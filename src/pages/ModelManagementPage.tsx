import { useEffect, useState } from "react"
import { Activity, History, RefreshCcw } from "lucide-react"
import { Line, LineChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

import { Navigation } from "@/components/predict/navigation"
import {
  getRetrainHistory,
  getRetrainMetricsTrend,
  getRetrainStatus,
  triggerRetrain,
  type RetrainHistoryItem,
  type RetrainHistoryResponse,
  type RetrainMetricsTrendResponse,
  type RetrainRunStatus,
  type RetrainStatusResponse,
} from "@/api/retrain"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

function formatDate(value: string) {
  return new Date(value).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function getStatusBadge(status: RetrainRunStatus) {
  if (status === "success") return <Badge className="bg-emerald-500 text-white hover:bg-emerald-500">success</Badge>
  if (status === "running") return <Badge className="bg-blue-500 text-white hover:bg-blue-500">running</Badge>
  if (status === "failed") return <Badge variant="destructive">failed</Badge>
  return <Badge variant="secondary">skipped</Badge>
}

export default function ModelManagementPage() {
  const [page, setPage] = useState(1)
  const pageSize = 10
  const [statusData, setStatusData] = useState<RetrainStatusResponse | null>(null)
  const [trendData, setTrendData] = useState<RetrainMetricsTrendResponse | null>(null)
  const [historyData, setHistoryData] = useState<RetrainHistoryResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isTriggering, setIsTriggering] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const [status, trend, history] = await Promise.all([
          getRetrainStatus(),
          getRetrainMetricsTrend(),
          getRetrainHistory(page, pageSize),
        ])
        setStatusData(status)
        setTrendData(trend)
        setHistoryData(history)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load model management data.")
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [page])

  const handleTriggerRetrain = async () => {
    setIsTriggering(true)
    setError(null)
    try {
      await triggerRetrain()
      const [status, trend, history] = await Promise.all([
        getRetrainStatus(),
        getRetrainMetricsTrend(),
        getRetrainHistory(page, pageSize),
      ])
      setStatusData(status)
      setTrendData(trend)
      setHistoryData(history)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Trigger retrain failed.")
    } finally {
      setIsTriggering(false)
    }
  }

  const isRetrainRunning = statusData?.status === "running"
  const historyItems: RetrainHistoryItem[] = historyData?.items ?? []
  const trendRuns = trendData?.runs ?? []
  const totalPages = historyData ? Math.max(1, Math.ceil(historyData.total / historyData.size)) : 1

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
          <Button disabled={isRetrainRunning || isTriggering} className="gap-2" onClick={handleTriggerRetrain}>
            <RefreshCcw className="h-4 w-4" />
            {isTriggering ? "Triggering..." : "Trigger Retrain"}
          </Button>
        </div>
        {error ? (
          <div className="mb-6 rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        ) : null}

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
                <p className="mt-1 text-lg font-semibold">#{statusData?.last_run?.id ?? "-"}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {statusData?.last_run ? formatDate(statusData.last_run.triggered_at) : "No run yet"}
                </p>
                <div className="mt-3 grid grid-cols-1 gap-2 text-sm text-muted-foreground">
                  <p>
                    Last run status:{" "}
                    <span className="font-medium text-foreground">{statusData?.last_run?.status ?? "-"}</span>
                  </p>
                  <p>
                    New rows: <span className="font-medium text-foreground">{statusData?.last_run?.new_rows ?? "-"}</span>
                  </p>
                  <p>
                    Model replaced:{" "}
                    <span className="font-medium text-foreground">
                      {statusData?.last_run?.model_replaced == null
                        ? "-"
                        : statusData.last_run.model_replaced
                          ? "Yes"
                          : "No"}
                    </span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Metrics Trend</CardTitle>
              <CardDescription>UI mẫu cho endpoint /retrain/metrics/trend</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex h-[320px] items-center justify-center text-sm text-muted-foreground">Loading trend...</div>
              ) : trendRuns.length === 0 ? (
                <div className="flex h-[320px] items-center justify-center text-sm text-muted-foreground">
                  No metrics trend data.
                </div>
              ) : (
                <div className="h-[320px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trendRuns} margin={{ left: 12, right: 12, top: 8 }}>
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
              )}
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
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-muted-foreground">
                      Loading history...
                    </TableCell>
                  </TableRow>
                ) : null}
                {historyItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">#{item.id}</TableCell>
                    <TableCell>{formatDate(item.triggered_at)}</TableCell>
                    <TableCell>{getStatusBadge(item.status)}</TableCell>
                    <TableCell>{item.new_rows ?? "-"}</TableCell>
                    <TableCell>{item.total_rows ?? "-"}</TableCell>
                    <TableCell>{item.duration_sec?.toFixed(1) ?? "-"}</TableCell>
                    <TableCell>{item.model_replaced == null ? "-" : item.model_replaced ? "Yes" : "No"}</TableCell>
                    <TableCell>
                      {item.metrics
                        ? `${item.metrics.rmse.toFixed(2)} / ${item.metrics.mae.toFixed(2)} / ${item.metrics.r2.toFixed(2)}`
                        : "-"}
                    </TableCell>
                  </TableRow>
                ))}
                {!isLoading && historyItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-muted-foreground">
                      No retrain history found.
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>

            <div className="mt-4 flex items-center justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={isLoading || page <= 1}
                onClick={() => setPage((prev) => prev - 1)}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {page} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={isLoading || page >= totalPages}
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
