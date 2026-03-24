"use client"

import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ZAxis,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const data = [
  { area: 45, price: 2.1 },
  { area: 60, price: 3.2 },
  { area: 75, price: 4.5 },
  { area: 80, price: 5.1 },
  { area: 90, price: 5.8 },
  { area: 100, price: 6.2 },
  { area: 110, price: 7.1 },
  { area: 120, price: 8.5 },
  { area: 130, price: 9.2 },
  { area: 140, price: 10.1 },
  { area: 150, price: 11.5 },
  { area: 160, price: 12.8 },
  { area: 55, price: 2.8 },
  { area: 65, price: 3.9 },
  { area: 85, price: 5.5 },
  { area: 95, price: 6.8 },
  { area: 105, price: 7.8 },
  { area: 115, price: 8.9 },
  { area: 125, price: 9.8 },
  { area: 135, price: 11.2 },
  { area: 70, price: 4.2 },
  { area: 82, price: 5.3 },
  { area: 98, price: 7.2 },
  { area: 112, price: 8.1 },
  { area: 128, price: 10.5 },
  { area: 145, price: 12.3 },
  { area: 50, price: 2.5 },
  { area: 88, price: 6.1 },
  { area: 102, price: 7.5 },
  { area: 118, price: 9.1 },
]

export function AreaPriceChart() {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Area vs Price</CardTitle>
        <CardDescription className="text-sm">
          Relationship between property area (m²) and price (VND billion)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <XAxis
                type="number"
                dataKey="area"
                name="Area"
                unit="m²"
                tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                type="number"
                dataKey="price"
                name="Price"
                unit="B"
                tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }}
                tickLine={false}
                axisLine={false}
              />
              <ZAxis range={[50, 50]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--color-card)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
                cursor={{ strokeDasharray: "3 3" }}
                formatter={(value: number, name: string) => {
                  if (name === "Area") return [`${value} m²`, name]
                  return [`${value}B VND`, "Price"]
                }}
              />
              <Scatter
                data={data}
                fill="var(--color-chart-2)"
              />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
