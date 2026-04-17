
import { Navigation } from "@/components/predict/navigation"
import { PriceDistributionChart } from "@/components/charts/price-distribution"
import { AreaVsPriceChart } from "@/components/charts/area-vs-price"
import { DistrictComparisonChart } from "@/components/charts/district-comparison"
import { FeatureImportanceChart } from "@/components/charts/feature-importance"
import { ChatBox } from "@/components/ChatBox"

export default function AnalysisPage() {
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
        <div className="grid gap-6 md:grid-cols-2">
          <PriceDistributionChart />
          <AreaVsPriceChart />
          <DistrictComparisonChart />
          <FeatureImportanceChart />
        </div>
      </main>
      <ChatBox />
    </div>
  )
}