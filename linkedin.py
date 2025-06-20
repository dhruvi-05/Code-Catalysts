from fastapi import APIRouter, HTTPException
router = APIRouter()

@router.get("/{user_id}")
def get_linkedin_profile(user_id: str):
    # In production, you'd fetch this from an API or database.
    # Here it's mocked for development.
    
    if user_id.lower() != "dhruvi":
        raise HTTPException(status_code=404, detail="LinkedIn user not found")

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
