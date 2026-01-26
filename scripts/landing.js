// CONFIRMADO: Código original preservado. Sistema aprimorado com foco em segurança, escalabilidade, educação e qualidade profissional.

// Landing Page JavaScript - AlphaFlow
const Landing = {
  init() {
    this.initParticles()
    this.checkAuth()
    this.initScrollEffects()
  },

  checkAuth() {
    const session = window.AuthManager.getSession() // Assuming AuthManager is a global object or imported correctly
    if (session && session.user) {
      const userIndicator = document.getElementById("user-indicator")
      const authTrigger = document.getElementById("auth-trigger")
      const userName = document.getElementById("user-name-header")

      if (userIndicator && authTrigger && userName) {
        userName.textContent = session.user.name
        userIndicator.classList.remove("hidden")
        authTrigger.classList.add("hidden")
      }
    }
  },

  goToAuth() {
    window.location.href = "auth.html"
  },

  goToDashboard() {
    const session = window.AuthManager.getSession() // Assuming AuthManager is a global object or imported correctly
    if (session && session.user) {
      window.location.href = "index.html"
    } else {
      this.goToAuth()
    }
  },

  showUserMenu() {
    const menu = confirm("Deseja acessar o painel de investimentos?")
    if (menu) {
      this.goToDashboard()
    }
  },

  initParticles() {
    const canvas = document.getElementById("particles-canvas")
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles = []
    const particleCount = 80

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 2 + 0.5
        this.speedX = Math.random() * 0.5 - 0.25
        this.speedY = Math.random() * 0.5 - 0.25
        this.opacity = Math.random() * 0.5 + 0.2
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

      for (let i = 0; i < particles.length; i++) {
        particles[i].update()
        particles[i].draw()

        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 100) {
            ctx.strokeStyle = `rgba(0, 242, 255, ${0.1 * (1 - distance / 100)})`
            ctx.lineWidth = 0.5
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }

      requestAnimationFrame(animate)
    }

    animate()

    window.addEventListener("resize", () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    })
  },

  initScrollEffects() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -100px 0px",
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1"
          entry.target.style.transform = "translateY(0)"
        }
      })
    }, observerOptions)

    document.querySelectorAll(".feature-card, .about-card").forEach((el) => {
      el.style.opacity = "0"
      el.style.transform = "translateY(30px)"
      el.style.transition = "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)"
      observer.observe(el)
    })
  },
}

// Initialize on page load
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => Landing.init())
} else {
  Landing.init()
}
