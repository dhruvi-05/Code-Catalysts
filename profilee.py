from fastapi import APIRouter, HTTPException, Query
import requests

router = APIRouter()

@router.get("/user-profile")
def get_unified_profile(gh: str = Query(...), lid: str = Query(...)):
    # 1. Call GitHub endpoint
    github_url = f"http://localhost:8000/api/github/{gh}"
    linkedin_url = f"http://localhost:8000/api/linkedin/{lid}"

    try:
        github_data = requests.get(github_url).json()
    except Exception:
        raise HTTPException(status_code=500, detail="GitHub fetch failed")

    try:
        linkedin_data = requests.get(linkedin_url).json()
    except Exception:
        raise HTTPException(status_code=500, detail="LinkedIn fetch failed")

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
