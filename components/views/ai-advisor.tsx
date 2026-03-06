"use client"

import { useState } from "react"
import { useApp } from "@/lib/store"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sparkles } from "lucide-react"

export function AIAdvisorView() {
  const { messages, addMessage, user } = useApp()
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSendMessage = async () => {
    if (!input.trim()) return

    const userMessage = {
      id: Date.now().toString(),
      role: "user" as const,
      content: input,
      timestamp: new Date(),
    }

    addMessage(userMessage)
    setInput("")
    setIsLoading(true)

    // Simular resposta da IA
    setTimeout(() => {
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant" as const,
        content: `Olá ${user.name}! Sua pergunta sobre "${input}" é excelente. Baseado no seu perfil de investidor (${user.type}), recomendo sempre diversificar seus investimentos e manter uma reserva de emergência. Lembre-se: não é recomendação financeira, apenas educação.`,
        timestamp: new Date(),
      }
      addMessage(aiMessage)
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="space-y-4 h-[600px] flex flex-col">
      <h1 className="text-3xl font-bold flex items-center gap-2">
        <Sparkles className="h-8 w-8" />
        IA Advisor
      </h1>

      <Card className="flex-1 p-4 overflow-y-auto space-y-4 bg-secondary/20">
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <p>Faça uma pergunta sobre investimentos</p>
          </div>
        )}
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-xs lg:max-w-md p-3 rounded-lg ${msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground"}`}>
              <p className="text-sm">{msg.content}</p>
            </div>
          </div>
        ))}
        {isLoading && <div className="flex justify-start">
          <div className="bg-secondary text-foreground p-3 rounded-lg">
            <div className="flex gap-1">
              <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce" />
              <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
              <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
            </div>
          </div>
        </div>}
      </Card>

      <div className="flex gap-2">
        <Input placeholder="Pergunte sobre investimentos..." value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === "Enter" && handleSendMessage()} />
        <Button onClick={handleSendMessage} disabled={!input.trim() || isLoading}>
          Enviar
        </Button>
      </div>
    </div>
  )
}
