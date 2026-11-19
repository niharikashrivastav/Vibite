
from backend.database import restaurants_collection

def search_restaurants(query_embedding, limit=3):

    results = restaurants_collection.aggregate([
        {
            "$vectorSearch": {
                "index": "vector_index",
                "path": "embedding",
                "queryVector": query_embedding,
                "numCandidates": 100,
                "limit": limit
            }
        }
    ])

    return list(results)
