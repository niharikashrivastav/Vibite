
from fastapi import APIRouter
from pydantic import BaseModel
from backend.services.rag_service import get_restaurant_recommendations

router = APIRouter()


# Define the structure of the user's request
class RecommendationRequest(BaseModel):
    query: str


# API endpoint for AI recommendations
@router.post("/recommend")
def recommend_restaurants(request: RecommendationRequest):

    response = get_restaurant_recommendations(request.query)

    return {
        "query": request.query,
        "recommendation": response
    }
