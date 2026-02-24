class AlphaDB {
  constructor() {
    this.dbName = "alphaflow_db"
    this.version = 1
    this.db = null
  }

  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        this.db = request.result
        resolve(this.db)
      }

      request.onupgradeneeded = (event) => {
        const db = event.target.result

        if (!db.objectStoreNames.contains("users")) {
          const usersStore = db.createObjectStore("users", { keyPath: "email" })
          usersStore.createIndex("name", "name", { unique: false })
          usersStore.createIndex("createdAt", "createdAt", { unique: false })
        }

        if (!db.objectStoreNames.contains("portfolios")) {
          const portfolioStore = db.createObjectStore("portfolios", { keyPath: "id", autoIncrement: true })
          portfolioStore.createIndex("userEmail", "userEmail", { unique: false })
          portfolioStore.createIndex("timestamp", "timestamp", { unique: false })
        }

        if (!db.objectStoreNames.contains("trades")) {
          const tradeStore = db.createObjectStore("trades", { keyPath: "id", autoIncrement: true })
          tradeStore.createIndex("userEmail", "userEmail", { unique: false })
          tradeStore.createIndex("ticker", "ticker", { unique: false })
          tradeStore.createIndex("timestamp", "timestamp", { unique: false })
          tradeStore.createIndex("type", "type", { unique: false })
        }

        if (!db.objectStoreNames.contains("watchlist")) {
          const watchlistStore = db.createObjectStore("watchlist", { keyPath: "id", autoIncrement: true })
          watchlistStore.createIndex("userEmail", "userEmail", { unique: false })
          watchlistStore.createIndex("ticker", "ticker", { unique: false })
        }

        if (!db.objectStoreNames.contains("aiHistory")) {
          const aiStore = db.createObjectStore("aiHistory", { keyPath: "id", autoIncrement: true })
          aiStore.createIndex("userEmail", "userEmail", { unique: false })
          aiStore.createIndex("timestamp", "timestamp", { unique: false })
        }
      }
    })
  }

  _ensureDB() {
    if (!this.db) {
      throw new Error("AlphaDB not initialized. Call init() before using the database.")
    }
  }

  _requestToPromise(request) {
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  _transactionDone(transaction) {
    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => resolve()
      transaction.onerror = () => reject(transaction.error)
      transaction.onabort = () => reject(transaction.error || new Error("IndexedDB transaction aborted"))
    })
  }

  async saveUser(userData) {
    this._ensureDB()
    const transaction = this.db.transaction(["users"], "readwrite")
    const store = transaction.objectStore("users")
    store.put({ ...userData, updatedAt: new Date().toISOString() })
    await this._transactionDone(transaction)
  }

  async getUser(email) {
    this._ensureDB()
    const transaction = this.db.transaction(["users"], "readonly")
    const store = transaction.objectStore("users")
    return this._requestToPromise(store.get(email))
  }

  async getAllUsers() {
    this._ensureDB()
    const transaction = this.db.transaction(["users"], "readonly")
    const store = transaction.objectStore("users")
    return this._requestToPromise(store.getAll())
  }

  async saveTrade(tradeData) {
    this._ensureDB()
    const transaction = this.db.transaction(["trades"], "readwrite")
    const store = transaction.objectStore("trades")
    const request = store.add({ ...tradeData, timestamp: new Date().toISOString() })
    const id = await this._requestToPromise(request)
    await this._transactionDone(transaction)
    return id
  }

  async getTradeHistory(userEmail, limit = 100) {
    this._ensureDB()
    const transaction = this.db.transaction(["trades"], "readonly")
    const store = transaction.objectStore("trades")
    const index = store.index("userEmail")
    return this._requestToPromise(index.getAll(userEmail, limit))
  }

  async savePortfolioSnapshot(portfolioData) {
    this._ensureDB()
    const transaction = this.db.transaction(["portfolios"], "readwrite")
    const store = transaction.objectStore("portfolios")
    const request = store.add({ ...portfolioData, timestamp: new Date().toISOString() })
    const id = await this._requestToPromise(request)
    await this._transactionDone(transaction)
    return id
  }

  async getPortfolioHistory(userEmail, days = 30) {
    this._ensureDB()
    const transaction = this.db.transaction(["portfolios"], "readonly")
    const store = transaction.objectStore("portfolios")
    const index = store.index("userEmail")
    return new Promise((resolve, reject) => {
      const request = index.getAll(userEmail)
      request.onsuccess = () => {
        const results = request.result
        const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
        resolve(results.filter((p) => new Date(p.timestamp) > cutoff))
      }
      request.onerror = () => reject(request.error)
    })
  }

  async saveAIInteraction(userEmail, query, response) {
    this._ensureDB()
    const transaction = this.db.transaction(["aiHistory"], "readwrite")
    const store = transaction.objectStore("aiHistory")
    const request = store.add({
      userEmail,
      query,
      response,
      timestamp: new Date().toISOString(),
    })
    const id = await this._requestToPromise(request)
    await this._transactionDone(transaction)
    return id
  }

  async getAIHistory(userEmail, limit = 50) {
    this._ensureDB()
    const transaction = this.db.transaction(["aiHistory"], "readonly")
    const store = transaction.objectStore("aiHistory")
    const index = store.index("userEmail")
    return this._requestToPromise(index.getAll(userEmail, limit))
  }

  async addToWatchlist(userEmail, ticker) {
    this._ensureDB()
    const transaction = this.db.transaction(["watchlist"], "readwrite")
    const store = transaction.objectStore("watchlist")
    const request = store.add({ userEmail, ticker, addedAt: new Date().toISOString() })
    const id = await this._requestToPromise(request)
    await this._transactionDone(transaction)
    return id
  }

  async getWatchlist(userEmail) {
    this._ensureDB()
    const transaction = this.db.transaction(["watchlist"], "readonly")
    const store = transaction.objectStore("watchlist")
    const index = store.index("userEmail")
    return this._requestToPromise(index.getAll(userEmail))
  }

  async clearUserData(userEmail) {
    this._ensureDB()
    const stores = ["trades", "portfolios", "watchlist", "aiHistory"]
    const transaction = this.db.transaction(stores, "readwrite")

    stores.forEach((storeName) => {
      const store = transaction.objectStore(storeName)
      const index = store.index("userEmail")
      const request = index.openCursor(IDBKeyRange.only(userEmail))

      request.onsuccess = (event) => {
        const cursor = event.target.result
        if (cursor) {
          cursor.delete()
          cursor.continue()
        }
      }
    })

    await this._transactionDone(transaction)
  }
}
