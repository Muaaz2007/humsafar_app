"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Shield, Eye, EyeOff, ArrowLeft } from "lucide-react"
import { useToast } from "@/components/enhanced-toast"
import Link from "next/link"

// Admin credentials (in real app, this would be handled by proper auth)
const ADMIN_CREDENTIALS = {
  username: "admin",
  password: "humsafar2024",
}

export default function AdminLogin() {
  const [credentials, setCredentials] = useState({ username: "", password: "" })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { showToast, ToastContainer } = useToast()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (credentials.username === ADMIN_CREDENTIALS.username && credentials.password === ADMIN_CREDENTIALS.password) {
      // Set admin session
      localStorage.setItem("isAdmin", "true")
      localStorage.setItem("adminLoginTime", Date.now().toString())

      showToast({
        message: "🎉 Welcome back, Admin!",
        type: "success",
      })

      setTimeout(() => {
        router.push("/admin")
      }, 1500)
    } else {
      showToast({
        message: "❌ Invalid credentials. Try again!",
        type: "error",
      })
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4 relative">
      {/* Back to Home Button */}
      <div className="absolute top-4 left-4 z-10">
        <Link
          href="/"
          className="w-10 h-10 md:w-12 md:h-12 bg-white dark:bg-gray-800 rounded-lg md:rounded-xl flex items-center justify-center shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
        >
          <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 text-gray-600 dark:text-gray-400" />
        </Link>
      </div>

      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 md:w-64 md:h-64 bg-orange-200/20 dark:bg-orange-800/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-32 h-32 md:w-64 md:h-64 bg-teal-200/20 dark:bg-teal-800/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="w-full max-w-sm md:max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-6 md:mb-8">
          <div className="w-16 h-16 md:w-20 md:h-20 mx-auto bg-white dark:bg-gray-800 rounded-2xl md:rounded-3xl flex items-center justify-center shadow-lg mb-3 md:mb-4 border-2 border-orange-200 dark:border-orange-800 overflow-hidden">
            <img
              src="/humsafar-logo.png"
              alt="HUMSAFAR"
              className="w-full h-full object-cover rounded-2xl md:rounded-3xl"
            />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-orange-600 to-teal-600 bg-clip-text text-transparent mb-2">
            Admin Portal
          </h1>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">Secure access to complaint management</p>
        </div>

        {/* Login Card */}
        <Card className="bg-white dark:bg-gray-800 border-0 shadow-2xl rounded-2xl md:rounded-3xl overflow-hidden">
          <CardHeader className="text-center pb-4 md:pb-6 bg-gradient-to-br from-orange-50 to-teal-50 dark:from-orange-900/20 dark:to-teal-900/20">
            <div className="w-12 h-12 md:w-16 md:h-16 mx-auto bg-gradient-to-br from-orange-500 to-red-600 rounded-xl md:rounded-2xl flex items-center justify-center mb-3 md:mb-4 shadow-lg">
              <Shield className="w-6 h-6 md:w-8 md:h-8 text-white" />
            </div>
            <CardTitle className="text-lg md:text-xl text-gray-900 dark:text-gray-100">Admin Login</CardTitle>
          </CardHeader>

          <CardContent className="p-4 md:p-8">
            <form onSubmit={handleLogin} className="space-y-4 md:space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-gray-700 dark:text-gray-300 font-medium text-sm md:text-base">
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  value={credentials.username}
                  onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                  className="h-10 md:h-12 rounded-lg md:rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 focus:bg-white dark:focus:bg-gray-800 transition-colors text-sm md:text-base"
                  placeholder="Enter admin username"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 dark:text-gray-300 font-medium text-sm md:text-base">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={credentials.password}
                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                    className="h-10 md:h-12 rounded-lg md:rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 focus:bg-white dark:focus:bg-gray-800 transition-colors pr-10 md:pr-12 text-sm md:text-base"
                    placeholder="Enter admin password"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-1 md:right-2 top-1 md:top-2 h-8 w-8 md:h-8 md:w-8 p-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showPassword ? (
                      <EyeOff className="w-3 h-3 md:w-4 md:h-4" />
                    ) : (
                      <Eye className="w-3 h-3 md:w-4 md:h-4" />
                    )}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-10 md:h-12 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-semibold rounded-lg md:rounded-xl shadow-lg text-sm md:text-base"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 md:w-4 md:h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Shield className="w-3 h-3 md:w-4 md:h-4" />
                    Sign In to Dashboard
                  </div>
                )}
              </Button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-4 md:mt-6 p-3 md:p-4 bg-gradient-to-r from-orange-50 to-teal-50 dark:from-orange-900/20 dark:to-teal-900/20 rounded-lg md:rounded-xl border border-orange-200 dark:border-orange-800">
              <p className="text-xs text-orange-700 dark:text-orange-300 font-medium mb-1 md:mb-2">Demo Credentials:</p>
              <p className="text-xs text-orange-600 dark:text-orange-400 mb-1">
                Username:{" "}
                <code className="bg-white dark:bg-gray-800 px-1 md:px-2 py-0.5 md:py-1 rounded text-xs">admin</code>
              </p>
              <p className="text-xs text-orange-600 dark:text-orange-400">
                Password:{" "}
                <code className="bg-white dark:bg-gray-800 px-1 md:px-2 py-0.5 md:py-1 rounded text-xs">
                  humsafar2024
                </code>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Back to User Portal */}
        <div className="text-center mt-4 md:mt-6">
          <Link href="/">
            <Button
              variant="ghost"
              className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 text-sm md:text-base"
            >
              ← Back to Home
            </Button>
          </Link>
        </div>
      </div>

      <ToastContainer />
    </div>
  )
}
