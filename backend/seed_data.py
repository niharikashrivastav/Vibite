
import json
from pathlib import Path

from backend.database import restaurants_collection
from backend.services.embedding_service import generate_embedding

# Load restaurant data from JSON
BASE_DIR = Path(__file__).resolve().parent.parent
DATA_FILE = BASE_DIR / "data" / "restaurants.json"

with open(DATA_FILE, "r", encoding="utf-8") as file:
    restaurants = json.load(file)

print(f"Loaded {len(restaurants)} restaurants from JSON.")
# Remove restaurants that are no longer in the JSON dataset
restaurant_names = [restaurant["name"] for restaurant in restaurants]

restaurants_collection.delete_many({
    "name": {"$nin": restaurant_names}
})

print("Removed old restaurant records.")

# Add restaurants and generate embeddings
for restaurant in restaurants:

    # Include restaurant details and menu in searchable text
    menu_text = ""

    for item in restaurant.get("menu", []):
        menu_text += f"""
        Item: {item['name']}
        Category: {item['category']}
        Food Type: {item['food_type']}
        Price: Rs. {item['price']}
        """

    search_text = f"""
    Name: {restaurant['name']}
    Cuisine: {restaurant['cuisine']}
    Food Type: {restaurant['food_type']}
    Location: {restaurant['location']}
    Ambience: {restaurant['ambience']}
    Description: {restaurant['description']}
    Reviews: {' '.join(restaurant.get('reviews', []))}
    Menu:
    {menu_text}
    """

    # Generate embedding
    embedding = generate_embedding(search_text)

    # Update existing restaurant or insert a new one
    restaurants_collection.update_one(
        {"name": restaurant["name"]},
        {
            "$set": {
                **restaurant,
                "search_text": search_text,
                "embedding": embedding
            }
        },
        upsert=True
    )

    print(f"Restaurant updated: {restaurant['name']}")

print("\nAll restaurants imported successfully!")
print("Embeddings generated successfully!")
print("Total restaurants processed:", len(restaurants))
