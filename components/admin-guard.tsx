"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Shield, Loader2 } from "lucide-react"

interface AdminGuardProps {
  children: React.ReactNode
}

export function AdminGuard({ children }: AdminGuardProps) {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)
  const router = useRouter()

  useEffect(() => {
    const checkAdminStatus = () => {
      const adminStatus = localStorage.getItem("isAdmin")
      const loginTime = localStorage.getItem("adminLoginTime")

      if (adminStatus === "true" && loginTime) {
        // Check if session is still valid (24 hours)
        const now = Date.now()
        const loginTimestamp = Number.parseInt(loginTime)
        const sessionDuration = 24 * 60 * 60 * 1000 // 24 hours

        if (now - loginTimestamp < sessionDuration) {
          setIsAdmin(true)
        } else {
          // Session expired
          localStorage.removeItem("isAdmin")
          localStorage.removeItem("adminLoginTime")
          setIsAdmin(false)
        }
      } else {
        setIsAdmin(false)
      }
    }

    checkAdminStatus()
  }, [])

  useEffect(() => {
    if (isAdmin === false) {
      router.push("/admin/login")
    }
  }, [isAdmin, router])

  if (isAdmin === null) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Card className="soft-card">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-4 text-slate-600" />
            <p className="text-slate-600">Verifying admin access...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isAdmin === false) {
    return null // Will redirect to login
  }

  return <>{children}</>
}
