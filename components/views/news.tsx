"use client"

import { useApp } from "@/lib/store"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function NewsView() {
  const { news } = useApp()

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Alpha News</h1>
      <div className="space-y-4">
        {news.map((item) => (
          <Card key={item.id} className="p-6 hover:border-primary/50 transition-colors cursor-pointer">
            <div className="flex justify-between items-start mb-3">
              <div>
                <Badge variant="outline" className="mb-2">
                  {item.category}
                </Badge>
                <h3 className="text-xl font-bold">{item.title}</h3>
              </div>
              <Badge variant="secondary">{item.ticker}</Badge>
            </div>
            <p className="text-muted-foreground mb-3">{item.summary}</p>
            <p className="text-sm text-muted-foreground line-clamp-2">{item.body}</p>
            <div className="flex justify-between items-center mt-4 text-xs text-muted-foreground">
              <span>{item.source}</span>
              <span>{item.timestamp}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
