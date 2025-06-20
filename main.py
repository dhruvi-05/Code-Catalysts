# main.py

from fastapi import FastAPI
from github import router as github_router
from linkedin import router as linkedin_router
from profilee import router as profile_router

app = FastAPI()

app.include_router(github_router, prefix="/api/github")
app.include_router(linkedin_router, prefix="/api/linkedin")
app.include_router(profile_router, prefix="/api")
