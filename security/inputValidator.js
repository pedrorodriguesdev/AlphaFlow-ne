class InputValidator {
  static sanitizeHTML(input) {
    const temp = document.createElement("div")
    temp.textContent = input
    return temp.innerHTML
  }

  static sanitizeString(input) {
    if (typeof input !== "string") return ""
    return input.replace(/[<>"'&]/g, (char) => {
      const entities = { "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;", "&": "&amp;" }
      return entities[char]
    })
  }

  static validateEmail(email) {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    return regex.test(email)
  }

  static validateEmailProvider(email) {
    const allowedProviders = ["gmail.com", "hotmail.com", "outlook.com", "yahoo.com"]
    const domain = email.split("@")[1]
    return allowedProviders.includes(domain)
  }

  static validateName(name) {
    return /^[a-zA-ZÀ-ÿ\s]{2,50}$/.test(name)
  }

  static validatePassword(password) {
    return password.length >= 6 && /[A-Za-z]/.test(password) && /[0-9]/.test(password)
  }

  static sanitizeNumericInput(value, min = 0, max = Number.POSITIVE_INFINITY) {
    const num = Number.parseFloat(value)
    if (isNaN(num)) return min
    return Math.max(min, Math.min(max, num))
  }

  static validateTradeAmount(amount, availableBalance) {
    const num = this.sanitizeNumericInput(amount, 0.001)
    return num > 0 && num <= availableBalance
  }

  static preventXSS(input) {
    return this.sanitizeHTML(this.sanitizeString(input))
  }

  static rateLimitCheck(key, maxAttempts = 5, windowMs = 60000) {
    const now = Date.now()
    const attempts = JSON.parse(localStorage.getItem(`rateLimit_${key}`) || "[]")
    const recentAttempts = attempts.filter((time) => now - time < windowMs)

    if (recentAttempts.length >= maxAttempts) {
      return false
    }

    recentAttempts.push(now)
    localStorage.setItem(`rateLimit_${key}`, JSON.stringify(recentAttempts))
    return true
  }
}
