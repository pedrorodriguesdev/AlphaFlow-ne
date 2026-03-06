"use client"

import { useState } from "react"
import { useApp } from "@/lib/store"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export function TradeProView() {
  const { assets, user, executeTrade, formatCurrency } = useApp()
  const [selectedAsset, setSelectedAsset] = useState(assets[0])
  const [quantity, setQuantity] = useState(1)
  const [tradeType, setTradeType] = useState<"buy" | "sell">("buy")

  const chartData = Array.from({ length: 24 }, (_, i) => ({
    time: `${i}h`,
    price: selectedAsset.price * (0.95 + Math.random() * 0.1),
  }))

  const handleTrade = () => {
    const result = executeTrade(tradeType, selectedAsset, quantity)
    alert(result.message)
    setQuantity(1)
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="mb-4 flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground">Ativo Selecionado</p>
                <h2 className="text-3xl font-bold">{selectedAsset.ticker}</h2>
                <p className="text-muted-foreground">{selectedAsset.name}</p>
              </div>
              <Badge variant={selectedAsset.change24h >= 0 ? "default" : "destructive"}>
                {selectedAsset.change24h >= 0 ? "+" : ""}{selectedAsset.change24h.toFixed(2)}%
              </Badge>
            </div>
            <p className="text-4xl font-bold mb-6">{formatCurrency(selectedAsset.price)}</p>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
                <Line type="monotone" dataKey="price" stroke="#00f2ff" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>

        <Card className="p-6 h-fit">
          <h3 className="font-bold mb-4">Executar Trade</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Tipo</label>
              <div className="flex gap-2 mt-2">
                <Button variant={tradeType === "buy" ? "default" : "outline"} className="flex-1" onClick={() => setTradeType("buy")}>
                  Comprar
                </Button>
                <Button variant={tradeType === "sell" ? "default" : "outline"} className="flex-1" onClick={() => setTradeType("sell")}>
                  Vender
                </Button>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Quantidade</label>
              <Input type="number" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} className="mt-2" min={0.0001} step={0.0001} />
            </div>

            <div className="bg-secondary/30 p-3 rounded-lg">
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="text-lg font-bold">{formatCurrency(selectedAsset.price * quantity)}</p>
            </div>

            <Button onClick={handleTrade} className="w-full h-11" disabled={quantity <= 0}>
              {tradeType === "buy" ? "Comprar" : "Vender"}
            </Button>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="font-bold mb-4">Selecionar Ativo</h3>
        <div className="grid gap-2 max-h-48 overflow-y-auto">
          {assets.map((asset) => (
            <button key={asset.id} onClick={() => setSelectedAsset(asset)} className={`p-3 rounded-lg text-left transition-colors ${selectedAsset.id === asset.id ? "bg-primary/20 border border-primary" : "bg-secondary/30 hover:bg-secondary/50"}`}>
              <div className="flex justify-between">
                <span className="font-medium">{asset.ticker}</span>
                <span className={selectedAsset.change24h >= 0 ? "text-green-500" : "text-red-500"}>{selectedAsset.change24h >= 0 ? "+" : ""}{selectedAsset.change24h.toFixed(2)}%</span>
              </div>
              <p className="text-sm text-muted-foreground">{formatCurrency(asset.price)}</p>
            </button>
          ))}
        </div>
      </Card>
    </div>
  )
}
