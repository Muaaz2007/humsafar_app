"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  ArrowLeft,
  MapPin,
  User,
  MessageSquare,
  Camera,
  X,
  Upload,
  Navigation,
  Loader2,
  ArrowRight,
} from "lucide-react"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import { ProgressStepper } from "@/components/progress-stepper"
import { ComplaintPreview } from "@/components/complaint-preview"
import { ComplaintHistory } from "@/components/complaint-history"
import { AIProcessing } from "@/components/ai-processing"
import { SmartSuggestions } from "@/components/smart-suggestions"
import { PrivacyConsent } from "@/components/privacy-consent"
import ImpactEstimation from "@/components/impact-estimation"
import { useToast } from "@/components/enhanced-toast"
import { useRealtime } from "@/contexts/realtime-context"
import Image from "next/image"

const popularLocations = [
  "Connaught Place, Central Delhi, New Delhi, 110001",
  "Marine Drive, Nariman Point, Mumbai, Maharashtra, 400021",
  "MG Road, Shivaji Nagar, Bangalore, Karnataka, 560001",
  "Park Street, Park Street Area, Kolkata, West Bengal, 700016",
  "Anna Salai, Mount Road, Chennai, Tamil Nadu, 600002",
  "Sector 17, Chandigarh, Punjab, 160017",
  "MI Road, Jaipur, Rajasthan, 302001",
  "FC Road, Shivajinagar, Pune, Maharashtra, 411005",
  "CG Road, Navrangpura, Ahmedabad, Gujarat, 380009",
  "Hazratganj, Lucknow, Uttar Pradesh, 226001",
]

const steps = [
  { id: 1, title: "🗣️ Spill the Tea", description: "Tell us what's wrong" },
  { id: 2, title: "📍 Drop the Deets", description: "Location & photo" },
  { id: 3, title: "✨ Make It Official", description: "Confirm details" },
]

// Mock address database based on coordinate ranges
const mockAddressByRegion = {
  delhi: [
    "123 Rajpath, India Gate, New Delhi, 110001",
    "456 Karol Bagh Market, Karol Bagh, New Delhi, 110005",
    "789 Lajpat Nagar Central Market, New Delhi, 110024",
    "321 Sarojini Nagar Market, New Delhi, 110023",
    "654 Janpath, Connaught Place, New Delhi, 110001",
  ],
  mumbai: [
    "234 Linking Road, Bandra West, Mumbai, 400050",
    "567 Hill Road, Bandra West, Mumbai, 400050",
    "890 SV Road, Andheri West, Mumbai, 400058",
    "432 Carter Road, Bandra West, Mumbai, 400050",
    "765 Juhu Beach Road, Juhu, Mumbai, 400049",
  ],
  bangalore: [
    "345 Brigade Road, Shivaji Nagar, Bangalore, 560001",
    "678 Commercial Street, Shivaji Nagar, Bangalore, 560001",
    "901 Koramangala 5th Block, Bangalore, 560095",
    "543 Indiranagar 100 Feet Road, Bangalore, 560038",
    "876 Jayanagar 4th Block, Bangalore, 560011",
  ],
  kolkata: [
    "456 Park Street, Park Street Area, Kolkata, 700016",
    "789 Camac Street, Park Street Area, Kolkata, 700017",
    "123 Gariahat Road, Gariahat, Kolkata, 700019",
    "654 Rashbehari Avenue, Kolkata, 700029",
    "987 Salt Lake Sector V, Kolkata, 700091",
  ],
  chennai: [
    "567 Anna Salai, Mount Road, Chennai, 600002",
    "890 T. Nagar Pondy Bazaar, Chennai, 600017",
    "234 Adyar Main Road, Chennai, 600020",
    "765 Velachery Main Road, Chennai, 600042",
    "432 OMR Thoraipakkam, Chennai, 600097",
  ],
  default: [
    "123 Main Road, City Center, Your City, 110001",
    "456 Market Street, Commercial Area, Your City, 110002",
    "789 Park Avenue, Residential Area, Your City, 110003",
    "321 Station Road, Railway Colony, Your City, 110004",
    "654 Bus Stand Road, Transport Nagar, Your City, 110005",
  ],
}

export default function ComplaintForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    complaint: "",
    image: null as File | null,
  })
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isGettingLocation, setIsGettingLocation] = useState(false)
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false)
  const [filteredLocations, setFilteredLocations] = useState<string[]>([])
  const [showProcessing, setShowProcessing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const [showLocationConsent, setShowLocationConsent] = useState(false)
  const [showImageConsent, setShowImageConsent] = useState(false)
  const { showToast, ToastContainer } = useToast()
  const { addComplaint } = useRealtime()

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setFormData({ ...formData, location: value })

    if (value.length > 0) {
      const filtered = popularLocations.filter((location) => location.toLowerCase().includes(value.toLowerCase()))
      setFilteredLocations(filtered)
      setShowLocationSuggestions(true)
    } else {
      setShowLocationSuggestions(false)
    }
  }

  const selectLocation = (location: string) => {
    setFormData({ ...formData, location })
    setShowLocationSuggestions(false)
  }

  const getRegionFromCoordinates = (lat: number, lng: number): string => {
    if (lat >= 28.4 && lat <= 28.9 && lng >= 76.8 && lng <= 77.5) return "delhi"
    if (lat >= 18.9 && lat <= 19.3 && lng >= 72.7 && lng <= 73.1) return "mumbai"
    if (lat >= 12.8 && lat <= 13.2 && lng >= 77.4 && lng <= 77.8) return "bangalore"
    if (lat >= 22.4 && lat <= 22.7 && lng >= 88.2 && lng <= 88.5) return "kolkata"
    if (lat >= 12.8 && lat <= 13.2 && lng >= 80.1 && lng <= 80.4) return "chennai"
    return "default"
  }

  const getMockAddress = (lat: number, lng: number): string => {
    const region = getRegionFromCoordinates(lat, lng)
    const addresses = mockAddressByRegion[region as keyof typeof mockAddressByRegion]
    return addresses[Math.floor(Math.random() * addresses.length)]
  }

  const getCurrentLocation = () => {
    setShowLocationConsent(true)
  }

  const handleLocationConsent = () => {
    setShowLocationConsent(false)
    if (!navigator.geolocation) {
      showToast({ message: "❌ Geolocation not supported", type: "error" })
      return
    }

    setIsGettingLocation(true)

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords

        try {
          let address = ""

          try {
            const nominatimResponse = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`,
              {
                headers: {
                  "User-Agent": "HUMSAFAR-App/1.0",
                },
              },
            )

            if (nominatimResponse.ok) {
              const nominatimData = await nominatimResponse.json()
              if (nominatimData && nominatimData.address) {
                const addr = nominatimData.address
                let formattedAddress = ""

                if (addr.house_number) formattedAddress += addr.house_number + " "
                if (addr.road) formattedAddress += addr.road + ", "
                if (addr.neighbourhood || addr.suburb) formattedAddress += (addr.neighbourhood || addr.suburb) + ", "
                if (addr.city || addr.town || addr.village)
                  formattedAddress += (addr.city || addr.town || addr.village) + ", "
                if (addr.state) formattedAddress += addr.state + ", "
                if (addr.postcode) formattedAddress += addr.postcode

                address = formattedAddress.replace(/,\s*$/, "")
              }
            }
          } catch (nominatimError) {
            console.log("Nominatim failed, trying fallback...")
          }

          if (!address) {
            address = getMockAddress(latitude, longitude)
          }

          setFormData({ ...formData, location: address })
          showToast({ message: "📍 Location detected successfully!", type: "success" })
        } catch (error) {
          console.error("All geocoding services failed:", error)
          const fallbackAddress = getMockAddress(latitude, longitude)
          setFormData({ ...formData, location: fallbackAddress })
        } finally {
          setIsGettingLocation(false)
        }
      },
      (error) => {
        console.error("Geolocation error:", error)
        setIsGettingLocation(false)

        let errorMessage = "Unable to get your location. "
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage += "Please allow location access and try again."
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage += "Location information is unavailable."
            break
          case error.TIMEOUT:
            errorMessage += "Location request timed out."
            break
          default:
            errorMessage += "Please enter your location manually."
            break
        }
        showToast({ message: errorMessage, type: "error" })
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 300000,
      },
    )
  }

  const handleImageUpload = () => {
    setShowImageConsent(true)
  }

  const handleImageConsent = () => {
    setShowImageConsent(false)
    fileInputRef.current?.click()
  }

  const handleImageUploadInner = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData({ ...formData, image: file })
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
      showToast({ message: "📸 Photo uploaded!", type: "success" })
    }
  }

  const removeImage = () => {
    setFormData({ ...formData, image: null })
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleNext = () => {
    if (currentStep === 1 && !formData.complaint.trim()) {
      showToast({ message: "❌ Please fill all required fields", type: "error" })
      return
    }
    if (currentStep === 2 && !formData.location) {
      showToast({ message: "❌ Please fill all required fields", type: "error" })
      return
    }
    setCurrentStep(currentStep + 1)
  }

  const handleBack = () => {
    setCurrentStep(currentStep - 1)
  }

  const handleSubmit = async () => {
    if (!formData.complaint.trim() || !formData.location) {
      showToast({ message: "❌ Please fill all required fields", type: "error" })
      return
    }

    setIsSubmitting(true)
    setShowProcessing(true)
  }

  const handleProcessingComplete = async () => {
    try {
      // Prepare the request body for Flask backend
      const requestBody = {
        message: formData.complaint,
        imageUrl: imagePreview || "",
        location: formData.location,
      }

      console.log("Sending request to Flask backend:", requestBody)

      const response = await fetch("http://localhost:8000/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      console.log("Flask backend response:", result)

      // Validate required fields from Flask response
      if (!result.category || !result.department || !result.summary || !result.urgency) {
        throw new Error("Invalid response from server - missing required fields")
      }

      // Generate reference ID if not provided
      const referenceId = result.reference_id || `${result.department.substring(0, 3).toUpperCase()}-${Date.now()}`

      // Create complaint object for real-time context
      const complaint = {
        id: Date.now().toString(),
        reference_id: referenceId,
        name: formData.name || "Anonymous",
        email: "user@example.com", // Default email since not collected in form
        phone: "",
        title: result.summary,
        description: formData.complaint,
        department: result.department,
        urgency: result.urgency,
        location: formData.location,
        timestamp: new Date().toISOString(),
        status: "New",
        ai_analysis: {
          category: result.category,
          priority: result.urgency,
          department: result.department,
          estimated_resolution_time: "3-5 business days",
          similar_complaints: 0,
        },
      }

      // Add to real-time context
      addComplaint(complaint)

      // Store in complaint history
      const historyItem = {
        id: complaint.id,
        summary: result.summary,
        location: formData.location,
        department: result.department,
        status: "Sent" as const,
        date: new Date().toLocaleDateString("en-IN"),
        reference_id: referenceId,
      }

      const existingHistory = JSON.parse(localStorage.getItem("complaintHistory") || "[]")
      const newHistory = [historyItem, ...existingHistory].slice(0, 10)
      localStorage.setItem("complaintHistory", JSON.stringify(newHistory))

      // Store result for result page
      sessionStorage.setItem(
        "complaintResult",
        JSON.stringify({
          status: "success",
          department: result.department,
          reference_id: referenceId,
          category: result.category,
          summary: result.summary,
          urgency: result.urgency,
          estimated_resolution: "3-5 business days",
          contact_number: "1800-111-7070",
        }),
      )

      showToast({ message: "✅ Complaint analyzed and submitted successfully!", type: "success" })

      // Navigate to result page
      setTimeout(() => {
        router.push("/result")
      }, 1000)
    } catch (error) {
      console.error("Error submitting complaint:", error)
      setShowProcessing(false)
      setIsSubmitting(false)

      let errorMessage = "❌ Failed to submit complaint. "
      if (error instanceof Error) {
        if (error.message.includes("fetch")) {
          errorMessage += "Please make sure the backend server is running on localhost:8000"
        } else {
          errorMessage += error.message
        }
      } else {
        errorMessage += "Please try again later."
      }

      showToast({
        message: errorMessage,
        type: "error",
      })
    }
  }

  if (showProcessing) {
    return <AIProcessing onComplete={handleProcessingComplete} />
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4">
      <div className="max-w-md mx-auto">
        {/* Header with logo and theme toggle */}
        <div className="flex items-center justify-between mb-8 pt-4">
          <Link
            href="/"
            className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-200 hover:shadow-md transition-all duration-300 soft-card"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors duration-300 hover:scale-105"
            >
              My Dashboard
            </Link>
            <div className="flex items-center gap-2">
              <Image src="/humsafar-logo.png" alt="HUMSAFAR" width={32} height={32} className="rounded-full" />
              <h1 className="text-xl font-bold text-slate-800">File Complaint</h1>
            </div>
          </div>
          <ThemeToggle />
        </div>

        {/* Progress Stepper */}
        <ProgressStepper currentStep={currentStep} steps={steps} />

        {/* Step 3: Preview */}
        {currentStep === 3 && (
          <ComplaintPreview
            formData={formData}
            imagePreview={imagePreview}
            onEdit={() => setCurrentStep(2)}
            onConfirm={handleSubmit}
            isSubmitting={isSubmitting}
          />
        )}

        {/* Steps 1 & 2: Form */}
        {currentStep < 3 && (
          <Card className="soft-card border-0 bg-white transition-all duration-500 hover:shadow-xl animate-soft-slide-up">
            <CardHeader className="text-center pb-6 bg-gradient-to-br from-blue-50 to-purple-50">
              <CardTitle className="text-2xl text-slate-800 font-bold mb-2">
                {currentStep === 1 ? "What's the Issue?" : "Add More Details"}
              </CardTitle>
              <p className="text-slate-600 text-sm">
                {currentStep === 1
                  ? "Describe your concern in detail"
                  : "Help us locate and understand the problem better"}
              </p>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
              {/* Step 1: Complaint Description */}
              {currentStep === 1 && (
                <div className="space-y-6 animate-soft-slide-up">
                  <div className="space-y-2">
                    <Label htmlFor="complaint" className="flex items-center gap-2 text-slate-700 font-medium text-sm">
                      <div className="w-5 h-5 bg-soft-orange rounded-lg flex items-center justify-center">
                        <MessageSquare className="w-3 h-3 text-soft-orange" />
                      </div>
                      Describe Your Complaint *
                    </Label>
                    <Textarea
                      id="complaint"
                      placeholder="Please describe the issue in detail. What exactly is the problem? When did you notice it? How is it affecting you or others?"
                      value={formData.complaint}
                      onChange={(e) => setFormData({ ...formData, complaint: e.target.value })}
                      className="min-h-32 border-slate-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl bg-slate-50 focus:bg-white transition-colors resize-none soft-card"
                      maxLength={1000}
                      required
                    />
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">The more details you provide, the better we can help</span>
                      <span className="text-slate-400">{formData.complaint.length}/1000</span>
                    </div>
                  </div>

                  {formData.complaint.length > 10 && (
                    <div className="mt-4">
                      <SmartSuggestions complaint={formData.complaint} />
                    </div>
                  )}

                  <Button
                    onClick={handleNext}
                    disabled={!formData.complaint.trim()}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-4 rounded-2xl transition-all duration-200 disabled:opacity-50 shadow-lg h-14 text-base soft-button"
                  >
                    <div className="flex items-center gap-3">
                      Let's Go! 🚀
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </Button>
                </div>
              )}

              {/* Step 2: Details */}
              {currentStep === 2 && (
                <div className="space-y-6 animate-soft-slide-up">
                  {/* Name Field */}
                  <div className="space-y-2">
                    <Label htmlFor="name" className="flex items-center gap-2 text-slate-700 font-medium text-sm">
                      <div className="w-5 h-5 bg-soft-blue rounded-lg flex items-center justify-center">
                        <User className="w-3 h-3 text-soft-blue" />
                      </div>
                      Your Name (Optional)
                    </Label>
                    <Input
                      id="name"
                      placeholder="Enter your name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="border-slate-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl h-12 bg-slate-50 focus:bg-white transition-colors soft-card"
                    />
                  </div>

                  {/* Location Field */}
                  <div className="space-y-2 relative">
                    <Label htmlFor="location" className="flex items-center gap-2 text-slate-700 font-medium text-sm">
                      <div className="w-5 h-5 bg-soft-mint rounded-lg flex items-center justify-center">
                        <MapPin className="w-3 h-3 text-soft-mint" />
                      </div>
                      Location / Area Name *
                    </Label>
                    <div className="relative">
                      <Input
                        id="location"
                        placeholder="Start typing your location..."
                        value={formData.location}
                        onChange={handleLocationChange}
                        onFocus={() => {
                          if (formData.location.length > 0) {
                            setShowLocationSuggestions(true)
                          }
                        }}
                        onBlur={() => {
                          setTimeout(() => setShowLocationSuggestions(false), 200)
                        }}
                        className="border-slate-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl h-12 bg-slate-50 focus:bg-white transition-colors pr-12 soft-card"
                        required
                      />
                      <Button
                        type="button"
                        onClick={getCurrentLocation}
                        disabled={isGettingLocation}
                        className="absolute right-2 top-2 h-8 w-8 p-0 bg-soft-blue text-soft-blue hover:bg-blue-200 rounded-lg disabled:opacity-50 soft-button"
                      >
                        {isGettingLocation ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Navigation className="w-4 h-4" />
                        )}
                      </Button>
                    </div>

                    {/* Location Suggestions */}
                    {showLocationSuggestions && filteredLocations.length > 0 && (
                      <div className="absolute z-10 w-full bg-white border border-slate-200 rounded-xl shadow-lg mt-1 max-h-48 overflow-y-auto soft-card">
                        {filteredLocations.map((location, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => selectLocation(location)}
                            className="w-full text-left px-4 py-3 hover:bg-slate-50 text-sm text-slate-700 border-b border-slate-100 last:border-b-0"
                          >
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-slate-400" />
                              {location}
                            </div>
                          </button>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <p className="text-xs text-slate-500">
                        {isGettingLocation ? "Getting your location..." : "Popular locations or use GPS"}
                      </p>
                      {!isGettingLocation && (
                        <Button
                          type="button"
                          onClick={() => {
                            setFilteredLocations(popularLocations)
                            setShowLocationSuggestions(true)
                          }}
                          className="text-xs text-blue-600 hover:text-blue-700 p-0 h-auto bg-transparent hover:bg-transparent"
                        >
                          Show popular
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Image Upload */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-slate-700 font-medium text-sm">
                      <div className="w-5 h-5 bg-soft-purple rounded-lg flex items-center justify-center">
                        <Camera className="w-3 h-3 text-soft-purple" />
                      </div>
                      Upload Photo (Optional)
                    </Label>

                    {!imagePreview ? (
                      <div
                        onClick={handleImageUpload}
                        className="border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-all bg-slate-50 soft-card"
                      >
                        <div className="w-12 h-12 bg-soft-blue rounded-xl flex items-center justify-center mx-auto mb-3">
                          <Upload className="w-6 h-6 text-soft-blue" />
                        </div>
                        <p className="text-slate-700 font-medium mb-1">Click to upload a photo</p>
                        <p className="text-xs text-slate-500">Show us the problem - it helps us understand better</p>
                      </div>
                    ) : (
                      <div className="relative">
                        <img
                          src={imagePreview || "/placeholder.svg"}
                          alt="Uploaded complaint"
                          className="w-full h-48 object-cover rounded-2xl border border-slate-200"
                        />
                        <Button
                          type="button"
                          onClick={removeImage}
                          className="absolute top-3 right-3 w-8 h-8 p-0 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg soft-button"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    )}

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUploadInner}
                      className="hidden"
                    />
                  </div>

                  {/* Navigation Buttons */}
                  <div className="flex gap-4 pt-4">
                    <Button
                      onClick={handleBack}
                      variant="outline"
                      className="flex-1 bg-white border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold py-4 rounded-2xl h-14 soft-button"
                    >
                      ⬅️ Go Back
                    </Button>
                    <Button
                      onClick={handleNext}
                      disabled={!formData.location}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-4 rounded-2xl transition-all duration-200 disabled:opacity-50 shadow-lg h-14 soft-button"
                    >
                      <div className="flex items-center gap-3">
                        👀 Check It Out
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Complaint History */}
        {currentStep === 1 && (
          <div className="mt-6">
            <ComplaintHistory />
          </div>
        )}

        {currentStep === 3 && formData.complaint && formData.location && (
          <div className="mb-6">
            <ImpactEstimation complaint={formData.complaint} location={formData.location} department="Auto-detected" />
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-6 p-4 bg-white rounded-2xl shadow-sm border border-slate-200 soft-card">
          <p className="text-xs text-slate-600">
            🔒 Your complaint will be processed securely and routed to the appropriate department
          </p>
        </div>

        {/* Privacy Consent Modals */}
        <PrivacyConsent
          isOpen={showLocationConsent}
          type="location"
          onAccept={handleLocationConsent}
          onDecline={() => setShowLocationConsent(false)}
          onClose={() => setShowLocationConsent(false)}
        />

        <PrivacyConsent
          isOpen={showImageConsent}
          type="image"
          onAccept={handleImageConsent}
          onDecline={() => setShowImageConsent(false)}
          onClose={() => setShowImageConsent(false)}
        />

        {/* Toast Container */}
        <ToastContainer />
      </div>
    </div>
  )
}
