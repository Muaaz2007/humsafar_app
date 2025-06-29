"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Lightbulb, Sparkles } from "lucide-react"

interface SmartSuggestionsProps {
  complaint: string
}

export function SmartSuggestions({ complaint }: SmartSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [category, setCategory] = useState<string>("")

  useEffect(() => {
    // Simple keyword-based suggestions
    const text = complaint.toLowerCase()
    let detectedCategory = ""
    let suggestionList: string[] = []

    if (text.includes("water") || text.includes("leak") || text.includes("pipe")) {
      detectedCategory = "Water & Utilities"
      suggestionList = [
        "Include the exact location of the water issue",
        "Mention if it's affecting multiple households",
        "Note the duration of the problem",
        "Add photos if possible",
      ]
    } else if (text.includes("road") || text.includes("pothole") || text.includes("traffic")) {
      detectedCategory = "Roads & Traffic"
      suggestionList = [
        "Specify the exact road name or landmark",
        "Mention peak hours when issue is worst",
        "Include safety concerns if any",
        "Note if it affects public transport",
      ]
    } else if (text.includes("garbage") || text.includes("waste") || text.includes("clean")) {
      detectedCategory = "Sanitation & Cleanliness"
      suggestionList = [
        "Mention the frequency of the issue",
        "Include health concerns if any",
        "Specify the type of waste",
        "Note if it attracts pests",
      ]
    } else if (text.includes("light") || text.includes("electricity") || text.includes("power")) {
      detectedCategory = "Electricity & Lighting"
      suggestionList = [
        "Mention specific pole numbers if visible",
        "Include timing when lights should work",
        "Note safety concerns in the area",
        "Specify if it's street or area lighting",
      ]
    } else {
      detectedCategory = "General Issue"
      suggestionList = [
        "Be as specific as possible about the location",
        "Include when the problem started",
        "Mention how it affects daily life",
        "Add any relevant photos",
      ]
    }

    setCategory(detectedCategory)
    setSuggestions(suggestionList)
  }, [complaint])

  if (suggestions.length === 0) return null

  return (
    <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200 soft-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-orange-800 text-sm">
          <div className="w-6 h-6 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
            <Lightbulb className="w-3 h-3 text-white" />
          </div>
          Smart Suggestions
          <Badge className="bg-orange-100 text-orange-700 text-xs px-2 py-0.5">
            <Sparkles className="w-3 h-3 mr-1" />
            AI Detected: {category}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-orange-700 text-xs mb-3 font-medium">
          💡 To help us resolve your issue faster, consider adding:
        </p>
        <ul className="space-y-2">
          {suggestions.map((suggestion, index) => (
            <li key={index} className="flex items-start gap-2 text-xs text-orange-800">
              <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-1.5 flex-shrink-0" />
              <span>{suggestion}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
