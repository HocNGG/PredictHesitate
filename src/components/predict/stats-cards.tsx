import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, TrendingUp, MapPin, Brain } from "lucide-react"

const stats = [
  {
    title: "Total Properties",
    value: "12,847",
    description: "Properties in database",
    icon: Building2,
    trend: "+12.5%",
  },
  {
    title: "Avg. Price",
    value: "6.8B VND",
    description: "Average listing price",
    icon: TrendingUp,
    trend: "+8.2%",
  },
  {
    title: "Districts Covered",
    value: "24",
    description: "HCMC districts",
    icon: MapPin,
    trend: "All areas",
  },
  {
    title: "Model Accuracy",
    value: "94.2%",
    description: "Prediction accuracy",
    icon: Brain,
    trend: "R² Score",
  },
]

export function StatsCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">
              {stat.description}
              <span className="ml-1 text-chart-2 font-medium">{stat.trend}</span>
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
