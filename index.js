function createContainer() {
  // CSS files section start
  const linkElement = document.createElement("link");
  linkElement.rel = "stylesheet";
  linkElement.type = "text/css";
  linkElement.href = "https://gelatoas.github.io/chatbot-widget/index.css";
  // linkElement.href = '/chatbot/index.css';
  document.head.appendChild(linkElement);
  // CSS files section end

  // JS Libs section start
  const script = document.createElement("script");
  script.type = "module";
  script.src = "https://md-block.verou.me/md-block.js";
  document.head.appendChild(script);
  // JS Libs section end

  // Attributes section start
  const defaultWelcomeMessage = "Hi 👋, I’m GelatoGPT. How can I help you ?";
  var threadId = "";
  var isChatContainerVisible = false;
  const isProduction = true;
  const baseURL = isProduction
    ? "https://dashboard.gelato.com/api/error-report/v1/assistance"
    : "https://dashboard.test.gelato.tech/api/error-report/v1/assistance";

  const assistantId = chatContainer.getAttribute("assistantId");
  // Attributes section end

  // Elements section start
  var chatContainer = document.getElementById("chat-widget-container");
  // chatContainer.id = "chat-container";
  chatContainer.classList.add("chat-container");
  document.body.appendChild(chatContainer);

  var chatMessages = document.createElement("div");
  chatMessages.id = "chat-messages";
  chatMessages.classList.add("chat-messages");
  chatContainer.appendChild(chatMessages);

  var typingElement = document.createElement("div");
  typingElement.id = "typingElement";
  typingElement.innerHTML = "GelatoGPT is typing. Please wait...";
  typingElement.classList.add("typing-element");
  chatContainer.appendChild(typingElement);

  var header = document.createElement("div");
  header.id = "chat-header";
  if (chatContainer.getAttribute("header")?.trim()) {
    header.textContent = chatContainer.getAttribute("header");
  } else {
    header.textContent = "Chatbot";
  }
  if (chatContainer.getAttribute("headerColor")?.trim()) {
    header.style.background = chatContainer.getAttribute("headerColor");
  }
  header.classList.add("chat-header");

  var closeButton = document.createElement("button");
  closeButton.id = "close-chat";
  closeButton.classList.add("close-chat");
  closeButton.addEventListener("click", handleCloseButtonClick);

  var svgImage = document.createElement("img");
  svgImage.classList.add("close-icon-32");
  svgImage.src =
    "https://gelatoas.github.io/chatbot-widget/assets/close-icon.png";
  svgImage.alt = "Close icon";

  closeButton.appendChild(svgImage);
  header.appendChild(closeButton);
  chatContainer.appendChild(header);

  var inputContainer = document.createElement("div");
  inputContainer.id = "input-container";
  inputContainer.classList.add("input-container");

  var userInput = document.createElement("input");
  userInput.type = "text";
  userInput.id = "user-input";
  userInput.classList.add("user-input");
  userInput.placeholder = "Type your message...";
  userInput.addEventListener("keydown", handleKeyDownEvent);

  var sendButton = document.createElement("button");
  sendButton.id = "send-button";
  sendButton.classList.add("send-button");
  sendButton.textContent = "Send";
  sendButton.addEventListener("click", handleSendButtonClick);

  inputContainer.appendChild(userInput);
  inputContainer.appendChild(sendButton);
  chatContainer.appendChild(inputContainer);

  var chatButton = document.getElementById("chat-button");
  chatButton.id = "chat-button";
  chatButton.classList.add("chat-button");
  if (!chatButton.textContent.trim()) {
    chatButton.textContent = "Chat";
  }
  if (chatButton.getAttribute("chatColor")?.trim()) {
    chatButton.style.background = chatButton.getAttribute("chatColor");
  }
  chatButton.addEventListener("click", toggleChatContainer);
  // Elements section end

  // Function start
  function handleSendButtonClick() {
    const message = userInput.value.trim();

    if (!message) {
      return;
    }

    disableInput();
    sendMessage("user", message, true);

    const disableThread = chatContainer.getAttribute("disableThread");

    const requestBody = {
      threadId: threadId,
      comment: message,
    };

    let URL;
    if (disableThread) {
      URL = `${baseURL}/${assistantId}/ask?disableThread=true`;
    } else {
      URL = `${baseURL}/${assistantId}/ask`;
    }

    fetch(`${URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => response.json())
      .then((data) => {
        threadId = data.data.threadId;
        const comment = filterErrors(data.data.comment);
        sendMessage("bot", comment, true);
      })
      .catch((error) => {
        console.error("Error during API call:", error);
        sendMessage(
          "bot",
          "Sorry, looks like something went wrong. Please try again or reach out to gc-support@gelato.com for further queries.",
          false
        );
      })
      .finally(() => {
        enableInput();
        // clearInput();
      });
    clearInput();
  }

  function disableInput() {
    typingElement.style.display = "block";
    userInput.disabled = true;
    sendButton.disabled = true;
  }

  function enableInput() {
    typingElement.style.display = "none";
    userInput.disabled = false;
    sendButton.disabled = false;
  }

  function clearInput() {
    userInput.value = "";
  }

  function handleCloseButtonClick() {
    chatContainer.style.display = "none";
    chatButton.style.display = "block";
  }
  function handleKeyDownEvent(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      sendButton.click();
    }
  }
  function filterErrors(text) {
    let start = text.indexOf("【");
    let end = text.indexOf("】");

    let beginText = text.substring(0, start);
    let endText = text.substring(end + 1, text.length);

    return beginText + endText;
  }
  function toggleChatContainer() {
    if (isChatContainerVisible) {
      chatContainer.style.display = "none";
      chatButton.style.display = "block";
    } else {
      chatContainer.style.display = "block";
      chatButton.style.display = "none";
    }
    isChatContainerVisible = !isChatContainerVisible;
  }

  function handleFeedback(threadId, feedback) {
    var requestBody = {
      feedback: feedback,
    };

    fetch(`${baseURL}/${threadId}/feedback`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => response.json())
      .then((data) => {
        // sendMessage("bot", data.data.comment);
        var feedbackStart = document.getElementById(
          "feedbackStart-" + threadId
        );
        var feedbackComplete = document.getElementById(
          "feedbackComplete-" + threadId
        );

        feedbackStart.style.display = "none";
        feedbackComplete.style.display = "block";
      })
      .catch((error) => {
        console.error("Error during API call:", error);
      });
  }

  function createThumbButton(iconPath, className) {
    const button = document.createElement("button");
    button.classList.add("icon-button");
    // button.innerHTML = "Click me";

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    svg.setAttribute("height", "16");
    svg.setAttribute("width", "16");
    svg.setAttribute("viewBox", "0 0 512 512");

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", iconPath);
    path.setAttribute("fill", "black");
    svg.appendChild(path);
    button.appendChild(svg);

    return button;
  }

  function sendMessage(sender, message, showFeedback) {
    var messageElement = document.createElement("div");
    var feedbackDiv = document.createElement("div");
    const enableFeedback = chatContainer.getAttribute("enableFeedback")?.trim();

    var feedbackCompleteSpan = document.createElement("span");
    var mdBlock = document.createElement("md-block");
    var hrElement = document.createElement("hr");
    if (!enableFeedback) {
      feedbackDiv.style.display = "none";
      hrElement.style.display = "none";
    }

    mdBlock.innerHTML = message;

    if (sender === "user") {
      messageElement.className = "sender";
    } else {
      messageElement.className = "receiver";

      if (showFeedback) {
        feedbackDiv.id = "feedbackStart-" + threadId;
        feedbackDiv.className = "feedback-buttons";

        var thumbsUpButton = createThumbButton(
          "M313.4 32.9c26 5.2 42.9 30.5 37.7 56.5l-2.3 11.4c-5.3 26.7-15.1 52.1-28.8 75.2H464c26.5 0 48 21.5 48 48c0 18.5-10.5 34.6-25.9 42.6C497 275.4 504 288.9 504 304c0 23.4-16.8 42.9-38.9 47.1c4.4 7.3 6.9 15.8 6.9 24.9c0 21.3-13.9 39.4-33.1 45.6c.7 3.3 1.1 6.8 1.1 10.4c0 26.5-21.5 48-48 48H294.5c-19 0-37.5-5.6-53.3-16.1l-38.5-25.7C176 420.4 160 390.4 160 358.3V320 272 247.1c0-29.2 13.3-56.7 36-75l7.4-5.9c26.5-21.2 44.6-51 51.2-84.2l2.3-11.4c5.2-26 30.5-42.9 56.5-37.7zM32 192H96c17.7 0 32 14.3 32 32V448c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32V224c0-17.7 14.3-32 32-32z"
        );
        thumbsUpButton.addEventListener("click", function () {
          var feedback = 1;
          handleFeedback(threadId, feedback);
        });

        var thumbsDownButton = createThumbButton(
          "M313.4 479.1c26-5.2 42.9-30.5 37.7-56.5l-2.3-11.4c-5.3-26.7-15.1-52.1-28.8-75.2H464c26.5 0 48-21.5 48-48c0-18.5-10.5-34.6-25.9-42.6C497 236.6 504 223.1 504 208c0-23.4-16.8-42.9-38.9-47.1c4.4-7.3 6.9-15.8 6.9-24.9c0-21.3-13.9-39.4-33.1-45.6c.7-3.3 1.1-6.8 1.1-10.4c0-26.5-21.5-48-48-48H294.5c-19 0-37.5 5.6-53.3 16.1L202.7 73.8C176 91.6 160 121.6 160 153.7V192v48 24.9c0 29.2 13.3 56.7 36 75l7.4 5.9c26.5 21.2 44.6 51 51.2 84.2l2.3 11.4c5.2 26 30.5 42.9 56.5 37.7zM32 384H96c17.7 0 32-14.3 32-32V128c0-17.7-14.3-32-32-32H32C14.3 96 0 110.3 0 128V352c0 17.7 14.3 32 32 32z"
        );
        thumbsDownButton.addEventListener("click", function () {
          var feedback = -1;
          handleFeedback(threadId, feedback);
        });
        var feedbackMsg = document.createElement("span");
        feedbackMsg.innerHTML = "Are you satisfied with this answer?";

        hrElement.style.border = "none";
        hrElement.style.height = "1px";
        hrElement.style.backgroundColor = "black";
        // feedbackDiv.appendChild(hrElement);

        feedbackDiv.appendChild(feedbackMsg);
        feedbackDiv.appendChild(thumbsUpButton);
        feedbackDiv.appendChild(thumbsDownButton);

        // mdBlock.appendChild(feedbackDiv);

        feedbackCompleteSpan.id = "feedbackComplete-" + threadId;
        feedbackCompleteSpan.innerHTML = "Thank you for your feedback";
        feedbackCompleteSpan.style.float = "right";
        feedbackCompleteSpan.style.display = "none";
      }
    }
    messageElement.appendChild(mdBlock);
    if (sender === "bot" && showFeedback) {
      messageElement.appendChild(hrElement);
    }
    messageElement.appendChild(feedbackDiv);
    messageElement.appendChild(feedbackCompleteSpan);

    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function init() {
    closeButton.click();
    const attributeWelcomeMessage =
      chatContainer.getAttribute("welcomeMessage");
    const welcomeMessage = attributeWelcomeMessage
      ? attributeWelcomeMessage
      : defaultWelcomeMessage;
    sendMessage("bot", welcomeMessage, false);
  }
  // Function ends
  init();
}

createContainer();
