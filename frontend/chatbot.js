document.addEventListener('DOMContentLoaded', () => {

  const chatbotModal = document.getElementById('chatbotModal');
  const closeChat = document.getElementById('closeChat');
  const chatInput = document.getElementById('chatInput');
  const sendChat = document.getElementById('sendChat');
  const chatbotBody = document.getElementById('chatbotBody');
  const chatNotification = document.getElementById('chatNotification');
  const closeNotification = document.getElementById('closeNotification');
  const chatbotBtn = document.getElementById('chatbotBtn');

  let initialized = false;
  let lastIntent = null;
  let notificationShown = false;

  // Hide notification 
  chatNotification.style.display = 'none';
  chatbotModal.style.display = 'none';

  // Show notification when scroll
  window.addEventListener('scroll', () => {
    if (!notificationShown && window.scrollY > 100) {
      chatNotification.style.display = 'flex';
      chatNotification.style.opacity = 0;
      chatNotification.style.transition = 'opacity 0.5s ease-in-out';
      setTimeout(() => { chatNotification.style.opacity = 1; }, 50);
      notificationShown = true;
    }
  });

  // Close notification
  closeNotification.addEventListener('click', (e) => {
    e.stopPropagation(); // prevent opening chat
    chatNotification.style.display = 'none';
  });

  // Open Chat Modal
  chatbotBtn.addEventListener('click', () => {
    chatbotModal.style.display = 'flex';

    if (!initialized) {
      botReply("Hi! 👋 Welcome to SharePlate!");

      setTimeout(() => {
        appendQuickOptions(
          ["Place an Order", "Delivery Info", "Check Offers", "Help / Support"],
          "Here are some things I can help you with today!"
        );
      }, 800);

      initialized = true;
    }
  });

  // Close Modal
  closeChat.addEventListener('click', () => {
    chatbotModal.style.display = 'none';
  });

  window.addEventListener('click', (e) => {
    if (e.target === chatbotModal) {
      chatbotModal.style.display = 'none';
    }
  });

  // Send Message
  sendChat.addEventListener('click', sendUserMessage);
  chatInput.addEventListener('keypress', e => { if (e.key === "Enter") sendUserMessage(); });

  function sendUserMessage() {
    const msg = chatInput.value.trim();
    if (msg !== "") {
      appendMessage(msg, 'user-msg');
      chatInput.value = "";
      handleUserMessage(msg.toLowerCase());
    }
  }

  // Add Message
  function appendMessage(text, type) {
    const div = document.createElement('div');
    div.className = type;
    div.innerHTML = text;
    chatbotBody.appendChild(div);
    chatbotBody.scrollTop = chatbotBody.scrollHeight;
  }

  // Typing Indicator
  function typingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'bot-msg typing';
    typingDiv.innerHTML = "Typing...";
    chatbotBody.appendChild(typingDiv);
    chatbotBody.scrollTop = chatbotBody.scrollHeight;
    return typingDiv;
  }

  function botReply(text) {
    const typing = typingIndicator();
    setTimeout(() => {
      typing.remove();
      appendMessage(text, 'bot-msg');
    }, 600);
  }

  // Quick Reply
  function appendQuickOptions(options, message) {
    appendMessage(message, 'bot-msg');

    const container = document.createElement('div');
    container.className = 'quick-options';

    options.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'quick-btn';
      btn.innerText = opt;

      btn.onclick = () => {
        appendMessage(opt, 'user-msg');
        handleUserMessage(opt.toLowerCase());
      };

      container.appendChild(btn);
    });

    chatbotBody.appendChild(container);
    chatbotBody.scrollTop = chatbotBody.scrollHeight;
  }

  // Responses
  const responses = {
    greetings: ["hello", "hi", "hey", "good morning", "good evening"],
    order: ["order", "buy", "purchase", "food", "place an order"],
    delivery: ["delivery", "location", "address", "track", "delivery info"],
    time: ["time", "hours", "open", "close"],
    payment: ["payment", "pay", "price", "card", "cash"],
    offers: ["offer", "discount", "promotion", "check offers"],
    help: ["help", "support", "assist", "help / support"],
    complaint: ["bad", "issue", "late", "wrong", "problem"],
    thanks: ["thank", "thanks"],
    menu: ["menu", "food items", "categories", "browse"],
    yes: ["yes", "yeah", "yep", "ok", "okay", "sure", "please"]
  };

  const replyMap = {
    greetings: "Hello! 👋 How can I help you today?",
    order: "You can place an order by browsing our menu. Would you like me to guide you step-by-step?",
    delivery: "To track or set your delivery location, please use the 'Orders' or 'Set Location' section.",
    time: "Our service hours are <b>9:00 AM – 11:00 PM</b> every day.",
    payment: "We accept cards, wallet payments, and cash on delivery.",
    offers: "Our latest offers are available in the Promotions section!",
    help: "Sure! Tell me what problem you're facing.",
    complaint: "I'm really sorry to hear that. Could you tell me what went wrong?",
    thanks: "You're welcome! 😊",
    menu: "You can browse food categories from the Browse section."
  };

  // User Message
  function handleUserMessage(msg) {

    // Track Yes 
    if (responses.yes.some(k => msg.includes(k)) && lastIntent === "order") {
      botReply(
        "Great! Here's how to place an order on SharePlate:<br><br>" +
        "1️⃣ Go to the <b>Browse</b> section<br>" +
        "2️⃣ Choose a category (Veg, Non-Veg, Snacks, etc.)<br>" +
        "3️⃣ Select a food item you like<br>" +
        "4️⃣ Click <b>Add to Cart</b><br>" +
        "5️⃣ Open your cart and press <b>Checkout</b><br><br>" +
        "If you'd like, I can help you choose your food too! 🍽️"
      );
      lastIntent = null;
      return;
    }

    // Detect
    for (let intent in responses) {
      if (responses[intent].some(keyword => msg.includes(keyword))) {
        botReply(replyMap[intent] || "Okay!");
        if (intent === "order") lastIntent = "order";
        return;
      }
    }

    // Fallback
    botReply("I'm not fully sure I understood that. Could you try rephrasing it?");
  }

});
