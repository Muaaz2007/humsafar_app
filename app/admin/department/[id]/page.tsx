"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  ArrowLeft,
  Search,
  MapPin,
  Clock,
  User,
  Camera,
  AlertTriangle,
  CheckCircle,
  Building,
  Truck,
  Shield,
  Zap,
  Menu,
  X,
} from "lucide-react"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import { AdminGuard } from "@/components/admin-guard"
import { useRealtime } from "@/contexts/realtime-context"

const departmentInfo = {
  infrastructure: { name: "Infrastructure", icon: Building, color: "from-orange-500 to-red-500" },
  transport: { name: "Transport", icon: Truck, color: "from-blue-500 to-cyan-500" },
  safety: { name: "Safety", icon: Shield, color: "from-red-500 to-pink-500" },
  utilities: { name: "Utilities", icon: Zap, color: "from-green-500 to-emerald-500" },
  general: { name: "General", icon: AlertTriangle, color: "from-purple-500 to-indigo-500" },
}

function DepartmentComplaintsContent() {
  const params = useParams()
  const departmentId = params.id as string
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("All")
  const [showSidebar, setShowSidebar] = useState(false)

  const { getComplaintsByDepartment, updateComplaint, getUrgentComplaints } = useRealtime()
  const complaints = getComplaintsByDepartment(departmentId)
  const urgentComplaints = getUrgentComplaints().filter(
    (c) => c.department.toLowerCase() === departmentId.toLowerCase(),
  )

  const department = departmentInfo[departmentId as keyof typeof departmentInfo]
  if (!department) return <div>Department not found</div>

  const Icon = department.icon

  const urgencyColors = {
    High: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800",
    Medium:
      "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800",
    Low: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800",
  }

  const statusColors = {
    New: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    "In Progress": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
    Resolved: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    Rejected: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  }

  const handleStatusChange = (complaintId: string, newStatus: string) => {
    updateComplaint(complaintId, { status: newStatus as any })
  }

  const filteredComplaints = complaints.filter((complaint) => {
    const matchesSearch =
      complaint.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === "All" || complaint.status === filterStatus
    return matchesSearch && matchesFilter
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </Link>
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 bg-gradient-to-br ${department.color} rounded-lg flex items-center justify-center`}
              >
                <Icon className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">{department.name}</h1>
                <p className="text-xs text-gray-600 dark:text-gray-400">{complaints.length} complaints</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSidebar(!showSidebar)}
              className="lg:hidden w-10 h-10 p-0"
            >
              {showSidebar ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Main Content */}
        <div className="flex-1 p-4">
          <div className="max-w-4xl mx-auto">
            {/* Desktop Header */}
            <div className="hidden lg:flex items-center justify-between mb-8 pt-4">
              <div className="flex items-center gap-4">
                <Link
                  href="/admin"
                  className="w-12 h-12 bg-white dark:bg-gray-800 rounded-xl flex items-center justify-center shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </Link>
                <div
                  className={`w-16 h-16 bg-gradient-to-br ${department.color} rounded-2xl flex items-center justify-center shadow-lg`}
                >
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{department.name} Department</h1>
                  <p className="text-gray-600 dark:text-gray-400">{complaints.length} total complaints</p>
                </div>
              </div>
              <ThemeToggle />
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="🔍 Search complaints..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl h-10 text-sm"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-300 text-sm min-w-32"
              >
                <option value="All">All Status</option>
                <option value="New">New</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            {/* Complaints List */}
            <div className="space-y-4">
              {filteredComplaints.map((complaint, index) => (
                <Card
                  key={complaint.id}
                  className="bg-white dark:bg-gray-800 border-0 shadow-lg rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-500 animate-slide-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-4">
                    <div className="flex flex-col lg:flex-row gap-4">
                      {/* Photo Thumbnail */}
                      <div className="flex-shrink-0 lg:w-20 lg:h-20">
                        {complaint.hasPhoto ? (
                          <div className="w-full h-32 lg:w-20 lg:h-20 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600">
                            <img
                              src={complaint.photoUrl || "/placeholder.svg?height=96&width=96"}
                              alt="Complaint evidence"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-full h-32 lg:w-20 lg:h-20 rounded-xl bg-gray-100 dark:bg-gray-700 border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center">
                            <Camera className="w-6 h-6 lg:w-8 lg:h-8 text-gray-400" />
                          </div>
                        )}
                      </div>

                      {/* Complaint Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <Badge
                                className={`${urgencyColors[complaint.urgency as keyof typeof urgencyColors]} px-2 py-1 rounded-lg border text-xs`}
                              >
                                {complaint.urgency === "High" && "🔴"}
                                {complaint.urgency === "Medium" && "🟡"}
                                {complaint.urgency === "Low" && "🟢"}
                                {complaint.urgency}
                              </Badge>
                              <Badge
                                className={`${statusColors[complaint.status as keyof typeof statusColors]} px-2 py-1 rounded-lg text-xs`}
                              >
                                {complaint.status}
                              </Badge>
                              <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">{complaint.id}</span>
                            </div>
                            <h3 className="text-base lg:text-lg font-bold text-gray-900 dark:text-gray-100 mb-2 leading-tight break-words">
                              {complaint.summary}
                            </h3>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs lg:text-sm text-gray-600 dark:text-gray-400 mb-3">
                              <div className="flex items-center gap-1 min-w-0">
                                <MapPin className="w-3 h-3 lg:w-4 lg:h-4 flex-shrink-0" />
                                <span className="truncate">{complaint.location}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3 lg:w-4 lg:h-4" />
                                {complaint.timeReported}
                              </div>
                              <div className="flex items-center gap-1">
                                <User className="w-3 h-3 lg:w-4 lg:h-4" />
                                {complaint.userName}
                              </div>
                            </div>
                            {complaint.urgencyReason && (
                              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3 mb-3">
                                <div className="flex items-start gap-2">
                                  <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                                  <div className="min-w-0">
                                    <p className="text-xs lg:text-sm font-semibold text-red-900 dark:text-red-100">
                                      Urgency Reason:
                                    </p>
                                    <p className="text-xs lg:text-sm text-red-700 dark:text-red-300 break-words">
                                      {complaint.urgencyReason}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                          <Button
                            size="sm"
                            onClick={() => handleStatusChange(complaint.id, "In Progress")}
                            className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white hover:shadow-lg transition-all duration-300 rounded-xl text-xs h-8"
                          >
                            🚀 Start Working
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleStatusChange(complaint.id, "Resolved")}
                            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-lg transition-all duration-300 rounded-xl text-xs h-8"
                          >
                            ✅ Mark Resolved
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleStatusChange(complaint.id, "Rejected")}
                            variant="outline"
                            className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20 rounded-xl text-xs h-8"
                          >
                            🚨 Reject
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 rounded-xl bg-transparent text-xs h-8"
                          >
                            👀 Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Urgent Complaints Sidebar - Mobile Overlay */}
        <div
          className={`${
            showSidebar ? "translate-x-0" : "translate-x-full"
          } lg:translate-x-0 fixed lg:relative top-0 right-0 w-80 lg:w-72 xl:w-80 h-full bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 p-4 lg:p-6 overflow-y-auto z-50 transition-transform duration-300 ease-in-out`}
        >
          {/* Mobile Close Button */}
          <div className="lg:hidden flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Urgent Complaints</h2>
            <Button variant="ghost" size="sm" onClick={() => setShowSidebar(false)} className="w-8 h-8 p-0">
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="hidden lg:block sticky top-0">
            <h2 className="text-lg xl:text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 lg:mb-6 flex items-center gap-2">
              🚨 Urgent Complaints
              <Badge className="bg-red-500 text-white px-2 py-1 rounded-full text-xs">{urgentComplaints.length}</Badge>
            </h2>

            <div className="space-y-3 lg:space-y-4">
              {urgentComplaints.map((complaint) => (
                <Card
                  key={complaint.id}
                  className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl lg:rounded-2xl"
                >
                  <CardContent className="p-3 lg:p-4">
                    <div className="flex items-start gap-2 lg:gap-3 mb-2 lg:mb-3">
                      <AlertTriangle className="w-4 h-4 lg:w-5 lg:h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-red-900 dark:text-red-100 text-xs lg:text-sm mb-1 break-words">
                          {complaint.summary}
                        </h4>
                        <p className="text-xs text-red-700 dark:text-red-300 mb-1 lg:mb-2 break-words">
                          📍 {complaint.location}
                        </p>
                        {complaint.urgencyReason && (
                          <p className="text-xs text-red-600 dark:text-red-400 mb-2 lg:mb-3 break-words">
                            {complaint.urgencyReason}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-1 lg:gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleStatusChange(complaint.id, "Resolved")}
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white text-xs rounded-lg h-7 lg:h-8"
                      >
                        ✅ Resolve
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleStatusChange(complaint.id, "Rejected")}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white text-xs rounded-lg h-7 lg:h-8"
                      >
                        🚨 Reject
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {urgentComplaints.length === 0 && (
                <div className="text-center py-6 lg:py-8">
                  <div className="w-12 h-12 lg:w-16 lg:h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-3 lg:mb-4">
                    <CheckCircle className="w-6 h-6 lg:w-8 lg:h-8 text-green-600 dark:text-green-400" />
                  </div>
                  <p className="text-xs lg:text-sm text-gray-600 dark:text-gray-400">
                    🎉 No urgent complaints!
                    <br />
                    Great job keeping up!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Overlay Background */}
        {showSidebar && (
          <div className="lg:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setShowSidebar(false)} />
        )}
      </div>

      <style jsx>{`
        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-slide-in {
          animation: slide-in 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  )
}

export default function DepartmentComplaints() {
  return (
    <AdminGuard>
      <DepartmentComplaintsContent />
    </AdminGuard>
  )
}
