
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.routes import restaurant, recommendation

app = FastAPI()

# Allow frontend to communicate with backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5500", "http://localhost:5500"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API routes
app.include_router(restaurant.router)
app.include_router(recommendation.router)

@app.get("/")
def home():
    return {"message": "Welcome to Vibite!"}

@app.get("/health")
def health_check():
    return {"status": "Vibite is running successfully"}
