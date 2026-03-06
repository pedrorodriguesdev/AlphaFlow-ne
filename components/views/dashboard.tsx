"use client"

import { useApp } from "@/lib/store"
import { Card } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

export function DashboardView() {
  const { user, calculateEquity, assets, formatCurrency } = useApp()

  const equity = calculateEquity()
  const invested = equity - user.balance

  const portfolioData = Object.entries(user.portfolio).map(([ticker, qty]) => {
    const asset = assets.find((a) => a.ticker === ticker)
    return {
      name: ticker,
      value: (asset?.price || 0) * qty,
    }
  })

  const evolutionData = [
    { mes: "Jan", valor: 5000 },
    { mes: "Fev", valor: 5250 },
    { mes: "Mar", valor: 5800 },
    { mes: "Abr", valor: 6200 },
    { mes: "Mai", valor: equity },
  ]

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-6">
          <p className="text-sm text-muted-foreground mb-2">Saldo em Caixa</p>
          <p className="text-2xl font-bold">{formatCurrency(user.balance)}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground mb-2">Investido</p>
          <p className="text-2xl font-bold">{formatCurrency(invested)}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground mb-2">Patrimônio Total</p>
          <p className="text-2xl font-bold text-primary">{formatCurrency(equity)}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground mb-2">Ativos na Carteira</p>
          <p className="text-2xl font-bold">{Object.keys(user.portfolio).length}</p>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Evolução do Patrimônio</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={evolutionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(value as number)} />
              <Bar dataKey="valor" fill="#00f2ff" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {portfolioData.length > 0 && (
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Alocação de Ativos</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={portfolioData} cx="50%" cy="50%" labelLine={false} label={({ name }) => name} outerRadius={100} fill="#8884d8" dataKey="value">
                  {portfolioData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={["#00f2ff", "#ff006e", "#8338ec", "#fb5607"][index % 4]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        )}
      </div>
    </div>
  )
}
