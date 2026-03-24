"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

// Generate mock scatter data
const generateScatterData = () => {
  const data = []
  for (let i = 0; i < 100; i++) {
    const area = 30 + Math.random() * 270
    const priceBase = area * 50 + Math.random() * 3000
    data.push({
      area: Math.round(area),
      price: Math.round(priceBase / 100) / 10,
    })
  }
  return data
}

const data = generateScatterData()

export function AreaVsPriceChart() {
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle>Area vs Price</CardTitle>
        <CardDescription>Relationship between property area (m²) and price (billion VND)</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis 
                type="number" 
                dataKey="area" 
                name="Area" 
                unit="m²"
                tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} 
                axisLine={{ stroke: "var(--border)" }}
                tickLine={{ stroke: "var(--border)" }}
              />
              <YAxis 
                type="number" 
                dataKey="price" 
                name="Price" 
                unit="B"
                tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} 
                axisLine={{ stroke: "var(--border)" }}
                tickLine={{ stroke: "var(--border)" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  color: "var(--foreground)",
                }}
                formatter={(value: number, name: string) => {
                  if (name === "Area") return [`${value} m²`, name]
                  return [`${value}B VND`, "Price"]
                }}
              />
              <Scatter name="Properties" data={data} fill="var(--chart-2)" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
