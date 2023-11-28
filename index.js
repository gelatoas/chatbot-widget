function createContainer() {
  var chatContainer = document.getElementById('chat-widget-container');

  chatContainer.style.position = 'fixed';
  chatContainer.style.bottom = '70px';
  chatContainer.style.right = '20px';
  chatContainer.style.width = '410px';
  chatContainer.style.height = '640px';
  chatContainer.style.border = '1px solid #ccc';
  chatContainer.style.borderRadius = '10px';
  chatContainer.style.background = '#fff';
  chatContainer.style.overflow = 'hidden';
  chatContainer.style.display = 'flex';
  chatContainer.style.flexDirection = 'column';

  document.body.appendChild(chatContainer);

  var chatMessages = document.createElement('div');
  chatMessages.id = 'chat-messages';
  chatMessages.style.height = 'calc(100% - 50px)';
  chatMessages.style.overflowY = 'auto';
  chatMessages.style.paddingTop = '40px';
  chatContainer.appendChild(chatMessages);

  var header = document.createElement('div');
  header.style.background = '#3498db';
  header.style.padding = '10px';
  header.style.textAlign = 'center';
  header.style.fontWeight = 'bold';
  header.style.color = '#fff';
  header.textContent = 'How can we help?';
  header.style.position = 'absolute';
  header.style.top = '0';
  header.style.width = '100%';

  var closeButton = document.createElement('button');
  closeButton.id = 'close-chat';
  closeButton.innerHTML = '&times;';
  closeButton.style.fontSize = '20px';
  closeButton.style.border = 'none';
  closeButton.style.backgroundColor = 'transparent';
  closeButton.style.color = '#555';
  closeButton.style.cursor = 'pointer';
  closeButton.style.position = 'absolute';
  closeButton.style.top = '10px';
  closeButton.style.right = '10px';

  header.appendChild(closeButton);
  chatContainer.appendChild(header);

  var inputContainer = document.createElement('div');
  inputContainer.style.display = 'flex';
  inputContainer.style.justifyContent = 'flex-end';
  inputContainer.style.margin = '5px';
  inputContainer.style.position = 'absolute';
  inputContainer.style.bottom = '0';
  // inputContainer.style.border = '1';

  var userInput = document.createElement('input');
  userInput.type = 'text';
  userInput.id = 'user-input';
  userInput.placeholder = 'Type your message...';
  userInput.style.border = '2px solid #ccc';
  userInput.style.borderRadius = '5px';
  userInput.style.padding = '10px';
  // userInput.style.margin = '5px';
  userInput.style.fontSize = '16px';
  userInput.style.width = '330px';
  userInput.style.boxShadow = '0 0 5px rgba(0, 0, 0, 0.1)';

  var sendButton = document.createElement('button');
  sendButton.id = 'send-button';
  sendButton.textContent = 'Send';
  sendButton.style.width = '50px';
  sendButton.style.marginLeft = '5px';
  // sendButton.style.padding = '10px';
  sendButton.style.border = 'none';
  sendButton.style.borderRadius = '5px';
  sendButton.style.background = '#3498db';
  sendButton.style.color = '#fff';
  sendButton.style.fontWeight = 'bold';
  sendButton.style.cursor = 'pointer';

  userInput.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      sendButton.click();
    }
  });
  inputContainer.appendChild(userInput);

  inputContainer.appendChild(sendButton);

  chatContainer.appendChild(inputContainer);

  var chatButton = document.getElementById('chat-button');
  chatButton.style.position = 'fixed';
  chatButton.style.bottom = '20px';
  chatButton.style.right = '20px';
  chatButton.style.backgroundColor = '#3498db';
  chatButton.style.color = '#ffffff';
  chatButton.style.padding = '10px';
  chatButton.style.border = 'none';
  chatButton.style.borderRadius = '5px';
  chatButton.style.cursor = 'pointer';

  chatButton.addEventListener('click', toggleChatContainer);

  closeButton.addEventListener('click', function () {
    chatContainer.style.display = 'none';
    chatButton.style.display = 'block';
  });

  sendButton.addEventListener('click', function () {
    var message = userInput.value;
    if (message.trim() !== '') {
      sendMessage('user', message);
      var assistantId = chatContainer.getAttribute('assistantId');
      var requestBody = {
        assistantId: assistantId,
        comment: message,
      };

      fetch(`http://localhost:4200/api/error-report/v1/assistance/${assistantId}/ask`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })
        .then(response => response.json())
        .then(data => {
          sendMessage('bot', data.data.comment);
        })
        .catch(error => {
          console.error('Error during API call:', error);
        });
      userInput.value = '';
    }
  });

  var isChatContainerVisible = false;

  function toggleChatContainer() {
    if (isChatContainerVisible) {
      chatContainer.style.display = 'none';
      chatButton.style.display = 'block';
    } else {
      chatContainer.style.display = 'block';
      chatButton.style.display = 'none';
    }
    isChatContainerVisible = !isChatContainerVisible;
  }

  var chatStyles = `
  #chatMessages {
    /* Add any styling for the chat container here */
  }

  .sender {
    background-color: #4CAF50;
    color: white;
    padding: 10px;
    margin: 5px 0;
    border-radius: 10px;
    float: right;
  }

  .receiver {
    background-color: #f1f1f1;
    color: black;
    padding: 10px;
    margin: 5px 0;
    border-radius: 10px;
    float: left;
  }
`;

  var styleElement = document.createElement('style');
  styleElement.type = 'text/css';
  styleElement.appendChild(document.createTextNode(chatStyles));
  document.head.appendChild(styleElement);

  function sendMessage(sender, message) {
    var messageElement = document.createElement('div');
    messageElement.textContent = message; // sender + ': ' + message;

    if (sender === 'user') {
      messageElement.className = 'sender';
    } else {
      messageElement.className = 'receiver';
    }

    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
  closeButton.click();
}

createContainer();
