
from fastapi import APIRouter
from pydantic import BaseModel

from backend.database import restaurants_collection
from backend.services.gemini_service import generate_response

router = APIRouter()


# Request structure
class ReviewRequest(BaseModel):
    restaurant_name: str


# Get all restaurants
@router.get("/restaurants")
def get_restaurants():

    restaurants = list(
        restaurants_collection.find({}, {"_id": 0})
    )

    return {
        "count": len(restaurants),
        "restaurants": restaurants
    }


# AI Review Summarizer
@router.post("/summarize-reviews")
def summarize_reviews(request: ReviewRequest):

    # Find restaurant
    restaurant = restaurants_collection.find_one(
        {"name": request.restaurant_name}
    )

    if not restaurant:
        return {"summary": "Restaurant not found."}

    reviews = restaurant.get("reviews", [])

    if not reviews:
        return {"summary": "No customer reviews available."}

    # Create Gemini prompt
    prompt = f"""
    You are Vibite, an AI restaurant assistant.

    Summarize the following customer reviews in 2-3 sentences.

    Use only the information provided.
    Do not invent customer experiences.

    Restaurant: {request.restaurant_name}

    Customer Reviews:
    {reviews}
    """

    summary = generate_response(prompt)

    return {
        "restaurant": request.restaurant_name,
        "summary": summary
    }
