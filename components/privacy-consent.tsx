"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { MapPin, Camera, Shield, AlertTriangle } from "lucide-react"

interface PrivacyConsentProps {
  isOpen: boolean
  type: "location" | "image"
  onAccept: () => void
  onDecline: () => void
  onClose: () => void
}

export function PrivacyConsent({ isOpen, type, onAccept, onDecline, onClose }: PrivacyConsentProps) {
  const isLocation = type === "location"

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-4">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                isLocation ? "bg-blue-100" : "bg-purple-100"
              }`}
            >
              {isLocation ? (
                <MapPin className="w-6 h-6 text-blue-600" />
              ) : (
                <Camera className="w-6 h-6 text-purple-600" />
              )}
            </div>
            <div>
              <DialogTitle className="text-lg font-semibold">
                {isLocation ? "Location Access" : "Camera Access"}
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-600">
                {isLocation
                  ? "We need your location to help route your complaint"
                  : "We need camera access to capture photos"}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-green-900 mb-1">Privacy Protected</h4>
                <p className="text-sm text-green-700">
                  {isLocation
                    ? "Your location data is only used to improve complaint routing and is not stored permanently."
                    : "Photos are processed locally and only uploaded with your explicit consent."}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900 mb-1">How We Use This</h4>
                <p className="text-sm text-blue-700">
                  {isLocation
                    ? "Location helps us identify the correct government department and provide accurate area-specific information."
                    : "Photos help officials better understand the issue and provide more effective solutions."}
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              onClick={onDecline}
              variant="outline"
              className="flex-1 bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
            >
              Not Now
            </Button>
            <Button
              onClick={onAccept}
              className={`flex-1 text-white ${
                isLocation ? "bg-blue-600 hover:bg-blue-700" : "bg-purple-600 hover:bg-purple-700"
              }`}
            >
              {isLocation ? "Allow Location" : "Allow Camera"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
