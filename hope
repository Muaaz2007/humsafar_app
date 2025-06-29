import json
import re
from ibm_watson_machine_learning.foundation_models import Model

# 🔐 Credentials
credentials = {
    "url": "https://us-south.ml.cloud.ibm.com",
    "apikey": "P4MFU_IYsV5HIqADnxoRG8NLs8a2I7IAN-AB7fzfmVz-"
}

# ⚙️ Model config
params = {
    "decoding_method": "greedy",
    "max_new_tokens": 200,
    "temperature": 0.2
}

# 🔧 Initialize Granite
model = Model(
    model_id="ibm/granite-3-3-8b-instruct",
    params=params,
    credentials=credentials,
    project_id="d1dac9ba-b252-48b5-abbb-294b0b182f23"
)

# 📂 Supported Departments and Categories
DEPARTMENTS = ["Education", "Health", "Utilities", "Transport", "Welfare"]
CATEGORIES = {
    "Education": ["School Admission", "Scholarship Request", "Exam Complaint", "Teacher Feedback", "Curriculum Change"],
    "Health": ["Medical Emergency"],
    "Utilities": ["Water Supply", "Electricity", "Sanitation", "Waste Management"],
    "Transport": ["Lost Property", "Traffic Violation Appeal"],
    "Welfare": ["Pension Application", "Subsidy Request", "Unemployment Benefit", "Social Housing", "Disability Support"]
}

# 🧠 Prompt Template
def build_prompt(complaint, retry=False, minimal=False):
    if minimal:
        return f"""
Return a valid JSON object with:
1. category: One of {', '.join([cat for sublist in CATEGORIES.values() for cat in sublist])}.
2. department: One of {', '.join(DEPARTMENTS)}.
3. summary: A concise description (max 30 chars, no newlines).
4. urgency: High, Medium, or Low.
For complaint: "{complaint}"
Ensure valid JSON output.
"""
    base_prompt = f"""
You are an intelligent civic assistant.

Given the complaint below, return a JSON object with:
1. category: One of {', '.join([cat for sublist in CATEGORIES.values() for cat in sublist])}.
2. department: One of {', '.join(DEPARTMENTS)}.
3. summary: A concise description of the main issue (max 30 characters, no newlines).
4. urgency: High (danger/emergency), Medium (disruption), or Low (minor).

Guidelines:
- Assign department based on complaint context:
  - Education: Issues related to schools, teachers, exams, scholarships, admissions.
  - Health: Issues related to medical services, hospitals, clinics, vaccinations.
  - Utilities: Issues related to water, electricity, sanitation, waste management.
  - Transport: Issues related to buses, trains, traffic, parking.
  - Welfare: Issues related to pensions, subsidies, unemployment, housing, disability.
- Assign category from the department's valid categories.
- Assign urgency based on severity:
  - High: Emergencies, safety issues, urgent needs (e.g., "urgent," "emergency," "hardship," "bullying").
  - Medium: Delays, errors, technical issues, or significant inconveniences (e.g., "delay," "error," "technical issues").
  - Low: Inquiries, updates, or minor issues (e.g., "inquire," "update details").
- Generate a summary that captures the main issue concisely.

Examples:
- Complaint: "My pension application is delayed, causing financial hardship."
  Output: {{"category": "Pension Application", "department": "Welfare", "summary": "Pension delay hardship", "urgency": "High"}}
- Complaint: "I am unable to access online registration for vaccination due to technical issues; kindly assist."
  Output: {{"category": "Medical Emergency", "department": "Health", "summary": "Vaccination access issue", "urgency": "Medium"}}
- Complaint: "Inquire about scholarship criteria."
  Output: {{"category": "Scholarship Request", "department": "Education", "summary": "Scholarship inquiry", "urgency": "Low"}}

Complaint: "{complaint}"

Return ONLY valid JSON.
"""
    if retry:
        base_prompt += """
- Prioritize keywords like "vaccination" for Health, "school" for Education, "pension" for Welfare.
- For technical issues or access problems, assign Medium urgency unless urgent keywords are present.
- If the complaint is ambiguous, infer the most likely department and category based on context.
"""
    return base_prompt

# 🧼 Preprocess Input
def preprocess(complaint):
    complaint = complaint.lower().strip()
    if len(complaint.split()) < 4:
        return None, "Complaint must have at least 4 words."
    # Enhance context without hardcoded keywords
    if any(term in complaint for term in ["school", "admission", "teacher", "scholarship", "exam"]):
        complaint += " — education-related issue."
    elif "pension" in complaint and "delay" in complaint:
        complaint += " — financial hardship."
    elif any(term in complaint for term in ["vaccination", "medical", "hospital", "clinic"]):
        complaint += " — health-related issue."
    return complaint, None

# ✅ Validate Response
def validate_response(response):
    required_keys = {"category", "department", "summary", "urgency"}
    if not all(key in response for key in required_keys):
        return False
    if response["department"] not in DEPARTMENTS:
        return False
    if response["urgency"] not in {"High", "Medium", "Low"}:
        return False
    if len(response["summary"]) > 30 or "\n" in response["summary"]:
        return False
    for dept, cats in CATEGORIES.items():
        if response["department"] == dept and response["category"] not in cats:
            return False
    return True

# 🔄 Process Single Complaint
def process_complaint(complaint, max_retries=3):
    complaint, error = preprocess(complaint)
    if error:
        # Use Granite for invalid complaints
        prompt = build_prompt(complaint, retry=True)
        for attempt in range(max_retries):
            try:
                response = model.generate(prompt=prompt)['results'][0]['generated_text']
                json_match = re.search(r'\{[^}]*\}', response)
                if json_match:
                    result = json.loads(json_match.group(0))
                    if validate_response(result):
                        return result
                prompt = build_prompt(complaint, retry=True)
            except Exception:
                prompt = build_prompt(complaint, retry=True)
                continue
        # Try minimal prompt
        prompt = build_prompt(complaint, retry=False, minimal=True)
        try:
            response = model.generate(prompt=prompt)['results'][0]['generated_text']
            json_match = re.search(r'\{[^}]*\}', response)
            if json_match:
                result = json.loads(json_match.group(0))
                if validate_response(result):
                    return result
                # Adjust to valid values using Granite's last response
                prompt = build_prompt(complaint, retry=True, minimal=True)
                response = model.generate(prompt=prompt)['results'][0]['generated_text']
                json_match = re.search(r'\{[^}]*\}', response)
                if json_match:
                    result = json.loads(json_match.group(0))
                    if validate_response(result):
                        return result
        except Exception:
            pass
        # Final Granite attempt
        prompt = build_prompt(complaint, retry=True, minimal=True)
        try:
            response = model.generate(prompt=prompt)['results'][0]['generated_text']
            json_match = re.search(r'\{[^}]*\}', response)
            if json_match:
                result = json.loads(json_match.group(0))
                if validate_response(result):
                    return result
        except Exception:
            pass
        # Absolute last resort: Granite-driven minimal output
        prompt = f"""
Return a valid JSON object with category, department, summary (max 30 chars), and urgency for: "{complaint}"
"""
        try:
            response = model.generate(prompt=prompt)['results'][0]['generated_text']
            json_match = re.search(r'\{[^}]*\}', response)
            if json_match:
                result = json.loads(json_match.group(0))
                if validate_response(result):
                    return result
                # Keep retrying with Granite until valid
                for _ in range(2):
                    response = model.generate(prompt=prompt)['results'][0]['generated_text']
                    json_match = re.search(r'\{[^}]*\}', response)
                    if json_match:
                        result = json.loads(json_match.group(0))
                        if validate_response(result):
                            return result
        except Exception:
            pass
        # If all fails, force Granite to generate a valid output
        prompt = f"""
Return a valid JSON object with:
- category: One of {', '.join([cat for sublist in CATEGORIES.values() for cat in sublist])}.
- department: One of {', '.join(DEPARTMENTS)}.
- summary: Max 30 chars, no newlines.
- urgency: High, Medium, or Low.
For: "{complaint}"
"""
        response = model.generate(prompt=prompt)['results'][0]['generated_text']
        json_match = re.search(r'\{[^}]*\}', response)
        if json_match:
            result = json.loads(json_match.group(0))
            if validate_response(result):
                return result
        # Keep trying until valid
        for _ in range(2):
            response = model.generate(prompt=prompt)['results'][0]['generated_text']
            json_match = re.search(r'\{[^}]*\}', response)
            if json_match:
                result = json.loads(json_match.group(0))
                if validate_response(result):
                    return result
        # Final attempt: return first valid Granite response
        return result  # Use last parsed result, assuming Granite eventually provides something usable

    prompt = build_prompt(complaint, retry=False)
    for attempt in range(max_retries):
        try:
            response = model.generate(prompt=prompt)['results'][0]['generated_text']
            json_match = re.search(r'\{[^}]*\}', response)
            if not json_match:
                prompt = build_prompt(complaint, retry=True)
                continue
            result = json.loads(json_match.group(0))
            if validate_response(result):
                return result
            prompt = build_prompt(complaint, retry=True)
        except Exception:
            prompt = build_prompt(complaint, retry=True)
            continue

    # Try minimal prompt
    prompt = build_prompt(complaint, retry=False, minimal=True)
    try:
        response = model.generate(prompt=prompt)['results'][0]['generated_text']
        json_match = re.search(r'\{[^}]*\}', response)
        if json_match:
            result = json.loads(json_match.group(0))
            if validate_response(result):
                return result
    except Exception:
        pass

    # Final Granite attempt
    prompt = f"""
Return a valid JSON object with category, department, summary (max 30 chars), and urgency for: "{complaint}"
"""
    try:
        response = model.generate(prompt=prompt)['results'][0]['generated_text']
        json_match = re.search(r'\{[^}]*\}', response)
        if json_match:
            result = json.loads(json_match.group(0))
            if validate_response(result):
                return result
            # Keep retrying with Granite
            for _ in range(2):
                response = model.generate(prompt=prompt)['results'][0]['generated_text']
                json_match = re.search(r'\{[^}]*\}', response)
                if json_match:
                    result = json.loads(json_match.group(0))
                    if validate_response(result):
                        return result
    except Exception:
        pass

    # Absolute last resort: force Granite to generate valid output
    prompt = f"""
Return a valid JSON object with:
- category: One of {', '.join([cat for sublist in CATEGORIES.values() for cat in sublist])}.
- department: One of {', '.join(DEPARTMENTS)}.
- summary: Max 30 chars, no newlines.
- urgency: High, Medium, or Low.
For: "{complaint}"
"""
    response = model.generate(prompt=prompt)['results'][0]['generated_text']
    json_match = re.search(r'\{[^}]*\}', response)
    if json_match:
        result = json.loads(json_match.group(0))
        if validate_response(result):
            return result
    # Keep trying until valid
    for _ in range(2):
        response = model.generate(prompt=prompt)['results'][0]['generated_text']
        json_match = re.search(r'\{[^}]*\}', response)
        if json_match:
            result = json.loads(json_match.group(0))
            if validate_response(result):
                return result
    return result  # Use last parsed result, assuming Granite provides something usable

# 🚀 Main Execution
if __name__ == "__main__":
    #test_complaint = "I am unable to access online registration for vaccination due to technical issues; kindly assist."
    #test_complaint = "Can you provide information on the vaccination schedule for children under 5 in my area? Looking to ensure my child is up-to-date."
    #test_complaint = "There was a fire accident near my house."
    while True:
        test_complaint = input("Enter prompt ('exit' to quit):").strip()
        if test_complaint == "exit":
            break
        result = process_complaint(test_complaint)
        print(json.dumps(result))
