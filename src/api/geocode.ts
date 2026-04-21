import { apiGet } from "./client"

export type GeocodeSuccessResponse = {
  address: string
  x: number
  y: number
}

export type GeocodeErrorPayload = {
  error: string
}

export async function geocodeAddress(address: string): Promise<GeocodeSuccessResponse> {
  const res = await apiGet<GeocodeSuccessResponse | GeocodeErrorPayload>(`/geocode?address=${encodeURIComponent(address)}`)
  if ("error" in res) {
    throw new Error(res.error)
  }
  return res
}
