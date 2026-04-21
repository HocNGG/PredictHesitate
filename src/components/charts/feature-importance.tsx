"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"

type FeatureImportanceDatum = {
  feature: string
  importance: number
  fill: string
}

const palette = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"]

function FeatureTooltip({
  active,
  payload,
}: {
  active?: boolean
  payload?: Array<{ payload: FeatureImportanceDatum }>
}) {
  if (!active || !payload || payload.length === 0) return null
  const item = payload[0].payload

  return (
    <div className="rounded-md border bg-card px-3 py-2 text-sm shadow-sm">
      <div className="font-medium">{item.feature}</div>
      <div className="mt-1 text-muted-foreground">
        Chỉ số ảnh hưởng: {item.importance.toFixed(6)}
        <br />
        Tỷ lệ: {(item.importance * 100).toFixed(2)}%
      </div>
    </div>
  )
}

export function FeatureImportanceChart({
  data,
  isLoading,
  runId,
}: {
  data: FeatureImportanceDatum[]
  isLoading: boolean
  runId: number | null
}) {
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle>Feature Importance</CardTitle>
        <CardDescription>
          Mức độ ảnh hưởng của từng đặc trưng trong mô hình{runId ? ` • run #${runId}` : ""}
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
              <BarChart data={data} layout="vertical" margin={{ top: 10, right: 30, left: 80, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={true} vertical={false} />
                <XAxis
                  type="number"
                  domain={[0, "dataMax + 0.05"]}
                  tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                  axisLine={{ stroke: "var(--border)" }}
                  tickLine={{ stroke: "var(--border)" }}
                  tickFormatter={(value) => `${(Number(value) * 100).toFixed(0)}%`}
                />
                <YAxis
                  type="category"
                  dataKey="feature"
                  tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                  axisLine={{ stroke: "var(--border)" }}
                  tickLine={{ stroke: "var(--border)" }}
                  width={95}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    color: "var(--foreground)",
                  }}
                  content={<FeatureTooltip />}
                />
                <Bar dataKey="importance" radius={[0, 4, 4, 0]}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill || palette[index % palette.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
