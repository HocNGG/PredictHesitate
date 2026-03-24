import { Navigation } from "@/components/predict/navigation"
import { PriceDistributionChart } from "@/components/charts/price-distribution-chart"
import { AreaPriceChart } from "@/components/charts/area-price-chart"
import { DistrictPropertyChart } from "@/components/charts/district-property-chart"
import { FeatureImportanceChart } from "@/components/charts/feature-importance-chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

const insights = [
  {
    title: "Location Premium",
    description: "District 1 properties command 2.3x higher prices than the city average",
    trend: "up",
  },
  {
    title: "Size Impact",
    description: "Each additional 10m² adds approximately 0.8B VND to property value",
    trend: "up",
  },
  {
    title: "Market Trend",
    description: "Thu Duc district showing fastest price growth at 15% YoY",
    trend: "up",
  },
  {
    title: "Apartment Premium",
    description: "New apartments (< 5 years) sell for 18% more than older units",
    trend: "neutral",
  },
]

export default function AnalysisPage() {
  return (
    <div className="min-h-screen bg-muted/40">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-balance">
            Data Analysis
          </h1>
          <p className="text-muted-foreground mt-1">
            Detailed analysis and insights from our ML model
          </p>
        </div>

        <div className="space-y-6">
          {/* Key Insights */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Key Market Insights</CardTitle>
              <CardDescription>
                AI-generated insights from analyzing 12,847 properties
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {insights.map((insight) => (
                  <div
                    key={insight.title}
                    className="rounded-lg border border-border bg-card p-4"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary" className="text-xs">
                        {insight.trend === "up" && <TrendingUp className="h-3 w-3 mr-1" />}
                        {insight.trend === "down" && <TrendingDown className="h-3 w-3 mr-1" />}
                        {insight.trend === "neutral" && <Minus className="h-3 w-3 mr-1" />}
                        Insight
                      </Badge>
                    </div>
                    <h3 className="font-medium text-sm mb-1">{insight.title}</h3>
                    <p className="text-xs text-muted-foreground">{insight.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Charts Grid */}
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
