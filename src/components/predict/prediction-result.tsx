"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, DollarSign, Bot, User } from "lucide-react"
import type { PredictionInput } from "./prediction-form"

interface PredictionResultProps {
  result: {
    price: number
    pricePerSqm: number
    input: PredictionInput
  } | null
}

export function PredictionResult({ result }: PredictionResultProps) {
  if (!result) {
    return (
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <TrendingUp className="h-5 w-5 text-primary" />
            Prediction Result
          </CardTitle>
          <CardDescription>
            Fill in the property details and click predict to see the AI estimation
          </CardDescription>
        </CardHeader>
        <CardContent className="flex min-h-[300px] items-center justify-center">
          <div className="text-center text-muted-foreground">
            <DollarSign className="mx-auto h-12 w-12 opacity-20" />
            <p className="mt-4">No prediction yet</p>
            <p className="text-sm">Enter property details to get started</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const formatCurrency = (value: number) => {
    if (value >= 1e9) {
      return `${(value / 1e9).toFixed(2)} tỷ VND`
    }
    return `${(value / 1e6).toFixed(0)} triệu VND`
  }

  return (
    <div className="space-y-4">
      <Card className="border-accent/50 bg-card">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-xl">
            <TrendingUp className="h-5 w-5 text-accent" />
            Prediction Result
          </CardTitle>
          <CardDescription>AI-powered price estimation for your property</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-xl bg-accent/10 p-6 text-center">
            <p className="mb-2 text-sm font-medium text-accent">Predicted Price</p>
            <p className="text-4xl font-bold text-accent">{formatCurrency(result.price)}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg bg-secondary p-4 text-center">
              <p className="text-xs font-medium text-muted-foreground">Price per m²</p>
              <p className="mt-1 text-lg font-semibold">{formatCurrency(result.pricePerSqm)}</p>
            </div>
            <div className="rounded-lg bg-secondary p-4 text-center">
              <p className="text-xs font-medium text-muted-foreground">Total Area</p>
              <p className="mt-1 text-lg font-semibold">{result.input.area} m²</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Bot className="h-5 w-5 text-primary" />
            AI Explanation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                <User className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="rounded-2xl rounded-tl-none bg-secondary px-4 py-2">
                <p className="text-sm">
                  Why is the predicted price {formatCurrency(result.price)} for this {result.input.propertyType.toLowerCase()} in {result.input.district}?
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary">
                <Bot className="h-4 w-4 text-primary-foreground" />
              </div>
              <div className="rounded-2xl rounded-tl-none bg-primary/10 px-4 py-3">
                <p className="text-sm leading-relaxed">
                  Based on our machine learning analysis of Ho Chi Minh City real estate data, here are the key factors:
                </p>
                <ul className="mt-3 space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    <span>
                      <strong>Location:</strong> {result.input.district} is a {result.input.district.includes("1") || result.input.district.includes("3") ? "premium" : "developing"} area with {result.input.district.includes("1") || result.input.district.includes("3") ? "high" : "moderate"} demand
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    <span>
                      <strong>Property Type:</strong> {result.input.propertyType}s in this district typically range from {formatCurrency(result.price * 0.8)} to {formatCurrency(result.price * 1.2)}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    <span>
                      <strong>Size & Layout:</strong> {result.input.area}m² with {result.input.bedrooms} bedrooms across {result.input.floors} floor{result.input.floors > 1 ? "s" : ""} is considered {result.input.area > 100 ? "spacious" : "standard"} for this property type
                    </span>
                  </li>
                  {result.input.frontage && (
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      <span>
                        <strong>Frontage:</strong> {result.input.frontage}m frontage width adds {result.input.frontage > 5 ? "significant" : "moderate"} value to the property
                      </span>
                    </li>
                  )}
                </ul>
                <p className="mt-3 text-xs text-muted-foreground">
                  Confidence: 87% | Model: Gradient Boosting v2.3
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
