import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sparkles } from "lucide-react"
import { DISTRICTS, PROPERTY_TYPES } from "@/constants/predict-options"

interface PredictionFormProps {
  onPredict: (data: PredictionInput) => void
  isLoading: boolean
}

export interface PredictionInput {
  propertyTypeId: number
  districtId: number
  area: number
  lat: number
  lng: number
  frontage: number | null
  bedrooms: number | null
  floors: number | null
}

export function PredictionForm({ onPredict, isLoading }: PredictionFormProps) {
  const [formData, setFormData] = useState<{
    propertyTypeId: string
    districtId: string
    area: string
    lat: string
    lng: string
    frontage: string
    bedrooms: string
    floors: string
  }>({
    propertyTypeId: "",
    districtId: "",
    area: "80",
    lat: "10.73",
    lng: "106.72",
    frontage: "",
    bedrooms: "2",
    floors: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const area = Number(formData.area)
    const lat = Number(formData.lat)
    const lng = Number(formData.lng)
    if (!formData.propertyTypeId || !formData.districtId || !(area > 0) || Number.isNaN(lat) || Number.isNaN(lng)) {
      return
    }
    const frontage = formData.frontage.trim() === "" ? null : Number(formData.frontage)
    const bedrooms = formData.bedrooms.trim() === "" ? null : Number(formData.bedrooms)
    const floors = formData.floors.trim() === "" ? null : Number(formData.floors)
    if (frontage !== null && Number.isNaN(frontage)) return
    if (bedrooms !== null && Number.isNaN(bedrooms)) return
    if (floors !== null && Number.isNaN(floors)) return

    onPredict({
      propertyTypeId: Number(formData.propertyTypeId),
      districtId: Number(formData.districtId),
      area,
      lat,
      lng,
      frontage,
      bedrooms,
      floors,
    })
  }

  const canSubmit =
    formData.propertyTypeId &&
    formData.districtId &&
    formData.area &&
    Number(formData.area) > 0 &&
    formData.lat !== "" &&
    formData.lng !== ""

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Sparkles className="h-5 w-5 text-primary" />
          Thông tin bất động sản
        </CardTitle>
        <CardDescription>
          Chọn loại nhà, quận/huyện (mã theo backend), diện tích và tọa độ — dữ liệu gửi lên API{" "}
          <code className="rounded bg-muted px-1">/predict</code>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="propertyType">Loại nhà đất</Label>
              <Select
                value={formData.propertyTypeId}
                onValueChange={(value) => setFormData({ ...formData, propertyTypeId: value })}
              >
                <SelectTrigger id="propertyType" className="bg-white text-black">
                  <SelectValue placeholder="Chọn loại" />
                </SelectTrigger>
                <SelectContent className="max-h-72 bg-white text-black">
                  {PROPERTY_TYPES.map((type) => (
                    <SelectItem key={type.id} value={String(type.id)}>
                      {type.label} ({type.id})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="district">Địa chỉ (quận/huyện)</Label>
              <Select
                value={formData.districtId}
                onValueChange={(value) => setFormData({ ...formData, districtId: value })}
              >
                <SelectTrigger id="district" className="bg-white text-black">
                  <SelectValue placeholder="Chọn quận/huyện" />
                </SelectTrigger>
                <SelectContent className="max-h-72 bg-white text-black">
                  {DISTRICTS.map((d) => (
                    <SelectItem key={d.id} value={String(d.id)}>
                      {d.label} ({d.id})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="area">Diện tích (m²)</Label>
              <Input
                id="area"
                type="number"
                min={0.01}
                step={0.01}
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                className="bg-white text-black"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lat">Tọa độ x (vĩ độ)</Label>
              <Input
                id="lat"
                type="number"
                step="any"
                value={formData.lat}
                onChange={(e) => setFormData({ ...formData, lat: e.target.value })}
                className="bg-white text-black"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lng">Tọa độ y (kinh độ)</Label>
              <Input
                id="lng"
                type="number"
                step="any"
                value={formData.lng}
                onChange={(e) => setFormData({ ...formData, lng: e.target.value })}
                className="bg-white text-black"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="frontage">Mặt tiền (m) — tùy chọn</Label>
              <Input
                id="frontage"
                type="number"
                min={0}
                step={0.1}
                placeholder="Để trống = null"
                value={formData.frontage}
                onChange={(e) => setFormData({ ...formData, frontage: e.target.value })}
                className="bg-white text-black"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bedrooms">Phòng ngủ — tùy chọn</Label>
              <Input
                id="bedrooms"
                type="number"
                min={0}
                placeholder="Để trống = null"
                value={formData.bedrooms}
                onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                className="bg-white text-black"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="floors">Số tầng — tùy chọn</Label>
              <Input
                id="floors"
                type="number"
                min={0}
                placeholder="Để trống = null"
                value={formData.floors}
                onChange={(e) => setFormData({ ...formData, floors: e.target.value })}
                className="bg-white text-black"
              />
            </div>
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full bg-primary text-white hover:bg-primary/90"
            disabled={isLoading || !canSubmit}
          >
            {isLoading ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                Đang dự đoán...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Dự đoán giá
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
