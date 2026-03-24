import { Navigation } from "@/components/predict/navigation"
import { StatsCards } from "@/components/predict/stats-cards"
import { PriceDistributionChart } from "@/components/charts/price-distribution-chart"
import { AreaPriceChart } from "@/components/charts/area-price-chart"
import { DistrictPropertyChart } from "@/components/charts/district-property-chart"
import { FeatureImportanceChart } from "@/components/charts/feature-importance-chart"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-muted/40">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-balance">
            Real Estate Analytics Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            AI-powered insights for the Ho Chi Minh City housing market
          </p>
        </div>

        <div className="space-y-6">
          <StatsCards />

          <div className="grid gap-6 md:grid-cols-2">
            <PriceDistributionChart />
            <AreaPriceChart />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <DistrictPropertyChart />
            <FeatureImportanceChart />
          </div>
        </div>
      </main>
    </div>
  )
}
