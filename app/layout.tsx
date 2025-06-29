import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import "./animations.css"
import { ThemeProvider } from "@/components/theme-provider"
import { RealtimeProvider } from "@/contexts/realtime-context"
import { Toaster } from "sonner"
import { NotificationSystem } from "@/components/notification-system"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "HUMSAFAR - AI-Powered Complaint Management",
  description: "Submit and track your complaints with AI-powered analysis and routing",
  icons: {
    icon: "/humsafar-logo.png",
    shortcut: "/humsafar-logo.png",
    apple: "/humsafar-logo.png",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <RealtimeProvider>
            <div className="relative">
              {/* Notification System - positioned globally */}
              <div className="fixed top-4 right-4 z-50">
                <NotificationSystem />
              </div>
              {children}
            </div>
            <Toaster position="top-center" richColors />
          </RealtimeProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
