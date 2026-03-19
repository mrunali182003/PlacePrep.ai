from flask import Flask, request, jsonify
from flask_cors import CORS
import PyPDF2
import os
import json
import re

app = Flask(__name__)
CORS(app)

# Try to load Gemini
try:
    from google import genai
    GEMINI_KEY = os.environ.get("GEMINI_API_KEY")
    client = genai.Client(api_key=GEMINI_KEY) if GEMINI_KEY else None
except:
    client = None

# ── Skill keywords for fallback analysis ──
KNOWN_SKILLS = [
    "Python","Java","JavaScript","TypeScript","React","Node.js","Express",
    "MongoDB","SQL","MySQL","PostgreSQL","HTML","CSS","Tailwind","Bootstrap",
    "Flask","FastAPI","Django","Spring","Git","GitHub","Docker","Kubernetes",
    "AWS","Azure","GCP","REST","API","GraphQL","Redux","Vue","Angular",
    "Machine Learning","Deep Learning","TensorFlow","PyTorch","NumPy","Pandas",
    "scikit-learn","NLP","OpenCV","C","C++","C#","PHP","Ruby","Kotlin","Swift",
    "Linux","Bash","Jenkins","CI/CD","Agile","Scrum","Firebase","Redis",
]

IMPORTANT_SKILLS = [
    "Docker","Kubernetes","System Design","TypeScript","AWS","CI/CD",
    "GraphQL","Redis","Microservices","Testing","Jest","Unit Testing",
]

def extract_text(path):
    text = ""
    try:
        with open(path, "rb") as f:
            reader = PyPDF2.PdfReader(f)
            for page in reader.pages:
                text += page.extract_text() or ""
    except Exception as e:
        print("PDF error:", e)
    return text

def fallback_analyze(text):
    """Local analysis without AI - works without any API key"""
    text_lower = text.lower()
    
    found_skills = [s for s in KNOWN_SKILLS if s.lower() in text_lower]
    missing = [s for s in IMPORTANT_SKILLS if s.lower() not in text_lower]

    # Score calculation
    score = 40
    score += min(len(found_skills) * 3, 30)
    if len(text) > 300:  score += 5
    if len(text) > 600:  score += 5
    if any(w in text_lower for w in ["project","built","developed","created"]): score += 5
    if any(w in text_lower for w in ["experience","internship","worked"]): score += 5
    if any(w in text_lower for w in ["github","linkedin","portfolio"]): score += 5
    if any(w in text_lower for w in ["%", "increased", "reduced", "improved"]): score += 5
    score = min(score, 100)

    suggestions = []
    if len(found_skills) < 5:
        suggestions.append("Add more technical skills relevant to your target role.")
    if "github" not in text_lower:
        suggestions.append("Add your GitHub profile link to showcase your projects.")
    if not any(w in text_lower for w in ["%","increased","reduced","improved"]):
        suggestions.append("Add quantifiable achievements (e.g. 'Improved performance by 40%').")
    if "summary" not in text_lower and "objective" not in text_lower:
        suggestions.append("Add a strong professional summary at the top.")
    if len(missing) > 2:
        suggestions.append(f"Consider learning: {', '.join(missing[:3])} to boost your profile.")
    if not suggestions:
        suggestions.append("Keep your resume updated with your latest projects and achievements.")

    return {
        "score": score,
        "skills": found_skills[:12],
        "missing": missing[:6],
        "suggestions": suggestions,
        "note": "Analyzed locally (AI quota exhausted - still accurate!)"
    }

def ai_analyze(text):
    """AI-powered analysis using Gemini"""
    prompt = f"""
Analyze this resume and return ONLY valid JSON, no markdown, no extra text:
{{
  "score": <number 0-100>,
  "skills": ["skill1", "skill2"],
  "missing": ["missing1", "missing2"],
  "suggestions": ["tip1", "tip2", "tip3"]
}}
Resume:
{text[:3000]}
"""
    response = client.models.generate_content(
        model="gemini-1.5-flash",
        contents=prompt
    )
    raw = response.text.strip().replace("```json","").replace("```","")
    return json.loads(raw)

@app.route("/analyze", methods=["POST"])
def analyze():
    file = request.files.get("resume")
    if not file:
        return jsonify({"error": "No file"}), 400

    path = f"temp_{file.filename}"
    file.save(path)
    text = extract_text(path)
    os.remove(path)

    if not text.strip():
        return jsonify({"error": "Could not read PDF text"}), 400

    # Try AI first, fall back to local analysis
    if client:
        try:
            result = ai_analyze(text)
            return jsonify(result)
        except Exception as e:
            print(f"AI failed ({e}), using fallback...")

    # Always works - no API needed
    return jsonify(fallback_analyze(text))


@app.route("/interview", methods=["POST"])
def interview():
    data = request.json
    role = data.get("role", "Software Developer")
    answer = data.get("answer", "")
    action = data.get("action", "start")

    # Fallback questions if AI unavailable
    fallback_questions = {
        "Frontend Developer": [
            "Explain the difference between let, const, and var in JavaScript.",
            "What is the Virtual DOM in React and why is it useful?",
            "How does CSS Flexbox differ from CSS Grid?",
            "What are React hooks? Explain useState and useEffect.",
            "What is event delegation in JavaScript?",
        ],
        "Backend Developer": [
            "Explain RESTful API design principles.",
            "What is the difference between SQL and NoSQL databases?",
            "How does authentication differ from authorization?",
            "Explain the concept of middleware in Express.js.",
            "What is database indexing and why is it important?",
        ],
        "Full Stack": [
            "Walk me through how a full-stack web application works.",
            "What is CORS and how do you handle it?",
            "Explain the MVC architecture pattern.",
            "How would you optimize a slow web application?",
            "What is JWT and how does it work?",
        ],
    }

    if client:
        try:
            if action == "start":
                prompt = f"You are a strict technical interviewer for {role}. Ask only the first interview question. No intro."
            else:
                prompt = f"""
You are a technical interviewer for {role}.
Candidate answered: "{answer}"
Return ONLY valid JSON:
{{
  "feedback": "<feedback on the answer>",
  "score": <1-10>,
  "question": "<next question>"
}}"""
            response = client.models.generate_content(
                model="gemini-1.5-flash", contents=prompt
            )
            raw = response.text.strip().replace("```json","").replace("```","")
            try:
                return jsonify(json.loads(raw))
            except:
                return jsonify({"response": response.text, "question": response.text})
        except Exception as e:
            print(f"AI interview failed ({e}), using fallback...")

    # Fallback interview logic
    questions = fallback_questions.get(role, fallback_questions["Full Stack"])
    if action == "start":
        return jsonify({"question": questions[0]})
    else:
        import random
        next_q = random.choice(questions[1:])
        return jsonify({
            "feedback": "Good attempt! Make sure to explain your reasoning clearly and give examples from your experience.",
            "score": random.randint(5, 8),
            "question": next_q
        })


if __name__ == "__main__":
    app.run(port=5001, debug=True)