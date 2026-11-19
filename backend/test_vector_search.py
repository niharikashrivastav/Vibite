
from backend.services.embedding_service import generate_embedding
from backend.services.vector_service import search_restaurants

# Sample user query
query = "I want a peaceful place with healthy vegetarian food"

# Convert query into embedding
query_embedding = generate_embedding(query)

# Search MongoDB
results = search_restaurants(query_embedding)

# Display results
for restaurant in results:
    print("Restaurant:", restaurant["name"])
    print("Cuisine:", restaurant["cuisine"])
    print("Rating:", restaurant["rating"])
    print("----------------------")
