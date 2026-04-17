import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, DollarSign, Bot, User } from "lucide-react"
import type { PredictionInput } from "./prediction-form"
import { getDistrictLabel, getPropertyTypeLabel } from "@/constants/predict-options"

interface PredictionResultProps {
  result: {
    predicted_price_per_m2: number | null
    predicted_total_price: number | null
    input: PredictionInput
  } | null
}

function formatTriệuPerM2(value: number | null) {
  if (value == null) return "—"
  return `${value.toLocaleString("vi-VN", { maximumFractionDigits: 2 })} triệu/m²`
}

function formatTriệuTotal(value: number | null) {
  if (value == null) return "—"
  return `${value.toLocaleString("vi-VN", { maximumFractionDigits: 2 })} triệu VND`
}

export function PredictionResult({ result }: PredictionResultProps) {
  if (!result) {
    return (
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <TrendingUp className="h-5 w-5 text-primary" />
            Kết quả dự đoán
          </CardTitle>
          <CardDescription>Điền form và bấm dự đoán để xem giá từ API</CardDescription>
        </CardHeader>
        <CardContent className="flex min-h-[300px] items-center justify-center">
          <div className="text-center text-muted-foreground">
            <DollarSign className="mx-auto h-12 w-12 opacity-20" />
            <p className="mt-4">Chưa có kết quả</p>
            <p className="text-sm">Nhập thông tin BĐS và gửi yêu cầu</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const typeLabel = getPropertyTypeLabel(result.input.propertyTypeId)
  const districtLabel = getDistrictLabel(result.input.districtId)

  return (
    <div className="space-y-4">
      <Card className="border-accent/50 bg-card">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-xl">
            <TrendingUp className="h-5 w-5 text-accent" />
            Kết quả từ backend
          </CardTitle>
          <CardDescription>Giá theo triệu VND/m² và tổng giá (triệu VND) như response API</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-xl bg-accent/10 p-6 text-center">
            <p className="mb-2 text-sm font-medium text-accent">Tổng giá dự đoán</p>
            <p className="text-4xl font-bold text-accent">{formatTriệuTotal(result.predicted_total_price)}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg bg-secondary p-4 text-center">
              <p className="text-xs font-medium text-muted-foreground">Giá / m²</p>
              <p className="mt-1 text-lg font-semibold">{formatTriệuPerM2(result.predicted_price_per_m2)}</p>
            </div>
            <div className="rounded-lg bg-secondary p-4 text-center">
              <p className="text-xs font-medium text-muted-foreground">Diện tích</p>
              <p className="mt-1 text-lg font-semibold">{result.input.area} m²</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Bot className="h-5 w-5 text-primary" />
            Tóm tắt đầu vào
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                <User className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="rounded-2xl rounded-tl-none bg-secondary px-4 py-2">
                <p className="text-sm">
                  {typeLabel} tại {districtLabel}, {result.input.area} m²
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary">
                <Bot className="h-4 w-4 text-primary-foreground" />
              </div>
              <div className="rounded-2xl rounded-tl-none bg-primary/10 px-4 py-3">
                <ul className="space-y-2 text-sm leading-relaxed">
                  <li>
                    <strong>Loại:</strong> {typeLabel} (mã {result.input.propertyTypeId})
                  </li>
                  <li>
                    <strong>Địa chỉ:</strong> {districtLabel} (mã {result.input.districtId})
                  </li>
                  <li>
                    <strong>Tọa độ:</strong> {result.input.lat}, {result.input.lng}
                  </li>
                  <li>
                    <strong>Mặt tiền:</strong> {result.input.frontage == null ? "null" : `${result.input.frontage} m`}
                  </li>
                  <li>
                    <strong>Phòng ngủ:</strong> {result.input.bedrooms == null ? "null" : result.input.bedrooms}
                  </li>
                  <li>
                    <strong>Số tầng:</strong> {result.input.floors == null ? "null" : result.input.floors}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
