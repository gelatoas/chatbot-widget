document.addEventListener("DOMContentLoaded", function () {
  // Create the chat widget container dynamically
  var chatContainer = document.createElement("div");
  chatContainer.id = "chat-widget-container";
  chatContainer.style.display = "none";

  // Additional styles for the chat container
  chatContainer.style.position = "fixed";
  chatContainer.style.bottom = "70px"; // Adjust the distance from the bottom as needed
  chatContainer.style.right = "20px";
  chatContainer.style.width = "300px"; // Set the desired width
  chatContainer.style.height = "400px"; // Set the desired height
  chatContainer.style.border = "1px solid #ccc";
  chatContainer.style.borderRadius = "10px";
  chatContainer.style.overflow = "hidden";

  document.body.appendChild(chatContainer);

  // Create the header with the name "MyChatBot"
  var header = document.createElement("div");
  header.style.background = "#f0f0f0";
  header.style.padding = "10px";
  header.style.textAlign = "center";
  header.style.fontWeight = "bold";
  header.textContent = "MyChatBot";
  chatContainer.appendChild(header);

  // Create the container for chat messages
  var chatMessages = document.createElement("div");
  chatMessages.id = "chat-messages";
  chatMessages.style.height = "calc(100% - 120px)"; // Adjust the height based on the chat container dimensions
  chatMessages.style.overflowY = "auto";
  chatContainer.appendChild(chatMessages);

  // Create the close button with a cross icon
  var closeButton = document.createElement("button");
  closeButton.id = "close-chat";
  closeButton.innerHTML = "&times;"; // HTML entity for the "times" symbol (X)
  closeButton.style.fontSize = "20px";
  closeButton.style.border = "none";
  closeButton.style.backgroundColor = "transparent";
  closeButton.style.color = "#555";
  closeButton.style.cursor = "pointer";
  closeButton.style.position = "absolute";
  closeButton.style.top = "10px";
  closeButton.style.right = "10px";

  chatContainer.appendChild(closeButton);

  // Create the container for user input and send button
  var inputContainer = document.createElement("div");
  inputContainer.style.display = "flex";
  inputContainer.style.margin = "5px";

  // Create the input field for user messages
  var userInput = document.createElement("input");
  userInput.type = "text";
  userInput.id = "user-input";
  userInput.placeholder = "Type your message...";
  userInput.style.flex = "1"; // Use flex to allow the input to grow
  inputContainer.appendChild(userInput);

  // Create the send button for user messages
  var sendButton = document.createElement("button");
  sendButton.id = "send-button";
  sendButton.textContent = "Send";
  sendButton.style.width = "80px"; // Set the desired width
  inputContainer.appendChild(sendButton);

  chatContainer.appendChild(inputContainer);

  // Create the chat button dynamically
  var chatButton = document.createElement("button");
  chatButton.id = "chat-button";
  chatButton.textContent = "Chat";
  document.body.appendChild(chatButton);

  // Apply styles to position the chat button at the bottom right corner
  chatButton.style.position = "fixed";
  chatButton.style.bottom = "20px";
  chatButton.style.right = "20px";

  // Button click event to show/hide the chat widget
  chatButton.addEventListener("click", function () {
    chatContainer.style.display = "block";
  });

  closeButton.addEventListener("click", function () {
    chatContainer.style.display = "none";
  });

  // Send a message event
  sendButton.addEventListener("click", function () {
    var message = userInput.value;
    if (message.trim() !== "") {
      sendMessage("user", message);
      // Simulate a bot response after a short delay
      setTimeout(function () {
        sendMessage("bot", "This is a sample response.");
      }, 1000);
      userInput.value = ""; // Clear the input field
    }
  });

  // Function to add a message to the chat
  function sendMessage(sender, message) {
    var messageElement = document.createElement("div");
    messageElement.className = sender;
    messageElement.textContent = sender + ": " + message;
    chatMessages.appendChild(messageElement);
  }
});
