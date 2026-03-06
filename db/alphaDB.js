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

  async saveUser(userData) {
    const transaction = this.db.transaction(["users"], "readwrite")
    const store = transaction.objectStore("users")
    return store.put({ ...userData, updatedAt: new Date().toISOString() })
  }

  async getUser(email) {
    const transaction = this.db.transaction(["users"], "readonly")
    const store = transaction.objectStore("users")
    return new Promise((resolve, reject) => {
      const request = store.get(email)
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  async getAllUsers() {
    const transaction = this.db.transaction(["users"], "readonly")
    const store = transaction.objectStore("users")
    return new Promise((resolve, reject) => {
      const request = store.getAll()
      request.onsuccess = () => resolve(request.result || [])
      request.onerror = () => reject(request.error)
    })
  }

  async saveTrade(tradeData) {
    const transaction = this.db.transaction(["trades"], "readwrite")
    const store = transaction.objectStore("trades")
    return store.add({ ...tradeData, timestamp: new Date().toISOString() })
  }

  async getTradeHistory(userEmail, limit = 100) {
    const transaction = this.db.transaction(["trades"], "readonly")
    const store = transaction.objectStore("trades")
    const index = store.index("userEmail")
    return new Promise((resolve, reject) => {
      const request = index.getAll(userEmail, limit)
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  async savePortfolioSnapshot(portfolioData) {
    const transaction = this.db.transaction(["portfolios"], "readwrite")
    const store = transaction.objectStore("portfolios")
    return store.add({ ...portfolioData, timestamp: new Date().toISOString() })
  }

  async getPortfolioHistory(userEmail, days = 30) {
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
    const transaction = this.db.transaction(["aiHistory"], "readwrite")
    const store = transaction.objectStore("aiHistory")
    return store.add({
      userEmail,
      query,
      response,
      timestamp: new Date().toISOString(),
    })
  }

  async getAIHistory(userEmail, limit = 50) {
    const transaction = this.db.transaction(["aiHistory"], "readonly")
    const store = transaction.objectStore("aiHistory")
    const index = store.index("userEmail")
    return new Promise((resolve, reject) => {
      const request = index.getAll(userEmail, limit)
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  async addToWatchlist(userEmail, ticker) {
    const transaction = this.db.transaction(["watchlist"], "readwrite")
    const store = transaction.objectStore("watchlist")
    return store.add({ userEmail, ticker, addedAt: new Date().toISOString() })
  }

  async getWatchlist(userEmail) {
    const transaction = this.db.transaction(["watchlist"], "readonly")
    const store = transaction.objectStore("watchlist")
    const index = store.index("userEmail")
    return new Promise((resolve, reject) => {
      const request = index.getAll(userEmail)
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  async clearUserData(userEmail) {
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

    return transaction.complete
  }
}
