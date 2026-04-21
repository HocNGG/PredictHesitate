
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { useMemo } from "react"

export type AreaVsPricePoint = {
  x: number // tọa độ x
  y: number // tọa độ y
  area: number // diện tích
  pricePerM2: number // giá/m2
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean
  payload?: Array<{ payload: AreaVsPricePoint }>
}) {
  if (!active || !payload || payload.length === 0) return null
  const d = payload[0].payload

  return (
    <div className="rounded-md border bg-card px-3 py-2 text-sm shadow-sm">
      <div className="font-medium">Thông tin điểm</div>
      <div className="mt-1 text-muted-foreground">
        Tọa độ: {d.x.toFixed(6)}, {d.y.toFixed(6)}
        <br />
        Diện tích: {d.area} m²
        <br />
        Giá: {d.pricePerM2.toFixed(2)} triệu/m²
      </div>
    </div>
  )
}

function clamp01(t: number) {
  if (t < 0) return 0
  if (t > 1) return 1
  return t
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

function rgb(r: number, g: number, b: number) {
  return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`
}

// Gradient giống kiểu heatmap: xanh -> lục -> vàng -> đỏ
function priceToColor(price: number, min: number, max: number) {
  if (!Number.isFinite(price) || !Number.isFinite(min) || !Number.isFinite(max) || max <= min) {
    return "rgb(59,130,246)" // fallback xanh
  }

  const t = clamp01((price - min) / (max - min))
  // 4 đoạn: blue -> cyan/green -> yellow -> red
  if (t < 0.33) {
    const tt = t / 0.33
    return rgb(lerp(30, 34, tt), lerp(64, 197, tt), lerp(175, 94, tt)) // blue -> green-ish
  }
  if (t < 0.66) {
    const tt = (t - 0.33) / 0.33
    return rgb(lerp(34, 253, tt), lerp(197, 224, tt), lerp(94, 71, tt)) // green -> yellow-ish
  }
  const tt = (t - 0.66) / 0.34
  return rgb(lerp(253, 220, tt), lerp(224, 38, tt), lerp(71, 38, tt)) // yellow -> red
}

function makeSizeScaler(min: number, max: number) {
  const minR = 2
  const maxR = 9
  return (v: number) => {
    if (!Number.isFinite(v) || !Number.isFinite(min) || !Number.isFinite(max) || max <= min) return 4
    const t = clamp01((v - min) / (max - min))
    // scale theo căn để điểm nhỏ vẫn thấy
    return lerp(minR, maxR, Math.sqrt(t))
  }
}

export function AreaVsPriceChart({
  points,
  isLoading,
  isUnavailable,
  runId,
}: {
  points: AreaVsPricePoint[]
  isLoading: boolean
  isUnavailable: boolean
  runId: number | null
}) {
  const FIXED_X_DOMAIN: [number, number] = [10.6, 10.95]
  const FIXED_Y_DOMAIN: [number, number] = [106.5, 106.82]

  const { minArea, maxArea, minPrice, maxPrice } = useMemo(() => {
    if (points.length === 0) {
      return {
        minArea: 0,
        maxArea: 0,
        minPrice: 0,
        maxPrice: 0,
      }
    }

    let minA = points[0].area
    let maxA = points[0].area
    let minP = points[0].pricePerM2
    let maxP = points[0].pricePerM2

    for (const p of points) {
      if (p.area < minA) minA = p.area
      if (p.area > maxA) maxA = p.area
      if (p.pricePerM2 < minP) minP = p.pricePerM2
      if (p.pricePerM2 > maxP) maxP = p.pricePerM2
    }

    return {
      minArea: minA,
      maxArea: maxA,
      minPrice: minP,
      maxPrice: maxP,
    }
  }, [points])

  const sizeOf = useMemo(() => makeSizeScaler(minArea, maxArea), [minArea, maxArea])

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle>Scatter theo tọa độ (x/y)</CardTitle>
        <CardDescription>
          Dùng `tọa độ x` và `tọa độ y` để đặt điểm. Hover để xem diện tích và giá/m²
          {runId ? ` • run #${runId}` : ""}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex h-[300px] items-center justify-center text-sm text-muted-foreground">Loading...</div>
        ) : isUnavailable ? (
          <div className="flex h-[300px] items-center justify-center text-sm text-muted-foreground">
            Không có file scatter cho run này.
          </div>
        ) : points.length === 0 ? (
          <div className="flex h-[300px] items-center justify-center text-sm text-muted-foreground">No data.</div>
        ) : (
          <div className="flex h-[300px] w-full gap-3">
            <div className="h-[300px] flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 10, right: 10, left: 6, bottom: 28 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis
                    type="number"
                    dataKey="x"
                    domain={FIXED_X_DOMAIN}
                    tickFormatter={(v: number) => v.toFixed(2)}
                    tickCount={6}
                    tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                    axisLine={{ stroke: "var(--border)" }}
                    tickLine={{ stroke: "var(--border)" }}
                    label={{ value: "tọa độ x", position: "insideBottom", offset: -16, fill: "var(--muted-foreground)" }}
                  />
                  <YAxis
                    type="number"
                    dataKey="y"
                    domain={FIXED_Y_DOMAIN}
                    tickFormatter={(v: number) => v.toFixed(2)}
                    tickCount={6}
                    tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                    axisLine={{ stroke: "var(--border)" }}
                    tickLine={{ stroke: "var(--border)" }}
                    label={{
                      value: "tọa độ y",
                      angle: -90,
                      position: "insideLeft",
                      fill: "var(--muted-foreground)",
                      offset: 0,
                    }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                      color: "var(--foreground)",
                    }}
                    content={<CustomTooltip />}
                  />
                  <Scatter
                    name="điểm"
                    data={points}
                    shape={(props: any) => {
                      const { cx, cy, payload } = props
                      const d = payload as AreaVsPricePoint
                      const r = sizeOf(d.area)
                      const fill = priceToColor(d.pricePerM2, minPrice, maxPrice)
                      return <circle cx={cx} cy={cy} r={r} fill={fill} fillOpacity={0.85} />
                    }}
                  />
                </ScatterChart>
              </ResponsiveContainer>
            </div>

            {/* Thanh màu theo giá/m2 */}
            <div className="flex h-[300px] w-14 flex-col items-center">
              <div className="text-xs text-muted-foreground">giá/m2</div>
              <div className="mt-2 flex w-full flex-1 items-stretch gap-2">
                <div className="flex flex-1 flex-col justify-between text-[10px] text-muted-foreground">
                  <div>{Number.isFinite(maxPrice) ? maxPrice.toFixed(0) : "-"}</div>
                  <div>{Number.isFinite(minPrice) ? minPrice.toFixed(0) : "-"}</div>
                </div>
                <div
                  className="w-3 rounded-sm border"
                  style={{
                    background:
                      "linear-gradient(to bottom, rgb(220,38,38), rgb(253,224,71), rgb(34,197,94), rgb(30,64,175))",
                    borderColor: "var(--border)",
                  }}
                />
              </div>
              <div className="mt-2 text-[10px] text-muted-foreground">chấm to = diện tích lớn</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
