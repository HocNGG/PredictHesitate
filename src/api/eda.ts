import { BASE_URL, apiGet } from "./client"

type EdaErrorResponse = {
  detail?: string
  [key: string]: unknown
}

export type PriceDistributionBin = {
  label: string
  min: number
  max: number
  count: number
}

export type PriceDistributionResponse = {
  run_id: number
  bins: PriceDistributionBin[]
}

export type DistrictPropertyTypeItem = {
  district: string
  property_type: string
  median_price: number
  sample_count: number
}

export type DistrictPropertyTypeResponse = {
  run_id: number
  data: DistrictPropertyTypeItem[]
}

export type ScatterVersionResponse = {
  run_id: number
  updated_at: string | null
}

export type FeatureImportanceItem = {
  name: string
  importance: number
}

export type FeatureImportanceResponse = {
  run_id: number
  features: FeatureImportanceItem[]
}

export async function getPriceDistribution(): Promise<PriceDistributionResponse> {
  return apiGet<PriceDistributionResponse>("/eda/price-distribution")
}

export async function getDistrictPropertyType(): Promise<DistrictPropertyTypeResponse> {
  return apiGet<DistrictPropertyTypeResponse>("/eda/district-property-type")
}

export async function getScatterVersion(): Promise<ScatterVersionResponse> {
  return apiGet<ScatterVersionResponse>("/eda/scatter/version")
}

export async function getFeatureImportance(): Promise<FeatureImportanceResponse> {
  return apiGet<FeatureImportanceResponse>("/feature-importance")
}

export async function getScatterFile(): Promise<string> {
  const response = await fetch(`${BASE_URL}/eda/scatter/file`, { method: "GET" })
  const text = await response.text()

  if (!response.ok) {
    try {
      const data = JSON.parse(text) as EdaErrorResponse
      throw new Error(data.detail || response.statusText || "Request failed")
    } catch {
      throw new Error(response.statusText || "Request failed")
    }
  }

  return text
}