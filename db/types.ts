export interface Asset {
  id: string
  ticker: string
  name: string
  category: "Cripto" | "Ações" | "Commodities"
  price: number
  basePrice: number
  change24h: number
  volume24h: number
  marketCap: number
  icon?: string
}

export interface User {
  name: string
  email: string
  type: "Iniciante" | "Conservador" | "Moderado" | "Agressivo" | "Trader"
  balance: number
  portfolio: Record<string, number>
  history: Trade[]
  createdAt?: string
}

export interface Trade {
  id?: string
  type: "buy" | "sell"
  ticker: string
  qty: number
  price: number
  total: number
  time: string
  buyPrice?: number // Preço de compra original para calcular lucro/prejuízo
}

export interface NewsItem {
  id: number
  title: string
  summary: string
  body: string
  category: "Cripto" | "Ações" | "Commodities"
  ticker: string
  timestamp: string
  source: string
}

export interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export type ViewType = "dashboard" | "market" | "trade-pro" | "news" | "ai" | "settings"

// Configurações da IA
export interface IAConfig {
  tone: "friendly" | "technical" | "balanced"
  accountType: "individual" | "family" | "business"
  financialSize: "small" | "medium" | "large"
  mainGoal: "emergency" | "longterm" | "passive" | "protection" | "learning"
  knowledgeLevel: "beginner" | "intermediate" | "advanced"
  isConfigured: boolean
}

// Portfólio Inteligente gerado pela IA
export interface SmartPortfolio {
  allocations: PortfolioAllocation[]
  riskScore: number
  expectedReturn: number
  explanation: string
  lastUpdated: string
}

export interface PortfolioAllocation {
  ticker: string
  name: string
  category: "Cripto" | "Ações" | "Commodities" | "Renda Fixa"
  percentage: number
  reason: string
  riskLevel: "baixo" | "médio" | "alto"
}

// Categorias de perguntas da IA
export interface AIKnowledgeCategory {
  id: string
  name: string
  icon: string
  questions: AIKnowledgeItem[]
}

export interface AIKnowledgeItem {
  keys: string[]
  question: string
  response: string
}
