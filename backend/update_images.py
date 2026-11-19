
import json
from pathlib import Path

from backend.database import restaurants_collection

# Read restaurant data from JSON
BASE_DIR = Path(__file__).resolve().parent.parent
file_path = BASE_DIR / "data" / "restaurants.json"

with open(file_path, "r", encoding="utf-8") as file:
    restaurants = json.load(file)

# Update image URLs in MongoDB
for restaurant in restaurants:

    restaurants_collection.update_one(
        {"name": restaurant["name"]},
        {
            "$set": {
                "image": restaurant["image"]
            }
        }
    )

    print(f"Image updated for {restaurant['name']}")

print("All restaurant images updated successfully!")
