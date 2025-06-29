"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import {
  Clock,
  CheckCircle,
  AlertTriangle,
  Search,
  Filter,
  Building2,
  Zap,
  TrendingUp,
  MessageSquare,
} from "lucide-react"
import { useRealtime } from "@/contexts/realtime-context"
import { AdminGuard } from "@/components/admin-guard"
import { NotificationSystem } from "@/components/notification-system"
import Image from "next/image"

const departments = [
  { id: "all", name: "All Departments", icon: Building2 },
  { id: "utilities", name: "Utilities", icon: Zap },
  { id: "transport", name: "Transport", icon: TrendingUp },
  { id: "infrastructure", name: "Infrastructure", icon: Building2 },
  { id: "safety", name: "Safety", icon: AlertTriangle },
]

export default function AdminDashboard() {
  const [mounted, setMounted] = useState(false)
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const { complaints, stats, updateComplaintStatus, getComplaintsByDepartment, getUrgentComplaints } = useRealtime()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  const filteredComplaints = complaints.filter((complaint) => {
    const matchesDepartment = selectedDepartment === "all" || complaint.department === selectedDepartment
    const matchesSearch =
      complaint.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.name?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || complaint.status === statusFilter

    return matchesDepartment && matchesSearch && matchesStatus
  })

  const urgentComplaints = getUrgentComplaints()

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Resolved":
        return "bg-green-100 text-green-800 border-green-200"
      case "In Progress":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "New":
        return "bg-orange-100 text-orange-800 border-orange-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "High":
        return "bg-red-100 text-red-800 border-red-200"
      case "Medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <AdminGuard>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-3">
                <Image
                  src="/humsafar-logo.png"
                  alt="HUMSAFAR Logo"
                  width={40}
                  height={40}
                  className="rounded-lg shadow-sm"
                />
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    HUMSAFAR Admin
                  </h1>
                  <p className="text-xs text-gray-500">Complaint Management Dashboard</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <NotificationSystem />
                <Button variant="outline" size="sm" onClick={() => (window.location.href = "/")}>
                  Back to Home
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Complaints</CardTitle>
                <MessageSquare className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                <p className="text-xs text-gray-500 mt-1">All submissions</p>
              </CardContent>
            </Card>

            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Resolved</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.resolved}</div>
                <p className="text-xs text-gray-500 mt-1">Completed cases</p>
              </CardContent>
            </Card>

            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">In Progress</CardTitle>
                <Clock className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
                <p className="text-xs text-gray-500 mt-1">Active cases</p>
              </CardContent>
            </Card>

            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Urgent</CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{urgentComplaints.length}</div>
                <p className="text-xs text-gray-500 mt-1">High priority</p>
              </CardContent>
            </Card>
          </div>

          {/* Urgent Complaints Alert */}
          {urgentComplaints.length > 0 && (
            <Card className="mb-8 bg-gradient-to-r from-red-50 to-orange-50 border-red-200">
              <CardHeader>
                <CardTitle className="text-red-800 flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  Urgent Complaints Requiring Immediate Attention
                </CardTitle>
                <CardDescription className="text-red-600">
                  {urgentComplaints.length} high-priority complaints need immediate action
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {urgentComplaints.slice(0, 3).map((complaint) => (
                    <div
                      key={complaint.id}
                      className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{complaint.title}</h4>
                        <p className="text-sm text-gray-600">
                          {complaint.department} • {complaint.location}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Submitted {new Date(complaint.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getUrgencyColor(complaint.urgency)}>{complaint.urgency}</Badge>
                        <Badge className={getStatusColor(complaint.status)}>{complaint.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Filters and Search */}
          <Card className="mb-8 bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Filter className="w-5 h-5 mr-2" />
                Filters & Search
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search complaints..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Select Department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Filter by Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="New">New</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Complaints List */}
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Complaints Management</CardTitle>
              <CardDescription>
                Showing {filteredComplaints.length} of {complaints.length} complaints
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredComplaints.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No complaints found matching your criteria.</p>
                  </div>
                ) : (
                  filteredComplaints.map((complaint) => (
                    <div
                      key={complaint.id}
                      className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{complaint.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{complaint.description}</p>
                          <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                            <span>ID: {complaint.reference_id || complaint.id}</span>
                            <span>Department: {complaint.department}</span>
                            <span>Location: {complaint.location}</span>
                            <span>Submitted: {new Date(complaint.timestamp).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          <div className="flex space-x-2">
                            <Badge className={getUrgencyColor(complaint.urgency)}>{complaint.urgency}</Badge>
                            <Badge className={getStatusColor(complaint.status)}>{complaint.status}</Badge>
                          </div>
                          <div className="flex space-x-2">
                            {complaint.status !== "In Progress" && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateComplaintStatus(complaint.id, "In Progress")}
                              >
                                Mark In Progress
                              </Button>
                            )}
                            {complaint.status !== "Resolved" && (
                              <Button size="sm" onClick={() => updateComplaintStatus(complaint.id, "Resolved")}>
                                Mark Resolved
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </AdminGuard>
  )
}
