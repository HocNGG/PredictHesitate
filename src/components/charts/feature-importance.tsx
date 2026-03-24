"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"

const data = [
  { feature: "District", importance: 0.35, fill: "var(--chart-1)" },
  { feature: "Area (m²)", importance: 0.28, fill: "var(--chart-2)" },
  { feature: "Property Type", importance: 0.15, fill: "var(--chart-3)" },
  { feature: "Frontage", importance: 0.10, fill: "var(--chart-4)" },
  { feature: "Bedrooms", importance: 0.07, fill: "var(--chart-5)" },
  { feature: "Floors", importance: 0.05, fill: "var(--chart-1)" },
]

export function FeatureImportanceChart() {
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle>Feature Importance</CardTitle>
        <CardDescription>Which features influence the ML model prediction most</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={data} 
              layout="vertical" 
              margin={{ top: 10, right: 30, left: 80, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={true} vertical={false} />
              <XAxis 
                type="number" 
                domain={[0, 0.4]}
                tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} 
                axisLine={{ stroke: "var(--border)" }}
                tickLine={{ stroke: "var(--border)" }}
                tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
              />
              <YAxis 
                type="category"
                dataKey="feature"
                tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} 
                axisLine={{ stroke: "var(--border)" }}
                tickLine={{ stroke: "var(--border)" }}
                width={75}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  color: "var(--foreground)",
                }}
                formatter={(value: number) => [`${(value * 100).toFixed(1)}%`, "Importance"]}
              />
              <Bar dataKey="importance" radius={[0, 4, 4, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
