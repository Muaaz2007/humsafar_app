"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, User, FileText, CheckCircle, XCircle, Clock, TrendingUp, AlertTriangle, Phone } from "lucide-react"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"

interface DashboardComplaint {
  id: string
  summary: string
  location: string
  department: string
  status: "Sent" | "Processing" | "Resolved" | "Rejected"
  date: string
  reference_id: string
  rejection_reason?: string
}

// Mock dashboard data with rejected complaints
const mockDashboardData = [
  {
    id: "1",
    summary: "Traffic signal not working at main intersection causing accidents during rush hour",
    location: "Main Market Road, Commercial District",
    department: "Transport",
    status: "Resolved" as const,
    date: "2024-01-15",
    reference_id: "TRA-1234",
  },
  {
    id: "2",
    summary: "Street lights not working in residential area making it unsafe at night",
    location: "Green Park Colony, Sector 12",
    department: "Safety",
    status: "Processing" as const,
    date: "2024-01-18",
    reference_id: "SAF-5678",
  },
  {
    id: "3",
    summary: "Water supply disrupted for 3 days in apartment complex",
    location: "Sunrise Apartments, Block A",
    department: "Utilities",
    status: "Sent" as const,
    date: "2024-01-20",
    reference_id: "UTI-9012",
  },
  {
    id: "4",
    summary: "Pothole on main road needs immediate repair",
    location: "MG Road, Near City Mall",
    department: "Infrastructure",
    status: "Rejected" as const,
    date: "2024-01-12",
    reference_id: "INF-3456",
    rejection_reason:
      "Rate Limiting: Too many complaints submitted from this device in a short time. Please wait 24 hours before submitting new complaints to prevent system overload.",
  },
  {
    id: "5",
    summary: "Issue with private bank ATM not dispensing cash properly",
    location: "HDFC Bank ATM, Commercial Street",
    department: "General",
    status: "Rejected" as const,
    date: "2024-01-10",
    reference_id: "GEN-7890",
    rejection_reason:
      "Out of Jurisdiction: We currently only handle civic issues in your city. Private bank issues should be reported directly to the bank's customer service or RBI banking ombudsman.",
  },
]

export default function UserDashboard() {
  const [complaints, setComplaints] = useState<DashboardComplaint[]>([])
  const [stats, setStats] = useState({
    total: 0,
    resolved: 0,
    processing: 0,
    sent: 0,
    rejected: 0,
  })

  useEffect(() => {
    // Combine real complaints from localStorage with mock data
    const storedComplaints = JSON.parse(localStorage.getItem("complaintHistory") || "[]")
    const allComplaints = [...mockDashboardData, ...storedComplaints]

    setComplaints(allComplaints)

    // Calculate stats
    const newStats = {
      total: allComplaints.length,
      resolved: allComplaints.filter((c) => c.status === "Resolved").length,
      processing: allComplaints.filter((c) => c.status === "Processing").length,
      sent: allComplaints.filter((c) => c.status === "Sent").length,
      rejected: allComplaints.filter((c) => c.status === "Rejected").length,
    }
    setStats(newStats)
  }, [])

  const statusColors = {
    Sent: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    Processing: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
    Resolved: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    Rejected: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  }

  const statusIcons = {
    Sent: Clock,
    Processing: TrendingUp,
    Resolved: CheckCircle,
    Rejected: XCircle,
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 pt-4">
          <Link
            href="/complaint"
            className="w-12 h-12 bg-white dark:bg-gray-800 rounded-xl flex items-center justify-center shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">My Dashboard</h1>
          <ThemeToggle />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg rounded-2xl">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mx-auto mb-2">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.total}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Total</p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg rounded-2xl">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mx-auto mb-2">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.resolved}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Resolved</p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg rounded-2xl">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl flex items-center justify-center mx-auto mb-2">
                <TrendingUp className="w-6 h-6 text-yellow-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.processing}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Processing</p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg rounded-2xl">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mx-auto mb-2">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.sent}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Pending</p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg rounded-2xl">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center mx-auto mb-2">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.rejected}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Rejected</p>
            </CardContent>
          </Card>
        </div>

        {/* User Info */}
        <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg rounded-3xl mb-8">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl text-gray-900 dark:text-gray-100">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-teal-600 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              Welcome back, Citizen!
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-4">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Account Status</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">✅ Verified Citizen</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">📍 Location Services: Enabled</p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-4">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Success Rate</h3>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {stats.total > 0 ? Math.round(((stats.resolved + stats.processing) / stats.total) * 100) : 0}%
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Complaints Accepted</p>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 rounded-2xl p-4">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Impact Score</h3>
                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {stats.resolved * 100 + stats.processing * 50}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Community Points</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Complaints List */}
        <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg rounded-3xl">
          <CardHeader>
            <CardTitle className="text-xl text-gray-900 dark:text-gray-100">All Complaints</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {complaints.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">No Complaints Yet</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">Start by filing your first complaint</p>
                <Link href="/complaint">
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl">
                    File New Complaint
                  </Button>
                </Link>
              </div>
            ) : (
              complaints.map((complaint) => {
                const StatusIcon = statusIcons[complaint.status]
                return (
                  <div
                    key={complaint.id}
                    className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-6 border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge className={`${statusColors[complaint.status]} text-xs px-3 py-1 rounded-lg`}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {complaint.status}
                          </Badge>
                          <span className="text-xs text-gray-500 dark:text-gray-400">{complaint.department}</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">•</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">{complaint.date}</span>
                        </div>
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 leading-tight">
                          {complaint.summary}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">📍 {complaint.location}</p>

                        {/* Rejection Reason */}
                        {complaint.status === "Rejected" && complaint.rejection_reason && (
                          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mt-3">
                            <div className="flex items-start gap-3">
                              <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                              <div>
                                <h4 className="font-semibold text-red-900 dark:text-red-100 text-sm mb-1">
                                  Rejection Reason
                                </h4>
                                <p className="text-sm text-red-700 dark:text-red-300 leading-relaxed">
                                  {complaint.rejection_reason}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-4">
                        <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                          ID: {complaint.reference_id}
                        </span>
                        {complaint.status === "Processing" && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 text-xs bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg"
                          >
                            <Phone className="w-3 h-3 mr-1" />
                            Contact Dept
                          </Button>
                        )}
                      </div>

                      {complaint.status === "Resolved" && (
                        <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-xs font-medium">Completed</span>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-8">
          <Link href="/complaint" className="flex-1">
            <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 rounded-2xl shadow-lg h-14">
              File New Complaint
            </Button>
          </Link>
          <Link href="/" className="flex-1">
            <Button
              variant="outline"
              className="w-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-semibold py-4 rounded-2xl h-14"
            >
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
