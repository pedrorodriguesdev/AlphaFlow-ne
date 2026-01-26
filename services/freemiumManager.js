class FreemiumManager {
  static TIERS = {
    FREE: {
      name: "Gratuito",
      maxTrades: 50,
      maxPortfolio: 100000,
      aiQueries: 20,
      advancedIndicators: false,
      newsAccess: "basic",
      supportLevel: "community",
    },
    PREMIUM: {
      name: "Premium",
      maxTrades: Number.POSITIVE_INFINITY,
      maxPortfolio: Number.POSITIVE_INFINITY,
      aiQueries: Number.POSITIVE_INFINITY,
      advancedIndicators: true,
      newsAccess: "full",
      supportLevel: "priority",
    },
  }

  static getUserTier(userEmail) {
    const premiumUsers = JSON.parse(localStorage.getItem("premium_users") || "[]")
    return premiumUsers.includes(userEmail) ? "PREMIUM" : "FREE"
  }

  static checkFeatureAccess(userEmail, feature) {
    const tier = this.getUserTier(userEmail)
    const limits = this.TIERS[tier]
    return limits[feature]
  }

  static checkTradeLimit(userEmail) {
    const tier = this.getUserTier(userEmail)
    const tradeCount = Number.parseInt(localStorage.getItem(`trade_count_${userEmail}`) || "0")
    return tradeCount < this.TIERS[tier].maxTrades
  }

  static incrementTradeCount(userEmail) {
    const currentCount = Number.parseInt(localStorage.getItem(`trade_count_${userEmail}`) || "0")
    localStorage.setItem(`trade_count_${userEmail}`, (currentCount + 1).toString())
  }

  static checkAIQuota(userEmail) {
    const tier = this.getUserTier(userEmail)
    const today = new Date().toDateString()
    const quotaKey = `ai_quota_${userEmail}_${today}`
    const used = Number.parseInt(localStorage.getItem(quotaKey) || "0")
    return used < this.TIERS[tier].aiQueries
  }

  static incrementAIQuota(userEmail) {
    const today = new Date().toDateString()
    const quotaKey = `ai_quota_${userEmail}_${today}`
    const used = Number.parseInt(localStorage.getItem(quotaKey) || "0")
    localStorage.setItem(quotaKey, (used + 1).toString())
  }
}
