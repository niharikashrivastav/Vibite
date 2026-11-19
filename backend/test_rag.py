
from backend.services.rag_service import get_restaurant_recommendations

# Sample user query
query = "I want a peaceful place with healthy vegetarian food in Bangalore"

# Get recommendations through RAG
response = get_restaurant_recommendations(query)

print("\nVibite Recommendations:")
print(response)
