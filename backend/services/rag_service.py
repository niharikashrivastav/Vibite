
from backend.services.embedding_service import generate_embedding
from backend.services.vector_service import search_restaurants
from backend.services.gemini_service import generate_response


def get_restaurant_recommendations(user_query):

    # 1. Convert user query into an embedding
    query_embedding = generate_embedding(user_query)

    # 2. Retrieve relevant restaurants from MongoDB
    restaurants = search_restaurants(query_embedding)

    # 3. Check if any restaurants were found
    if not restaurants:
        return "Sorry, I couldn't find any matching restaurants."

    # 4. Prepare restaurant information as context
    context = ""

    for restaurant in restaurants:

        # Prepare menu information
        menu_details = ""

        for item in restaurant.get("menu", []):
            menu_details += f"""
            Dish: {item['name']}
            Category: {item['category']}
            Food Type: {item['food_type']}
            Price: Rs. {item['price']}
            """

        context += f"""
        Name: {restaurant['name']}
        Cuisine: {restaurant['cuisine']}
        Food Type: {restaurant['food_type']}
        Location: {restaurant['location']}
        Ambience: {restaurant['ambience']}
        Price for Two: Rs. {restaurant['price_for_two']}
        Rating: {restaurant['rating']}
        Description: {restaurant['description']}
        Reviews: {', '.join(restaurant.get('reviews', []))}

        Menu:
        {menu_details}
        """

    # 5. Create the RAG prompt
    prompt = f"""
    You are Vibite, an AI restaurant recommendation assistant.

    Use ONLY the restaurant information provided below
    to answer the user's query.

    Do not invent restaurant names, prices, ratings, or details.

    If the information is insufficient, clearly say so.

    Restaurant Information:
    {context}

    User Query:
    {user_query}

    Prioritize restaurants whose ambience matches the user's
    requested mood.

    Recommend the most relevant restaurants and explain
    why they match the user's preferences.

    You can also recommend specific menu items when relevant.

    Do not invent menu items or prices.
    Do not claim an ambience that is not mentioned
    in the restaurant information.
    """

    # 6. Generate response using Gemini
    response = generate_response(prompt)

    return response
