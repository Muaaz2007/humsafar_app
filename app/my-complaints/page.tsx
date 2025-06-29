"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Search, Filter, Download } from "lucide-react"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import { ComplaintHistory } from "@/components/complaint-history"
import { useRealtime } from "@/contexts/realtime-context"

export default function MyComplaints() {
  const { complaints, stats } = useRealtime()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")

  const filteredComplaints = complaints.filter((complaint) => {
    const matchesSearch =
      complaint.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.reference_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.location.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter = filterStatus === "all" || complaint.status.toLowerCase() === filterStatus.toLowerCase()

    return matchesSearch && matchesFilter
  })

  const exportComplaints = () => {
    const csvContent = [
      ["Reference ID", "Summary", "Status", "Department", "Location", "Created Date"],
      ...filteredComplaints.map((c) => [
        c.reference_id,
        c.summary,
        c.status,
        c.department,
        c.location,
        new Date(c.created_at).toLocaleDateString(),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `my-complaints-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 md:mb-8 pt-4 gap-4">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-white dark:bg-gray-800 rounded-lg md:rounded-xl flex items-center justify-center shadow-lg overflow-hidden">
              <img
                src="/humsafar-logo.png"
                alt="HUMSAFAR"
                className="w-full h-full object-cover rounded-lg md:rounded-xl"
              />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">My Complaints</h1>
              <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">Track and manage your submissions</p>
            </div>
          </div>
          <div className="flex items-center gap-2 md:gap-4 w-full sm:w-auto">
            <Link href="/complaint" className="flex-1 sm:flex-none">
              <Button
                variant="outline"
                className="w-full sm:w-auto bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg md:rounded-xl text-xs md:text-sm h-8 md:h-10"
              >
                ➕ New Complaint
              </Button>
            </Link>
            <Link href="/" className="flex-1 sm:flex-none">
              <Button
                variant="outline"
                className="w-full sm:w-auto bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg md:rounded-xl text-xs md:text-sm h-8 md:h-10"
              >
                <ArrowLeft className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                Home
              </Button>
            </Link>
            <ThemeToggle />
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
          <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg rounded-xl md:rounded-2xl">
            <CardContent className="p-4 md:p-6">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                  {stats.total}
                </div>
                <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400">Total</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg rounded-xl md:rounded-2xl">
            <CardContent className="p-4 md:p-6">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-yellow-600 dark:text-yellow-400 mb-1">
                  {stats.inProgress}
                </div>
                <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400">In Progress</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg rounded-xl md:rounded-2xl">
            <CardContent className="p-4 md:p-6">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-green-600 dark:text-green-400 mb-1">
                  {stats.resolved}
                </div>
                <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400">Resolved</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg rounded-xl md:rounded-2xl">
            <CardContent className="p-4 md:p-6">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">{stats.new}</div>
                <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400">New</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg rounded-2xl mb-6 md:mb-8">
          <CardHeader>
            <CardTitle className="text-lg md:text-xl font-bold text-gray-900 dark:text-gray-100">
              🔍 Search & Filter
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search by reference ID, summary, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 rounded-xl h-12"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="new">New</option>
                  <option value="in progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                </select>
                <Button
                  onClick={exportComplaints}
                  variant="outline"
                  className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl px-4"
                  disabled={filteredComplaints.length === 0}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>

            {searchTerm || filterStatus !== "all" ? (
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Filter className="w-4 h-4" />
                <span>
                  Showing {filteredComplaints.length} of {complaints.length} complaints
                </span>
                {(searchTerm || filterStatus !== "all") && (
                  <Button
                    onClick={() => {
                      setSearchTerm("")
                      setFilterStatus("all")
                    }}
                    variant="ghost"
                    size="sm"
                    className="text-blue-600 hover:text-blue-700 p-1 h-auto"
                  >
                    Clear filters
                  </Button>
                )}
              </div>
            ) : null}
          </CardContent>
        </Card>

        {/* Complaints List */}
        <ComplaintHistory showActions={true} />
      </div>
    </div>
  )
}
