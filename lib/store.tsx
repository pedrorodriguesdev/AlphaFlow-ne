"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback, useEffect } from "react"
import type { Asset, User, Trade, NewsItem, ViewType, Message, IAConfig, SmartPortfolio, PortfolioAllocation } from "./types"
import { mockAssets, mockNews, defaultUser, defaultIAConfig } from "./data"

interface AppState {
  user: User
  assets: Asset[]
  news: NewsItem[]
  currentView: ViewType
  isAuthenticated: boolean
  messages: Message[]
  iaConfig: IAConfig
  smartPortfolio: SmartPortfolio | null
  purchasePrices: Record<string, number> // Preço médio de compra por ativo
}

interface AppContextType extends AppState {
  setCurrentView: (view: ViewType) => void
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  updateUser: (updates: Partial<User>) => void
  executeTrade: (
    type: "buy" | "sell",
    asset: Asset,
    quantity: number
  ) => { success: boolean; message: string }
  addFunds: () => { success: boolean; message: string }
  updateAssetPrices: () => void
  addMessage: (message: Message) => void
  formatCurrency: (value: number) => string
  calculateEquity: () => number
  updateIAConfig: (config: Partial<IAConfig>) => void
  generateSmartPortfolio: () => void
  getAssetPurchasePrice: (ticker: string) => number | null
  calculateProfit: (ticker: string, currentPrice: number) => { profit: number; percentage: number } | null
}

const AppContext = createContext<AppContextType | null>(null)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(defaultUser)
  const [assets, setAssets] = useState<Asset[]>(mockAssets)
  const [news] = useState<NewsItem[]>(mockNews)
  const [currentView, setCurrentView] = useState<ViewType>("dashboard")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [refillCount, setRefillCount] = useState(3)
  const [iaConfig, setIAConfig] = useState<IAConfig>(defaultIAConfig)
  const [smartPortfolio, setSmartPortfolio] = useState<SmartPortfolio | null>(null)
  const [purchasePrices, setPurchasePrices] = useState<Record<string, number>>({})

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("alphaflow_user")
    const savedAuth = localStorage.getItem("alphaflow_auth")
    const savedRefill = localStorage.getItem("alphaflow_refill")
    const savedIAConfig = localStorage.getItem("alphaflow_ia_config")
    const savedPurchasePrices = localStorage.getItem("alphaflow_purchase_prices")
    const savedSmartPortfolio = localStorage.getItem("alphaflow_smart_portfolio")

    if (savedUser && savedAuth === "true") {
      setUser(JSON.parse(savedUser))
      setIsAuthenticated(true)
    }

    if (savedRefill) {
      const refillData = JSON.parse(savedRefill)
      const today = new Date().toDateString()
      if (refillData.date === today) {
        setRefillCount(refillData.count)
      } else {
        setRefillCount(3)
      }
    }

    if (savedIAConfig) {
      setIAConfig(JSON.parse(savedIAConfig))
    }

    if (savedPurchasePrices) {
      setPurchasePrices(JSON.parse(savedPurchasePrices))
    }

    if (savedSmartPortfolio) {
      setSmartPortfolio(JSON.parse(savedSmartPortfolio))
    }
  }, [])

  // Save user to localStorage on change
  useEffect(() => {
    if (isAuthenticated && user.email) {
      localStorage.setItem("alphaflow_user", JSON.stringify(user))
    }
  }, [user, isAuthenticated])

  // Save IA config
  useEffect(() => {
    localStorage.setItem("alphaflow_ia_config", JSON.stringify(iaConfig))
  }, [iaConfig])

  // Save purchase prices
  useEffect(() => {
    localStorage.setItem("alphaflow_purchase_prices", JSON.stringify(purchasePrices))
  }, [purchasePrices])

  // Update asset prices periodically
  useEffect(() => {
    const interval = setInterval(() => {
      updateAssetPrices()
    }, 10000) // A cada 10 segundos como solicitado
    return () => clearInterval(interval)
  }, [])

  const formatCurrency = useCallback((value: number) => {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    })
  }, [])

  const calculateEquity = useCallback(() => {
    let invested = 0
    for (const ticker of Object.keys(user.portfolio)) {
      const asset = assets.find((a) => a.ticker === ticker)
      if (asset) {
        invested += user.portfolio[ticker] * asset.price
      }
    }
    return user.balance + invested
  }, [user, assets])

  const login = useCallback(
    async (email: string, password: string): Promise<boolean> => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        return false
      }

      if (password.length < 6) {
        return false
      }

      const existingUser = localStorage.getItem(`alphaflow_user_${email}`)
      if (existingUser) {
        const userData = JSON.parse(existingUser)
        setUser(userData)
      } else {
        const newUser: User = {
          name: email.split("@")[0].charAt(0).toUpperCase() + email.split("@")[0].slice(1),
          email,
          type: "Iniciante",
          balance: 5000,
          portfolio: {},
          history: [],
          createdAt: new Date().toISOString(),
        }
        setUser(newUser)
        localStorage.setItem(`alphaflow_user_${email}`, JSON.stringify(newUser))
      }

      // Carregar configurações salvas do usuário
      const savedIAConfig = localStorage.getItem(`alphaflow_ia_config_${email}`)
      if (savedIAConfig) {
        setIAConfig(JSON.parse(savedIAConfig))
      }

      const savedPurchasePrices = localStorage.getItem(`alphaflow_purchase_prices_${email}`)
      if (savedPurchasePrices) {
        setPurchasePrices(JSON.parse(savedPurchasePrices))
      }

      setIsAuthenticated(true)
      localStorage.setItem("alphaflow_auth", "true")
      return true
    },
    []
  )

  const logout = useCallback(() => {
    if (user.email) {
      localStorage.setItem(`alphaflow_user_${user.email}`, JSON.stringify(user))
      localStorage.setItem(`alphaflow_ia_config_${user.email}`, JSON.stringify(iaConfig))
      localStorage.setItem(`alphaflow_purchase_prices_${user.email}`, JSON.stringify(purchasePrices))
    }
    setUser(defaultUser)
    setIsAuthenticated(false)
    setIAConfig(defaultIAConfig)
    setPurchasePrices({})
    setSmartPortfolio(null)
    localStorage.removeItem("alphaflow_auth")
    localStorage.removeItem("alphaflow_user")
  }, [user, iaConfig, purchasePrices])

  const updateUser = useCallback((updates: Partial<User>) => {
    setUser((prev) => {
      const updated = { ...prev, ...updates }
      if (updated.email) {
        localStorage.setItem(`alphaflow_user_${updated.email}`, JSON.stringify(updated))
      }
      return updated
    })
  }, [])

  const getAssetPurchasePrice = useCallback((ticker: string): number | null => {
    return purchasePrices[ticker] || null
  }, [purchasePrices])

  const calculateProfit = useCallback((ticker: string, currentPrice: number): { profit: number; percentage: number } | null => {
    const purchasePrice = purchasePrices[ticker]
    const quantity = user.portfolio[ticker]
    
    if (!purchasePrice || !quantity) return null
    
    const currentValue = quantity * currentPrice
    const purchaseValue = quantity * purchasePrice
    const profit = currentValue - purchaseValue
    const percentage = ((currentPrice - purchasePrice) / purchasePrice) * 100
    
    return { profit, percentage }
  }, [purchasePrices, user.portfolio])

  const executeTrade = useCallback(
    (
      type: "buy" | "sell",
      asset: Asset,
      quantity: number
    ): { success: boolean; message: string } => {
      if (!isAuthenticated) {
        return { success: false, message: "Faça login para operar" }
      }

      if (quantity <= 0 || isNaN(quantity)) {
        return { success: false, message: "Quantidade inválida" }
      }

      const total = asset.price * quantity

      if (type === "buy") {
        if (user.balance < total) {
          return { success: false, message: `Saldo insuficiente. Necessário: ${formatCurrency(total)}` }
        }

        const trade: Trade = {
          type: "buy",
          ticker: asset.ticker,
          qty: quantity,
          price: asset.price,
          total,
          time: new Date().toISOString(),
        }

        // Calcular novo preço médio
        const currentQty = user.portfolio[asset.ticker] || 0
        const currentAvgPrice = purchasePrices[asset.ticker] || 0
        const newTotalQty = currentQty + quantity
        const newAvgPrice = ((currentQty * currentAvgPrice) + (quantity * asset.price)) / newTotalQty

        setPurchasePrices(prev => ({
          ...prev,
          [asset.ticker]: newAvgPrice
        }))

        setUser((prev) => ({
          ...prev,
          balance: prev.balance - total,
          portfolio: {
            ...prev.portfolio,
            [asset.ticker]: (prev.portfolio[asset.ticker] || 0) + quantity,
          },
          history: [...prev.history, trade],
        }))

        return {
          success: true,
          message: `Compra de ${quantity.toFixed(4)} ${asset.ticker} realizada!`,
        }
      } else {
        // VENDA
        const currentQty = user.portfolio[asset.ticker] || 0
        if (currentQty < quantity) {
          return { success: false, message: `Você possui apenas ${currentQty.toFixed(4)} ${asset.ticker}` }
        }

        // Calcular lucro/prejuízo
        const purchasePrice = purchasePrices[asset.ticker] || asset.price
        const profit = (asset.price - purchasePrice) * quantity
        const profitPercentage = ((asset.price - purchasePrice) / purchasePrice) * 100

        const trade: Trade = {
          type: "sell",
          ticker: asset.ticker,
          qty: quantity,
          price: asset.price,
          total,
          time: new Date().toISOString(),
          buyPrice: purchasePrice,
        }

        setUser((prev) => {
          const newPortfolio = { ...prev.portfolio }
          newPortfolio[asset.ticker] -= quantity
          if (newPortfolio[asset.ticker] <= 0.0001) {
            delete newPortfolio[asset.ticker]
            // Remover preço de compra se não tiver mais o ativo
            setPurchasePrices(p => {
              const newPrices = { ...p }
              delete newPrices[asset.ticker]
              return newPrices
            })
          }
          return {
            ...prev,
            balance: prev.balance + total,
            portfolio: newPortfolio,
            history: [...prev.history, trade],
          }
        })

        const profitText = profit >= 0 
          ? `Lucro: +${formatCurrency(profit)} (+${profitPercentage.toFixed(2)}%)`
          : `Prejuízo: ${formatCurrency(profit)} (${profitPercentage.toFixed(2)}%)`

        return {
          success: true,
          message: `Venda de ${quantity.toFixed(4)} ${asset.ticker} realizada! ${profitText}`,
        }
      }
    },
    [isAuthenticated, user, purchasePrices, formatCurrency]
  )

  const addFunds = useCallback((): { success: boolean; message: string } => {
    if (!isAuthenticated) {
      return { success: false, message: "Faça login para adicionar saldo" }
    }

    if (refillCount <= 0) {
      return { success: false, message: "Limite de resgates diários atingido" }
    }

    setUser((prev) => ({
      ...prev,
      balance: prev.balance + 10000,
    }))

    const newCount = refillCount - 1
    setRefillCount(newCount)
    localStorage.setItem(
      "alphaflow_refill",
      JSON.stringify({
        count: newCount,
        date: new Date().toDateString(),
      })
    )

    return {
      success: true,
      message: `R$ 10.000,00 adicionado! Restam ${newCount} resgates hoje.`,
    }
  }, [isAuthenticated, refillCount])

  const updateAssetPrices = useCallback(() => {
    setAssets((prev) =>
      prev.map((asset) => {
        const variance = (Math.random() - 0.5) * 0.02
        const newPrice = asset.price * (1 + variance)
        const change = ((newPrice - asset.basePrice) / asset.basePrice) * 100
        return {
          ...asset,
          price: Number(newPrice.toFixed(2)),
          change24h: Number(change.toFixed(2)),
        }
      })
    )
  }, [])

  const addMessage = useCallback((message: Message) => {
    setMessages((prev) => [...prev, message])
  }, [])

  const updateIAConfig = useCallback((config: Partial<IAConfig>) => {
    setIAConfig((prev) => ({ ...prev, ...config }))
  }, [])

  const generateSmartPortfolio = useCallback(() => {
    // Gerar portfólio baseado na configuração do usuário
    let allocations: PortfolioAllocation[] = []
    let riskScore = 5
    let expectedReturn = 10

    if (iaConfig.mainGoal === "emergency" || iaConfig.knowledgeLevel === "beginner") {
      // Carteira conservadora - prioriza segurança e liquidez
      allocations = [
        { ticker: "TESOURO", name: "Tesouro Selic", category: "Renda Fixa", percentage: 50, reason: "Alta liquidez e baixo risco. Historicamente acompanha a taxa básica de juros.", riskLevel: "baixo" },
        { ticker: "ITUB4", name: "Itaú Unibanco", category: "Ações", percentage: 15, reason: "Banco com histórico de dividendos consistentes. Sujeito a volatilidade de mercado.", riskLevel: "médio" },
        { ticker: "GOLD", name: "Ouro", category: "Commodities", percentage: 15, reason: "Reserva de valor tradicional. Tende a proteger contra inflação no longo prazo.", riskLevel: "médio" },
        { ticker: "BTC", name: "Bitcoin", category: "Cripto", percentage: 10, reason: "Exposição limitada ao mercado cripto. Pode variar 20-50% em períodos curtos.", riskLevel: "alto" },
        { ticker: "VALE3", name: "Vale S.A.", category: "Ações", percentage: 10, reason: "Diversificação em commodities. Sensível a ciclos econômicos globais.", riskLevel: "médio" },
      ]
      riskScore = 3
      expectedReturn = 8
    } else if (iaConfig.mainGoal === "longterm" || iaConfig.knowledgeLevel === "intermediate") {
      // Carteira moderada - equilíbrio entre crescimento e proteção
      allocations = [
        { ticker: "TESOURO", name: "Tesouro IPCA+", category: "Renda Fixa", percentage: 30, reason: "Protege contra inflação com retorno real garantido se levado ao vencimento.", riskLevel: "baixo" },
        { ticker: "PETR4", name: "Petrobras", category: "Ações", percentage: 15, reason: "Potencial de dividendos elevados. Sujeita a riscos políticos e de commodities.", riskLevel: "médio" },
        { ticker: "BTC", name: "Bitcoin", category: "Cripto", percentage: 20, reason: "Ativo com potencial de valorização. Historicamente volátil mas com tendência de alta em ciclos de 4 anos.", riskLevel: "alto" },
        { ticker: "ETH", name: "Ethereum", category: "Cripto", percentage: 15, reason: "Plataforma líder em contratos inteligentes. Oferece staking com rendimentos de 4-5% a.a.", riskLevel: "alto" },
        { ticker: "WEGE3", name: "WEG S.A.", category: "Ações", percentage: 10, reason: "Histórico de crescimento consistente. Empresa exportadora sujeita a câmbio.", riskLevel: "médio" },
        { ticker: "GOLD", name: "Ouro", category: "Commodities", percentage: 10, reason: "Hedge tradicional contra incertezas. Tende a descorrelacionar de ações.", riskLevel: "baixo" },
      ]
      riskScore = 5
      expectedReturn = 12
    } else if (iaConfig.mainGoal === "passive") {
      // Carteira de renda passiva - foco em geração de fluxo
      allocations = [
        { ticker: "ITUB4", name: "Itaú Unibanco", category: "Ações", percentage: 25, reason: "Histórico de dividend yield de 5-8% a.a. Setor bancário apresenta ciclicidade.", riskLevel: "médio" },
        { ticker: "BBDC4", name: "Bradesco", category: "Ações", percentage: 20, reason: "Dividendos historicamente consistentes. Diversificação no setor financeiro.", riskLevel: "médio" },
        { ticker: "TESOURO", name: "Tesouro IPCA+", category: "Renda Fixa", percentage: 25, reason: "Títulos com juros semestrais. Renda previsível protegida da inflação.", riskLevel: "baixo" },
        { ticker: "PETR4", name: "Petrobras", category: "Ações", percentage: 15, reason: "Entre os maiores dividend yields da bolsa. Alta variabilidade nos proventos.", riskLevel: "médio" },
        { ticker: "ETH", name: "Ethereum (Staking)", category: "Cripto", percentage: 15, reason: "Staking oferece rendimentos de ~4-5% a.a. em ETH. Sujeito a volatilidade do ativo.", riskLevel: "alto" },
      ]
      riskScore = 4
      expectedReturn = 10
    } else {
      // Carteira agressiva - máximo potencial de retorno com risco elevado
      allocations = [
        { ticker: "BTC", name: "Bitcoin", category: "Cripto", percentage: 30, reason: "Líder do mercado cripto por capitalização. Pode variar 50%+ em correções, mas tem tendência histórica de alta.", riskLevel: "alto" },
        { ticker: "ETH", name: "Ethereum", category: "Cripto", percentage: 25, reason: "Segunda maior cripto. Base para DeFi e NFTs. Alta correlação com BTC.", riskLevel: "alto" },
        { ticker: "SOL", name: "Solana", category: "Cripto", percentage: 15, reason: "Blockchain de alta performance. Mais volátil que BTC/ETH, maior potencial de upside e downside.", riskLevel: "alto" },
        { ticker: "PETR4", name: "Petrobras", category: "Ações", percentage: 15, reason: "Potencial de dividendos + valorização. Adiciona exposição fora do mercado cripto.", riskLevel: "médio" },
        { ticker: "WEGE3", name: "WEG S.A.", category: "Ações", percentage: 15, reason: "Empresa de crescimento. Descorrelacionada do setor de commodities.", riskLevel: "médio" },
      ]
      riskScore = 8
      expectedReturn = 18
    }

    const portfolio: SmartPortfolio = {
      allocations,
      riskScore,
      expectedReturn,
      explanation: generatePortfolioExplanation(iaConfig, riskScore, expectedReturn),
      lastUpdated: new Date().toISOString(),
    }

    setSmartPortfolio(portfolio)
    localStorage.setItem("alphaflow_smart_portfolio", JSON.stringify(portfolio))
  }, [iaConfig])

  const value: AppContextType = {
    user,
    assets,
    news,
    currentView,
    isAuthenticated,
    messages,
    iaConfig,
    smartPortfolio,
    purchasePrices,
    setCurrentView,
    login,
    logout,
    updateUser,
    executeTrade,
    addFunds,
    updateAssetPrices,
    addMessage,
    formatCurrency,
    calculateEquity,
    updateIAConfig,
    generateSmartPortfolio,
    getAssetPurchasePrice,
    calculateProfit,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

function generatePortfolioExplanation(config: IAConfig, riskScore: number, expectedReturn: number): string {
  const toneMap = {
    friendly: "Montei uma sugestão de carteira pensando no seu momento de vida.",
    technical: "A alocação sugerida considera correlação entre ativos e busca otimizar o índice Sharpe.",
    balanced: "Criei uma sugestão equilibrada baseada no seu perfil e objetivos declarados.",
  }

  const goalMap = {
    emergency: "Priorizei liquidez e segurança, focando em reserva de emergência.",
    longterm: "Foquei em ativos com potencial histórico de crescimento no longo prazo.",
    passive: "Selecionei ativos conhecidos por gerar renda através de dividendos e rendimentos.",
    protection: "A carteira prioriza proteção patrimonial contra inflação e volatilidade.",
    learning: "Incluí diversificação educativa para explorar diferentes classes de ativos.",
  }

  const riskDisclaimer = riskScore >= 6 
    ? "Carteiras mais agressivas podem apresentar volatilidade significativa no curto prazo."
    : riskScore >= 4
    ? "Espere oscilações moderadas, especialmente em momentos de estresse de mercado."
    : "Mesmo carteiras conservadoras podem sofrer variações em cenários extremos."

  const returnDisclaimer = `O retorno de ${expectedReturn}% a.a. é uma estimativa baseada em dados históricos e não representa garantia de resultado futuro.`

  return `${toneMap[config.tone]} ${goalMap[config.mainGoal]} Risco estimado: ${riskScore}/10. ${riskDisclaimer} ${returnDisclaimer} Esta é uma sugestão educacional — sempre faça sua própria análise.`
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error("useApp must be used within an AppProvider")
  }
  return context
}
