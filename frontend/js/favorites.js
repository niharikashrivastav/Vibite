
// Get HTML elements
const favoriteList = document.getElementById("favoriteRestaurantList");
const favoriteCount = document.getElementById("favoriteCount");

// Load saved favourites
async function loadFavorites() {

    try {

        // Get favourite names from localStorage
        const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

        // Fetch restaurant data from FastAPI
        const response = await fetch("http://127.0.0.1:8000/restaurants");

        const data = await response.json();

        // Find restaurants saved by the user
        const favoriteRestaurants = data.restaurants.filter(
            restaurant => favorites.includes(restaurant.name)
        );

        favoriteList.innerHTML = "";

        favoriteCount.textContent =
            `${favoriteRestaurants.length} favourites saved`;

        // Show message if there are no favourites
        if (favoriteRestaurants.length === 0) {
            favoriteList.textContent = "No favourites yet. Explore restaurants and save your favourites! ❤️";
            return;
        }

        // Display favourite restaurants
        favoriteRestaurants.forEach(restaurant => {

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

                    <button class="favorite-btn"
                            data-name="${restaurant.name}">
                        Remove from Favourites
                    </button>
                </div>
            `;

            favoriteList.appendChild(card);

        });

        // Handle removing favourites
        document.querySelectorAll(".favorite-btn").forEach(button => {

            button.addEventListener("click", function() {

                const name = this.dataset.name;

                const updatedFavorites = favorites.filter(
                    item => item !== name
                );

                localStorage.setItem(
                    "favorites",
                    JSON.stringify(updatedFavorites)
                );

                loadFavorites();

            });

        });

    } catch (error) {

        favoriteCount.textContent = "Unable to load favourites.";
        console.error("Error:", error);

    }

}

// Load favourites when page opens
loadFavorites();
