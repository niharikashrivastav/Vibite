
const chatInput = document.getElementById("chatInput");
const sendButton = document.getElementById("sendButton");
const chatMessages = document.getElementById("chatMessages");

// Read query passed from homepage
const urlParams = new URLSearchParams(window.location.search);
const userQuery = urlParams.get("query");

if (userQuery) {
    chatInput.value = userQuery;
}

// Function to display normal messages
function addMessage(message, className) {

    const messageDiv = document.createElement("div");

    messageDiv.className = className;
    messageDiv.textContent = message;
    messageDiv.style.marginBottom = "15px";

    chatMessages.appendChild(messageDiv);

    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Function to format AI recommendations
function addRecommendation(response) {

    const messageDiv = document.createElement("div");
    messageDiv.className = "bot-message recommendation-message";

    // Escape HTML
    let formatted = response.replace(/&/g, "&amp;")
                            .replace(/</g, "&lt;")
                            .replace(/>/g, "&gt;");

    // Format bold text
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

    // Format bullet points
    const lines = formatted.split("\n");
    let html = "";
    let inList = false;

    lines.forEach(line => {

        line = line.trim();

        if (line.startsWith("* ") || line.startsWith("- ")) {

            if (!inList) {
                html += "<ul>";
                inList = true;
            }

            html += `<li>${line.substring(2)}</li>`;

        } else {

            if (inList) {
                html += "</ul>";
                inList = false;
            }

            if (line !== "") {
                html += `<p>${line}</p>`;
            }
        }
    });

    if (inList) {
        html += "</ul>";
    }

    messageDiv.innerHTML = html;

    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Function to send message
async function sendMessage() {

    const message = chatInput.value.trim();

    if (message === "" || sendButton.disabled) {
        return;
    }

    addMessage(message, "user-message");

    chatInput.value = "";
    sendButton.disabled = true;

    const loadingMessage = document.createElement("div");

    loadingMessage.className = "bot-message typing-indicator";

    loadingMessage.innerHTML = `
        <span></span>
        <span></span>
        <span></span>
    `;

    chatMessages.appendChild(loadingMessage);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    try {

        const response = await fetch("http://127.0.0.1:8000/recommend", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                query: message
            })

        });

        if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
        }

        const data = await response.json();

        if (!data.recommendation) {
            throw new Error("No recommendation received.");
        }

        addRecommendation(data.recommendation);

    } catch (error) {

        console.error("Chatbot Error:", error);

        addMessage(
            "Gemini is temporarily unavailable. Please try again in a moment.",
            "bot-message"
        );

    } finally {

        // Always remove the loading animation
        loadingMessage.remove();

        // Always enable the send button again
        sendButton.disabled = false;

        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

// Send button
sendButton.addEventListener("click", sendMessage);

// Send using Enter key
chatInput.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {
        event.preventDefault();
        sendMessage();
    }

});
