"use client"

import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const data = [
  { district: "District 1", apartment: 15.2, house: 22.5, villa: 45.8 },
  { district: "District 2", apartment: 8.5, house: 12.3, villa: 28.6 },
  { district: "District 7", apartment: 6.8, house: 10.5, villa: 22.4 },
  { district: "Binh Thanh", apartment: 5.2, house: 9.8, villa: 18.5 },
  { district: "Thu Duc", apartment: 4.1, house: 7.2, villa: 15.3 },
  { district: "Go Vap", apartment: 3.5, house: 6.8, villa: 12.1 },
]

export function DistrictPropertyChart() {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">District vs Property Type</CardTitle>
        <CardDescription className="text-sm">
          Average prices by property type across districts (VND billion)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <XAxis
                dataKey="district"
                tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
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
                formatter={(value: number) => [`${value}B VND`]}
              />
              <Legend
                wrapperStyle={{ fontSize: "12px" }}
                iconType="circle"
                iconSize={8}
              />
              <Bar dataKey="apartment" fill="var(--color-chart-1)" radius={[2, 2, 0, 0]} name="Apartment" />
              <Bar dataKey="house" fill="var(--color-chart-2)" radius={[2, 2, 0, 0]} name="House" />
              <Bar dataKey="villa" fill="var(--color-chart-3)" radius={[2, 2, 0, 0]} name="Villa" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
