// script.js - Frontend Only (⚠️ INSECURE - FOR LOCAL TESTING ONLY)

const chatWindow = document.getElementById('chat-window');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const typingIndicator = document.getElementById('typing-indicator');

// ⚠️ IMPORTANT: Paste your OpenAI API Key here.
// Anyone who opens your website can see this key.
// Only use this method for private, local testing.
const OPENAI_API_KEY = "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";
const API_URL = "https://api.openai.com/v1/chat/completions";

// --- This function now sends the user's message directly to the OpenAI API ---
async function getAuraResponse(inputText) {
    const requestBody = {
        model: "gpt-4o-mini",   // you can also use "gpt-4.1" or "gpt-3.5-turbo"
        messages: [{ role: "user", content: inputText }]
    };

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();
        // Extract assistant's reply
        const aiText = data.choices[0].message.content;
        return aiText;

    } catch (error) {
        console.error("Error fetching from OpenAI API:", error);
        if (OPENAI_API_KEY === "sk-PASTE_YOUR_OPENAI_KEY_HERE") {
            return "Error: API key is not set. Please add your key to script.js.";
        }
        return "Oops! I'm having trouble connecting to my brain. Please check the console for errors.";
    }
}

// --- UI functions ---

function showTypingIndicator() {
    typingIndicator.style.display = 'flex';
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

function hideTypingIndicator() {
    typingIndicator.style.display = 'none';
}

function addMessage(text, sender) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', `${sender}-message`);
    messageElement.innerText = text;
    chatWindow.appendChild(messageElement);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

// --- Chat handling ---
async function handleUserMessage() {
    const userText = userInput.value.trim();
    if (userText === "") return;

    addMessage(userText, 'user');
    userInput.value = '';

    showTypingIndicator();

    const auraResponse = await getAuraResponse(userText);
    hideTypingIndicator();
    addMessage(auraResponse, 'aura');
}

// Event Listeners
sendBtn.addEventListener('click', handleUserMessage);
userInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        handleUserMessage();
    }
});

// Initial greeting
window.onload = () => {
    setTimeout(() => {
        addMessage("Hi! I'm Aura. Ask me anything!", 'aura');
    }, 1000);
};
