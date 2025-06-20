import requests
from fastapi import APIRouter, HTTPException
from datetime import datetime

router = APIRouter()
GITHUB_API_BASE = "https://api.github.com"

@router.get("/{username}")
def get_github_profile(username: str):
    user_url = f"{GITHUB_API_BASE}/users/{username}"
    repos_url = f"{GITHUB_API_BASE}/users/{username}/repos"

    user_resp = requests.get(user_url)
    repos_resp = requests.get(repos_url)

    if user_resp.status_code != 200 or repos_resp.status_code != 200:
        raise HTTPException(status_code=404, detail="GitHub user not found")

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
