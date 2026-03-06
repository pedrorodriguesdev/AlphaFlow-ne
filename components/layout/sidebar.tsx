"use client"

import { useApp } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Boxes, BarChart3, TrendingUp, Newspaper, Sparkles, Settings } from "lucide-react"

export function Sidebar() {
  const { currentView, setCurrentView } = useApp()

  const items = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "market", label: "Mercado Global", icon: TrendingUp },
    { id: "trade-pro", label: "Trade Pro", icon: Boxes },
    { id: "news", label: "Alpha News", icon: Newspaper },
    { id: "ai", label: "IA Advisor", icon: Sparkles },
    { id: "settings", label: "Configurações", icon: Settings },
  ]

  return (
    <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-80 flex-col border-r border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent">
            <Boxes className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold">AlphaFlow</span>
        </div>
      </div>

      <nav className="flex-1 space-y-2 p-4 overflow-y-auto">
        {items.map((item) => {
          const Icon = item.icon
          return (
            <Button
              key={item.id}
              variant={currentView === item.id ? "default" : "ghost"}
              className="w-full justify-start gap-3"
              onClick={() => setCurrentView(item.id as any)}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Button>
          )
        })}
      </nav>

      <div className="border-t border-border p-4">
        <p className="text-xs text-muted-foreground text-center">AlphaFlow v1.0 © 2026</p>
      </div>
    </aside>
  )
}
