class AuthManager {
  static SESSION_DURATION = 30 * 60 * 1000 // 30 minutos

  static async hashPassword(password) {
    const encoder = new TextEncoder()
    const data = encoder.encode(password + "alphaflow_salt_v1")
    const hashBuffer = await crypto.subtle.digest("SHA-256", data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
  }

  static generateToken() {
    const array = new Uint8Array(32)
    crypto.getRandomValues(array)
    return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("")
  }

  static saveSession(userData) {
    const session = {
      user: {
        email: userData.email,
        name: userData.name,
        type: userData.type,
      },
      token: this.generateToken(),
      expiresAt: Date.now() + this.SESSION_DURATION,
      createdAt: Date.now(),
    }
    sessionStorage.setItem("alphaflow_session", JSON.stringify(session))
    return session
  }

  static getSession() {
    const sessionData = sessionStorage.getItem("alphaflow_session")
    if (!sessionData) return null

    const session = JSON.parse(sessionData)
    if (Date.now() > session.expiresAt) {
      this.clearSession()
      return null
    }

    return session
  }

  static refreshSession() {
    const session = this.getSession()
    if (!session) return null

    session.expiresAt = Date.now() + this.SESSION_DURATION
    sessionStorage.setItem("alphaflow_session", JSON.stringify(session))
    return session
  }

  static clearSession() {
    sessionStorage.removeItem("alphaflow_session")
  }

  static isAuthenticated() {
    return this.getSession() !== null
  }
}
