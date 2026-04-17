import { apiGet } from "./client"
import { apiPost } from "./client"

export type RetrainJobStatus = "running" | "idle"
export type RetrainRunStatus = "success" | "running" | "failed" | "skipped"

export type RetrainMetrics = {
  rmse: number
  mae: number
  r2: number
  prev_rmse: number | null
  prev_mae: number | null
  prev_r2: number | null
}

export type RetrainHistoryItem = {
  id: number
  triggered_at: string
  status: RetrainRunStatus
  new_rows: number | null
  total_rows: number | null
  duration_sec: number | null
  model_replaced: boolean | null
  metrics: RetrainMetrics | null
}

export type RetrainStatusResponse = {
  status: RetrainJobStatus
  last_run: {
    id: number
    triggered_at: string
    status: RetrainRunStatus
    new_rows: number | null
    model_replaced: boolean | null
  } | null
}

export type RetrainHistoryResponse = {
  total: number
  page: number
  size: number
  items: RetrainHistoryItem[]
}

export type RetrainMetricsTrendResponse = {
  runs: Array<{
    run_id: number
    date: string
    rmse: number
    mae: number
    r2: number
  }>
}

export type TriggerRetrainResponse = {
  message: string
}

export async function triggerRetrain(): Promise<TriggerRetrainResponse> {
  return apiPost<TriggerRetrainResponse>("/retrain/trigger")
}

export async function getRetrainStatus(): Promise<RetrainStatusResponse> {
  return apiGet<RetrainStatusResponse>("/retrain/status")
}

export async function getRetrainHistory(page = 1, size = 10): Promise<RetrainHistoryResponse> {
  return apiGet<RetrainHistoryResponse>(`/retrain/history?page=${page}&size=${size}`)
}

export async function getRetrainMetricsTrend(): Promise<RetrainMetricsTrendResponse> {
  return apiGet<RetrainMetricsTrendResponse>("/retrain/metrics/trend")
}