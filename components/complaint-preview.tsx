"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, User, MessageSquare, Camera, Edit, Send, Loader2 } from "lucide-react"

interface ComplaintPreviewProps {
  formData: {
    name: string
    location: string
    complaint: string
    image: File | null
  }
  imagePreview: string | null
  onEdit: () => void
  onConfirm: () => void
  isSubmitting: boolean
}

export function ComplaintPreview({ formData, imagePreview, onEdit, onConfirm, isSubmitting }: ComplaintPreviewProps) {
  return (
    <Card className="soft-card border-0 bg-white transition-all duration-500 hover:shadow-xl animate-soft-slide-up">
      <CardHeader className="text-center pb-6 bg-gradient-to-br from-green-50 to-blue-50">
        <CardTitle className="text-2xl text-slate-800 font-bold mb-2">Review Your Complaint</CardTitle>
        <p className="text-slate-600 text-sm">Please review your details before submitting</p>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* Complaint Details */}
        <div className="space-y-4">
          {/* Name */}
          {formData.name && (
            <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-slate-800 mb-1">Your Name</h4>
                <p className="text-slate-600 text-sm">{formData.name}</p>
              </div>
            </div>
          )}

          {/* Location */}
          <div className="flex items-start gap-3 p-4 bg-green-50 rounded-xl border border-green-100">
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <MapPin className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-slate-800 mb-1">Location</h4>
              <p className="text-slate-600 text-sm">{formData.location}</p>
            </div>
          </div>

          {/* Complaint */}
          <div className="flex items-start gap-3 p-4 bg-orange-50 rounded-xl border border-orange-100">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <MessageSquare className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-slate-800 mb-1">Your Complaint</h4>
              <p className="text-slate-600 text-sm leading-relaxed">{formData.complaint}</p>
              <Badge className="mt-2 bg-orange-100 text-orange-800 text-xs">
                {formData.complaint.length} characters
              </Badge>
            </div>
          </div>

          {/* Image */}
          {imagePreview && (
            <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-xl border border-purple-100">
              <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <Camera className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-slate-800 mb-2">Attached Photo</h4>
                <img
                  src={imagePreview || "/placeholder.svg"}
                  alt="Complaint attachment"
                  className="w-full h-32 object-cover rounded-lg border border-purple-200"
                />
              </div>
            </div>
          )}
        </div>

        {/* AI Processing Notice */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs font-bold">AI</span>
            </div>
            <h4 className="font-medium text-slate-800">AI-Powered Processing</h4>
          </div>
          <p className="text-slate-600 text-sm">
            Our AI will analyze your complaint, categorize it, determine urgency level, and route it to the appropriate
            department automatically.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4">
          <Button
            onClick={onEdit}
            variant="outline"
            disabled={isSubmitting}
            className="flex-1 bg-white border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold py-4 rounded-2xl h-14 soft-button"
          >
            <Edit className="w-5 h-5 mr-2" />
            Edit Details
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isSubmitting}
            className="flex-1 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-semibold py-4 rounded-2xl transition-all duration-200 disabled:opacity-50 shadow-lg h-14 soft-button"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-3">
                <Loader2 className="w-5 h-5 animate-spin" />
                Submitting...
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Send className="w-5 h-5" />
                Submit Complaint
              </div>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
