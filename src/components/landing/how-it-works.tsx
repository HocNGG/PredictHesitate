import { FileText, Cpu, LineChart } from "lucide-react"

const steps = [
  {
    icon: FileText,
    step: "01",
    title: "Enter Property Information",
    description: "Input details about the property including location, area, number of rooms, and other features."
  },
  {
    icon: Cpu,
    step: "02",
    title: "AI Predicts the Price",
    description: "Our machine learning model analyzes the data and generates an accurate price prediction."
  },
  {
    icon: LineChart,
    step: "03",
    title: "View Analytics & Explanation",
    description: "Get detailed analytics, market comparisons, and understand the factors behind the prediction."
  }
]

export function HowItWorks() {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-[oklch(0.15_0.04_275)] to-background" />

      <div className="container mx-auto relative px-4 md:px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Get accurate property price predictions in three simple steps.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12 relative">
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute top-16 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-primary/50 via-accent/50 to-primary/50" />

          {steps.map((step, index) => (
            <div key={index} className="relative flex flex-col items-center text-center">
              {/* Step number circle */}
              <div className="relative mb-6">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border border-border/50">
                  <div className="w-24 h-24 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center border border-border/30">
                    <step.icon className="w-10 h-10 text-primary" />
                  </div>
                </div>
                {/* Step number badge */}
                <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-sm font-bold text-primary-foreground shadow-lg">
                  {step.step}
                </div>
              </div>

              <h3 className="text-xl font-semibold text-foreground mb-3">
                {step.title}
              </h3>
              <p className="text-muted-foreground max-w-xs text-pretty">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
