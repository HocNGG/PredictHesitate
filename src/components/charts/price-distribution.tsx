"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { range: "0-2B", count: 45, fill: "var(--chart-1)" },
  { range: "2-4B", count: 120, fill: "var(--chart-1)" },
  { range: "4-6B", count: 180, fill: "var(--chart-1)" },
  { range: "6-8B", count: 150, fill: "var(--chart-1)" },
  { range: "8-10B", count: 95, fill: "var(--chart-1)" },
  { range: "10-15B", count: 65, fill: "var(--chart-1)" },
  { range: "15-20B", count: 35, fill: "var(--chart-1)" },
  { range: "20B+", count: 20, fill: "var(--chart-1)" },
]

export function PriceDistributionChart() {
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle>Price Distribution</CardTitle>
        <CardDescription>Distribution of real estate prices in billion VND</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis 
                dataKey="range" 
                tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} 
                axisLine={{ stroke: "var(--border)" }}
                tickLine={{ stroke: "var(--border)" }}
              />
              <YAxis 
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
                labelStyle={{ color: "var(--foreground)" }}
              />
              <Bar dataKey="count" fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
