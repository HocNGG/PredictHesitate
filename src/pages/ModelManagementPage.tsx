import { useMemo, useState } from "react"
import { Activity, History, RefreshCcw } from "lucide-react"
import { Line, LineChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

import { Navigation } from "@/components/predict/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

type RetrainStatus = "running" | "idle"
type RunStatus = "success" | "running" | "failed" | "skipped"

type HistoryItem = {
  id: number
  triggered_at: string
  status: RunStatus
  new_rows: number | null
  total_rows: number | null
  duration_sec: number | null
  model_replaced: boolean | null
  metrics: {
    rmse: number
    mae: number
    r2: number
    prev_rmse: number | null
    prev_mae: number | null
    prev_r2: number | null
  } | null
}

const mockRetrainStatus: { status: RetrainStatus; last_run: HistoryItem | null } = {
  status: "idle",
  last_run: {
    id: 14,
    triggered_at: "2026-04-16T09:40:00Z",
    status: "success",
    new_rows: 112,
    total_rows: 1987,
    duration_sec: 86.2,
    model_replaced: true,
    metrics: {
      rmse: 0.22,
      mae: 0.16,
      r2: 0.9,
      prev_rmse: 0.24,
      prev_mae: 0.17,
      prev_r2: 0.89,
    },
  },
}

const mockMetricTrend = {
  runs: [
    { run_id: 10, date: "2026-01-15T00:00:00Z", rmse: 0.29, mae: 0.2, r2: 0.84 },
    { run_id: 11, date: "2026-02-10T00:00:00Z", rmse: 0.27, mae: 0.19, r2: 0.86 },
    { run_id: 12, date: "2026-03-07T00:00:00Z", rmse: 0.25, mae: 0.18, r2: 0.88 },
    { run_id: 13, date: "2026-03-29T00:00:00Z", rmse: 0.24, mae: 0.17, r2: 0.89 },
    { run_id: 14, date: "2026-04-16T00:00:00Z", rmse: 0.22, mae: 0.16, r2: 0.9 },
  ],
}

const mockHistory: HistoryItem[] = [
  {
    id: 14,
    triggered_at: "2026-04-16T09:40:00Z",
    status: "success",
    new_rows: 112,
    total_rows: 1987,
    duration_sec: 86.2,
    model_replaced: true,
    metrics: { rmse: 0.22, mae: 0.16, r2: 0.9, prev_rmse: 0.24, prev_mae: 0.17, prev_r2: 0.89 },
  },
  {
    id: 13,
    triggered_at: "2026-03-29T05:20:00Z",
    status: "success",
    new_rows: 95,
    total_rows: 1875,
    duration_sec: 90.5,
    model_replaced: true,
    metrics: { rmse: 0.24, mae: 0.17, r2: 0.89, prev_rmse: 0.25, prev_mae: 0.18, prev_r2: 0.88 },
  },
  {
    id: 12,
    triggered_at: "2026-03-07T02:30:00Z",
    status: "failed",
    new_rows: 82,
    total_rows: 1780,
    duration_sec: 41.3,
    model_replaced: false,
    metrics: null,
  },
  {
    id: 11,
    triggered_at: "2026-02-10T01:45:00Z",
    status: "success",
    new_rows: 140,
    total_rows: 1698,
    duration_sec: 94.8,
    model_replaced: true,
    metrics: { rmse: 0.27, mae: 0.19, r2: 0.86, prev_rmse: 0.3, prev_mae: 0.21, prev_r2: 0.83 },
  },
  {
    id: 10,
    triggered_at: "2026-01-15T10:00:00Z",
    status: "skipped",
    new_rows: 0,
    total_rows: 1558,
    duration_sec: 12.1,
    model_replaced: false,
    metrics: null,
  },
]

function formatDate(value: string) {
  return new Date(value).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function getStatusBadge(status: RunStatus) {
  if (status === "success") return <Badge className="bg-emerald-500 text-white hover:bg-emerald-500">success</Badge>
  if (status === "running") return <Badge className="bg-blue-500 text-white hover:bg-blue-500">running</Badge>
  if (status === "failed") return <Badge variant="destructive">failed</Badge>
  return <Badge variant="secondary">skipped</Badge>
}

export default function ModelManagementPage() {
  const [page, setPage] = useState(1)
  const pageSize = 3

  const pagedHistory = useMemo(() => {
    const start = (page - 1) * pageSize
    return mockHistory.slice(start, start + pageSize)
  }, [page])

  const totalPages = Math.ceil(mockHistory.length / pageSize)
  const isRetrainRunning = mockRetrainStatus.status === "running"

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Model Management</h1>
            <p className="mt-2 text-muted-foreground">
              Monitor retrain status, model metrics trend, and retrain history.
            </p>
          </div>
          <Button disabled={isRetrainRunning} className="gap-2">
            <RefreshCcw className="h-4 w-4" />
            Trigger Retrain
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Retrain Status
              </CardTitle>
              <CardDescription>UI mẫu cho endpoint /retrain/status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border p-4">
                <p className="text-sm text-muted-foreground">Current status</p>
                <div className="mt-2">
                  {isRetrainRunning ? (
                    <Badge className="bg-blue-500 text-white hover:bg-blue-500">running</Badge>
                  ) : (
                    <Badge variant="secondary">idle</Badge>
                  )}
                </div>
              </div>
              <div className="rounded-lg border p-4">
                <p className="text-sm text-muted-foreground">Last run id</p>
                <p className="mt-1 text-lg font-semibold">#{mockRetrainStatus.last_run?.id ?? "-"}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {mockRetrainStatus.last_run ? formatDate(mockRetrainStatus.last_run.triggered_at) : "No run yet"}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Metrics Trend</CardTitle>
              <CardDescription>UI mẫu cho endpoint /retrain/metrics/trend</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[320px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mockMetricTrend.runs} margin={{ left: 12, right: 12, top: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis
                      dataKey="run_id"
                      tick={{ fill: "var(--muted-foreground)" }}
                      axisLine={{ stroke: "var(--border)" }}
                      tickLine={{ stroke: "var(--border)" }}
                    />
                    <YAxis
                      tick={{ fill: "var(--muted-foreground)" }}
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
                    />
                    <Line type="monotone" dataKey="rmse" stroke="var(--chart-1)" strokeWidth={2} dot />
                    <Line type="monotone" dataKey="mae" stroke="var(--chart-2)" strokeWidth={2} dot />
                    <Line type="monotone" dataKey="r2" stroke="var(--chart-5)" strokeWidth={2} dot />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-4 w-4" />
              Retrain History
            </CardTitle>
            <CardDescription>UI mẫu cho endpoint /retrain/history?page=1&size=10</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Run ID</TableHead>
                  <TableHead>Triggered At</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>New Rows</TableHead>
                  <TableHead>Total Rows</TableHead>
                  <TableHead>Duration (s)</TableHead>
                  <TableHead>Model Replaced</TableHead>
                  <TableHead>Metrics (RMSE/MAE/R2)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pagedHistory.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">#{item.id}</TableCell>
                    <TableCell>{formatDate(item.triggered_at)}</TableCell>
                    <TableCell>{getStatusBadge(item.status)}</TableCell>
                    <TableCell>{item.new_rows ?? "-"}</TableCell>
                    <TableCell>{item.total_rows ?? "-"}</TableCell>
                    <TableCell>{item.duration_sec?.toFixed(1) ?? "-"}</TableCell>
                    <TableCell>{item.model_replaced ? "Yes" : "No"}</TableCell>
                    <TableCell>
                      {item.metrics
                        ? `${item.metrics.rmse.toFixed(2)} / ${item.metrics.mae.toFixed(2)} / ${item.metrics.r2.toFixed(2)}`
                        : "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="mt-4 flex items-center justify-end gap-2">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((prev) => prev - 1)}>
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {page} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage((prev) => prev + 1)}
              >
                Next
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
