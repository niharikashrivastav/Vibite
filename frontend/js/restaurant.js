let allRestaurants = [];
let selectedCuisine = "All";
let selectedFood = "All";
// Get selected cuisine from homepage
const urlParams = new URLSearchParams(window.location.search);
selectedCuisine = urlParams.get("cuisine") || "All";



const restaurantList = document.getElementById("exploreRestaurantList");
const restaurantCount = document.getElementById("restaurantCount");

// Load restaurants from FastAPI
async function loadRestaurants() {

    try {

        const response = await fetch("http://127.0.0.1:8000/restaurants");

        const data = await response.json();

        allRestaurants = data.restaurants;

        filterRestaurants();

    } catch (error) {

        restaurantCount.textContent = "Unable to load restaurants.";
        console.error("Error:", error);

    }
}

// Load restaurants when page opens
loadRestaurants();


// Display restaurants based on selected filters
function filterRestaurants() {

    const filteredRestaurants = allRestaurants.filter(restaurant => {

        const cuisineMatch =
            selectedCuisine === "All" ||
            restaurant.cuisine === selectedCuisine;

        const foodMatch =
            selectedFood === "All" ||
            restaurant.food_type === selectedFood;

        return cuisineMatch && foodMatch;

    });

    restaurantList.innerHTML = "";

    restaurantCount.textContent =
        `${filteredRestaurants.length} restaurants found`;

    filteredRestaurants.forEach(restaurant => {

        const card = document.createElement("div");
        card.className = "restaurant-card";
        card.style.cursor = "pointer";

        card.addEventListener("click", () => {
        window.location.href = `restaurant-details.html?name=${encodeURIComponent(restaurant.name)}`;
        });

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
                <p>${restaurant.description}</p>
            </div>
        `;

        restaurantList.appendChild(card);

    });

}

// Cuisine filter buttons
document.querySelectorAll(".filter-btn").forEach(button => {

    button.addEventListener("click", function() {

        document.querySelectorAll(".filter-btn").forEach(btn => {
            btn.classList.remove("active");
        });

        this.classList.add("active");

        selectedCuisine = this.dataset.filter;

        filterRestaurants();

    });

});

// Food preference buttons
document.querySelectorAll(".food-filter-btn").forEach(button => {

    button.addEventListener("click", function() {

        document.querySelectorAll(".food-filter-btn").forEach(btn => {
            btn.classList.remove("active");
        });

        this.classList.add("active");

        selectedFood = this.dataset.food;

        filterRestaurants();

    });

});

