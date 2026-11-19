
from pymongo import MongoClient
from backend.config import MONGO_URI

client = MongoClient(MONGO_URI)

db = client["vibite_db"]

restaurants_collection = db["restaurants"]

