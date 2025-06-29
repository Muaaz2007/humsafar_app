"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, TrendingUp, Clock } from "lucide-react"

interface ImpactEstimationProps {
  complaint: string
  location: string
  department: string
}

export default function ImpactEstimation({ complaint, location, department }: ImpactEstimationProps) {
  // Simple impact calculation based on keywords and department
  const calculateImpact = () => {
    const complaintLower = complaint.toLowerCase()
    let impactScore = 1
    let affectedPeople = 50

    // High impact keywords
    if (complaintLower.includes("road") || complaintLower.includes("traffic") || complaintLower.includes("signal")) {
      impactScore = 3
      affectedPeople = 500
    } else if (
      complaintLower.includes("water") ||
      complaintLower.includes("electricity") ||
      complaintLower.includes("power")
    ) {
      impactScore = 3
      affectedPeople = 300
    } else if (
      complaintLower.includes("safety") ||
      complaintLower.includes("security") ||
      complaintLower.includes("light")
    ) {
      impactScore = 2
      affectedPeople = 200
    } else if (
      complaintLower.includes("garbage") ||
      complaintLower.includes("noise") ||
      complaintLower.includes("pollution")
    ) {
      impactScore = 2
      affectedPeople = 150
    }

    // Adjust based on location keywords
    if (
      location.toLowerCase().includes("market") ||
      location.toLowerCase().includes("main") ||
      location.toLowerCase().includes("central")
    ) {
      affectedPeople *= 2
      impactScore = Math.min(impactScore + 1, 3)
    }

    return {
      level: impactScore === 1 ? "Low" : impactScore === 2 ? "Medium" : "High",
      people: affectedPeople,
      timeframe: impactScore === 1 ? "1-2 weeks" : impactScore === 2 ? "3-7 days" : "1-3 days",
    }
  }

  const impact = calculateImpact()

  const impactColors = {
    Low: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    Medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    High: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  }

  const impactEmojis = {
    Low: "🟢",
    Medium: "🟡",
    High: "🔴",
  }

  return (
    <Card className="border-0 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">Impact Assessment</h3>
              <Badge className={`${impactColors[impact.level]} text-xs px-2 py-0.5 rounded-lg`}>
                {impactEmojis[impact.level]} {impact.level} Impact
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">People Affected</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{impact.people}+</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Expected Action</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{impact.timeframe}</p>
                </div>
              </div>
            </div>

            <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-3 font-medium">
              💪 Your complaint can help improve life for {impact.people}+ people in your area!
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
