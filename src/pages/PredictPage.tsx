import { useState } from "react"
import { Navigation } from "@/components/predict/navigation"
import { PredictionForm, type PredictionInput } from "@/components/predict/prediction-form"
import { PredictionResult } from "@/components/predict/prediction-result"
import { predictPrice } from "@/api/predict"

export default function PredictPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<{
    predicted_price_per_m2: number | null
    predicted_total_price: number | null
    input: PredictionInput
  } | null>(null)

  const handlePredict = async (input: PredictionInput) => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await predictPrice({
        "loại nhà đất": input.propertyTypeId,
        "địa chỉ": input.districtId,
        "diện tích": input.area,
        "mặt tiền": input.frontage,
        "phòng ngủ": input.bedrooms,
        "tọa độ x": input.lat,
        "tọa độ y": input.lng,
        "số tầng": input.floors,
      })
      setResult({
        predicted_price_per_m2: data.predicted_price_per_m2,
        predicted_total_price: data.predicted_total_price,
        input,
      })
    } catch (err) {
      setResult(null)
      setError(err instanceof Error ? err.message : "Không gọi được API dự đoán.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Dự đoán giá</h1>
          <p className="mt-2 text-muted-foreground">
            Gửi payload đúng schema backend (mã loại nhà, mã quận, tọa độ, v.v.) tới{" "}
            <code className="rounded bg-muted px-1">POST /predict</code>
          </p>
        </div>
        {error ? (
          <div className="mb-6 rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        ) : null}
        <div className="grid gap-8 lg:grid-cols-2">
          <PredictionForm onPredict={handlePredict} isLoading={isLoading} />
          <PredictionResult result={result} />
        </div>
      </main>
    </div>
  )
}
