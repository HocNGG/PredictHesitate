"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

export function DistrictComparisonChart({
  data,
  propertyTypes,
  isLoading,
  runId,
}: {
  data: Array<Record<string, string | number>>
  propertyTypes: string[]
  isLoading: boolean
  runId: number | null
}) {
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle>District vs Property Type</CardTitle>
        <CardDescription>
          Median price (triệu VND/m²) by district and property type{runId ? ` • run #${runId}` : ""}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex h-[300px] items-center justify-center text-sm text-muted-foreground">Loading...</div>
        ) : data.length === 0 ? (
          <div className="flex h-[300px] items-center justify-center text-sm text-muted-foreground">No data.</div>
        ) : (
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
                  formatter={(value: unknown) => [`${Number(value).toFixed(2)} triệu/m²`, "Median price"]}
                />
                <Legend
                  wrapperStyle={{ paddingTop: "10px" }}
                  formatter={(value) => <span style={{ color: "var(--foreground)" }}>{String(value)}</span>}
                />
                {propertyTypes.map((key, idx) => (
                  <Bar
                    key={key}
                    dataKey={key}
                    name={key}
                    fill={`var(--chart-${(idx % 5) + 1})`}
                    radius={[2, 2, 0, 0]}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
