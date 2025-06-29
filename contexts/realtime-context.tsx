"use client"
import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import { toast } from "sonner"

export interface Complaint {
  id: string
  reference_id: string
  name: string
  email: string
  phone: string
  title: string
  description: string
  department: string
  urgency: string
  location: string
  timestamp: string
  status: string
  ai_analysis?: {
    category: string
    priority: string
    department: string
    estimated_resolution_time: string
    similar_complaints: number
  }
}

export interface Notification {
  id: string
  title: string
  message: string
  type: "status_update" | "assignment" | "resolution" | "general"
  timestamp: string
  read: boolean
  complaintId?: string
  oldStatus?: string
  newStatus?: string
}

interface RealtimeContextType {
  complaints: Complaint[]
  notifications: Notification[]
  stats: {
    total: number
    resolved: number
    inProgress: number
    pending: number
  }
  addComplaint: (complaint: Complaint) => void
  updateComplaintStatus: (id: string, status: string) => void
  getComplaintById: (id: string) => Complaint | undefined
  getComplaintsByDepartment: (department: string) => Complaint[]
  getUrgentComplaints: () => Complaint[]
  addNotification: (notification: Omit<Notification, "id" | "timestamp" | "read">) => void
  markNotificationAsRead: (id: string) => void
  markAllNotificationsAsRead: () => void
  getUnreadNotificationCount: () => number
  clearOldNotifications: () => void
  removeDuplicateComplaints: () => void
}

const RealtimeContext = createContext<RealtimeContextType | undefined>(undefined)

export function RealtimeProvider({ children }: { children: ReactNode }) {
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])

  // Load data from localStorage on mount
  useEffect(() => {
    const savedComplaints = localStorage.getItem("humsafar_complaints")
    const savedNotifications = localStorage.getItem("humsafar_notifications")

    if (savedComplaints) {
      try {
        setComplaints(JSON.parse(savedComplaints))
      } catch (error) {
        console.error("Error loading complaints:", error)
      }
    }

    if (savedNotifications) {
      try {
        const parsed = JSON.parse(savedNotifications).map((n: any) => ({
          ...n,
          timestamp: new Date(n.timestamp).toISOString(),
        }))
        setNotifications(parsed)
      } catch (error) {
        console.error("Error loading notifications:", error)
      }
    }
  }, [])

  // Save complaints to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("humsafar_complaints", JSON.stringify(complaints))
  }, [complaints])

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("humsafar_notifications", JSON.stringify(notifications))
  }, [notifications])

  const addComplaint = useCallback((complaint: Complaint) => {
    setComplaints((prev) => {
      // Check for duplicates based on content similarity
      const isDuplicate = prev.some(
        (existing) =>
          existing.title.toLowerCase() === complaint.title.toLowerCase() &&
          existing.description.toLowerCase() === complaint.description.toLowerCase() &&
          existing.email === complaint.email &&
          Math.abs(new Date(existing.timestamp).getTime() - new Date(complaint.timestamp).getTime()) < 60000, // Within 1 minute
      )

      if (isDuplicate) {
        toast.error("Duplicate complaint detected", {
          description: "A similar complaint was already submitted recently.",
        })
        return prev
      }

      const newComplaints = [complaint, ...prev]

      // Add notification for new complaint
      const notification: Omit<Notification, "id" | "timestamp" | "read"> = {
        title: "Complaint Submitted",
        message: `Your complaint "${complaint.title}" has been submitted successfully.`,
        type: "general",
        complaintId: complaint.reference_id,
      }

      setNotifications((prevNotifications) => [
        {
          ...notification,
          id: Date.now().toString(),
          timestamp: new Date().toISOString(),
          read: false,
        },
        ...prevNotifications,
      ])

      return newComplaints
    })
  }, [])

  const updateComplaintStatus = useCallback((id: string, status: string) => {
    setComplaints((prev) =>
      prev.map((complaint) => {
        if (complaint.id === id || complaint.reference_id === id) {
          const oldStatus = complaint.status

          // Add notification for status change
          const notification: Omit<Notification, "id" | "timestamp" | "read"> = {
            title: "Status Updated",
            message: `Your complaint "${complaint.title}" status changed from ${oldStatus} to ${status}`,
            type: "status_update",
            complaintId: complaint.reference_id,
            oldStatus,
            newStatus: status,
          }

          setNotifications((prevNotifications) => [
            {
              ...notification,
              id: Date.now().toString(),
              timestamp: new Date().toISOString(),
              read: false,
            },
            ...prevNotifications,
          ])

          return { ...complaint, status }
        }
        return complaint
      }),
    )
  }, [])

  const getComplaintById = useCallback(
    (id: string) => {
      return complaints.find((complaint) => complaint.id === id || complaint.reference_id === id)
    },
    [complaints],
  )

  const getComplaintsByDepartment = useCallback(
    (department: string) => {
      return complaints.filter((complaint) => complaint.department.toLowerCase() === department.toLowerCase())
    },
    [complaints],
  )

  const getUrgentComplaints = useCallback(() => {
    return complaints.filter((complaint) => complaint.urgency === "High" && complaint.status !== "Resolved")
  }, [complaints])

  const addNotification = useCallback((notification: Omit<Notification, "id" | "timestamp" | "read">) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      read: false,
    }
    setNotifications((prev) => [newNotification, ...prev])
  }, [])

  const markNotificationAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }, [])

  const markAllNotificationsAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })))
  }, [])

  const getUnreadNotificationCount = useCallback(() => {
    return notifications.filter((n) => !n.read).length
  }, [notifications])

  const clearOldNotifications = useCallback(() => {
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

    setNotifications((prev) => prev.filter((notification) => new Date(notification.timestamp) > oneWeekAgo))
  }, [])

  const removeDuplicateComplaints = useCallback(() => {
    setComplaints((prev) => {
      const seen = new Set()
      return prev.filter((complaint) => {
        const key = `${complaint.title}-${complaint.email}-${complaint.description.substring(0, 50)}`
        if (seen.has(key)) {
          return false
        }
        seen.add(key)
        return true
      })
    })
  }, [])

  const stats = {
    total: complaints.length,
    resolved: complaints.filter((c) => c.status === "Resolved").length,
    inProgress: complaints.filter((c) => c.status === "In Progress").length,
    pending: complaints.filter((c) => c.status === "Pending").length,
  }

  const value: RealtimeContextType = {
    complaints,
    notifications,
    stats,
    addComplaint,
    updateComplaintStatus,
    getComplaintById,
    getComplaintsByDepartment,
    getUrgentComplaints,
    addNotification,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    getUnreadNotificationCount,
    clearOldNotifications,
    removeDuplicateComplaints,
  }

  return <RealtimeContext.Provider value={value}>{children}</RealtimeContext.Provider>
}

export function useRealtime() {
  const context = useContext(RealtimeContext)
  if (context === undefined) {
    throw new Error("useRealtime must be used within a RealtimeProvider")
  }
  return context
}
