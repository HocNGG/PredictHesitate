export const BASE_URL = "http://localhost:8001"

export type HttpMethod = "GET" | "POST"

type ErrorResponse = {
  detail?: string
  [key: string]: unknown
}

function tryParseJson(text: string): unknown {
  if (!text) return null
  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

export async function request<T>(path: string, method: HttpMethod, body?: unknown): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  const text = await response.text()
  const data = tryParseJson(text)

  if (!response.ok) {
    const message =
      data && typeof data === "object" && "detail" in data
        ? String((data as ErrorResponse).detail)
        : response.statusText || "Request failed"

    throw new Error(message)
  }

  return data as T
}

export function apiGet<T>(path: string): Promise<T> {
  return request<T>(path, "GET")
}

export function apiPost<T>(path: string, body?: unknown): Promise<T> {
  return request<T>(path, "POST", body)
}