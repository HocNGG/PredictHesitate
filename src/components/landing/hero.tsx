import { Button } from "@/components/ui/button"
import { ArrowRight, BarChart3 } from "lucide-react"
import { useNavigate } from "react-router-dom"
import previewVideo from "@/assets/vid3.mov"

export function Hero() {
  const navigate = useNavigate()
  return (
    <section className="relative -mt-16 min-h-screen w-full pb-24 overflow-hidden font-['Inter','Segoe_UI',system-ui,-apple-system,BlinkMacSystemFont,sans-serif]">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute"
        style={{
          filter: "brightness(0.8)",
          top: "-4rem",
          left: 0,
          right: 0,
          width: "100%",
          height: "calc(100vh + 4rem)",
          minHeight: "calc(100% + 4rem)",
          objectFit: "cover",
        }}
      >
        <source src={previewVideo} type="video/mp4" />
      </video>

      {/* Dark overlay to keep text readable */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Animated gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[oklch(0.5_0.2_275)] rounded-full blur-3xl opacity-20 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[oklch(0.45_0.2_260)] rounded-full blur-3xl opacity-15 animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="container relative z-10 mx-auto px-4 md:px-6 py-24 md:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="flex flex-col gap-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium w-fit mx-auto lg:mx-0">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              AI-Powered Platform
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground text-balance">
              AI-Powered Real Estate Price Prediction
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 text-pretty">
              Predict housing prices instantly using machine learning and data analytics for Ho Chi Minh City properties.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
              <Button size="lg" className="gap-2 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity" onClick={() => navigate('/predict')}>
                Start Predicting
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button size="lg" variant="secondary" className="gap-2" onClick={() => navigate('/analysis')}>
                <BarChart3 className="w-4 h-4" />
                View Data Insights
              </Button>
            </div>
          </div>

          {/* Right Content - Illustration */}
          <div className="relative flex items-center justify-center">
            <div className="relative w-full max-w-lg aspect-square">
              {/* Glow effect behind image */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-accent/30 rounded-3xl blur-2xl" />

              {/* Image container */}
              <div className="relative rounded-3xl overflow-hidden bg-card/50 backdrop-blur-sm">
                <img
                  src="/src/assets/robot-removebg-preview.png"
                  alt="AI Real Estate Price Prediction Illustration"
                  width={600}
                  height={600}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Floating stats cards */}
              <div className="absolute -bottom-4 -left-4 bg-card/90 backdrop-blur-md border border-border/50 rounded-xl p-4 shadow-xl">
                <p className="text-xs text-muted-foreground">Accuracy Rate</p>
                <p className="text-2xl font-bold text-primary">95.8%</p>
              </div>

              <div className="absolute -top-4 -right-4 bg-card/90 backdrop-blur-md border border-border/50 rounded-xl p-4 shadow-xl">
                <p className="text-xs text-muted-foreground">Predictions</p>
                <p className="text-2xl font-bold text-accent">10K+</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  )
}
