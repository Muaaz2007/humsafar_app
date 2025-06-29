"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, CheckCircle, AlertCircle, Info, Zap } from "lucide-react"

interface ToastProps {
  message: string
  type: "success" | "error" | "info" | "smart"
  emoji?: string
  action?: {
    label: string
    onClick: () => void
  }
  duration?: number
  onClose: () => void
}

export function EnhancedToast({ message, type, emoji, action, duration = 4000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onClose, 300) // Wait for animation
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  const typeConfig = {
    success: {
      icon: CheckCircle,
      bgColor: "bg-green-500",
      textColor: "text-white",
      emoji: emoji || "✨",
      message: "✨ Yay! That worked!",
      animation: "animate-bounce",
    },
    error: {
      icon: AlertCircle,
      bgColor: "bg-red-500",
      textColor: "text-white",
      emoji: emoji || "😅",
      message: "😅 Oops, something went wrong",
      animation: "animate-pulse",
    },
    info: {
      icon: Info,
      bgColor: "bg-blue-500",
      textColor: "text-white",
      emoji: emoji || "💡",
      message: "💡 Just so you know...",
      animation: "",
    },
    smart: {
      icon: Zap,
      bgColor: "bg-gradient-to-r from-purple-500 to-pink-500",
      textColor: "text-white",
      emoji: emoji || "🤖",
      message: "🤖 AI says...",
      animation: "",
    },
  }

  const config = typeConfig[type]
  const Icon = config.icon

  return (
    <div
      className={`fixed top-4 right-4 z-50 transition-all duration-300 ${
        isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      } ${config.animation}`}
    >
      <Card className={`${config.bgColor} border-0 shadow-2xl rounded-2xl overflow-hidden min-w-80 max-w-sm`}>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="flex items-center gap-2 flex-1">
              <span className="text-lg">{config.emoji}</span>
              <div className="flex-1">
                <p className={`${config.textColor} text-sm font-medium leading-relaxed`}>{message || config.message}</p>
                {action && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={action.onClick}
                    className={`${config.textColor} hover:bg-white/20 mt-2 h-8 px-3 rounded-lg text-xs`}
                  >
                    {action.label}
                  </Button>
                )}
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setIsVisible(false)
                setTimeout(onClose, 300)
              }}
              className={`${config.textColor} hover:bg-white/20 w-6 h-6 p-0 rounded-full flex-shrink-0`}
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Toast Manager Hook
export function useToast() {
  const [toasts, setToasts] = useState<Array<ToastProps & { id: string }>>([])

  const showToast = (toast: Omit<ToastProps, "onClose">) => {
    const id = Date.now().toString()
    setToasts((prev) => [...prev, { ...toast, id, onClose: () => removeToast(id) }])
  }

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  const ToastContainer = () => (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <EnhancedToast key={toast.id} {...toast} />
      ))}
    </div>
  )

  return { showToast, ToastContainer }
}
