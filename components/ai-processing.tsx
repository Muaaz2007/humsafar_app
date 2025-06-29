"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Loader2, Brain, Zap, CheckCircle } from "lucide-react"

interface AIProcessingProps {
  onComplete: () => void
}

const processingSteps = [
  { id: 1, text: "Analyzing complaint content...", icon: Brain, duration: 2000 },
  { id: 2, text: "Categorizing department...", icon: Zap, duration: 1500 },
  { id: 3, text: "Determining urgency level...", icon: CheckCircle, duration: 1000 },
  { id: 4, text: "Generating summary...", icon: CheckCircle, duration: 1500 },
  { id: 5, text: "Finalizing analysis...", icon: CheckCircle, duration: 1000 },
]

export function AIProcessing({ onComplete }: AIProcessingProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let stepIndex = 0
    let progressValue = 0

    const processStep = () => {
      if (stepIndex < processingSteps.length) {
        setCurrentStep(stepIndex)

        const step = processingSteps[stepIndex]
        const stepProgress = (stepIndex + 1) * (100 / processingSteps.length)

        // Animate progress for this step
        const progressInterval = setInterval(() => {
          progressValue += 2
          setProgress(Math.min(progressValue, stepProgress))

          if (progressValue >= stepProgress) {
            clearInterval(progressInterval)
            stepIndex++

            if (stepIndex >= processingSteps.length) {
              // All steps complete, trigger completion
              setTimeout(() => {
                onComplete()
              }, 500)
            } else {
              // Move to next step
              setTimeout(processStep, 300)
            }
          }
        }, 50)
      }
    }

    // Start processing
    setTimeout(processStep, 500)
  }, [onComplete])

  const CurrentIcon = currentStep < processingSteps.length ? processingSteps[currentStep].icon : CheckCircle

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-teal-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
        <CardContent className="p-8">
          {/* AI Brain Animation */}
          <div className="text-center mb-8">
            <div className="relative w-24 h-24 mx-auto mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse opacity-20"></div>
              <div className="absolute inset-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Brain className="w-10 h-10 text-white animate-bounce" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full flex items-center justify-center animate-spin">
                <Zap className="w-3 h-3 text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">AI Analysis in Progress</h2>
            <p className="text-gray-600 text-sm">Our AI is analyzing your complaint using advanced algorithms</p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Processing...</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-3 bg-gray-100">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </Progress>
          </div>

          {/* Current Step */}
          <div className="space-y-4">
            {processingSteps.map((step, index) => (
              <div
                key={step.id}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
                  index === currentStep
                    ? "bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200"
                    : index < currentStep
                      ? "bg-green-50 border border-green-200"
                      : "bg-gray-50 border border-gray-200"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    index === currentStep
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                      : index < currentStep
                        ? "bg-green-500 text-white"
                        : "bg-gray-300 text-gray-600"
                  }`}
                >
                  {index === currentStep ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : index < currentStep ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <step.icon className="w-4 h-4" />
                  )}
                </div>
                <span
                  className={`text-sm font-medium ${
                    index === currentStep ? "text-blue-900" : index < currentStep ? "text-green-900" : "text-gray-600"
                  }`}
                >
                  {step.text}
                </span>
              </div>
            ))}
          </div>

          {/* AI Features */}
          <div className="mt-8 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-100">
            <h3 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
              <Zap className="w-4 h-4" />
              AI-Powered Analysis
            </h3>
            <ul className="text-sm text-purple-700 space-y-1">
              <li>• Smart department routing</li>
              <li>• Urgency level detection</li>
              <li>• Content summarization</li>
              <li>• Category classification</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
