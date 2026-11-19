
from backend.services.embedding_service import generate_embedding

text = "A cozy Italian restaurant serving delicious vegetarian pasta"

embedding = generate_embedding(text)

print("Embedding generated successfully!")
print("Embedding length:", len(embedding))
print("First 5 values:", embedding[:5])
