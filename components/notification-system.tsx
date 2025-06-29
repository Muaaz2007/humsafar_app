"use client"

import { useState, useEffect } from "react"
import { Bell, X, CheckCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { useRealtime } from "@/contexts/realtime-context"
import { cn } from "@/lib/utils"

export function NotificationSystem() {
  const [isOpen, setIsOpen] = useState(false)
  const [hasCleanedOldNotifications, setHasCleanedOldNotifications] = useState(false)
  const {
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    getUnreadNotificationCount,
    clearOldNotifications,
  } = useRealtime()

  const unreadCount = getUnreadNotificationCount()

  // Clear old notifications only once on mount
  useEffect(() => {
    if (!hasCleanedOldNotifications) {
      clearOldNotifications()
      setHasCleanedOldNotifications(true)
    }
  }, [clearOldNotifications, hasCleanedOldNotifications])

  const handleNotificationClick = (notificationId: string) => {
    markNotificationAsRead(notificationId)
  }

  const handleMarkAllAsRead = () => {
    markAllNotificationsAsRead()
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "resolved":
        return "✅"
      case "urgent":
        return "🚨"
      case "admin_response":
        return "💬"
      default:
        return "📋"
    }
  }

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="relative h-9 w-9 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-red-500 text-white text-xs">
            {unreadCount > 9 ? "9+" : unreadCount}
          </Badge>
        )}
      </Button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />

          {/* Notification Panel */}
          <Card className="absolute right-0 top-12 w-80 max-h-96 overflow-hidden z-50 shadow-lg border">
            <div className="p-4 border-b bg-gray-50 dark:bg-gray-800">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm">Notifications</h3>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <Button variant="ghost" size="sm" onClick={handleMarkAllAsRead} className="h-7 px-2 text-xs">
                      <CheckCheck className="h-3 w-3 mr-1" />
                      Mark all read
                    </Button>
                  )}
                  <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-7 w-7">
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                  <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No notifications yet</p>
                </div>
              ) : (
                <div className="divide-y">
                  {notifications.slice(0, 10).map((notification) => (
                    <div
                      key={notification.id}
                      className={cn(
                        "p-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors",
                        !notification.read && "bg-blue-50 dark:bg-blue-900/20",
                      )}
                      onClick={() => handleNotificationClick(notification.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-lg">{getNotificationIcon(notification.type)}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium text-sm truncate">{notification.title}</p>
                            {!notification.read && <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />}
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <p className="text-xs text-gray-500">
                              {new Date(notification.timestamp).toLocaleDateString()} at{" "}
                              {new Date(notification.timestamp).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                            {notification.oldStatus && notification.newStatus && (
                              <Badge variant="outline" className="text-xs">
                                {notification.oldStatus} → {notification.newStatus}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {notifications.length > 10 && (
              <div className="p-3 border-t bg-gray-50 dark:bg-gray-800 text-center">
                <p className="text-xs text-gray-500">Showing 10 of {notifications.length} notifications</p>
              </div>
            )}
          </Card>
        </>
      )}
    </div>
  )
}
