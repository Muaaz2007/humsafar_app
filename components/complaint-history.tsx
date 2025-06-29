"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, MapPin, Building, Copy, ExternalLink } from "lucide-react"
import Link from "next/link"

interface HistoryItem {
  id: string
  summary: string
  location: string
  department: string
  status: "Sent" | "Processing" | "Resolved"
  date: string
  reference_id: string
}

export function ComplaintHistory() {
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [copied, setCopied] = useState<string | null>(null)

  useEffect(() => {
    const savedHistory = localStorage.getItem("complaintHistory")
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory))
      } catch (error) {
        console.error("Error loading complaint history:", error)
      }
    }
  }, [])

  const copyReferenceId = (refId: string) => {
    navigator.clipboard.writeText(refId)
    setCopied(refId)
    setTimeout(() => setCopied(null), 2000)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Resolved":
        return "bg-green-100 text-green-800 border-green-200"
      case "Processing":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "Sent":
        return "bg-orange-100 text-orange-800 border-orange-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  if (history.length === 0) {
    return null
  }

  return (
    <Card className="soft-card border-0 bg-white shadow-lg">
      <CardHeader className="pb-4 bg-gradient-to-br from-purple-50 to-indigo-50">
        <CardTitle className="flex items-center gap-2 text-slate-800 text-lg">
          <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
            <Clock className="w-3 h-3 text-white" />
          </div>
          Recent Complaints
        </CardTitle>
        <p className="text-slate-600 text-sm">Your last {history.length} submissions</p>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-3">
          {history.slice(0, 3).map((item) => (
            <div
              key={item.id}
              className="p-4 bg-slate-50 rounded-xl border border-slate-200 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-medium text-slate-800 text-sm mb-1">{item.summary}</h4>
                  <div className="flex items-center gap-3 text-xs text-slate-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span>{item.location.substring(0, 30)}...</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Building className="w-3 h-3" />
                      <span>{item.department}</span>
                    </div>
                  </div>
                </div>
                <Badge className={`${getStatusColor(item.status)} text-xs px-2 py-1 rounded-full border`}>
                  {item.status}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">ID: {item.reference_id}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyReferenceId(item.reference_id)}
                    className="h-6 w-6 p-0 hover:bg-slate-200"
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                  {copied === item.reference_id && <span className="text-xs text-green-600 font-medium">Copied!</span>}
                </div>
                <span className="text-xs text-slate-500">{item.date}</span>
              </div>
            </div>
          ))}
        </div>

        {history.length > 3 && (
          <div className="mt-4 text-center">
            <Link href="/my-complaints">
              <Button
                variant="outline"
                size="sm"
                className="bg-white border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View All Complaints
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
