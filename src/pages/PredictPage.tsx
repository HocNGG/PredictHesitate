
import { useState } from "react"
import { Navigation } from "@/components/predict/navigation"
import { PredictionForm, type PredictionInput } from "@/components/predict/prediction-form"
import { PredictionResult } from "@/components/predict/prediction-result"

// Simulated price prediction based on input
function predictPrice(input: PredictionInput): { price: number; pricePerSqm: number } {
  // Base price per sqm based on district (in VND)
  const districtPrices: Record<string, number> = {
    "District 1": 250000000,
    "District 2 (Thu Duc)": 120000000,
    "District 3": 200000000,
    "District 4": 100000000,
    "District 5": 130000000,
    "District 6": 80000000,
    "District 7": 140000000,
    "District 8": 70000000,
    "District 9 (Thu Duc)": 80000000,
    "District 10": 150000000,
    "District 11": 100000000,
    "District 12": 60000000,
    "Binh Thanh": 130000000,
    "Phu Nhuan": 160000000,
    "Go Vap": 90000000,
    "Tan Binh": 110000000,
    "Tan Phu": 85000000,
    "Thu Duc City": 100000000,
  }

  // Property type multiplier
  const typeMultipliers: Record<string, number> = {
    "Apartment": 0.9,
    "Townhouse": 1.1,
    "Villa": 1.5,
    "Detached House": 1.2,
    "Land": 0.7,
  }

  const basePricePerSqm = districtPrices[input.district] || 100000000
  const typeMultiplier = typeMultipliers[input.propertyType] || 1

  // Additional factors
  const bedroomFactor = 1 + (input.bedrooms - 2) * 0.05
  const floorFactor = 1 + (input.floors - 1) * 0.03
  const frontageFactor = input.frontage ? 1 + (input.frontage - 4) * 0.02 : 1

  // Add some randomness to simulate ML model variance
  const variance = 0.9 + Math.random() * 0.2

  const pricePerSqm = basePricePerSqm * typeMultiplier * bedroomFactor * floorFactor * frontageFactor * variance
  const price = pricePerSqm * input.area

  return {
    price: Math.round(price / 1000000) * 1000000,
    pricePerSqm: Math.round(pricePerSqm / 1000000) * 1000000,
  }
}

export default function PredictPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{
    price: number
    pricePerSqm: number
    input: PredictionInput
  } | null>(null)

  const handlePredict = async (input: PredictionInput) => {
    setIsLoading(true)
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const prediction = predictPrice(input)
    setResult({
      ...prediction,
      input,
    })
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Price Prediction</h1>
          <p className="mt-2 text-muted-foreground">
            Get AI-powered real estate price predictions for Ho Chi Minh City properties
          </p>
        </div>
        <div className="grid gap-8 lg:grid-cols-2">
          <PredictionForm onPredict={handlePredict} isLoading={isLoading} />
          <PredictionResult result={result} />
        </div>
      </main>
    </div>
  )
}
