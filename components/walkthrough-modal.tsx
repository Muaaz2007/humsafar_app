"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { X, ArrowRight, ArrowLeft, Zap, Shield, Target } from "lucide-react"

const walkthrough = [
  {
    title: "Welcome to HUMSAFAR! 👋",
    description: "Your smart companion for filing government complaints. We make it easy to get your voice heard.",
    icon: "👋",
    color: "from-blue-500 to-purple-600",
  },
  {
    title: "AI-Powered Routing 🤖",
    description: "Our AI analyzes your complaint and automatically routes it to the right government department.",
    icon: Zap,
    color: "from-green-500 to-teal-600",
  },
  {
    title: "Track Your Progress 📊",
    description: "Get reference numbers, status updates, and direct contact information for follow-ups.",
    icon: Target,
    color: "from-orange-500 to-red-600",
  },
  {
    title: "Secure & Private 🔒",
    description: "Your data is protected. We only use information to route your complaint effectively.",
    icon: Shield,
    color: "from-purple-500 to-pink-600",
  },
]

interface WalkthroughModalProps {
  isOpen: boolean
  onClose: () => void
}

export function WalkthroughModal({ isOpen, onClose }: WalkthroughModalProps) {
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0)
    }
  }, [isOpen])

  if (!isOpen) return null

  const current = walkthrough[currentStep]
  const Icon = typeof current.icon === "string" ? null : current.icon

  const handleNext = () => {
    if (currentStep < walkthrough.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onClose()
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-0 bg-white dark:bg-gray-800 rounded-3xl overflow-hidden animate-scale-up">
        <CardContent className="p-0">
          {/* Header */}
          <div className="relative p-6 text-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 p-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full"
            >
              <X className="w-4 h-4" />
            </Button>

            {/* Icon */}
            <div
              className={`w-20 h-20 mx-auto mb-4 bg-gradient-to-br ${current.color} rounded-3xl flex items-center justify-center shadow-lg`}
            >
              {Icon ? <Icon className="w-10 h-10 text-white" /> : <span className="text-3xl">{current.icon}</span>}
            </div>

            {/* Content */}
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">{current.title}</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{current.description}</p>
          </div>

          {/* Progress Dots */}
          <div className="flex justify-center gap-2 px-6 mb-6">
            {walkthrough.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentStep ? "bg-blue-500 w-6" : "bg-gray-300 dark:bg-gray-600"
                }`}
              />
            ))}
          </div>

          {/* Navigation */}
          <div className="flex gap-3 p-6 pt-0">
            {currentStep > 0 && (
              <Button
                variant="outline"
                onClick={handlePrev}
                className="flex-1 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-2xl h-12"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            )}
            <Button
              onClick={handleNext}
              className={`${currentStep === 0 ? "w-full" : "flex-1"} bg-gradient-to-r ${current.color} text-white font-semibold rounded-2xl h-12 shadow-lg`}
            >
              {currentStep === walkthrough.length - 1 ? (
                "Let's Get Started! 🚀"
              ) : (
                <>
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
