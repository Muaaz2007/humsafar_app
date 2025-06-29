import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    const requiredFields = ["name", "email", "phone", "title", "description", "department", "urgency", "location"]
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    // Generate reference ID
    const referenceId = `HMS${Date.now().toString().slice(-6)}${Math.random().toString(36).substring(2, 5).toUpperCase()}`

    // Create complaint object
    const complaint = {
      id: `complaint_${Date.now()}_${Math.random().toString(36).substring(2)}`,
      reference_id: referenceId,
      name: body.name,
      email: body.email,
      phone: body.phone,
      title: body.title,
      description: body.description,
      department: body.department,
      urgency: body.urgency,
      location: body.location,
      timestamp: new Date().toISOString(),
      status: "Pending",
      ai_analysis: {
        category: body.department,
        priority: body.urgency,
        department: body.department,
        estimated_resolution_time:
          body.urgency === "High" ? "24-48 hours" : body.urgency === "Medium" ? "3-5 days" : "1-2 weeks",
        similar_complaints: Math.floor(Math.random() * 10) + 1,
      },
    }

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Return success response
    return NextResponse.json({
      success: true,
      message: "Complaint submitted successfully",
      complaint,
      reference_id: referenceId,
    })
  } catch (error) {
    console.error("Error processing complaint:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
