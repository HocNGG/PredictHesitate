"use client"

import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const data = [
  { range: "< 2B", count: 45 },
  { range: "2-4B", count: 120 },
  { range: "4-6B", count: 185 },
  { range: "6-8B", count: 142 },
  { range: "8-10B", count: 98 },
  { range: "10-15B", count: 67 },
  { range: "15-20B", count: 38 },
  { range: "> 20B", count: 22 },
]

export function PriceDistributionChart() {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Price Distribution</CardTitle>
        <CardDescription className="text-sm">
          Distribution of property prices in VND (billion)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <XAxis
                dataKey="range"
                tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--color-card)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
                labelStyle={{ fontWeight: 600 }}
                cursor={{ fill: "var(--color-muted)", opacity: 0.3 }}
              />
              <Bar
                dataKey="count"
                fill="var(--color-chart-1)"
                radius={[4, 4, 0, 0]}
                name="Properties"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
