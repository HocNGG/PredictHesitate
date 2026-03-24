"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

const data = [
  { district: "District 1", apartment: 18.5, townhouse: 25.2, villa: 45.0 },
  { district: "District 3", apartment: 14.2, townhouse: 20.1, villa: 38.5 },
  { district: "District 7", apartment: 10.5, townhouse: 15.8, villa: 28.0 },
  { district: "Binh Thanh", apartment: 9.8, townhouse: 13.5, villa: 22.0 },
  { district: "Phu Nhuan", apartment: 11.2, townhouse: 16.5, villa: 25.5 },
  { district: "Thu Duc", apartment: 6.5, townhouse: 10.2, villa: 18.0 },
]

export function DistrictComparisonChart() {
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle>District vs Property Type</CardTitle>
        <CardDescription>Average price (billion VND) by district and property type</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis 
                dataKey="district" 
                tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} 
                axisLine={{ stroke: "var(--border)" }}
                tickLine={{ stroke: "var(--border)" }}
                angle={-20}
                textAnchor="end"
                height={60}
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
                formatter={(value: number) => [`${value}B VND`]}
              />
              <Legend 
                wrapperStyle={{ paddingTop: "10px" }}
                formatter={(value) => <span style={{ color: "var(--foreground)" }}>{value}</span>}
              />
              <Bar dataKey="apartment" name="Apartment" fill="var(--chart-1)" radius={[2, 2, 0, 0]} />
              <Bar dataKey="townhouse" name="Townhouse" fill="var(--chart-2)" radius={[2, 2, 0, 0]} />
              <Bar dataKey="villa" name="Villa" fill="var(--chart-3)" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
