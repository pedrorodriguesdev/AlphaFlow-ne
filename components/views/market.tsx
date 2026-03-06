"use client"

import { useApp } from "@/lib/store"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown } from "lucide-react"

export function MarketView() {
  const { assets, formatCurrency } = useApp()

  const grouped = {
    Cripto: assets.filter((a) => a.category === "Cripto"),
    Ações: assets.filter((a) => a.category === "Ações"),
    Commodities: assets.filter((a) => a.category === "Commodities"),
  }

  return (
    <div className="space-y-6">
      {Object.entries(grouped).map(([category, items]) => (
        <div key={category}>
          <h2 className="text-xl font-bold mb-4">{category}</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {items.map((asset) => (
              <Card key={asset.id} className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-bold text-lg">{asset.ticker}</p>
                    <p className="text-sm text-muted-foreground">{asset.name}</p>
                  </div>
                  <Badge variant={asset.change24h >= 0 ? "default" : "destructive"}>
                    {asset.change24h >= 0 ? "+" : ""}{asset.change24h.toFixed(2)}%
                  </Badge>
                </div>
                <p className="text-2xl font-bold mb-2">{formatCurrency(asset.price)}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  {asset.change24h >= 0 ? <TrendingUp className="h-4 w-4 text-green-500" /> : <TrendingDown className="h-4 w-4 text-red-500" />}
                  Vol: {(asset.volume24h / 1e9).toFixed(1)}B
                </div>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
