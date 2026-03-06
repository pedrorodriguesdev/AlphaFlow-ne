"use client"

import { useState, useEffect } from "react"
import { useApp } from "@/lib/store"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { DashboardView } from "@/components/views/dashboard"
import { MarketView } from "@/components/views/market"
import { TradeProView } from "@/components/views/trade-pro"
import { NewsView } from "@/components/views/news"
import { AIAdvisorView } from "@/components/views/ai-advisor"
import { SettingsView } from "@/components/views/settings"
import { LoginModal } from "@/components/auth/login-modal"
import { Button } from "@/components/ui/button"
import { LogIn } from "lucide-react"

export function AppShell() {
  const { currentView, isAuthenticated } = useApp()
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Show login prompt after a delay if not authenticated
  useEffect(() => {
    if (mounted && !isAuthenticated) {
      const timer = setTimeout(() => {
        setShowLoginModal(true)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [mounted, isAuthenticated])

  const renderView = () => {
    switch (currentView) {
      case "dashboard":
        return <DashboardView />
      case "market":
        return <MarketView />
      case "trade-pro":
        return <TradeProView />
      case "news":
        return <NewsView />
      case "ai":
        return <AIAdvisorView />
      case "settings":
        return <SettingsView />
      default:
        return <DashboardView />
    }
  }

  if (!mounted) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground">Carregando AlphaFlow...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <div className="flex-1 lg:ml-80">
        <Header />

        {/* Login Button for Mobile */}
        {!isAuthenticated && (
          <div className="fixed bottom-4 right-4 z-50 lg:bottom-6 lg:right-6">
            <Button
              onClick={() => setShowLoginModal(true)}
              className="rounded-full shadow-lg glow-primary h-12 px-6"
            >
              <LogIn className="h-4 w-4 mr-2" />
              Entrar
            </Button>
          </div>
        )}

        <main className="p-4 lg:p-8 pb-24 lg:pb-8">
          {renderView()}
        </main>
      </div>

      <LoginModal open={showLoginModal} onOpenChange={setShowLoginModal} />
    </div>
  )
}
