import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, BarChart2, Brain } from "lucide-react"

const features = [
  {
    icon: TrendingUp,
    title: "Price Prediction",
    description: "Predict property prices based on area, location, and features with high accuracy using our advanced ML models."
  },
  {
    icon: BarChart2,
    title: "Data Analytics",
    description: "Visualize housing market trends using interactive charts and gain insights into the real estate market."
  },
  {
    icon: Brain,
    title: "AI Explanation",
    description: "Understand why the AI predicted the price with detailed explanations and feature importance analysis."
  }
]

export function Features() {
  return (
    <section className="py-24 md:py-32 relative">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Powerful Features
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">            
            Our platform combines cutting-edge AI technology with comprehensive data analytics to deliver accurate predictions.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="border-border/50 bg-card/60"
            >
              <CardHeader className="relative">
                <feature.icon className="w-6 h-6 text-primary m-4" />
                <CardTitle className="text-xl font-semibold text-foreground">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="relative">
                <CardDescription className="text-muted-foreground text-base">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
