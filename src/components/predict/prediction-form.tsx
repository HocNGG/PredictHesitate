"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sparkles } from "lucide-react"

const propertyTypes = [
  "Apartment",
  "Townhouse",
  "Villa",
  "Detached House",
  "Land",
]

const districts = [
  "District 1",
  "District 2 (Thu Duc)",
  "District 3",
  "District 4",
  "District 5",
  "District 6",
  "District 7",
  "District 8",
  "District 9 (Thu Duc)",
  "District 10",
  "District 11",
  "District 12",
  "Binh Thanh",
  "Phu Nhuan",
  "Go Vap",
  "Tan Binh",
  "Tan Phu",
  "Thu Duc City",
]

interface PredictionFormProps {
  onPredict: (data: PredictionInput) => void
  isLoading: boolean
}

export interface PredictionInput {
  propertyType: string
  district: string
  area: number
  bedrooms: number
  floors: number
  frontage?: number
}

export function PredictionForm({ onPredict, isLoading }: PredictionFormProps) {
  const [formData, setFormData] = useState<Partial<PredictionInput>>({
    area: 80,
    bedrooms: 3,
    floors: 2,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.propertyType && formData.district && formData.area && formData.bedrooms && formData.floors) {
      onPredict(formData as PredictionInput)
    }
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Sparkles className="h-5 w-5 text-primary" />
          Property Details
        </CardTitle>
        <CardDescription>
          Enter the property information to get an AI-powered price prediction
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="propertyType">Property Type</Label>
              <Select
                value={formData.propertyType}
                onValueChange={(value) => setFormData({ ...formData, propertyType: value })}
              >
                <SelectTrigger id="propertyType" className="bg-input">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {propertyTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="district">District</Label>
              <Select
                value={formData.district}
                onValueChange={(value) => setFormData({ ...formData, district: value })}
              >
                <SelectTrigger id="district" className="bg-input">
                  <SelectValue placeholder="Select district" />
                </SelectTrigger>
                <SelectContent>
                  {districts.map((district) => (
                    <SelectItem key={district} value={district}>
                      {district}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="area">Area (m²)</Label>
              <Input
                id="area"
                type="number"
                min={10}
                max={10000}
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: Number(e.target.value) })}
                className="bg-input"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bedrooms">Bedrooms</Label>
              <Input
                id="bedrooms"
                type="number"
                min={1}
                max={20}
                value={formData.bedrooms}
                onChange={(e) => setFormData({ ...formData, bedrooms: Number(e.target.value) })}
                className="bg-input"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="floors">Floors</Label>
              <Input
                id="floors"
                type="number"
                min={1}
                max={50}
                value={formData.floors}
                onChange={(e) => setFormData({ ...formData, floors: Number(e.target.value) })}
                className="bg-input"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="frontage">Frontage Width (m) - Optional</Label>
            <Input
              id="frontage"
              type="number"
              min={0}
              step={0.1}
              placeholder="e.g., 5.5"
              value={formData.frontage || ""}
              onChange={(e) => setFormData({ ...formData, frontage: e.target.value ? Number(e.target.value) : undefined })}
              className="bg-input"
            />
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full bg-primary hover:bg-primary/90"
            disabled={isLoading || !formData.propertyType || !formData.district}
          >
            {isLoading ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                Predicting...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                PREDICT PRICE
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
