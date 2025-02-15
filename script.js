const chatBody = document.querySelector(".chat-body");
const messageInput = document.querySelector(".message-input");
const sendMessageButton = document.querySelector("#send-message");




// API Setup
const API_KEY = "AIzaSyA9N7ns7o6v0Djm_rhJTBcZsr6lsTTed7c";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

const userData = {
    message: null,
    file: {
        data: null,
        mime_type: null
    }
   
}

// Create message element with dynamic classes and return it
const createMessageElement = (content, ...classes) => {
    const div = document.createElement("div");
    div.classList.add("message", ...classes);
    div.innerHTML = content;
    return div;
}

// Generate bot response using API
const generateBotResponse = async (incomingMessageDiv) => {
const messageElement = incomingMessageDiv.querySelector(".message-text")

    // API request options
    const requestOptions = {
        method: "POST",
        headers: {"Content-Type": "application/json"}, 
        body: JSON.stringify({
            contents: [{
                parts: [{ text: userData.message }, ...(userData.file.data ? [{inline_data: userData.file }] : [])]
            }]
        })
    }

    try{
        //Fetch bot response from API
        const response = await fetch(API_URL, requestOptions);
        const data = await response.json();
        if(!response.ok) throw new Error(data.error.message);

        //Extract and display bot's response text 
        const apiResponseText = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, "$1").trim();

        
        messageElement.innerText = apiResponseText;
        chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });

    } catch(error) {
        //Handle error in API response
        console.log(error);
        messageElement.innerText = error.message;
        messageElement.style.color = "#ff0000";
    } finally {
        incomingMessageDiv.classList.remove("thinking");
        chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth"});
    }
}   



// Handle outgoing user messages
let outgoingMessageDiv; // Declare outside, but don't initialize yet

const handleOutgoingMessage = (e) => {
    
    e.preventDefault();
    userData.message = messageInput.value.trim();
    messageInput.value = "";

    const messageContent = `<div class="message-text"></div>
    ${userData.file.data ? `<img src="data:${userData.file.mime_type};base64,${userData.file.data}" class="attachment" />` : ""}`;

    outgoingMessageDiv = createMessageElement(messageContent, "user-message"); // Now initialize it
    outgoingMessageDiv.querySelector(".message-text").textContent = userData.message;
    chatBody.appendChild(outgoingMessageDiv);
    chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth"});

// Simulate bot response with thinking indicator after a delay
    setTimeout(() => {
       const messageContent = `<div class="message-text z-100 text-sm md:text-md flex my-6 border-3 rounded-xl p-3 mx-3 md:mx-0 md:p-6 border-dashed bg-[#e5e7eb] h-auto">
                <div class="card">
                    <div class="loader text-[20px] md:text-[25px]">
                        <p>loading</p>
                        <div class="words">
                        <span class="word">Responsibility</span>
                        <span class="word">Collaboration</span>
                        <span class="word">Caring and Sharing</span>
                        <span class="word">Honesty</span>
                        <span class="word">Open-mindedness</span>
                        <span class="word">Respect</span>
                        <span class="word">Reflectiveness</span>
                    </div>
                </div>`;

        const incomingMessageDiv = createMessageElement(messageContent);
        chatBody.appendChild(incomingMessageDiv);
        chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth"});
        generateBotResponse(incomingMessageDiv)
    }, 600);
}



// Handle Enter key press for sending message
messageInput.addEventListener("keydown", (e) => {
    const userMessage = e.target.value.trim();
    if(e.key === "Enter" && userMessage) {
        handleOutgoingMessage(e);
    }
})

sendMessageButton.addEventListener("click", (e) => handleOutgoingMessage(e));


//LESSON PLAN BUILDER

function generateLessonPlan() {
    const coreValue = document.getElementById("core-value").value;
    const duration = document.getElementById("duration").value;
    const material = document.getElementById("material").value;

    const inquiryText = `Act like a professional teacher and create a unique and detailed activity for ${duration} minutes. This should be integrated to the core value, ${coreValue}. This activity should be approriate to all grade levels from Pre-K to 10. Everyone should be joining in. If the activity requires groupings, it should be balanced. The activity should be collaborative and preferably psychomotor and the material/meterials to be used is/are ${material}. Should create a different activity for every request.`; 
  
    if (messageInput) {
        messageInput.value = inquiryText; 
        sendMessageButton.click();
        outgoingMessageDiv.style.display = "none";
    }
}


const generateLesson = document.getElementById("generate-lesson-plan"); 
if (generateLesson) {
    generateLesson.addEventListener("click", generateLessonPlan);
} 

function refreshPage(){
    window.location.reload();
}


  // Add 'loaded' class when the DOM is ready
  document.addEventListener('DOMContentLoaded', (event) => {
    document.body.classList.add('loaded');
  });

  





