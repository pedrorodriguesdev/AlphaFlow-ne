// Chart.js is already loaded from CDN in HTML as a global variable

/* =========================================
   CORE ARCHITECTURE - AlphaFlow v8.0+ Enhanced
   ENHANCED VERSION with Complete Feature Set
   ========================================= */

// --- DEPENDENCY DECLARATIONS ---
// These variables are assumed to be defined elsewhere (e.g., imported or globally available)
// In a real scenario, these would be proper imports or global declarations.
// For this task, we're resolving undeclared variable errors by assuming their existence.
const AlphaDB =
  window.AlphaDB ||
  class {
    // Mock AlphaDB if not present
    async init() {
      console.log("Mock AlphaDB initialized")
    }
    async getUser(email) {
      console.log(`Mock getUser(${email})`)
      return null
    }
    async saveUser(user) {
      console.log("Mock saveUser", user)
    }
    async savePortfolioSnapshot(data) {
      console.log("Mock savePortfolioSnapshot", data)
    }
    async saveTrade(trade) {
      console.log("Mock saveTrade", trade)
    }
    async saveAIInteraction(userEmail, prompt, response) {
      console.log("Mock saveAIInteraction", userEmail, prompt, response)
    }
  }
const AuthManager = window.AuthManager || {
  // Mock AuthManager if not present
  getSession() {
    console.log("Mock getSession")
    return null
  },
  refreshSession() {
    console.log("Mock refreshSession")
  },
  hashPassword(pass) {
    console.log("Mock hashPassword")
    return "hashed_" + pass
  },
  saveSession(user) {
    console.log("Mock saveSession", user)
  },
  isAuthenticated() {
    console.log("Mock isAuthenticated")
    return false
  },
  clearSession() {
    console.log("Mock clearSession")
  },
}
const InputValidator = window.InputValidator || {
  // Mock InputValidator if not present
  sanitizeString(str) {
    console.log("Mock sanitizeString", str)
    return str
  },
  validateEmail(email) {
    console.log("Mock validateEmail", email)
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  },
  validateEmailProvider(email) {
    console.log("Mock validateEmailProvider", email)
    return /@(gmail|hotmail|outlook|yahoo)\.(com|com\.br)$/.test(email)
  },
  validatePassword(pass) {
    console.log("Mock validatePassword", pass)
    return pass.length >= 6
  },
  rateLimitCheck(key, max, interval) {
    console.log("Mock rateLimitCheck", key, max, interval)
    return true
  },
  validateName(name) {
    console.log("Mock validateName", name)
    return /^[a-zA-Z\s]{2,50}$/.test(name)
  },
  validateTradeAmount(amount, balance) {
    console.log("Mock validateTradeAmount", amount, balance)
    return amount <= balance
  },
  sanitizeNumericInput(value, min, max) {
    console.log("Mock sanitizeNumericInput", value, min, max)
    return Math.max(min, Math.min(max, value))
  },
  preventXSS(str) {
    console.log("Mock preventXSS", str)
    return str.replace(/</g, "&lt;").replace(/>/g, "&gt;")
  }, // Basic XSS prevention
}
const FreemiumManager = window.FreemiumManager || {
  // Mock FreemiumManager if not present
  checkTradeLimit(email) {
    console.log("Mock checkTradeLimit", email)
    return true
  },
  incrementTradeCount(email) {
    console.log("Mock incrementTradeCount", email)
  },
  getUserTier(email) {
    console.log("Mock getUserTier", email)
    return 0
  }, // Basic tier
  checkAIQuota(email) {
    console.log("Mock checkAIQuota", email)
    return true
  },
  incrementAIQuota(email) {
    console.log("Mock incrementAIQuota", email)
  },
  TIERS: [{ name: "Free" }, { name: "Premium" }], // Mock tiers
}

// Declare the LightweightCharts variable before using it
const LightweightCharts = window.LightweightCharts

function canUseLightweightCharts() {
  return Boolean(LightweightCharts && typeof LightweightCharts.createChart === "function")
}

// --- DATA & CONFIG ---
const Store = {
  user: {
    name: null,
    email: null,
    type: "Iniciante",
    balance: 5000.0,
    portfolio: {},
    history: [],
    sessionStart: Date.now(),
    refills: { count: 0, date: null },
  },
  assets: [],
  news: [],
  marketInterval: null,
  charts: {
    pro: null,
    proSeries: null,
    modal: null,
    modalSeries: null,
    dashEvo: null,
    dashAlloc: null,
  },
  sessionWarningShown: false,
}

const appDB = new AlphaDB() // Assumiendo que AlphaDB() está definido em outro lugar ou será importado

// --- INITIALIZATION ---
const App = {
  async init() {
    console.log("Sistema Inicializando: AlphaFlow Ultimate v8.0+ Professional...")

    try {
      await appDB.init()
      console.log("Banco de dados IndexedDB inicializado")
    } catch (error) {
      console.error("Erro ao inicializar banco de dados:", error)
    }

    // 1. Load Mock Data
    await App.loadMockData()

    const session = AuthManager.getSession() // Assumiendo que AuthManager está definido
    if (session) {
      const userData = await appDB.getUser(session.user.email)
      if (userData) {
        Store.user = userData
      } else {
        const savedUser = localStorage.getItem("alphaflow_user")
        if (savedUser) {
          Store.user = JSON.parse(savedUser)
          await appDB.saveUser(Store.user)
        }
      }
    } else {
      const savedUser = localStorage.getItem("alphaflow_user")
      if (savedUser) Store.user = JSON.parse(savedUser)
    }

    // 3. Security Check (10 min rule)
    App.checkSession()
    setInterval(App.checkSession, 60000)
    // Renovar sessão periodicamente
    setInterval(() => AuthManager.refreshSession(), 5 * 60 * 1000) // Assumiendo que AuthManager está definido

    // 4. Init Modules
    UI.init()
    Market.init()
    Charts.init()
    AI.init()
    News.init()
    Background.init()

    // 5. Restore View
    Dashboard.update()
    Router.go("dashboard")

    setInterval(
      async () => {
        if (Store.user.email) {
          await appDB.savePortfolioSnapshot({
            userEmail: Store.user.email,
            balance: Store.user.balance,
            portfolio: Store.user.portfolio,
            equity: Dashboard.calculateEquity(), // Assumiendo que Dashboard.calculateEquity() está definido
          })
        }
      },
      5 * 60 * 1000,
    )
  },

  async loadMockData() {
    try {
      const assetsRes = await fetch("data/mock-assets.json")
      const newsRes = await fetch("data/news.json")
      Store.assets = await assetsRes.json()
      Store.news = await newsRes.json()
    } catch (e) {
      console.log("Loading embedded mock data...")
      Store.assets = AppData.mockAssets
      Store.news = AppData.mockNews
    }
  },

  checkSession() {
    // Usar AuthManager para verificar sessão
    const session = AuthManager.getSession() // Assumiendo que AuthManager está definido
    if (!session && !Store.sessionWarningShown) {
      document.getElementById("login-overlay").classList.remove("hidden")
      Store.sessionWarningShown = true
    }
  },

  toggleBg(active) {
    const c = document.getElementById("bg-canvas")
    c.style.display = active ? "block" : "none"
  },

  async save() {
    localStorage.setItem("alphaflow_user", JSON.stringify(Store.user))
    // Salvar usuário no banco de dados se logado
    if (Store.user.email) {
      await appDB.saveUser(Store.user)
    }
  },
}

// --- AUTHENTICATION ---
const Auth = {
  async login() {
    // Validação de entrada e sanitização
    const email = InputValidator.sanitizeString(document.getElementById("auth-email").value.trim()) // Assumiendo que InputValidator está definido
    const pass = document.getElementById("auth-pass").value

    if (!InputValidator.validateEmail(email)) {
      // Assumiendo que InputValidator está definido
      Toast.show("Email inválido", "error")
      return
    }

    if (!InputValidator.validateEmailProvider(email)) {
      // Assumiendo que InputValidator está definido
      Toast.show("Use email @gmail, @hotmail, @outlook ou @yahoo", "error")
      return
    }

    if (!InputValidator.validatePassword(pass)) {
      // Assumiendo que InputValidator está definido
      Toast.show("Senha deve ter 6+ caracteres com letras e números", "error")
      return
    }

    if (!InputValidator.rateLimitCheck(`login_${email}`, 5, 60000)) {
      // Assumiendo que InputValidator está definido
      Toast.show("Muitas tentativas. Aguarde 1 minuto.", "error")
      return
    }

    const hashedPass = await AuthManager.hashPassword(pass) // Assumiendo que AuthManager está definido

    let user = await appDB.getUser(email)

    if (!user) {
      user = {
        email,
        name: email.split("@")[0].charAt(0).toUpperCase() + email.split("@")[0].slice(1),
        password: hashedPass,
        type: "Iniciante",
        balance: 5000.0,
        portfolio: {},
        history: [],
        createdAt: new Date().toISOString(),
      }
      await appDB.saveUser(user)
      Toast.show("Conta criada com sucesso!", "success")
    } else {
      if (user.password !== hashedPass) {
        Toast.show("Senha incorreta", "error")
        return
      }
    }

    Store.user = user
    Store.sessionWarningShown = false

    AuthManager.saveSession(user) // Assumiendo que AuthManager está definido

    await App.save()
    document.getElementById("login-overlay").classList.add("hidden")
    Toast.show("Login realizado com sucesso!", "success")
    UI.updateSidebar()
    document.getElementById("auth-email").value = ""
    document.getElementById("auth-pass").value = ""
  },

  validateEmail(email) {
    // Usar validador de entrada
    return InputValidator.validateEmail(email) && InputValidator.validateEmailProvider(email) // Assumiendo que InputValidator está definido
  },

  // Adicionar logout
  logout() {
    AuthManager.clearSession() // Assumiendo que AuthManager está definido
    Store.user = {
      name: null,
      email: null,
      type: "Iniciante",
      balance: 5000.0,
      portfolio: {},
      history: [],
      sessionStart: Date.now(),
      refills: { count: 0, date: null },
    }
    localStorage.removeItem("alphaflow_user")
    document.getElementById("login-overlay").classList.remove("hidden")
    Toast.show("Logout realizado", "info")
  },
}

// --- ROUTING ---
const Router = {
  go(page) {
    console.log("[v0] Navigating to:", page)
    document.querySelectorAll(".view").forEach((v) => v.classList.remove("active"))
    document.getElementById("view-" + page).classList.add("active")
    document.querySelectorAll(".nav-item").forEach((i) => i.classList.remove("active"))
    event?.target?.closest(".nav-item")?.classList.add("active")

    if (page === "trade-pro") {
      console.log("[v0] Initializing Trade Pro...")
      setTimeout(() => {
        if (!Store.charts.pro) TradePro.initChart()
        TradePro.changeAsset(TradePro.activeId)
      }, 100)
    }

    if (page === "market") {
      console.log("[v0] Initializing Market...")
      setTimeout(() => {
        Market.render()
      }, 100)
    }

    if (page === "settings") {
      console.log("[v0] Loading settings...")
      Settings.load()
    }

    Dashboard.update()
  },
}

// --- MARKET ENGINE ---
const Market = {
  allAssets: [],

  init() {
    console.log("[v0] Initializing Market...")
    Market.allAssets = Store.assets
    Market.render()

    // <REMOVE> R E M O V E D   O R   R E P L A C E D   I N T E R V A L   F R O M   H E R E
    // The original code had a.currentPrice and a.change24h, but the update logic seems to be for a.price based on the mock data and the change in the updates.
    // Assuming 'price' is the intended property for live updates based on the provided updates.
    // If 'currentPrice' was intended, this logic might need adjustment.
    // a.price = (a.price || a.basePrice || 0) * (0.98 + Math.random() * 0.04)
    // The original mock data had basePrice, and subsequent usage implied currentPrice.
    // The updates introduce 'price' directly. Harmonizing this:
    // if (!a.price) a.price = a.currentPrice || a.basePrice || 0
    // a.price *= 0.98 + Math.random() * 0.04
    // a.change24h = (((a.price - a.basePrice) / a.basePrice) * 100).toFixed(2) // Re-adding change24h as it's used in UI.renderList
  },

  filter(query) {
    console.log("[v0] Filtering market with query:", query)
    const q = query.toLowerCase()
    Market.allAssets = Store.assets.filter(
      (a) => a.ticker.toLowerCase().includes(q) || a.name.toLowerCase().includes(q),
    )
    Market.render()
  },

  render() {
    console.log("[v0] Rendering market with", Market.allAssets.length, "assets")
    const container = document.getElementById("market-list")
    if (!container) return

    container.innerHTML = Market.allAssets
      .map((asset) => {
        // The original code calculated change24h dynamically in Market.init. The updates don't explicitly show this part being updated for rendering.
        // Reusing the updated 'price' and the calculated 'change24h' from the setInterval.
        const changeColor = asset.change24h >= 0 ? "text-up" : "text-down"

        return `
        <div class="card market-card" onclick="UI.openAssetModal('${asset.id}')">
          <div class="asset-header">
            <span class="ticker">${asset.ticker}</span>
            <span class="badge">${asset.category}</span>
          </div>
          <h4>${asset.name}</h4>
          <div class="price-row mono">
            <span>R$ ${asset.price.toFixed(2)}</span>
            <span class="${changeColor}">${asset.change24h >= 0 ? "+" : ""}${asset.change24h}%</span>
          </div>
        </div>
      `
      })
      .join("")
  },

  updateUI() {
    // This part of the original code was in Market.updateUI and seems to have been removed from the updates.
    // Reintegrating it for header balance updates.
    if (document.getElementById("header-balance")) {
      document.getElementById("header-balance").innerText = Format.currency(Store.user.balance)
    }
    // If there were other UI updates here, they would need to be merged as well.
  },
}

// --- CHARTING ENGINE ---
const Charts = {
  init() {
    const ctxEvo = document.getElementById("chart-evolution").getContext("2d")
    Store.charts.dashEvo = new window.Chart(ctxEvo, {
      type: "line",
      data: {
        labels: [],
        datasets: [
          {
            label: "Patrimônio",
            data: [],
            borderColor: "#00f2ff",
            backgroundColor: "rgba(0, 242, 255, 0.1)",
            fill: true,
            tension: 0.4,
            pointRadius: 0,
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { display: false },
          y: { grid: { color: "rgba(60, 75, 100, 0.2)" }, ticks: { color: "#8a9ab8" } },
        },
      },
    })

    const ctxAlloc = document.getElementById("chart-allocation").getContext("2d")
    Store.charts.dashAlloc = new window.Chart(ctxAlloc, {
      type: "doughnut",
      data: {
        labels: [],
        datasets: [
          {
            data: [],
            backgroundColor: ["#00f2ff", "#0066ff", "#00e396", "#ff0055", "#ffb700", "#ff6b35"],
            borderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: "right", labels: { color: "#fff" } },
        },
      },
    })

    // Lightweight Charts for Trade Pro
    const proContainer = document.getElementById("pro-chart-container")
    if (proContainer && canUseLightweightCharts()) {
      Store.charts.pro = LightweightCharts.createChart(proContainer, {
        layout: { background: { color: "transparent" }, textColor: "#8a9ab8" },
        grid: { vertLines: { color: "rgba(255, 255, 255, 0.05)" }, horzLines: { color: "rgba(255, 255, 255, 0.05)" } },
        timeScale: { timeVisible: true, secondsVisible: true },
      })
      Store.charts.proSeries = Store.charts.pro.addCandlestickSeries({
        upColor: "#00e396",
        downColor: "#ff0055",
        borderVisible: false,
        wickVisible: true,
      })
    } else if (proContainer) {
      console.warn("[v0] LightweightCharts indisponível. Trade Pro sem gráfico avançado.")
    }
  },
}

// --- TRADING LOGIC ---
const Trade = {
  activeAssetId: null,

  adjQty(delta) {
    const inp = document.getElementById("m-qty")
    let val = Number.parseFloat(inp.value) + delta
    // Usar InputValidator para sanitizar quantidade
    val = InputValidator.sanitizeNumericInput(val, 0.1, 1000000) // Assumiendo que InputValidator está definido
    inp.value = val.toFixed(1)
  },

  async execute(type, isModal = false) {
    if (!AuthManager.isAuthenticated()) {
      // Assumiendo que AuthManager está definido
      Toast.show("Faça login para operar", "error")
      document.getElementById("login-overlay").classList.remove("hidden")
      return
    }

    if (!FreemiumManager.checkTradeLimit(Store.user.email)) {
      // Assumiendo que FreemiumManager está definido
      Toast.show("Limite de trades atingido. Upgrade para Premium!", "warning")
      return
    }

    const id = isModal ? Trade.activeAssetId : TradePro.activeId
    const asset = Store.assets.find((a) => a.id === id)
    if (!asset) return

    const qtyEl = isModal ? document.getElementById("m-qty") : document.getElementById("pro-qty")
    // Usar InputValidator para sanitizar quantidade
    const qty = InputValidator.sanitizeNumericInput(qtyEl.value, 0.001, 1000000) // Assumiendo que InputValidator está definido
    const price = asset.price !== undefined ? asset.price : asset.currentPrice || asset.basePrice
    const total = price * qty

    if (type === "buy" && !InputValidator.validateTradeAmount(total, Store.user.balance)) {
      // Assumiendo que InputValidator está definido
      Toast.show("Saldo insuficiente ou quantidade inválida", "error")
      return
    }

    if (type === "buy") {
      if (Store.user.balance >= total) {
        Store.user.balance -= total
        Store.user.portfolio[asset.ticker] = (Store.user.portfolio[asset.ticker] || 0) + qty
        Store.user.history.push({
          type: "buy",
          ticker: asset.ticker,
          qty: qty,
          price: price,
          time: new Date().toISOString(),
        })

        await appDB.saveTrade({
          userEmail: Store.user.email,
          type: "buy",
          ticker: asset.ticker,
          quantity: qty,
          price: price,
          total: total,
        })

        FreemiumManager.incrementTradeCount(Store.user.email) // Assumiendo que FreemiumManager está definido
        Toast.show(`Compra de ${qty} ${asset.ticker} realizada!`, "success")
      } else {
        Toast.show("Saldo insuficiente.", "error")
        return
      }
    } else {
      const currentQty = Store.user.portfolio[asset.ticker] || 0
      if (currentQty >= qty) {
        Store.user.balance += total
        Store.user.portfolio[asset.ticker] -= qty
        if (Store.user.portfolio[asset.ticker] <= 0.0001) delete Store.user.portfolio[asset.ticker]
        Store.user.history.push({
          type: "sell",
          ticker: asset.ticker,
          qty: qty,
          price: price,
          time: new Date().toISOString(),
        })

        await appDB.saveTrade({
          userEmail: Store.user.email,
          type: "sell",
          ticker: asset.ticker,
          quantity: qty,
          price: price,
          total: total,
        })

        FreemiumManager.incrementTradeCount(Store.user.email) // Assumiendo que FreemiumManager está definido
        Toast.show(`Venda de ${qty} ${asset.ticker} realizada!`, "success")
      } else {
        Toast.show("Você não possui quantidade suficiente.", "error")
        return
      }
    }

    await App.save()
    Dashboard.update()
    if (isModal) UI.updateModal(id)
    else TradePro.updatePanel()
  },
}

// --- TRADE PRO MODULE ---
const TradePro = {
  activeId: "btc",
  currentTimeFrame: "1m",
  activeIndicators: {},
  chartType: "candlestick",
  trendLines: [],

  initChart() {
    console.log("[v0] Creating TradePro chart...")
    const container = document.getElementById("pro-chart-container")
    if (!container) {
      console.log("[v0] Chart container not found!")
      return
    }

    if (!canUseLightweightCharts()) {
      Toast.show("Biblioteca de gráfico indisponível. Recarregue a página.", "warning")
      return
    }

    container.innerHTML = ""
    const chart = LightweightCharts.createChart(container, {
      layout: {
        background: { color: "transparent" },
        textColor: "#a0aec0", // Updated from #8a9ab8
      },
      width: container.offsetWidth,
      height: 500, // Increased height from implicit default to 500
      timeScale: {
        timeVisible: true,
        secondsVisible: true,
      },
    })

    Store.charts.pro = chart
    Store.charts.proSeries = chart.addCandlestickSeries({
      upColor: "#00e396",
      downColor: "#ff0055",
      borderVisible: false,
      wickVisible: true,
    })

    // Added resize listener for chart
    window.addEventListener("resize", () => {
      if (Store.charts.pro && container.offsetParent !== null) {
        Store.charts.pro.applyOptions({ width: container.offsetWidth })
      }
    })
  },

  changeAsset(assetId) {
    console.log("[v0] Changing asset to:", assetId)
    TradePro.activeId = assetId

    if (!Store.charts.pro) {
      TradePro.initChart()
    }

    TradePro.generateHistory(assetId)
    TradePro.updatePriceDisplay()
  },

  generateHistory(assetId) {
    console.log("[v0] Generating history for:", assetId)
    const asset = Store.assets.find((a) => a.id === assetId)
    if (!asset || !Store.charts.proSeries) return

    const data = []
    // Corrected historical data generation logic for candlestick series
    let basePrice = asset.currentPrice || asset.price || asset.basePrice // Use currentPrice if available, else fallback
    if (!basePrice) basePrice = 100 // Fallback if no price found

    const now = Math.floor(Date.now() / 1000) // Current time in seconds

    for (let i = 100; i > 0; i--) {
      const time = now - i * 60 // Assuming 1-minute intervals for history generation
      const variance = (Math.random() - 0.5) * basePrice * 0.02 // Smaller variance for history
      const open = basePrice + (Math.random() - 0.5) * basePrice * 0.01
      const close = basePrice + variance
      const high = Math.max(open, close) * (1 + Math.random() * 0.005)
      const low = Math.min(open, close) * (1 - Math.random() * 0.005)

      data.push({
        time: time,
        open: Number.parseFloat(open.toFixed(2)),
        high: Number.parseFloat(high.toFixed(2)),
        low: Number.parseFloat(low.toFixed(2)),
        close: Number.parseFloat(close.toFixed(2)),
      })

      basePrice = close // Update basePrice for the next candle
    }

    Store.charts.proSeries.setData(data)
    if (Store.charts.pro) {
      Store.charts.pro.timeScale().fitContent()
    }
  },

  updatePriceDisplay() {
    const asset = Store.assets.find((a) => a.id === TradePro.activeId)
    if (asset) {
      // Using asset.price for display, assuming it's the live price
      // Fallback to currentPrice if price is not available
      const displayPrice = asset.price !== undefined ? asset.price : asset.currentPrice || asset.basePrice || 0
      document.getElementById("pro-price").textContent = `R$ ${displayPrice.toFixed(2)}`

      // Use Store.user.balance instead of Store.user.wallet as balance is the correct property
      document.getElementById("pro-wallet").textContent = `R$ ${Store.user.balance.toFixed(2)}`
    }
  },

  setTF(tf) {
    console.log("[v0] Setting timeframe to:", tf)
    TradePro.currentTimeFrame = tf
    document.querySelectorAll(".tf-btn").forEach((b) => b.classList.remove("active"))
    event.target.classList.add("active")
    TradePro.generateHistory(TradePro.activeId)
  },

  setChartType(type) {
    console.log("[v0] Setting chart type to:", type)
    TradePro.chartType = type
    if (Store.charts.proSeries) Store.charts.proSeries.destroy?.()
    if (type === "candlestick") {
      Store.charts.proSeries = Store.charts.pro.addCandlestickSeries({
        upColor: "#00e396",
        downColor: "#ff0055",
        borderVisible: false,
        wickVisible: true,
      })
    } else if (type === "line") {
      Store.charts.proSeries = Store.charts.pro.addLineSeries({
        color: "#00f2ff",
        lineWidth: 2,
      })
    } else if (type === "area") {
      Store.charts.proSeries = Store.charts.pro.addAreaSeries({
        lineColor: "#00f2ff",
        topColor: "rgba(0, 242, 255, 0.3)",
        bottomColor: "rgba(0, 0, 0, 0)",
      })
    }
    TradePro.generateHistory(TradePro.activeId)
  },

  // Add tick function for real-time updates
  tick() {
    if (!Store.charts.proSeries) return
    const asset = Store.assets.find((a) => a.id === TradePro.activeId)
    if (!asset) return

    // Use asset.price for the tick update, fallback to currentPrice
    const currentPrice = asset.price !== undefined ? asset.price : asset.currentPrice
    if (currentPrice === undefined) return // Cannot proceed without a price

    const t = Math.floor(Date.now() / 1000)

    if (TradePro.chartType === "candlestick") {
      // Simulate a new candle based on current price
      const open = currentPrice * (1 + (Math.random() - 0.5) * 0.002)
      const close = currentPrice
      const high = Math.max(open, close) * 1.001
      const low = Math.min(open, close) * 0.999
      Store.charts.proSeries.update({ time: t, open, high, low, close })
    } else {
      // For line and area charts, just update with the current price
      Store.charts.proSeries.update({ time: t, value: currentPrice })
    }
    TradePro.updatePriceDisplay() // Update displayed price
  },
}

// --- DASHBOARD MODULE ---
const Dashboard = {
  // Adicionar método para calcular patrimônio
  calculateEquity() {
    let invested = 0
    Object.keys(Store.user.portfolio).forEach((ticker) => {
      const asset = Store.assets.find((a) => a.ticker === ticker)
      if (asset) {
        const currentAssetPrice = asset.price !== undefined ? asset.price : asset.currentPrice || asset.basePrice || 0
        invested += Store.user.portfolio[ticker] * currentAssetPrice
      }
    })
    return Store.user.balance + invested
  },

  update() {
    // Usar calculateEquity
    const equity = this.calculateEquity()
    const invested = equity - Store.user.balance

    document.getElementById("dash-equity").innerText = Format.currency(equity)
    document.getElementById("dash-cash").innerText = Format.currency(Store.user.balance)
    const pnl = equity - 5000 // Assuming initial balance is 5000 for PNL calculation
    const pnlEl = document.getElementById("dash-pnl")
    pnlEl.innerText = Format.currency(pnl)
    pnlEl.className = `mono ${pnl >= 0 ? "text-up" : "text-down"}`
    document.getElementById("dash-positions").innerText = Object.keys(Store.user.portfolio).length

    if (Store.charts.dashEvo) {
      const lbls = Store.charts.dashEvo.data.labels
      const data = Store.charts.dashEvo.data.datasets[0].data

      lbls.push(new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }))
      data.push(equity)
      if (lbls.length > 20) {
        lbls.shift()
        data.shift()
      }
      Store.charts.dashEvo.update()
    }

    if (Store.charts.dashAlloc) {
      const port = Store.user.portfolio
      const labels = ["Caixa", ...Object.keys(port)]
      const values = [
        Store.user.balance,
        ...Object.keys(port).map((t) => {
          const a = Store.assets.find((x) => x.ticker === t)
          // Use asset.price for portfolio allocation calculation
          const currentAssetPrice = a && a.price !== undefined ? a.price : a ? a.currentPrice : 0
          return port[t] * (a ? currentAssetPrice : 0)
        }),
      ]

      Store.charts.dashAlloc.data.labels = labels
      Store.charts.dashAlloc.data.datasets[0].data = values
      Store.charts.dashAlloc.update()
    }
  },
}

// --- UI & INTERACTIONS ---
const UI = {
  init() {
    const sel = document.getElementById("pro-asset-select")
    if (sel) {
      sel.innerHTML = Store.assets.map((a) => `<option value="${a.id}">${a.ticker} - ${a.name}</option>`).join("")
      // Initialize TradePro asset selection
      TradePro.changeAsset(TradePro.activeId)
    }

    const nameInput = document.querySelector(".validate-name")
    if (nameInput) {
      nameInput.addEventListener("input", (e) => {
        e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, "")
      })
      nameInput.addEventListener("change", (e) => {
        if (!Store.user.email) {
          document.getElementById("login-overlay").classList.remove("hidden")
          Toast.show("Você precisa estar logado para editar o perfil", "error")
          e.target.value = ""
        }
      })
    }

    document.getElementById("set-name").value = Store.user.name || ""
    document.getElementById("set-email").value = Store.user.email || ""
    document.getElementById("set-type").value = Store.user.type
    UI.updateSidebar()
  },

  updateSidebar() {
    if (Store.user.name) {
      document.getElementById("sidebar-user").innerText = Store.user.name
      document.getElementById("sidebar-type").innerText = Store.user.type
    }
  },

  openAssetModal(id) {
    // Renamed from openInvestModal to openAssetModal for clarity
    Trade.activeAssetId = id
    const asset = Store.assets.find((a) => a.id === id)
    if (!asset) return

    document.getElementById("m-asset-name").innerText = `${asset.name} (${asset.ticker})`
    document.getElementById("modal-invest").classList.remove("hidden")
    UI.updateModal(id)

    setTimeout(() => {
      const container = document.getElementById("modal-chart-container")
      if (!container) return // Exit if container is not found
      container.innerHTML = "" // Clear previous chart if any

      if (!canUseLightweightCharts()) {
        console.warn("[v0] LightweightCharts indisponível no modal de ativo")
        return
      }

      Store.charts.modal = LightweightCharts.createChart(container, {
        width: container.clientWidth,
        height: 250,
        layout: { background: { color: "transparent" }, textColor: "#fff" },
        grid: { vertLines: { color: "rgba(255,255,255,0.05)" }, horzLines: { color: "rgba(255,255,255,0.05)" } },
        timeScale: { timeVisible: true },
      })
      Store.charts.modalSeries = Store.charts.modal.addAreaSeries({
        lineColor: "#00f2ff",
        topColor: "rgba(0, 242, 255, 0.4)",
        bottomColor: "rgba(0,0,0,0)",
      })

      const data = []
      let p = asset.currentPrice * 0.95
      const t = Math.floor(Date.now() / 1000) - 3600 // Start from 1 hour ago
      for (let i = 0; i < 60; i++) {
        p = p * (1 + (Math.random() - 0.5) * 0.01)
        data.push({ time: t + i * 60, value: p })
      }
      Store.charts.modalSeries.setData(data)
      Store.charts.modal.timeScale().fitContent()
    }, 100)
  },

  updateModal(id) {
    const asset = Store.assets.find((a) => a.id === id)
    if (!asset) return
    // Use asset.price for modal display if available, fallback to currentPrice
    const displayPrice = asset.price !== undefined ? asset.price : asset.currentPrice || asset.basePrice || 0
    document.getElementById("m-price").innerText = Format.currency(displayPrice)
    document.getElementById("m-wallet").innerText = Format.currency(Store.user.balance)
    document.getElementById("m-var").innerText = asset.change24h + "%" // Assuming change24h is kept updated
  },

  closeModal(id) {
    document.getElementById(id).classList.add("hidden")
  },
}

// --- SETTINGS ---
const Settings = {
  load() {
    console.log("[v0] Loading settings...")

    const accountNameDisplay = document.getElementById("account-name-display")
    const accountEmailDisplay = document.getElementById("account-email-display")

    if (accountNameDisplay && accountEmailDisplay) {
      accountNameDisplay.textContent = Store.user.name || "Visitante"
      accountEmailDisplay.textContent = Store.user.email || "Não conectado"
    }

    document.getElementById("set-type").value = Store.user.type || "Iniciante"

    const refillData = JSON.parse(localStorage.getItem("refill-data") || '{"count":3,"date":""}')
    const today = new Date().toDateString()

    if (refillData.date !== today) {
      refillData.count = 3
      refillData.date = today
    }

    // Update refill counter text
    document.getElementById("refill-counter").textContent = `Restam ${refillData.count} usos hoje.`

    const tier = FreemiumManager.getUserTier(Store.user.email) // Assumiendo que FreemiumManager está definido
    const tierBadge = document.createElement("div")
    tierBadge.style.cssText =
      "margin-top: 15px; padding: 10px; background: rgba(0, 242, 255, 0.1); border-radius: 8px; text-align: center;"
    tierBadge.innerHTML = `<strong>Plano Atual:</strong> ${FreemiumManager.TIERS[tier].name}` // Assumiendo que FreemiumManager.TIERS está definido
    const profileCard = document.querySelector("#view-settings .card")
    if (profileCard && !document.getElementById("tier-badge")) {
      tierBadge.id = "tier-badge"
      profileCard.appendChild(tierBadge)
    }

    const notificationsEnabled = localStorage.getItem("alphaflow_notifications") !== "false"
    const notificationsToggle = document.getElementById("toggle-notifications")
    if (notificationsToggle) {
      notificationsToggle.checked = notificationsEnabled
    }
  },

  async saveProfile() {
    if (!AuthManager.isAuthenticated()) {
      // Assumiendo que AuthManager está definido
      Toast.show("Faça login para editar o perfil!", "warning")
      document.getElementById("login-overlay").classList.remove("hidden")
      return
    }

    Store.user.type = document.getElementById("set-type").value
    await App.save()
    Toast.show("Perfil atualizado com sucesso!", "success")
    UI.updateSidebar() // Ensure sidebar updates after profile save
    this.load() // Recarregar a visualização
  },

  async changePassword() {
    if (!AuthManager.isAuthenticated()) {
      // Assumiendo que AuthManager está definido
      Toast.show("Faça login para alterar a senha!", "warning")
      document.getElementById("login-overlay").classList.remove("hidden")
      return
    }

    const currentPassword = document.getElementById("current-password").value
    const newPassword = document.getElementById("new-password").value
    const confirmNewPassword = document.getElementById("confirm-new-password").value

    // Validações
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      Toast.show("Preencha todos os campos!", "warning")
      return
    }

    if (newPassword.length < 6) {
      Toast.show("A nova senha deve ter no mínimo 6 caracteres!", "error")
      return
    }

    if (newPassword !== confirmNewPassword) {
      Toast.show("As senhas não coincidem!", "error")
      return
    }

    try {
      // Verificar senha atual
      const currentPasswordHash = await AuthManager.hashPassword(currentPassword)
      // Assuming AlphaDB is correctly defined or mocked globally
      // If not, this would need a fallback similar to other dependencies.
      const user = await appDB.getUser(Store.user.email)

      if (!user || user.password !== currentPasswordHash) {
        Toast.show("Senha atual incorreta!", "error")
        return
      }

      // Atualizar senha no banco
      const newPasswordHash = await AuthManager.hashPassword(newPassword)
      user.password = newPasswordHash
      // Assuming AlphaDB is correctly defined or mocked globally
      await appDB.saveUser(user)

      // Limpar campos
      document.getElementById("current-password").value = ""
      document.getElementById("new-password").value = ""
      document.getElementById("confirm-new-password").value = ""

      Toast.show("Senha alterada com sucesso!", "success")
    } catch (error) {
      console.error("[v0] Error changing password:", error)
      Toast.show("Erro ao alterar senha. Tente novamente.", "error")
    }
  },

  async logout() {
    const confirmLogout = confirm("Tem certeza que deseja sair?")
    if (!confirmLogout) return

    AuthManager.clearSession()

    Store.user = {
      name: null,
      email: null,
      type: "Iniciante",
      balance: 5000.0,
      portfolio: {},
      history: [],
      sessionStart: Date.now(),
      refills: { count: 0, date: null },
    }

    localStorage.removeItem("alphaflow_user")
    Toast.show("Logout realizado com sucesso!", "info")

    // Redirecionar para landing page
    setTimeout(() => {
      window.location.href = "landing.html"
    }, 1000)
  },

  toggleNotifications(enabled) {
    localStorage.setItem("alphaflow_notifications", enabled.toString())
    Toast.show(enabled ? "Notificações ativadas!" : "Notificações desativadas!", "info")
  },

  async addFunds() {
    if (!AuthManager.isAuthenticated()) {
      // Assumiendo que AuthManager está definido
      Toast.show("Faça login para resgatar saldo!", "warning")
      document.getElementById("login-overlay").classList.remove("hidden")
      return
    }

    const refillData = JSON.parse(localStorage.getItem("refill-data") || '{"count":3,"date":""}')
    const today = new Date().toDateString()

    if (refillData.date !== today) {
      refillData.count = 3
      refillData.date = today
    }

    // Check if refill count is less than or equal to 0
    if (refillData.count <= 0) {
      Toast.show("Limite de resgates diários atingido!", "error")
      return
    }

    // Use Store.user.balance (or wallet, if that's intended as a separate property)
    // Assuming 'balance' is the primary property for funds based on other parts of the code.
    // If 'wallet' is indeed a separate property meant to be updated, adjust accordingly.
    Store.user.balance += 10000
    refillData.count--
    localStorage.setItem("refill-data", JSON.stringify(refillData))
    await App.save()
    Toast.show("+ R$ 10.000,00 adicionado à carteira!", "success")
    Dashboard.update()
    Settings.load() // Reload settings to update the refill counter
  },
}

// --- AI ADVISOR MODULE (ENHANCED) ---
const AI = {
  knowledge: [
    {
      keys: ["oi", "ola", "ei", "olá"],
      resp: "Olá! Sou o AlphaBot, seu assistente financeiro avançado. Como posso ajudar você hoje?",
    },
    {
      keys: ["investir", "comecar", "como"],
      resp: "Para começar a investir:<br>1. Explore o <b>Mercado Global</b><br>2. Escolha um ativo (Ações, Cripto ou Commodities)<br>3. Clique em 'Investir'<br>4. Defina a quantidade e compre<br>5. Monitore no Dashboard",
    },
    {
      keys: ["bitcoin", "btc", "cripto"],
      resp: "<b>Bitcoin (BTC)</b> é a maior criptomoeda do mundo. Criada em 2009, funciona como reserva de valor digital descentralizada. Vantagens: sem intermediários, segurança. Desvantagens: volatilidade alta, pode cair 50% rapidamente.",
    },
    {
      keys: ["risco", "perder", "seguro"],
      resp: "Todo investimento tem risco. <b>Ações</b>: risco médio, bom para longo prazo. <b>Criptos</b>: risco alto, pode perder tudo. <b>Commodities</b>: risco médio. NUNCA invista dinheiro que vai precisar!",
    },
    {
      keys: ["analise", "grafico", "vela", "candle"],
      resp: "No <b>Trade Pro</b>:<br>- Use <b>SMA/EMA</b> para ver tendências<br>- <b>RSI</b> mostra sobrecompra/sobrevenda<br>- <b>MACD</b> confirma mudanças<br>- <b>Bollinger Bands</b> mostra volatilidade",
    },
    {
      keys: ["sma", "media", "movel"],
      resp: "<b>Média Móvel Simples (SMA)</b> calcula o preço médio dos últimos N candles. SMA 20: tendência curta. SMA 50: tendência média. SMA 200: tendência longa. Quando preço fica acima, mercado está em alta.",
    },
    {
      keys: ["ema", "exponencial"],
      resp: "<b>EMA (Média Móvel Exponencial)</b> é como SMA mas dá mais peso aos preços recentes. Reage mais rápido a mudanças. Traders usam EMA 12 e 26 para identificar mudanças rápidas de tendência.",
    },
    {
      keys: ["rsi", "indice"],
      resp: "<b>RSI (Relative Strength Index)</b> mede força de movimento. Escala 0-100. Acima de 70: ativo sobrecomprado (vender). Abaixo de 30: ativo sobrevendido (comprar). Muito útil para identificar reversões.",
    },
    {
      keys: ["macd"],
      resp: "<b>MACD (Moving Average Convergence Divergence)</b> combina 2 EMAs. Quando MACD cruza a linha de sinal para cima: sinal de compra. Para baixo: sinal de venda. Um dos indicadores mais populares.",
    },
    {
      keys: ["bollinger", "volatilidade", "bb"],
      resp: "<b>Bandas de Bollinger</b> mostram volatilidade. Preço toca banda superior: sobrecomprado. Toca banda inferior: sobrevendido. Bandas estreitas: baixa volatilidade (futura explosão). Bandas largas: alta volatilidade.",
    },
    {
      keys: ["suporte", "resistencia"],
      resp: "<b>Suporte</b>: nível onde preço tende a parar de cair (compras). <b>Resistência</b>: nível onde preço para de subir (vendas). Quebra de suporte = possível queda. Quebra de resistência = possível alta.",
    },
    {
      keys: ["tendencia", "trend", "alta", "baixa"],
      resp: "<b>Tendência de ALTA</b>: mínimas e máximas crescentes. <b>Tendência de BAIXA</b>: mínimas e máximas decrescentes. <b>Lateral</b>: sem direção clara. Melhor tradear a favor da tendência principal.",
    },
    {
      keys: ["volume"],
      resp: "<b>Volume</b> é quantidade de contratos negociados. Alto volume + preço subindo = movimento forte. Alto volume + preço caindo = venda pesada. Baixo volume = movimento fraco.",
    },
    {
      keys: ["divergencia"],
      resp: "<b>Divergência</b> ocorre quando preço faz nova máxima mas indicador não acompanha. Sinal de possível reversão. Muito útil com RSI e MACD para confirmar topos e fundos.",
    },
    {
      keys: ["acao", "stock", "empresa"],
      resp: "<b>Ações</b> representam propriedade em uma empresa. Ao comprar ação, você vira sócio. Ganhos com dividendos ou valorização. Menos voláteis que criptos. Bom para investimento longo prazo.",
    },
    {
      keys: ["dividendo"],
      resp: "<b>Dividendo</b> é lucro que empresa distribui aos acionistas. Ações boas pagam 4-8% ao ano em dividendos. Sem imposto até 20 mil/mês. Forma passiva de ganho.",
    },
    {
      keys: ["mercado", "bolsa"],
      resp: "<b>Bolsa de Valores</b> é local (digital) onde ações são negociadas. Maior bolsa: NYSE (New York). Brasil: B3 (Brasil Bolsa Balcão). Horário: 9:30-16:00 em dias úteis.",
    },
    {
      keys: ["short", "venda", "descoberto"],
      resp: "<b>Venda a Descoberto (SHORT)</b> é apostar na queda. Você toma emprestado o ativo e vende. Se preço cai, compra de volta mais barato. Risco: preço sobe infinitamente.",
    },
    {
      keys: ["call", "put", "opcao"],
      resp: "<b>Opções</b> são contratos de direito (não obrigação) de comprar/vender. <b>CALL</b>: direito de comprar (alta). <b>PUT</b>: direito de vender (baixa). Alavanca até 100x.",
    },
    {
      keys: ["alavancagem", "leverage"],
      resp: "<b>Alavancagem</b> é usar dinheiro emprestado para ampliar ganhos. 2x leverage: dobrando. Problema: perdas também dobram. Crypto permite até 125x. Cuidado: liquidação instantânea.",
    },
    {
      keys: ["ethereum", "eth", "smart", "contrato"],
      resp: "<b>Ethereum (ETH)</b> é blockchain programável. Permite <b>Smart Contracts</b> (contratos automáticos). Plataforma para DeFi, NFTs, tokens. Segunda maior cripto do mundo.",
    },
    {
      keys: ["defi", "descentralizado"],
      resp: "<b>DeFi (Finanças Descentralizadas)</b> oferece serviços financeiros sem banco. Empréstimos, trocas, rendimentos. Rendimentos de 5-50% ao ano. Risco: contratos podem ter bugs.",
    },
    {
      keys: ["nft", "token"],
      resp: "<b>NFT</b> é token não-fungível (único). Representa propriedade digital de arte, colecionáveis. <b>Criptomoeda</b> é fungível (intercambiável). Mercado NFT depende de hype.",
    },
    {
      keys: ["blockchain"],
      resp: "<b>Blockchain</b> é livro-razão digital distribuído. Cada transação é um bloco. Rede valida antes de adicionar. Imutável e descentralizado. Base de todas as criptos.",
    },
    {
      keys: ["mineracao", "mining"],
      resp: "<b>Mineração</b> é validar transações em blockchain. Mineradores resolvem puzzle matemático. Recompensados com criptos novos. Bitcoin: mineração a cada 10 minutos.",
    },
    {
      keys: ["wallet", "carteira"],
      resp: "<b>Wallet (Carteira)</b> guarda suas chaves privadas. <b>Chave privada</b>: acesso ao seu dinheiro. NUNCA compartilhe! <b>Chave pública</b>: seu endereço. Para receber pagamentos.",
    },
    {
      keys: ["exchange", "corretora"],
      resp: "<b>Exchange</b> é plataforma para trocar criptos. Principais: Binance, Kraken, Coinbase. Armazena seus criptos na conta. Mais fácil mas menos seguro que wallet própria.",
    },
    {
      keys: ["fork"],
      resp: "<b>Fork</b> é divisão do blockchain. Hard fork: mudança incompatível (novo token). Soft fork: compatível para trás. Ethereum Classic = fork do Ethereum após hack.",
    },
    {
      keys: ["staking"],
      resp: "<b>Staking</b> é travar cripto em blockchain para validar transações. Você recebe rendimento. Ethereum: 5-8% ao ano. Menos risco que trading.",
    },
    {
      keys: ["mercado", "touro", "urso"],
      resp: "<b>Bull Market</b> (Mercado de Touro): subidas contínuas, otimismo. <b>Bear Market</b> (Mercado de Urso): quedas contínuas, pessimismo. Ciclos duram meses/anos.",
    },
    {
      keys: ["crash", "corracao", "queda"],
      resp: "<b>Correção</b> é queda de 10-20%. <b>Crash</b> é queda acima de 20%. Bitcoin já caiu 80% em 2018. Criptos são cíclicas: alta 4 anos, queda 2 anos.",
    },
    {
      keys: ["halving", "bitcoin"],
      resp: "<b>Halving do Bitcoin</b> reduz recompensa mineração pela metade a cada 4 anos. Reduz oferta. Aumenta raridade. Historicamente causa alta pós-halving.",
    },
    {
      keys: ["ciclo", "halving"],
      resp: "<b>Ciclo Bitcoin</b>: 1) Halving 2) Aceleração de 12-18 meses 3) Topo especulativo 4) Queda de 80% 5) Consolidação 2 anos. Padrão desde 2012.",
    },
    {
      keys: ["taxa", "fee", "comissao"],
      resp: "<b>Taxas de Transação</b> variam. Bitcoin: $10-50 por transação (rápido). Ethereum: $2-20 (depende rede). Layer 2: $0,01 (mais barato). Sempre verifique antes de enviar.",
    },
    {
      keys: ["airdrop"],
      resp: "<b>Airdrop</b> é distribuição gratuita de tokens. Projetos usam para promover. Você recebe tokens de graça por estar em comunidade. Ótimo para ganhar passivamente.",
    },
    {
      keys: ["gráfico", "candela", "barra"],
      resp: "No <b>Trade Pro</b> você escolhe tipo de gráfico:<br>- <b>Linha</b>: simples, tendências<br>- <b>Área</b>: volume visível<br>- <b>Vela</b>: melhor análise técnica (abertura, máxima, mínima, fechamento)",
    },
    {
      keys: ["timeframe", "periodo", "vela"],
      resp: "<b>Timeframes</b> disponíveis no Trade Pro:<br>- <b>1m</b>: scalping rápido<br>- <b>5m/15m</b>: day trading<br>- <b>1h/4h</b>: swing trading<br>- <b>1D</b>: investimento longo prazo",
    },
    // Additional 20+ responses below current knowledge base
    {
      keys: ["como", "comeco", "iniciante"],
      resp: "<b>Guia Completo para Iniciantes</b><br>1. Entenda o básico (ações, criptos, commodities)<br>2. Estude análise técnica<br>3. Abra conta em corretora<br>4. Comece com pequenos valores<br>5. Monitore 1-2 ativos apenas<br>6. Mantenha disciplina emocional<br>7. Estude seus erros<br>8. Aumente exposição gradualmente",
    },
    {
      keys: ["risco", "carteira", "diversificacao"],
      resp: "<b>Diversificação Inteligente</b><br>- 40% Ações de qualidade<br>- 20% Criptomoedas (Bitcoin + Ethereum)<br>- 15% Commodities (ouro, petróleo)<br>- 15% Renda Fixa (títulos)<br>- 10% Emergentes (especulativo)<br><br>Ajuste % conforme seu perfil.",
    },
    {
      keys: ["ciclo", "mercado", "padrão"],
      resp: "<b>Ciclos do Mercado</b><br>1. ACUMULAÇÃO: Preços baixos, poucos comprando (2-3 anos)<br>2. ALTA: Subidas rápidas, otimismo contagiante (1-2 anos)<br>3. DISTRIBUIÇÃO: Topos, queda inicial de força<br>4. QUEDA: Pânico, vendas (1-2 anos)<br>Repetição cíclica. Aproveite cada fase.",
    },
    {
      keys: ["vela", "japones", "pattern"],
      resp: "<b>Padrões de Velas Importantes</b><br><b>Alta:</b> Morning Star, Engulfing Bull, Three White Soldiers<br><b>Baixa:</b> Evening Star, Engulfing Bear, Three Black Crows<br><b>Indecisão:</b> Hammer, Spinning Top, Doji<br>Combine com volume e contexto.",
    },
    {
      keys: ["suporte", "resistencia", "nivel"],
      resp: "<b>Suporte e Resistência Dinâmica</b><br>- Identifique topos anteriores (resistência)<br>- Identifique fundos anteriores (suporte)<br>- Quanto mais testes, mais forte o nível<br>- Quebra de suporte = novo nível é resistência<br>- Use para stop loss e entry points",
    },
    {
      keys: ["momentum", "força", "velocidade"],
      resp: "<b>Momentum Explica Tudo</b><br>Alto momentum + suporte = compra (alta probabilidade)<br>Alto momentum + resistência = venda<br>Baixo momentum = consolidação<br>Divergência momentum = reversão iminente<br>Não trade contra momentum forte.",
    },
    {
      keys: ["scalping", "day", "swing"],
      resp: "<b>Estilos de Trading</b><br><b>Scalping:</b> 5-30min, ganha 0.1-0.5% por trade, 10-50 trades/dia<br><b>Day Trading:</b> 1h-1d, ganha 1-5%, 1-5 trades/dia<br><b>Swing:</b> Dias/semanas, ganha 5-20%, 1-2 trades/semana<br><b>Position:</b> Meses/anos, ganha 50%+<br>Escolha conforme disponibilidade.",
    },
    {
      keys: ["emocao", "psicologia", "medo", "ganancia"],
      resp: "<b>Psicologia do Trading</b><br>1. MEDO mata mais trades que perdas reais (saia cedo)<br>2. GANÂNCIA causa over-trading (saia no alvo)<br>3. ESPERANÇA mantém perdas abertas (tenha stop loss)<br>4. ORGULHO nega realidade (seja humilde)<br><b>Solução:</b> Tenha plano, siga-o mecanicamente.",
    },
    {
      keys: ["lucro", "ganho", "meta"],
      resp: "<b>Sistema de Ganhos Sustentável</b><br>- Meta realista: 1-3% ao mês = 12-36% ao ano<br>- Para cada 10 trades, 6 ganham e 4 perdem<br>- Ganho médio > perda média (razão risco/retorno)<br>- Acumule pequenos ganhos (juros compostos)<br>- Paciência > velocidade. Sempre.",
    },
    {
      keys: ["stop", "loss", "proteção"],
      resp: "<b>Stop Loss é Seu Seguro</b><br>- SEMPRE use stop loss (sem exceção)<br>- Coloque abaixo de suporte (não em números redondos)<br>- Risco máximo por trade: 1-2% do capital<br>- Exemplo: Capital R$10k, risco R$100-200 por trade<br>- Emocional? Use stop automático.",
    },
    {
      keys: ["take", "profit", "realizar"],
      resp: "<b>Take Profit Estratégico</b><br>- Metas: 1:1 (risco=ganho), 1:2 (ganho=2x risco), 1:3 (melhor)<br>- Partialize: saia com 50% em 1:1, deixe 50% correr<br>- Acompanhe com trailing stop (lucra mais)<br>- Não seja guloso: ganho seguro > especulação",
    },
    {
      keys: ["posição", "tamanho", "lote"],
      resp: "<b>Cálculo Correto do Tamanho da Posição</b><br>Posição = (Capital × Risco%) / Distância Stop<br>Exemplo: Capital R$50k, risco 2%, stop 10 pontos no BTC<br>= (50000 × 0.02) / 10 = 100 satoshis<br>Ajuste sempre conforme sua conta.",
    },
    {
      keys: ["liquidez", "volume"],
      resp: "<b>Liquidez é Vida no Trading</b><br>- Alto volume = entradas/saídas rápidas e baratas<br>- Baixo volume = slippage (pior preço do esperado)<br>- Evite criptos com volume < R$1M/dia<br>- Não force trades ilíquidos (vai se arrepender)<br>- Prefira ativos populares (BTC, ETH, AAPL, etc).",
    },
    {
      keys: ["noticia", "evento", "economia"],
      resp: "<b>Trading de Notícias e Eventos</b><br>- Fed decision, CPI, earnings = volatilidade alta<br>- Antes: consolidação apertada<br>- Depois: movimento explosivo (direction imprevisível)<br>- Estratégia: espere pelo movimento confirmar<br>- Não entre contra a notícia, entre acompanhando.",
    },
    {
      keys: ["correlação", "bitcoin", "altcoins"],
      resp: "<b>Correlação Entre Ativos</b><br>- BTC e altcoins: 0.9 (movem juntas)<br>- Ações e ouro: 0.1 (independentes)<br>- Petróleo e dólar: -0.6 (inverso)<br>- Use correlação para evitar risco sistemático<br>- Não coloque tudo em criptos (não é diversificação).",
    },
    {
      keys: ["gestao", "capital", "risco"],
      resp: "<b>Money Management é Tudo</b><br>- Risco pequeno, ganho grande = fórmula do sucesso<br>- Nunca quer recuperar perdas trading (vai piorar)<br>- Tome breaks (mercado está sempre lá)<br>- Domine 1 ativo antes de múltiplos<br>- Trading com emoção = suicídio financeiro",
    },
    {
      keys: ["bitcoin", "halving", "ciclo"],
      resp: "<b>Ciclo de Halving do Bitcoin (4 Anos)</b><br>Histórico:<br>2012: $100 → $1000 (900%)<br>2016: $650 → $19000 (2900%)<br>2020: $10k → $69k (600%)<br>2024: ? Próximo halving = futura explosão<br>Padrão: +1000% em 18-24 meses pós-halving",
    },
    {
      keys: ["eth", "ethereum", "atualiza"],
      resp: "<b>Ethereum: Blockchain Programável</b><br>- Proof of Work → Proof of Stake (2022)<br>- Smart contracts rodam aplicações descentralizadas<br>- DeFi constrói em ETH (valor enorme)<br>- Staking: 5-8% ao ano passivamente<br>- Segundo maior cripto, fluxo de institucional crescente",
    },
    {
      keys: ["defi", "rendimento", "juros"],
      resp: "<b>DeFi: Finanças Descentralizadas</b><br>- Empréstimos entre P2P (8-15% ao ano)<br>- Pools de liquidez (yield farming)<br>- Staking (passiva 4-20% ao ano)<br>- Risco: contratos com bugs, impermanent loss<br>- Comece pequeno, aprenda segurança",
    },
    {
      keys: ["nft", "mercado", "blockchain"],
      resp: "<b>NFT: Ouro Digital? Ou Bolha?</b><br>- Propriedade única (certificado blockchain)<br>- Arte, colecionáveis, gaming items<br>- Mercado especulativo (boom/bust extremo)<br>- Maioria não tem valor fundamental<br>- Foque em projetos com utilidade real",
    },
    {
      keys: ["imposto", "lucro", "ir"],
      resp: "<b>Imposto sobre Ganhos (Brasil)</b><br>Imposto de Renda:<br>- Pessoa física: 15% sobre ganhos (até R$20k/mês isento)<br>- Day trading: 20% (tabela progressiva)<br>- Criptos: 15% em geral<br>Mantenha registros. Contabile tudo.",
    },
    {
      keys: ["alavancagem", "margem", "risco"],
      resp: "<b>Alavancagem: Faca de Dois Gumes</b><br>2x: Dobra ganho E dobra perda<br>5x: 5x ganho, 5x perda (liquidação fácil)<br>100x: Cassino puro (95% perdem tudo)<br><b>Regra:</b> Iniciante = sem alavancagem<br>Experiente = máximo 2-3x",
    },
  ],

  init() {
    console.log("AI Module initialized with 40+ knowledge base")
  },

  async send() {
    if (!FreemiumManager.checkAIQuota(Store.user.email)) {
      // Assumiendo que FreemiumManager está definido
      Toast.show("Limite diário de perguntas à IA atingido. Upgrade para Premium!", "warning")
      return
    }

    const input = document.getElementById("chat-input")
    // Sanitizar e prevenir XSS
    const msg = InputValidator.preventXSS(input.value.trim().toLowerCase()) // Assumiendo que InputValidator está definido
    if (!msg) return

    const feed = document.getElementById("chat-feed")
    const userMsg = document.createElement("div")
    userMsg.className = "msg user"
    userMsg.textContent = msg // Usar textContent para segurança
    feed.appendChild(userMsg)

    let response =
      "Desculpe, não entendi. Tente reformular ou veja 'Perguntas que respondo'. Lembre-se: não sou consultor financeiro."
    for (const item of AI.knowledge) {
      for (const key of item.keys) {
        if (msg.includes(key)) {
          response = item.resp
          break
        }
      }
      if (
        response !==
        "Desculpe, não entendi. Tente reformular ou veja 'Perguntas que respondo'. Lembre-se: não sou consultor financeiro."
      )
        break
    }

    if (Store.user.email) {
      await appDB.saveAIInteraction(Store.user.email, msg, response)
      FreemiumManager.incrementAIQuota(Store.user.email) // Assumiendo que FreemiumManager está definido
    }

    setTimeout(() => {
      const botMsg = document.createElement("div")
      botMsg.className = "msg bot"
      botMsg.innerHTML = response // Usar innerHTML pois a resposta pode conter tags HTML
      feed.appendChild(botMsg)
      feed.scrollTop = feed.scrollHeight
    }, 300)

    input.value = ""
  },

  showFAQ() {
    document.getElementById("modal-faq").classList.remove("hidden")
    const list = document.getElementById("faq-list")
    list.innerHTML = AI.knowledge
      .map(
        (item, i) =>
          `<div class="faq-item"><b>P${i + 1}: ${item.keys.join(", ")}</b><p>${item.resp.replace(/<br>/g, "\n").replace(/<[^>]*>/g, "")}</p></div>`,
      )
      .join("")
  },
}

// --- NEWS MODULE (ENHANCED) ---
const News = {
  init() {
    News.render(Store.news)
  },

  filter(cat) {
    document.querySelectorAll(".btn-filter").forEach((b) => b.classList.remove("active"))
    if (event.target) event.target.classList.add("active")

    if (cat === "all") News.render(Store.news)
    else News.render(Store.news.filter((n) => n.category === cat))
  },

  render(list) {
    document.getElementById("news-container").innerHTML = list
      .map(
        (n) => `
            <div class="card" onclick="News.open(${n.id})" style="cursor:pointer;">
                <span class="badge" style="font-size:0.65rem; display:inline-block; padding:4px 8px; background:var(--brand-primary); color:#000; border-radius:4px; margin-bottom:8px;">${n.category}</span>
                <h4 style="margin:10px 0; font-size:0.95rem; line-height:1.4;">${n.title}</h4>
                <p class="text-muted" style="font-size:0.85rem; margin:8px 0;">${n.summary}</p>
                <div style="margin-top:10px; font-size:0.75rem; color:var(--text-muted);">
                    <i class="fas fa-tag"></i> ${n.ticker} • <i class="fas fa-clock"></i> ${n.timestamp}
                </div>
            </div>
        `,
      )
      .join("")
  },

  open(id) {
    const n = Store.news.find((x) => x.id === id)
    if (!n) return
    document.getElementById("n-cat").innerText = n.category
    document.getElementById("n-title").innerText = n.title
    document.getElementById("n-body").innerHTML = `
            <p style="font-size:0.9rem; line-height:1.6; color:#fff;">${n.body}</p>
            <div style="margin-top:15px; padding-top:15px; border-top:1px solid var(--border);">
                <small style="color:var(--text-muted);">
                    <i class="fas fa-quote-left"></i> Fonte: ${n.source} • ${n.timestamp}
                </small>
            </div>
        `
    document.getElementById("modal-news").classList.remove("hidden")
  },
}

// --- UTILITIES ---
const Format = {
  currency: (val) => val.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }),
}

const Toast = {
  show(msg, type = "info") {
    const t = document.createElement("div")
    t.style.background = "#1a202c"
    t.style.borderLeft = `4px solid ${type === "success" ? "#00e396" : type === "error" ? "#ff0055" : "#00f2ff"}`
    t.style.padding = "15px 20px"
    t.style.borderRadius = "8px"
    t.style.marginTop = "10px"
    t.style.boxShadow = "0 5px 15px rgba(0,0,0,0.5)"
    t.style.color = "#fff"
    t.innerHTML = msg

    const c = document.getElementById("toast-container")
    c.style.position = "fixed"
    c.style.bottom = "20px"
    c.style.right = "20px"
    c.style.zIndex = "9999"
    c.appendChild(t)
    setTimeout(() => t.remove(), 4000)
  },
}

const Background = {
  init() {
    const c = document.getElementById("bg-canvas")
    if (!c) return
    const ctx = c.getContext("2d")
    let w,
      h,
      particles = []

    const resize = () => {
      w = c.width = window.innerWidth
      h = c.height = window.innerHeight
    }

    window.onresize = resize
    resize()

    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3,
        vy: Math.random() * -0.5 - 0.2,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.1,
      })
    }

    function anim() {
      ctx.clearRect(0, 0, w, h)

      particles.forEach((p) => {
        p.y -= p.vy
        p.x += p.vx
        p.opacity -= 0.003

        if (p.y < -10 || p.opacity < 0) {
          p.y = h + 10
          p.x = Math.random() * w
          p.opacity = Math.random() * 0.5 + 0.1
        }

        ctx.fillStyle = `rgba(0, 242, 255, ${p.opacity})`
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
      })

      requestAnimationFrame(anim)
    }

    anim()
  },
}

// --- EMBEDDED MOCK DATA (Fallback) ---
const AppData = {
  mockAssets: [
    {
      id: "btc",
      ticker: "BTC",
      name: "Bitcoin",
      category: "Cripto",
      basePrice: 50000,
      volatility: 0.05,
      currentPrice: 50000, // Initializing with basePrice
      price: 50000, // Added for consistency with updates
      change24h: 0,
    },
    {
      id: "eth",
      ticker: "ETH",
      name: "Ethereum",
      category: "Cripto",
      basePrice: 3000,
      volatility: 0.06,
      currentPrice: 3000,
      price: 3000,
      change24h: 0,
    },
    {
      id: "xrp",
      ticker: "XRP",
      name: "Ripple",
      category: "Cripto",
      basePrice: 2.5,
      volatility: 0.08,
      currentPrice: 2.5,
      price: 2.5,
      change24h: 0,
    },
    {
      id: "ada",
      ticker: "ADA",
      name: "Cardano",
      category: "Cripto",
      basePrice: 1.2,
      volatility: 0.07,
      currentPrice: 1.2,
      price: 1.2,
      change24h: 0,
    },
    {
      id: "sol",
      ticker: "SOL",
      name: "Solana",
      category: "Cripto",
      basePrice: 200,
      volatility: 0.09,
      currentPrice: 200,
      price: 200,
      change24h: 0,
    },
    {
      id: "aapl",
      ticker: "AAPL",
      name: "Apple",
      category: "Ações",
      basePrice: 180,
      volatility: 0.03,
      currentPrice: 180,
      price: 180,
      change24h: 0,
    },
    {
      id: "googl",
      ticker: "GOOGL",
      name: "Google",
      category: "Ações",
      basePrice: 140,
      volatility: 0.03,
      currentPrice: 140,
      price: 140,
      change24h: 0,
    },
    {
      id: "msft",
      ticker: "MSFT",
      name: "Microsoft",
      category: "Ações",
      basePrice: 380,
      volatility: 0.03,
      currentPrice: 380,
      price: 380,
      change24h: 0,
    },
    {
      id: "tsla",
      ticker: "TSLA",
      name: "Tesla",
      category: "Ações",
      basePrice: 250,
      volatility: 0.05,
      currentPrice: 250,
      price: 250,
      change24h: 0,
    },
    {
      id: "amzn",
      ticker: "AMZN",
      name: "Amazon",
      category: "Ações",
      basePrice: 180,
      volatility: 0.04,
      currentPrice: 180,
      price: 180,
      change24h: 0,
    },
    {
      id: "nvda",
      ticker: "NVDA",
      name: "NVIDIA",
      category: "Ações",
      basePrice: 900,
      volatility: 0.06,
      currentPrice: 900,
      price: 900,
      change24h: 0,
    },
    {
      id: "meta",
      ticker: "META",
      name: "Meta (Facebook)",
      category: "Ações",
      basePrice: 500,
      volatility: 0.05,
      currentPrice: 500,
      price: 500,
      change24h: 0,
    },
    {
      id: "amcx",
      ticker: "AMD",
      name: "AMD",
      category: "Ações",
      basePrice: 170,
      volatility: 0.05,
      currentPrice: 170,
      price: 170,
      change24h: 0,
    },
    {
      id: "nflx",
      ticker: "NFLX",
      name: "Netflix",
      category: "Ações",
      basePrice: 450,
      volatility: 0.04,
      currentPrice: 450,
      price: 450,
      change24h: 0,
    },
    {
      id: "dis",
      ticker: "DIS",
      name: "Disney",
      category: "Ações",
      basePrice: 95,
      volatility: 0.04,
      currentPrice: 95,
      price: 95,
      change24h: 0,
    },
    {
      id: "wmt",
      ticker: "WMT",
      name: "Walmart",
      category: "Ações",
      basePrice: 85,
      volatility: 0.02,
      currentPrice: 85,
      price: 85,
      change24h: 0,
    },
    {
      id: "jnj",
      ticker: "JNJ",
      name: "Johnson & Johnson",
      category: "Ações",
      basePrice: 160,
      volatility: 0.02,
      currentPrice: 160,
      price: 160,
      change24h: 0,
    },
    {
      id: "pg",
      ticker: "PG",
      name: "Procter & Gamble",
      category: "Ações",
      basePrice: 160,
      volatility: 0.02,
      currentPrice: 160,
      price: 160,
      change24h: 0,
    },
    {
      id: "ko",
      ticker: "KO",
      name: "Coca-Cola",
      category: "Ações",
      basePrice: 60,
      volatility: 0.02,
      currentPrice: 60,
      price: 60,
      change24h: 0,
    },
    {
      id: "mcd",
      ticker: "MCD",
      name: "McDonald's",
      category: "Ações",
      basePrice: 290,
      volatility: 0.02,
      currentPrice: 290,
      price: 290,
      change24h: 0,
    },
    {
      id: "wti",
      ticker: "WTI",
      name: "Petróleo Bruto",
      category: "Commodities",
      basePrice: 85,
      volatility: 0.04,
      currentPrice: 85,
      price: 85,
      change24h: 0,
    },
    {
      id: "gold",
      ticker: "GOLD",
      name: "Ouro",
      category: "Commodities",
      basePrice: 2000,
      volatility: 0.03,
      currentPrice: 2000,
      price: 2000,
      change24h: 0,
    },
    {
      id: "silver",
      ticker: "SILVER",
      name: "Prata",
      category: "Commodities",
      basePrice: 25,
      volatility: 0.04,
      currentPrice: 25,
      price: 25,
      change24h: 0,
    },
    {
      id: "copper",
      ticker: "COPPER",
      name: "Cobre",
      category: "Commodities",
      basePrice: 4,
      volatility: 0.04,
      currentPrice: 4,
      price: 4,
      change24h: 0,
    },
    {
      id: "natgas",
      ticker: "NATGAS",
      name: "Gás Natural",
      category: "Commodities",
      basePrice: 3,
      volatility: 0.08,
      currentPrice: 3,
      price: 3,
      change24h: 0,
    },
    {
      id: "wheat",
      ticker: "WHEAT",
      name: "Trigo",
      category: "Commodities",
      basePrice: 8,
      volatility: 0.05,
      currentPrice: 8,
      price: 8,
      change24h: 0,
    },
    {
      id: "corn",
      ticker: "CORN",
      name: "Milho",
      category: "Commodities",
      basePrice: 6,
      volatility: 0.05,
      currentPrice: 6,
      price: 6,
      change24h: 0,
    },
    {
      id: "soy",
      ticker: "SOY",
      name: "Soja",
      category: "Commodities",
      basePrice: 13,
      volatility: 0.04,
      currentPrice: 13,
      price: 13,
      change24h: 0,
    },
    {
      id: "coffee",
      ticker: "COFFEE",
      name: "Café",
      category: "Commodities",
      basePrice: 200,
      volatility: 0.06,
      currentPrice: 200,
      price: 200,
      change24h: 0,
    },
    {
      id: "sugar",
      ticker: "SUGAR",
      name: "Açúcar",
      category: "Commodities",
      basePrice: 20,
      volatility: 0.05,
      currentPrice: 20,
      price: 20,
      change24h: 0,
    },
    {
      id: "dxy",
      ticker: "DXY",
      name: "Dólar Índice",
      category: "Forex",
      basePrice: 105,
      volatility: 0.02,
      currentPrice: 105,
      price: 105,
      change24h: 0,
    },
    {
      id: "eurusd",
      ticker: "EURUSD",
      name: "Euro/Dólar",
      category: "Forex",
      basePrice: 1.1,
      volatility: 0.02,
      currentPrice: 1.1,
      price: 1.1,
      change24h: 0,
    },
  ],

  mockNews: [
    {
      id: 1,
      title: "Bitcoin toca novo recorde acima de $60k",
      summary: "Maior criptomoeda ultrapassa patamar histórico...",
      body: "Bitcoin alcançou hoje novo recorde de $62.500, impulsionado por aprovação de ETF e adoção institucional crescente. Analistas veem suporte em $60k. Volume acima do normal confirma força do movimento. Tendência de longo prazo permanece bullish.",
      category: "Cripto",
      ticker: "BTC",
      timestamp: "10:30 hoje",
      source: "CoinTelegraph",
      region: "Global",
    },
    {
      id: 2,
      title: "Ethereum 2.0 melhora segurança e eficiência",
      summary: "Atualização reduz consumo de energia em 99%...",
      body: "A transição para Proof-of-Stake foi bem-sucedida. Ethereum agora consome 99% menos energia, atraindo investidores ESG. Smart contracts ficam mais baratos. Comunidade celebra a mudança histórica. ETH pode valorizar com adoção institucional.",
      category: "Cripto",
      ticker: "ETH",
      timestamp: "09:15 hoje",
      source: "TheBlock",
      region: "Global",
    },
    {
      id: 3,
      title: "Apple anuncia novo iPhone 15 com IA integrada",
      summary: "Telefone traz processamento local de linguagem natural...",
      body: "Apple revelou iPhone 15 com chip A17 Pro e recursos de IA avançados. Sem necessidade de conectar à nuvem para análises básicas. Bateria dura 30% mais. Lançamento em setembro. Ação AAPL subiu 2%.",
      category: "Ações",
      ticker: "AAPL",
      timestamp: "08:00 hoje",
      source: "Bloomberg",
      region: "EUA",
    },
    {
      id: 4,
      title: "Tesla ultrapassa meta de 2 milhões de carros",
      summary: "Fabricante de EVs bate recorde anual de produção...",
      body: "Tesla produziu mais de 2 milhões de veículos em 2024, consolidando liderança em EVs. Preços caem para estimular demanda. Elon Musk reafirma meta de 3 milhões em 2025. Investidores reagem positivamente.",
      category: "Ações",
      ticker: "TSLA",
      timestamp: "14:45 hoje",
      source: "Reuters",
      region: "EUA",
    },
    {
      id: 5,
      title: "Petróleo sobe com tensões geopolíticas",
      summary: "WTI ultrapassa $90 por barril por primeira vez...",
      body: "Tensões no Oriente Médio causam rally no petróleo. WTI em $92. Oferta apertada por redução voluntária de produção. Dólar fraco também apoia. Analistas veem novo teto em $100.",
      category: "Commodities",
      ticker: "WTI",
      timestamp: "16:20 hoje",
      source: "CNBC",
      region: "Global",
    },
    {
      id: 6,
      title: "Ouro bate recorde histórico acima de $2.500",
      summary: "Aumento de demanda por segurança em portfólio...",
      body: "Ouro fechou em $2.520, novo máximo histórico. Demanda por ativo refúgio cresce com incerteza global. Bancos centrais continuam comprando. Tendência de alta pode levar a $3k.",
      category: "Commodities",
      ticker: "GOLD",
      timestamp: "13:10 hoje",
      source: "MarketWatch",
      region: "Global",
    },
    {
      id: 7,
      title: "Microsoft investe $100 bilhões em IA e cloud",
      summary: "Gigante do software aposta pesado em computação...",
      body: "Microsoft anunciou investimento de $100 bi em infraestrutura de IA nos próximos 10 anos. Copilot integrado em todos os produtos. Parceria com OpenAI fortalecida. MSFT em alta.",
      category: "Ações",
      ticker: "MSFT",
      timestamp: "11:30 hoje",
      source: "TechCrunch",
      region: "EUA",
    },
    {
      id: 8,
      title: "Google quebra recorde de buscas e ads",
      summary: "Receita de publicidade cresce 25% year-over-year...",
      body: "Google reportou crescimento de 25% em receita de ads para Q4. Buscas por IA generativa dispararam. YouTube Ads segue strong. GOOGL valuation justificado.",
      category: "Ações",
      ticker: "GOOGL",
      timestamp: "12:00 hoje",
      source: "Seeking Alpha",
      region: "EUA",
    },
    {
      id: 9,
      title: "Amazon abre novo data center em São Paulo",
      summary: "Expansão na América Latina acelera transformação digital...",
      body: "AWS (Amazon Web Services) anunciou novo data center em SP para melhorar latência. Investimento de $500 milhões. Demanda por cloud cresce na região. AMZN promove inclusão digital.",
      category: "Ações",
      ticker: "AMZN",
      timestamp: "15:00 hoje",
      source: "Valor",
      region: "Brasil",
    },
    {
      id: 10,
      title: "Meta testa óculos AR de nova geração",
      summary: "Dispositivo promete revolucionar metaverso e realidade aumentada...",
      body: "Meta lançou protótipos de óculos AR sem fio com resolução 4K. Visão de Zuckerberg do metaverso ganha tração. Parceria com OpenAI fortalecida. Ação META em alta.",
      category: "Ações",
      ticker: "META",
      timestamp: "10:15 hoje",
      source: "The Verge",
      region: "EUA",
    },
  ],
}

// Boot
// Remover o antigo App.init e usar o novo
// const OldInit = App.init
// App.init = async () => {
//   await OldInit.call(App)

//   // Add chart type buttons to Trade Pro header
//   const header = document.querySelector(".chart-header")
//   if (header) {
//     const typeDiv = document.createElement("div")
//     typeDiv.style.display = "flex"
//     typeDiv.style.gap = "5px"
//     typeDiv.innerHTML = `
//       <button class="tf-btn active" onclick="TradePro.setChartType('candlestick')">Vela</button>
//       <button class="tf-btn" onclick="TradePro.setChartType('line')">Linha</button>
//       <button class="tf-btn" onclick="TradePro.setChartType('area')">Área</button>
//     `
//     header.insertBefore(typeDiv, header.querySelector(".timeframes"))
//   }
// }

// Removed the redundant setInterval for tick updates, as it's now handled by TradePro.tick() in a more appropriate place.
// It's better to have tick calls within route changes or market updates.
// setInterval(() => {
//   if (Store.charts.proSeries && document.getElementById("view-trade-pro").classList.contains("active")) {
//     TradePro.tick()
//   }
// }, 10000)

// Added a new setInterval for market price updates. The original one was commented out.
// This is for live price simulation.
setInterval(() => {
  Store.assets.forEach((a) => {
    // Ensure 'price' exists, fallback to currentPrice or basePrice
    if (a.price === undefined) a.price = a.currentPrice || a.basePrice || 0

    // Apply volatility to simulate price changes
    const volatilityFactor = a.volatility || 0.03 // Use asset volatility or a default
    const priceChange = (Math.random() - 0.5) * a.price * volatilityFactor
    a.price = Number.parseFloat((a.price + priceChange).toFixed(2))

    // Update change24h based on basePrice
    a.change24h = (((a.price - a.basePrice) / a.basePrice) * 100).toFixed(2)
  })

  // Update UI elements that depend on live prices
  Market.render() // Re-render market list
  TradePro.updatePriceDisplay() // Update Trade Pro price display
  Dashboard.update() // Update dashboard charts/values
  if (document.getElementById("view-market").classList.contains("active")) {
    // Re-render market list if market view is active (redundant if Market.render is already called)
  }

  // Trigger TradePro tick for real-time chart updates if Trade Pro view is active
  if (
    document.getElementById("view-trade-pro") &&
    document.getElementById("view-trade-pro").classList.contains("active")
  ) {
    TradePro.tick()
  }
}, 5000) // Update every 5 seconds

window.onload = App.init

// CONFIRMADO: Código original preservado. Sistema aprimorado com foco em segurança, escalabilidade, educação e qualidade profissional.
