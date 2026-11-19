
// Get restaurant container
const restaurantList = document.getElementById("restaurantList");

// Fetch restaurants from FastAPI
async function loadRestaurants() {

    try {
        const response = await fetch("http://127.0.0.1:8000/restaurants");

        const data = await response.json();

        restaurantList.innerHTML = "";

        data.restaurants.forEach(restaurant => {

            const card = document.createElement("div");
            card.className = "restaurant-card";

            
        card.innerHTML = `
            <img src="${restaurant.image}" 
            alt="${restaurant.name}" 
            class="restaurant-image">

            <div class="restaurant-info">
            <h3>${restaurant.name}</h3>
            <p>${restaurant.cuisine} • ${restaurant.food_type}</p>
            <p>⭐ ${restaurant.rating}</p>
            <p>₹${restaurant.price_for_two} for two</p>
            <p>${restaurant.ambience}</p>
            </div>
        `;


            restaurantList.appendChild(card);

        });

    } catch (error) {
        restaurantList.textContent = "Unable to load restaurants. Please try again.";
        console.error("Error loading restaurants:", error);
    }
}

// Load restaurants when page opens
loadRestaurants();


// Homepage AI Search
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");

searchButton.addEventListener("click", () => {

    const query = searchInput.value.trim();

    if (query === "") {
        alert("Please enter what you are craving!");
        return;
    }

    // Redirect to AI Assistant with the search query
    window.location.href = `chatbot.html?query=${encodeURIComponent(query)}`;

});


// Mood-based restaurant discovery
const moodButtons = document.querySelectorAll("[data-mood]");

moodButtons.forEach(button => {

    button.addEventListener("click", function() {

        const mood = this.dataset.mood;

        const query = `I want a ${mood.toLowerCase()} restaurant experience in Bangalore. Recommend a restaurant that matches this mood.`;

        // Open AI Assistant with the selected mood
        window.location.href =
            `chatbot.html?query=${encodeURIComponent(query)}`;

    });

});

// Explore by Cuisine
const cuisineButtons = document.querySelectorAll("[data-cuisine]");

cuisineButtons.forEach(button => {
    button.addEventListener("click", function() {
        const cuisine = this.dataset.cuisine;

        window.location.href =
            `restaurants.html?cuisine=${encodeURIComponent(cuisine)}`;
    });
});
