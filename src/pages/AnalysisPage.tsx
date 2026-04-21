
import { useEffect, useMemo, useState } from "react"
import { Navigation } from "@/components/predict/navigation"
import { PriceDistributionChart } from "@/components/charts/price-distribution"
import { AreaVsPriceChart } from "@/components/charts/area-vs-price"
import { DistrictComparisonChart } from "@/components/charts/district-comparison"
import { FeatureImportanceChart } from "@/components/charts/feature-importance"
import { ChatBox } from "@/components/ChatBox"
import {
  getDistrictPropertyType,
  getFeatureImportance,
  getPriceDistribution,
  getScatterFile,
  getScatterVersion,
  type DistrictPropertyTypeResponse,
  type FeatureImportanceResponse,
  type PriceDistributionResponse,
  type ScatterVersionResponse,
} from "@/api/eda"
import { getCachedScatter, setCachedScatter } from "@/lib/eda-cache"
import { groupDistrictPropertyMedianPrice, parseScatterCsv, sortPriceBins } from "@/lib/eda-transform"

export default function AnalysisPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [runId, setRunId] = useState<number | null>(null)
  const [priceDist, setPriceDist] = useState<PriceDistributionResponse | null>(null)
  const [districtType, setDistrictType] = useState<DistrictPropertyTypeResponse | null>(null)
  const [featureImportance, setFeatureImportance] = useState<FeatureImportanceResponse | null>(null)
  const [scatterCsv, setScatterCsv] = useState<string | null>(null)
  const [isScatterUnavailable, setIsScatterUnavailable] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function loadOnce(allowRetryIfRunMismatch: boolean): Promise<void> {
      setIsLoading(true)
      setError(null)
      setIsScatterUnavailable(false)

      try {
        const version: ScatterVersionResponse = await getScatterVersion()
        if (cancelled) return
        setRunId(version.run_id)

        const cached = getCachedScatter(String(version.run_id))
        if (cached) {
          setScatterCsv(cached)
        } else {
          try {
            const csvText = await getScatterFile()
            if (cancelled) return
            setCachedScatter(String(version.run_id), csvText)
            setScatterCsv(csvText)
          } catch (err) {
            // Scatter is optional; other JSON charts should still render.
            setScatterCsv(null)
            setIsScatterUnavailable(true)
          }
        }

        const [dist, districtProp, featureImp] = await Promise.all([
          getPriceDistribution(),
          getDistrictPropertyType(),
          getFeatureImportance(),
        ])
        if (cancelled) return

        if (allowRetryIfRunMismatch) {
          const mismatch =
            dist.run_id !== districtProp.run_id || dist.run_id !== featureImp.run_id || dist.run_id !== version.run_id
          if (mismatch) {
            await loadOnce(false)
            return
          }
        }

        setPriceDist(dist)
        setDistrictType(districtProp)
        setFeatureImportance(featureImp)
      } catch (err) {
        if (cancelled) return
        setError(err instanceof Error ? err.message : "Failed to load EDA dashboard.")
      } finally {
        if (cancelled) return
        setIsLoading(false)
      }
    }

    loadOnce(true)
    return () => {
      cancelled = true
    }
  }, [])

  const bins = useMemo(() => {
    const raw = priceDist?.bins ?? []
    const sorted = sortPriceBins(raw.map((b) => ({ label: b.label, count: b.count })))
    return sorted
  }, [priceDist])

  const districtGrouped = useMemo(() => {
    const raw = districtType?.data ?? []
    return groupDistrictPropertyMedianPrice(raw)
  }, [districtType])

  const propertyTypes = useMemo(() => {
    const raw = districtType?.data ?? []
    const keys = Array.from(new Set(raw.map((x) => x.property_type))).sort((a, b) => a.localeCompare(b, "vi-VN"))
    return keys
  }, [districtType])

  const scatterPoints = useMemo(() => {
    const points = parseScatterCsv(scatterCsv ?? "")
    return points.map((p) => ({
      x: p.x,
      y: p.y,
      area: p.area,
      pricePerM2: p.pricePerM2,
    }))
  }, [scatterCsv])

  const featureImportanceData = useMemo(() => {
    const palette = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"]
    return (featureImportance?.features ?? [])
      .slice()
      .sort((a, b) => b.importance - a.importance)
      .map((f, idx) => ({
        feature: f.name,
        importance: f.importance,
        fill: palette[idx % palette.length],
      }))
  }, [featureImportance])

  return (
    <div className="min-h-screen bg-background relative">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Data Analysis</h1>
          <p className="mt-2 text-muted-foreground">
            Explore insights from Ho Chi Minh City real estate dataset
          </p>
        </div>
        {error ? (
          <div className="mb-6 rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        ) : null}
        <div className="grid gap-6 md:grid-cols-2">
          <PriceDistributionChart bins={bins} isLoading={isLoading} runId={runId} />
          <AreaVsPriceChart
            points={scatterPoints}
            isLoading={isLoading}
            isUnavailable={isScatterUnavailable}
            runId={runId}
          />
          <DistrictComparisonChart
            data={districtGrouped}
            propertyTypes={propertyTypes}
            isLoading={isLoading}
            runId={runId}
          />
          <FeatureImportanceChart data={featureImportanceData} isLoading={isLoading} runId={runId} />
        </div>
      </main>
      <ChatBox />
    </div>
  )
}