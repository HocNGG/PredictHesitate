import { useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, MapPinned, Sparkles } from "lucide-react"
import { DISTRICTS, PROPERTY_TYPES } from "@/constants/predict-options"
import { geocodeAddress } from "@/api/geocode"
import { MapContainer, TileLayer, CircleMarker, useMapEvents, useMap } from "react-leaflet"

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

function MapClickHandler({
  onPick,
}: {
  onPick: (lat: number, lng: number) => void
}) {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng)
    },
  })
  return null
}

function MapFlyTo({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap()
  map.setView([lat, lng], 13, { animate: true })
  return null
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
  const [addressInput, setAddressInput] = useState("")
  const [geocodeLoading, setGeocodeLoading] = useState(false)
  const [geocodeError, setGeocodeError] = useState<string | null>(null)
  const [resolvedAddress, setResolvedAddress] = useState<string | null>(null)

  const latNum = Number(formData.lat)
  const lngNum = Number(formData.lng)
  const markerPosition = useMemo<[number, number]>(() => {
    if (Number.isFinite(latNum) && Number.isFinite(lngNum)) return [latNum, lngNum]
    return [10.78, 106.7]
  }, [latNum, lngNum])

  const setLatLng = (lat: number, lng: number) => {
    setFormData((prev) => ({ ...prev, lat: lat.toFixed(6), lng: lng.toFixed(6) }))
  }

  const handleGeocode = async () => {
    if (!addressInput.trim()) return
    setGeocodeLoading(true)
    setGeocodeError(null)
    setResolvedAddress(null)
    try {
      const res = await geocodeAddress(addressInput.trim())
      setLatLng(res.x, res.y)
      setResolvedAddress(res.address)
    } catch (err) {
      setGeocodeError(err instanceof Error ? err.message : "Không thể chuyển đổi địa chỉ.")
    } finally {
      setGeocodeLoading(false)
    }
  }

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

          <div className="space-y-3 rounded-lg border p-4">
            <div className="space-y-2">
              <Label htmlFor="address">Nhập địa chỉ để tự điền tọa độ</Label>
              <div className="flex gap-2">
                <Input
                  id="address"
                  type="text"
                  placeholder="Ví dụ: 123 Nguyễn Hữu Thọ, Quận 7"
                  value={addressInput}
                  onChange={(e) => setAddressInput(e.target.value)}
                  className="bg-white text-black"
                />
                <Button type="button" variant="outline" onClick={handleGeocode} disabled={geocodeLoading || !addressInput.trim()}>
                  {geocodeLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <MapPinned className="h-4 w-4" />}
                </Button>
              </div>
              {geocodeError ? <p className="text-sm text-destructive">{geocodeError}</p> : null}
              {resolvedAddress ? <p className="text-sm text-muted-foreground">Địa chỉ chuẩn hóa: {resolvedAddress}</p> : null}
            </div>

            <div className="overflow-hidden rounded-lg border">
              <MapContainer center={markerPosition} zoom={12} className="h-64 w-full">
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapClickHandler onPick={setLatLng} />
                <MapFlyTo lat={markerPosition[0]} lng={markerPosition[1]} />
                <CircleMarker center={markerPosition} radius={8} pathOptions={{ color: "#2563eb", fillOpacity: 0.8 }} />
              </MapContainer>
            </div>
            <p className="text-xs text-muted-foreground">
              Bạn có thể click trực tiếp trên bản đồ để chọn vị trí và tự động điền tọa độ x/y.
            </p>
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
