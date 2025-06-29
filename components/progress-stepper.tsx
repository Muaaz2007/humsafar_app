"use client"

interface Step {
  id: number
  title: string
  description: string
}

interface ProgressStepperProps {
  currentStep: number
  steps: Step[]
}

export function ProgressStepper({ currentStep, steps }: ProgressStepperProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between relative">
        {/* Progress Line */}
        <div className="absolute top-6 left-0 right-0 h-0.5 bg-slate-200 -z-10">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500 ease-out"
            style={{
              width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
            }}
          />
        </div>

        {steps.map((step, index) => {
          const isActive = step.id === currentStep
          const isCompleted = step.id < currentStep
          const isUpcoming = step.id > currentStep

          return (
            <div key={step.id} className="flex flex-col items-center relative">
              {/* Step Circle */}
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                  isCompleted
                    ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg scale-110"
                    : isActive
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg scale-110 animate-pulse"
                      : "bg-slate-200 text-slate-500"
                }`}
              >
                {isCompleted ? "✓" : step.id}
              </div>

              {/* Step Content */}
              <div className="mt-3 text-center max-w-24">
                <h3
                  className={`text-xs font-semibold transition-colors duration-300 ${
                    isActive ? "text-blue-600" : isCompleted ? "text-green-600" : "text-slate-500"
                  }`}
                >
                  {step.title}
                </h3>
                <p
                  className={`text-xs mt-1 transition-colors duration-300 ${
                    isActive ? "text-slate-700" : "text-slate-500"
                  }`}
                >
                  {step.description}
                </p>
              </div>

              {/* Active Step Indicator */}
              {isActive && <div className="absolute -bottom-2 w-2 h-2 bg-blue-500 rounded-full animate-bounce" />}
            </div>
          )
        })}
      </div>
    </div>
  )
}
