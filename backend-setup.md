# HUMSAFAR Flask Backend Setup

## Installation

1. **Create Virtual Environment**
\`\`\`bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
\`\`\`

2. **Install Dependencies**
\`\`\`bash
pip install -r requirements.txt
\`\`\`

3. **Run the Backend**
\`\`\`bash
python hope.py
\`\`\`

## API Endpoints

### POST /submit
Submit a new complaint for AI processing

**Request:**
\`\`\`json
{
  "message": "Road is damaged near my area",
  "imageUrl": "data:image/jpeg;base64,/9j/4AAQ...", // Optional
  "location": "123 Main St, City"
}
\`\`\`

**Response:**
\`\`\`json
{
  "category": "Infrastructure",
  "department": "Public Works Department",
  "summary": "Complaint regarding infrastructure issue...",
  "urgency": "Medium",
  "reference_id": "HMS12345678"
}
\`\`\`

### GET /health
Check if the backend is running

## Integration with Frontend

The Next.js frontend automatically connects to `http://localhost:8000/submit` when you submit a complaint.

## Adding Real AI

Replace the `analyze_complaint_with_ai()` function with your actual AI processing logic:
- OpenAI GPT integration
- Custom ML models
- Image analysis
- Location-based routing
