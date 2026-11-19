
// Get the restaurant details container
const detailsContainer = document.getElementById("restaurantDetails");

// Get restaurant name from URL
const urlParams = new URLSearchParams(window.location.search);
const restaurantName = urlParams.get("name");

// Fetch restaurant details from FastAPI
async function loadRestaurantDetails() {

    try {

        const response = await fetch("http://127.0.0.1:8000/restaurants");

        const data = await response.json();

        // Find the selected restaurant
        const restaurant = data.restaurants.find(
            item => item.name === restaurantName
        );

        // Check if restaurant exists
        if (!restaurant) {
            detailsContainer.textContent = "Restaurant not found.";
            return;
        }

        // Display restaurant details
        
detailsContainer.innerHTML = `
    <div class="details-card">

        <img src="${restaurant.image}"
             alt="${restaurant.name}"
             class="details-image">

        <h2>${restaurant.name}</h2>
        <button id="favoriteButton" class="favorite-btn">
            ❤️ Add to Favourites
        </button>

        <p>${restaurant.description}</p>

        <div class="details-meta">
            <span>⭐ ${restaurant.rating}</span>
            <span>₹${restaurant.price_for_two} for two</span>
            <span>${restaurant.cuisine}</span>
            <span>${restaurant.food_type}</span>
        </div>

        <p><strong>Location:</strong> ${restaurant.location}</p>

        <p><strong>Ambience:</strong> ${restaurant.ambience}</p>

        
<h3>Our Menu 🍽️</h3>

<div class="menu-list">

    ${["Main Course", "Starter", "Dessert", "Beverage"].map(category => {

        const items = restaurant.menu.filter(
            item => item.category === category
        );

        if (items.length === 0) return "";

        return `
            <div class="menu-category">

                <h3>${category}</h3>

                <div class="menu-category-items">

                    ${items.map(item => `
                        <div class="menu-item">

                            <div class="menu-item-info">
                                <h4>${item.name}</h4>

                                <span class="${item.food_type === 'Veg' ? 'veg-label' : 'nonveg-label'}">
                                    ${item.food_type === 'Veg' ? '🟢 Veg' : '🔴 Non-Veg'}
                                </span>
                            </div>

                            <strong>₹${item.price}</strong>

                        </div>
                    `).join("")}

                </div>

            </div>
        `;

    }).join("")}

</div>


<h3>Customer Reviews</h3>

        ${restaurant.reviews.map(review => `
            <p>💬 ${review}</p>
        `).join("")}

    </div>
    `;

// Get the Favourite button
const favoriteButton = document.getElementById("favoriteButton");

// Get saved favourites
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

// Check if restaurant is already a favourite
if (favorites.includes(restaurant.name)) {
    favoriteButton.textContent = "❤️ Added to Favourites";
}

// Handle Favourite button click
favoriteButton.addEventListener("click", function() {

    if (favorites.includes(restaurant.name)) {

        favorites = favorites.filter(
            name => name !== restaurant.name
        );

        favoriteButton.textContent = "❤️ Add to Favourites";

    } else {

        favorites.push(restaurant.name);

        favoriteButton.textContent = "❤️ Added to Favourites";

    }

    // Save updated favourites
    localStorage.setItem("favorites", JSON.stringify(favorites));

});



    } catch (error) {

        detailsContainer.textContent =
            "Unable to load restaurant details.";

        console.error("Error:", error);

    }
}

// Load details when page opens
loadRestaurantDetails();



// AI Review Summarizer
const summarizeButton = document.getElementById("summarizeButton");
const reviewSummary = document.getElementById("reviewSummary");

summarizeButton.addEventListener("click", async function() {

    summarizeButton.disabled = true;
    summarizeButton.textContent = "✨ Generating Summary...";

    reviewSummary.innerHTML = `
    <div class="typing-indicator">
        <span></span>
        <span></span>
        <span></span>
    </div>
`;

    try {

        const response = await fetch(
            "http://127.0.0.1:8000/summarize-reviews",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    restaurant_name: restaurantName
                })
            }
        );

        if (!response.ok) {
            throw new Error("Unable to summarize reviews.");
        }

        const data = await response.json();

        reviewSummary.textContent = data.summary;

    } catch (error) {

        reviewSummary.textContent =
            "Sorry! Unable to generate the review summary.";

        console.error("Error:", error);

    }

    summarizeButton.disabled = false;
    summarizeButton.textContent = "✨ Summarize Reviews";

});
