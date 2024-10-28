const textInputField = document.getElementById("textInput");
const sendButton = document.getElementById("sendButton");
const clearButton = document.getElementById("clearButton");
const chatWindow = document.getElementById("chatWindow");

let GOOGLE_API_KEY = "PUT_API_KEY_HERE";
const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GOOGLE_API_KEY}`

let history = []

const makeRequest = async () => {
    console.log(history)
    let response = await fetch(endpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "contents": history
        })
    });

    let data = await response.json();
    if (data.error) {
        addMessage("system", data.error.message)
        return
    }
    addMessage("model", data.candidates[0].content.parts[0]["text"])
}

const addMessage = (sender, message) => {
    let element = `<article class="message message-item ${sender.toLowerCase() == 'user' ? 'is-success' : 'is-info'}" style="width: fit-content;">
                    <div class="message-header">
                        <p>${sender.toUpperCase()}</p>
                    </div>
                    <div class="message-body">
                        ${message}
                    </div>
                </article>`;

    chatWindow.innerHTML += element;
    textInputField.value = "";

    if (sender.toLowerCase() == "system") return

    history.push({
        "role": sender,
        "parts": [
            {"text": message}
        ]
    })

    if (sender.toLowerCase() == "user")
        makeRequest();
}

sendButton.addEventListener("click", () => {
    let userText = textInputField.value;
    if (userText == "" ) return 
    userText = userText.trim();
    if (userText == "" ) return
    if (userText.length < 2 || userText.length > 1000) {
        addMessage("system", "Your message is either too long or too short!");
        return
    }

    addMessage("user", userText);
});

clearButton.addEventListener("click", () => {
    chatWindow.innerHTML = "";
    history = [];
})