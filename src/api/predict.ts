import { apiPost } from "./client"

export type PredictRequest = {
  "loại nhà đất": number
  "địa chỉ": number
  "diện tích": number
  "mặt tiền": number | null
  "phòng ngủ": number | null
  "tọa độ x": number
  "tọa độ y": number
  "số tầng": number | null
}

export type PredictResponse = {
  predicted_price_per_m2: number | null
  predicted_total_price: number | null
}

export async function predictPrice(body: PredictRequest): Promise<PredictResponse> {
  return apiPost<PredictResponse>("/predict", body)
}
