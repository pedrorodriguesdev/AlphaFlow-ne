"use client"

import type React from "react"
import { useState } from "react"
import { useApp } from "@/lib/store"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Boxes, 
  Mail, 
  Lock, 
  AlertCircle, 
  Sparkles, 
  TrendingUp, 
  Shield, 
  Zap,
  ArrowRight,
  CheckCircle2,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface LoginModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const features = [
  { icon: TrendingUp, text: "Gráficos avançados em tempo real" },
  { icon: Shield, text: "Operações seguras e protegidas" },
  { icon: Zap, text: "Execução instantânea de ordens" },
  { icon: Sparkles, text: "Análises de IA exclusivas" },
]

export function LoginModal({ open, onOpenChange }: LoginModalProps) {
  const { login } = useApp()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError("Email inválido")
      setIsLoading(false)
      return
    }

    // Validate password
    if (password.length < 6) {
      setError("A senha deve ter no mínimo 6 caracteres")
      setIsLoading(false)
      return
    }

    const success = await login(email, password)

    if (success) {
      setEmail("")
      setPassword("")
      onOpenChange(false)
    } else {
      setError("Erro ao fazer login. Tente novamente.")
    }

    setIsLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl p-0 bg-card/95 backdrop-blur-xl border-border overflow-hidden">
        <div className="grid sm:grid-cols-5">
          {/* Left Panel - Features */}
          <div className="hidden sm:flex sm:col-span-2 flex-col justify-between p-6 bg-gradient-to-br from-primary/10 via-accent/5 to-transparent border-r border-border">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/20">
                  <Boxes className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="font-bold text-lg">AlphaFlow</span>
              </div>
              
              <h3 className="text-lg font-semibold mb-4 text-balance">
                A plataforma de investimentos do futuro
              </h3>
              
              <div className="space-y-3">
                {features.map((feature, index) => {
                  const Icon = feature.icon
                  return (
                    <div 
                      key={index}
                      className="flex items-center gap-3 text-sm text-muted-foreground"
                    >
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
                        <Icon className="h-3.5 w-3.5 text-primary" />
                      </div>
                      <span>{feature.text}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            <p className="text-xs text-muted-foreground mt-6">
              Junte-se a milhares de investidores
            </p>
          </div>

          {/* Right Panel - Form */}
          <div className="sm:col-span-3 p-6 sm:p-8">
            <DialogHeader className="text-left mb-6">
              <div className="flex items-center gap-3 sm:hidden mb-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/20">
                  <Boxes className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <span className="font-bold text-lg">AlphaFlow</span>
                  <p className="text-xs text-muted-foreground">Trading Platform</p>
                </div>
              </div>
              <DialogTitle className="text-2xl font-bold">
                Bem-vindo de volta
              </DialogTitle>
              <DialogDescription className="text-base">
                Entre com sua conta ou crie uma nova para começar
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="flex items-center gap-2 rounded-xl bg-destructive/10 p-4 text-sm text-destructive border border-destructive/20">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <div className="relative">
                  <Mail className={cn(
                    "absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors",
                    focusedField === "email" ? "text-primary" : "text-muted-foreground"
                  )} />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField(null)}
                    className={cn(
                      "h-12 pl-11 bg-secondary/30 border-border rounded-xl transition-all",
                      focusedField === "email" && "ring-2 ring-primary/30 border-primary/50"
                    )}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Senha
                </Label>
                <div className="relative">
                  <Lock className={cn(
                    "absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors",
                    focusedField === "password" ? "text-primary" : "text-muted-foreground"
                  )} />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Mínimo 6 caracteres"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField(null)}
                    className={cn(
                      "h-12 pl-11 bg-secondary/30 border-border rounded-xl transition-all",
                      focusedField === "password" && "ring-2 ring-primary/30 border-primary/50"
                    )}
                    required
                    minLength={6}
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-base font-semibold rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
                style={{ boxShadow: "0 4px 20px oklch(0.72 0.19 195 / 0.3)" }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                    Entrando...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    Acessar plataforma
                    <ArrowRight className="h-4 w-4" />
                  </div>
                )}
              </Button>

              <div className="flex items-center gap-2 justify-center text-xs text-muted-foreground bg-secondary/30 rounded-xl py-3 px-4">
                <CheckCircle2 className="h-3.5 w-3.5 text-[oklch(0.70_0.20_145)]" />
                <span>Conta criada automaticamente se não existir</span>
              </div>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
