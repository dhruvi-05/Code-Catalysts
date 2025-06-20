import requests
import json
import re
from datetime import datetime
from google import genai
from fastapi import FastAPI, HTTPException, Query

GITHUB_API_BASE = "https://api.github.com"
GEMINI_API_KEY = "<INSERT API KEY>"
client = genai.Client(api_key=GEMINI_API_KEY)
app = FastAPI()

def get_github_profile(username: str):
    user_url = f"{GITHUB_API_BASE}/users/{username}"
    repos_url = f"{GITHUB_API_BASE}/users/{username}/repos"

    user_resp = requests.get(user_url)
    repos_resp = requests.get(repos_url)

    user_data = user_resp.json()
    repos_data = repos_resp.json()

    projects = []
    for repo in repos_data:
        created_at_raw = repo.get("created_at")
        pushed_at_raw = repo.get("pushed_at")

        # Convert to readable format if timestamps are present
        created_at = datetime.strptime(created_at_raw, "%Y-%m-%dT%H:%M:%SZ").strftime("%d %B %Y") if created_at_raw else None
        pushed_at = datetime.strptime(pushed_at_raw, "%Y-%m-%dT%H:%M:%SZ").strftime("%d %B %Y") if pushed_at_raw else None

        project = {
            "name": repo["name"],
            "description": repo.get("description"),
            "languages": [repo["language"]] if repo["language"] else [],
            "topics": repo.get("topics", []),
            "url": repo["html_url"],
            "created_at": created_at,
            "pushed_at": pushed_at
        }
        projects.append(project)

    return {
        "username": username,
        "profile_url": user_data["html_url"],
        "avatar_url": user_data["avatar_url"],
        "bio": user_data.get("bio"),
        "location": user_data.get("location"),
        "public_repos": user_data.get("public_repos"),
        "followers": user_data.get("followers"),
        "following": user_data.get("following"),
        "projects": projects
    }

def get_linkedin_profile(user_id: str):
    return {
        "name": "Dhruvi Sharma",
        "headline": "AI/ML Enthusiast | ECE Undergrad at IIIT Bhopal",
        "location": "Bhopal, Madhya Pradesh, India",
        "about": (
            "An Electronics and Communication Engineering student passionate about AI, "
            "ML, and Deep Learning. Currently exploring the intersection of real-time "
            "systems and machine intelligence through academic and hands-on projects."
        ),
        "experience": [
            {
                "title": "Research Intern",
                "company": "IIT Hyderabad",
                "duration": "May 2024 – July 2024",
                "description": "Worked on a lightweight object detection model with YOLOv5 for drone-based surveillance."
            },
            {
                "title": "Teaching Assistant - Fundamentals of Computer Programming",
                "company": "IIIT Bhopal",
                "duration": "Jan 2024 – Apr 2024",
                "description": "Mentored 100+ students, assisted with grading and project evaluations."
            }
        ],
        "education": [
            {
                "degree": "B.Tech in Electronics and Communication Engineering",
                "institution": "IIIT Bhopal",
                "year": "2023 – 2027",
                "description": "Focus: AI systems, ML, digital systems, and embedded programming."
            }
        ],
        "skills": [
            "Python", "Machine Learning", "Deep Learning",
            "Data Structures", "Computer Vision", "FastAPI", "Git", "Linux"
        ],
        "certifications": [
            {
                "name": "Google Cloud Certified – Associate Cloud Engineer",
                "issuer": "Google",
                "year": "2024"
            },
            {
                "name": "Introduction to TensorFlow for AI",
                "issuer": "Coursera / DeepLearning.AI",
                "year": "2024"
            }
        ]
    }

def get_unified_profile(gh="dhruvi-05", lid="dhruvi"):
    # 1. Call GitHub endpoint
    github_data = get_github_profile(gh)
    linkedin_data = get_linkedin_profile(lid)

    # 2. Merge skills from both
    skills = list(set(
        linkedin_data.get("skills", []) +
        [repo.get("language") for repo in github_data.get("repos", []) if repo.get("language")]
    ))

    # 3. Merge timeline from GitHub and LinkedIn experience
    timeline = []

    for t in github_data.get("timeline", []):
        timeline.append({
            "year": t.get("month", "Unknown"),  # you can reformat to just year later
            "focus": "GitHub Project Created"
        })

    for job in linkedin_data.get("experience", []):
        timeline.append({
            "year": job.get("duration", "Unknown"),
            "focus": job.get("title", "") + " @ " + job.get("company", "")
        })

    # 4. Final unified profile
    unified_profile = {
        "name": linkedin_data.get("name", "Unknown"),
        "headline": linkedin_data.get("headline", ""),
        "skills": skills,
        "timeline": timeline,
        "certifications": linkedin_data.get("certifications", []),
        "projects": github_data.get("repos", [])
    }

    return unified_profile

@app.get("/analyze-profile")
def analyze_profile(gh: str = Query(...), lid: str = Query(...)):
    try:
        profile_info = str(get_unified_profile(gh, lid))
        prompt = profile_info + '''
        You are an AI career assistant. Given a user\'s profile data in JSON format, analyze their background, skills, and projects. Provide personalized suggestions for improving their profile, growing professionally, and identifying career or learning opportunities.

        Output should include:

        A brief summary of the person’s current strengths

        3-5 actionable suggestions for:
        Improving their GitHub (e.g., better README, contribution ideas, project recommendations)
        Enhancing their LinkedIn (e.g., keyword optimizations, skill endorsements)
        Career growth opportunities (e.g., certifications, roles to target, skills to build)

        Return the output strictly in the following JSON format:
        {
            "strengths_summary": "<short paragraph summarizing strengths>",
            "github_suggestions": [
                "<GitHub suggestion 1>",
                "<GitHub suggestion 2>",
                "<...>"
            ],
            "linkedin_suggestions": [
                "<LinkedIn suggestion 1>",
                "<LinkedIn suggestion 2>",
                "<...>"
            ],
            "career_recommendations": [
                "<Career or learning recommendation 1>",
                "<Career or learning recommendation 2>",
                "<...>"
            ]
        }
        '''

        response = client.models.generate_content(model="gemini-2.0-flash", contents=prompt)
        match = re.search(r"```json\s*(\{.*?\})\s*```", str(response.text), re.DOTALL)
        json_str = match.group(1)
        return json.loads(json_str)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))