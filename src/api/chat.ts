import { apiPost } from "./client"

export type ChatRequest = {
  session_id: string | null
  message: string
}

export type ChatPrediction = {
  price_per_m2: number
  total_price: number
}

export type ChatResponse = {
  session_id: string
  reply: string
  is_prediction: boolean
  prediction: ChatPrediction | null
  state_complete: boolean
}

export async function sendChatMessage(body: ChatRequest): Promise<ChatResponse> {
  return apiPost<ChatResponse>("/chat", body)
}
