// CONFIRMADO: Código original preservado. Sistema aprimorado com foco em segurança, escalabilidade, educação e qualidade profissional.

// Authentication Page JavaScript - AlphaFlow
const AuthPage = {
  InputValidator: null,
  AuthManager: null,
  appDB: null,

  async init() {
    // Inicializa os modulos (classes definidas globalmente)
    this.InputValidator = InputValidator
    this.AuthManager = AuthManager
    
    // Inicializa o banco de dados IndexedDB
    this.appDB = new AlphaDB()
    try {
      await this.appDB.init()
      console.log("[v0] Banco de dados inicializado com sucesso")
    } catch (error) {
      console.error("[v0] Erro ao inicializar banco de dados:", error)
    }

    // Verifica se usuario ja esta logado - redireciona para area de investimentos
    if (this.AuthManager.isAuthenticated()) {
      window.location.href = "index.html"
      return
    }

    this.initParticles()
    this.initForms()
    this.checkURLParams()
  },

  checkURLParams() {
    const params = new URLSearchParams(window.location.search)
    const mode = params.get("mode")
    if (mode === "signup") {
      this.switchTab("signup")
    }
  },

  switchTab(tab) {
    const tabs = document.querySelectorAll(".tab-btn")
    const forms = document.querySelectorAll(".auth-form")

    tabs.forEach((t) => t.classList.remove("active"))
    forms.forEach((f) => f.classList.remove("active"))

    if (tab === "login") {
      tabs[0].classList.add("active")
      document.getElementById("login-form").classList.add("active")
    } else {
      tabs[1].classList.add("active")
      document.getElementById("signup-form").classList.add("active")
    }
  },

  initForms() {
    // Login Form
    const loginForm = document.getElementById("login-form")
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault()
      await this.handleLogin()
    })

    // Signup Form
    const signupForm = document.getElementById("signup-form")
    signupForm.addEventListener("submit", async (e) => {
      e.preventDefault()
      await this.handleSignup()
    })
  },

  async handleLogin() {
    const identifier = this.InputValidator.sanitizeString(document.getElementById("login-identifier").value.trim())
    const password = document.getElementById("login-password").value
    const humanCheck = document.getElementById("human-check").checked

    // Validations
    if (!identifier || !password) {
      this.showToast("Preencha todos os campos!", "warning")
      return
    }

    if (!humanCheck) {
      this.showToast("Confirme que você não é um robô", "warning")
      return
    }

    if (!this.InputValidator.rateLimitCheck(`login_${identifier}`, 5, 60000)) {
      this.showToast("Muitas tentativas. Aguarde 1 minuto.", "error")
      return
    }

    try {
      const hashedPass = await this.AuthManager.hashPassword(password)

      // Try to get user by email or name
      let user = await this.appDB.getUser(identifier)

      if (!user) {
        // Try to find by name
        const allUsers = await this.appDB.getAllUsers()
        user = allUsers.find((u) => u.name.toLowerCase() === identifier.toLowerCase())
      }

      if (!user) {
        this.showToast("Usuário não encontrado", "error")
        return
      }

      if (user.password !== hashedPass) {
        this.showToast("Senha incorreta", "error")
        return
      }

      // Success - Save session and redirect
      this.AuthManager.saveSession(user)
      this.showToast("Login realizado com sucesso!", "success")

      setTimeout(() => {
        window.location.href = "index.html"
      }, 1000)
    } catch (error) {
      console.error("[v0] Login error:", error)
      this.showToast("Erro ao fazer login. Tente novamente.", "error")
    }
  },

  async handleSignup() {
    const nameRaw = document.getElementById("signup-name").value.trim()
    const emailRaw = document.getElementById("signup-email").value.trim().toLowerCase()
    const password = document.getElementById("signup-password").value
    const confirmPassword = document.getElementById("signup-password-confirm").value
    const notificationsOpt = document.getElementById("notifications-opt").checked
    const termsCheck = document.getElementById("terms-check").checked

    // Validations
    if (!nameRaw || !emailRaw || !password || !confirmPassword) {
      this.showToast("Preencha todos os campos!", "warning")
      return
    }

    // Validacao de nome - bloqueia numeros
    const nameHasNumbers = /\d/.test(nameRaw)
    if (nameHasNumbers) {
      this.showToast("Nome nao pode conter numeros!", "error")
      return
    }

    // Validacao de nome - apenas letras e espacos
    const namePattern = /^[A-Za-zÀ-ÿ\s]+$/
    if (!namePattern.test(nameRaw)) {
      this.showToast("Nome deve conter apenas letras e espacos", "error")
      return
    }

    // Validacao de nome - minimo 3 caracteres
    if (nameRaw.length < 3) {
      this.showToast("Nome deve ter pelo menos 3 caracteres", "error")
      return
    }

    // Validacao de email - obrigatorio @gmail.com
    if (!emailRaw.endsWith("@gmail.com")) {
      this.showToast("Email deve terminar com @gmail.com", "error")
      return
    }

    // Validacao de email - parte antes do @ nao pode ser muito grande (max 20 caracteres)
    const emailLocalPart = emailRaw.split("@")[0]
    if (emailLocalPart.length > 20) {
      this.showToast("Email muito longo! Maximo 20 caracteres antes do @", "error")
      return
    }

    // Validacao de email - parte antes do @ minimo 3 caracteres
    if (emailLocalPart.length < 3) {
      this.showToast("Email deve ter pelo menos 3 caracteres antes do @", "error")
      return
    }

    // Sanitiza depois de validar
    const name = this.InputValidator.sanitizeString(nameRaw)
    const email = this.InputValidator.sanitizeString(emailRaw)

    // Validacao de senha - minimo 6 caracteres
    if (password.length < 6) {
      this.showToast("Senha deve ter pelo menos 6 caracteres", "error")
      return
    }

    if (password !== confirmPassword) {
      this.showToast("As senhas não coincidem", "error")
      return
    }

    if (!termsCheck) {
      this.showToast("Você deve aceitar os Termos de Uso", "warning")
      return
    }

    try {
      // Check if user already exists
      const existingUser = await this.appDB.getUser(email)
      if (existingUser) {
        this.showToast("Email já cadastrado", "error")
        return
      }

      // Create new user
      const hashedPass = await this.AuthManager.hashPassword(password)
      const newUser = {
        email,
        name,
        password: hashedPass,
        type: "Iniciante",
        balance: 5000.0,
        portfolio: {},
        history: [],
        notificationsEnabled: notificationsOpt,
        createdAt: new Date().toISOString(),
      }

      await this.appDB.saveUser(newUser)

      // Save session
      this.AuthManager.saveSession(newUser)

      // Save notification preference
      localStorage.setItem("alphaflow_notifications", notificationsOpt.toString())

      this.showToast("Conta criada com sucesso!", "success")

      setTimeout(() => {
        window.location.href = "index.html"
      }, 1500)
    } catch (error) {
      console.error("[v0] Signup error:", error)
      this.showToast("Erro ao criar conta. Tente novamente.", "error")
    }
  },

  showToast(message, type = "info") {
    let container = document.getElementById("toast-container")
    if (!container) {
      container = document.createElement("div")
      container.id = "toast-container"
      container.style.cssText = "position:fixed;top:20px;right:20px;z-index:9999;"
      document.body.appendChild(container)
    }

    const toast = document.createElement("div")
    toast.className = `toast toast-${type}`
    toast.style.cssText = `
      background: ${type === "error" ? "#ff0055" : type === "success" ? "#00e396" : "#00f2ff"};
      color: ${type === "info" || type === "warning" ? "#000" : "#fff"};
      padding: 15px 20px;
      border-radius: 8px;
      margin-bottom: 10px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.3);
      animation: slideIn 0.3s ease-out;
      font-weight: 600;
    `
    toast.textContent = message
    container.appendChild(toast)

    setTimeout(() => {
      toast.style.animation = "slideOut 0.3s ease-out"
      setTimeout(() => toast.remove(), 300)
    }, 3000)
  },

  initParticles() {
    const canvas = document.getElementById("particles-canvas")
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles = []
    const particleCount = 50

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 2 + 0.5
        this.speedX = Math.random() * 0.3 - 0.15
        this.speedY = Math.random() * 0.3 - 0.15
        this.opacity = Math.random() * 0.4 + 0.1
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY

        if (this.x > canvas.width) this.x = 0
        if (this.x < 0) this.x = canvas.width
        if (this.y > canvas.height) this.y = 0
        if (this.y < 0) this.y = canvas.height
      }

      draw() {
        ctx.fillStyle = `rgba(0, 242, 255, ${this.opacity})`
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle())
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach((particle) => {
        particle.update()
        particle.draw()
      })
      requestAnimationFrame(animate)
    }

    animate()

    window.addEventListener("resize", () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    })
  },
}

// CSS Animations
const style = document.createElement("style")
style.textContent = `
  @keyframes slideIn {
    from { transform: translateX(400px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(400px); opacity: 0; }
  }
`
document.head.appendChild(style)

// Initialize on page load
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => AuthPage.init())
} else {
  AuthPage.init()
}
