"use client"

import { useApp } from "@/lib/store"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { User, LogOut, Settings } from "lucide-react"

export function SettingsView() {
  const { user, logout } = useApp()

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Configurações</h1>

      <Card className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center">
            <User className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">{user.name}</h2>
            <p className="text-muted-foreground">{user.email}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="border-t pt-4">
            <h3 className="font-bold mb-2 flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Perfil de Investidor
            </h3>
            <p className="text-muted-foreground">{user.type}</p>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-bold mb-2">Saldo Total</h3>
            <p className="text-lg font-bold text-primary">R$ {user.balance.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-bold mb-2">Operações Realizadas</h3>
            <p className="text-muted-foreground">{user.history.length} trades</p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="font-bold mb-4">Ações</h3>
        <Button variant="destructive" className="w-full" onClick={logout}>
          <LogOut className="h-4 w-4 mr-2" />
          Fazer Logout
        </Button>
      </Card>
    </div>
  )
}
