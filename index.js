function createContainer() {
  var threadId = '';
  var chatContainer = document.getElementById('chat-widget-container');

  chatContainer.style.position = 'fixed';
  chatContainer.style.bottom = '2%';
  chatContainer.style.right = '2%';
  chatContainer.style.width = '28%';
  chatContainer.style.height = '80vh';
  chatContainer.style.border = '1px solid #ccc';
  chatContainer.style.borderRadius = '10px';
  chatContainer.style.background = '#fff';
  chatContainer.style.overflow = 'hidden';
  chatContainer.style.display = 'flex';
  chatContainer.style.flexDirection = 'column';

  document.body.appendChild(chatContainer);

  var chatMessages = document.createElement('div');
  chatMessages.id = 'chat-messages';
  chatMessages.style.height = 'calc(100% - 85px)';
  chatMessages.style.overflowY = 'auto';
  chatMessages.style.paddingTop = '15%';
  chatMessages.style.paddingLeft = '5%';
  chatMessages.style.width = '95%';
  chatContainer.appendChild(chatMessages);

  var typingElement = document.createElement('div');
  typingElement.id = 'typingElement';
  typingElement.innerHTML = 'GelatoGPT is typing. Please wait...';
  typingElement.style.width = '250px';
  typingElement.style.height = '20px';
  typingElement.style.paddingLeft = '10px';
  typingElement.style.marginBottom = '15%';
  typingElement.style.marginRight = '5%';
  typingElement.style.right = '0';
  typingElement.style.bottom = '0';
  typingElement.style.position = 'absolute';
  typingElement.style.backgroundColor = 'grey';
  typingElement.style.color = 'white';
  typingElement.style.borderRadius = '10px';
  typingElement.style.float = 'right';
  typingElement.style.display = 'none';

  chatContainer.appendChild(typingElement);

  var header = document.createElement('div');
  header.style.background = '#212529';
  header.style.padding = '4%';
  header.style.textAlign = 'center';
  // header.style.fontWeight = 'bold';
  header.style.color = '#fff';
  header.textContent = '✨ Gelato GPT';
  header.style.fontSize = '16px';
  header.style.position = 'absolute';
  header.style.top = '0';
  header.style.width = '100%';

  var closeButton = document.createElement('button');
  closeButton.id = 'close-chat';
  closeButton.innerHTML =
    '<svg data-v-3a871e6c="" data-v-1709d122="" viewBox="0 0 24 24" class="svg-icon svg-fill svg-up cl-icon cl-chatbox-btn" aria-label="Close widget" role="button" tabindex="6" style="width: 24px; height: 24px; min-width: 24px;"><path fill="white" stroke="none" pid="0" d="M4 12a1 1 0 0 1 1-1h14a1 1 0 1 1 0 2H5a1 1 0 0 1-1-1Z" _fill="currentColor"></path></svg>';

  closeButton.style.fontSize = '20px';
  closeButton.style.border = 'none';
  closeButton.style.backgroundColor = 'transparent';
  closeButton.style.color = '#555';
  closeButton.style.cursor = 'pointer';
  closeButton.style.position = 'absolute';
  closeButton.style.top = '1%';
  closeButton.style.right = '2%';
  closeButton.style.paddingTop = '2%';

  header.appendChild(closeButton);
  chatContainer.appendChild(header);

  var inputContainer = document.createElement('div');
  inputContainer.style.display = 'flex';
  // inputContainer.style.justifyContent = 'flex-end';
  inputContainer.style.margin = '1%';
  inputContainer.style.position = 'absolute';
  inputContainer.style.bottom = '0';
  inputContainer.style.width = '100%';
  // inputContainer.style.border = '1';

  var userInput = document.createElement('input');
  userInput.type = 'text';
  userInput.id = 'user-input';
  userInput.placeholder = 'Type your message...';
  userInput.style.border = '2px solid #ccc';
  userInput.style.borderRadius = '5px';
  userInput.style.padding = '3%';
  // userInput.style.margin = '5px';
  userInput.style.fontSize = '16px';
  userInput.style.width = '80%';
  userInput.style.boxShadow = '0 0 5px rgba(0, 0, 0, 0.1)';
  // userInput.style.resize = 'vertical';
  // userInput.rows = 2;

  var sendButton = document.createElement('button');
  sendButton.id = 'send-button';
  sendButton.textContent = 'Send';
  sendButton.style.width = '14%';
  sendButton.style.marginLeft = '2%';
  // sendButton.style.padding = '10px';
  sendButton.style.border = 'none';
  sendButton.style.borderRadius = '5px';
  sendButton.style.background = '#212529';
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
  chatButton.style.backgroundColor = '#212529';
  chatButton.style.color = '#ffffff';
  chatButton.style.padding = '10px';
  chatButton.style.border = 'none';
  chatButton.style.borderRadius = '30px';
  chatButton.style.cursor = 'pointer';
  chatButton.textContent = '✨ Gelato GPT';
  chatButton.addEventListener('click', toggleChatContainer);

  closeButton.addEventListener('click', function () {
    chatContainer.style.display = 'none';
    chatButton.style.display = 'block';
  });

  function filterErrors(text) {
    let start = text.indexOf('【');
    let end = text.indexOf('】');

    let beginText = text.substring(0, start);
    let endText = text.substring(end + 1, text.length);

    return beginText + endText;
  }

  sendButton.addEventListener('click', function () {
    var message = userInput.value;
    if (message) {
      typingElement.style.display = 'block';
      userInput.disabled = true;
      sendButton.disabled = true;
    }
    if (message.trim() !== '') {
      sendMessage('user', message, true);
      var assistantId = chatContainer.getAttribute('assistantId');
      var requestBody = {
        threadId: threadId,
        comment: message,
      };
      const isProduction = true;
      const baseURL = isProduction
        ? 'https://dashboard.gelato.com/api/error-report/v1/assistance'
        : 'https://dashboard.test.gelato.tech/api/error-report/v1/assistance';

      const URL = `${baseURL}/${assistantId}/ask`;

      fetch(`${URL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })
        .then(response => response.json())
        .then(data => {
          threadId = data.data.threadId;
          var comment = filterErrors(data.data.comment);
          // var comment = data.data.comment;
          sendMessage('bot', comment, true);
          typingElement.style.display = 'none';
          userInput.disabled = false;
          sendButton.disabled = false;
        })
        .catch(error => {
          console.error('Error during API call:', error);
          sendMessage(
            'bot',
            'Sorry, looks like something went wrong.Please try again or reach out to gc-support@gelato.com for further queries.',
            false,
          );
          typingElement.style.display = 'none';
          userInput.disabled = false;
          sendButton.disabled = false;
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
    background-color: #0c5a9f;
    color: white;
    padding: 10px;
    // padding-left: 10px;
    // padding-right: 10px;
    margin: 5px 0;
    border-radius: 10px;
    float: right;
  }

  .receiver {
    background-color: #c1c1c1;
    color: black;
    padding: 10px;
    // padding-left: 10px;
    // padding-right: 5px;
    // padding-bottom: 5px;
    margin: 5px 0;
    border-radius: 10px;
    float: left;
  }

  .feedback-buttons button {
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 10px;
    // font-size: 16px; /* Adjust the font size as needed */
}
`;

  var styleElement = document.createElement('style');
  styleElement.type = 'text/css';
  styleElement.appendChild(document.createTextNode(chatStyles));
  document.head.appendChild(styleElement);

  const script = document.createElement('script');
  script.type = 'module';
  script.src = 'https://md-block.verou.me/md-block.js';
  document.head.appendChild(script);

  function handleFeedback(threadId, feedback) {
    var requestBody = {
      feedback: feedback,
    };

    fetch(`https://dashboard.test.gelato.tech/api/error-report/v1/assistance/${threadId}/feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })
      .then(response => response.json())
      .then(data => {
        // sendMessage("bot", data.data.comment);
        var feedbackStart = document.getElementById('feedbackStart-' + threadId);
        var feedbackComplete = document.getElementById('feedbackComplete-' + threadId);

        feedbackStart.style.display = 'none';
        feedbackComplete.style.display = 'block';
      })
      .catch(error => {
        console.error('Error during API call:', error);
      });
  }

  function createThumbButton(iconPath, className) {
    const button = document.createElement('button');
    button.classList.add('icon-button');
    // button.innerHTML = "Click me";

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    svg.setAttribute('height', '16');
    svg.setAttribute('width', '16');
    svg.setAttribute('viewBox', '0 0 512 512');

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', iconPath);
    path.setAttribute('fill', 'black');
    // Append path to SVG, and SVG to the button
    svg.appendChild(path);
    button.appendChild(svg);

    return button;
  }

  function sendMessage(sender, message, showFeedback) {
    var messageElement = document.createElement('div');
    var feedbackDiv = document.createElement('div');
    feedbackDiv.style.display = 'none';
    var feedbackCompleteSpan = document.createElement('span');
    var mdBlock = document.createElement('md-block');
    var hrElement = document.createElement('hr');
    hrElement.style.display = 'none';

    mdBlock.innerHTML = message;

    if (sender === 'user') {
      messageElement.className = 'sender';
    } else {
      messageElement.className = 'receiver';

      if (showFeedback) {
        feedbackDiv.id = 'feedbackStart-' + threadId;
        feedbackDiv.className = 'feedback-buttons';

        var thumbsUpButton = createThumbButton(
          'M313.4 32.9c26 5.2 42.9 30.5 37.7 56.5l-2.3 11.4c-5.3 26.7-15.1 52.1-28.8 75.2H464c26.5 0 48 21.5 48 48c0 18.5-10.5 34.6-25.9 42.6C497 275.4 504 288.9 504 304c0 23.4-16.8 42.9-38.9 47.1c4.4 7.3 6.9 15.8 6.9 24.9c0 21.3-13.9 39.4-33.1 45.6c.7 3.3 1.1 6.8 1.1 10.4c0 26.5-21.5 48-48 48H294.5c-19 0-37.5-5.6-53.3-16.1l-38.5-25.7C176 420.4 160 390.4 160 358.3V320 272 247.1c0-29.2 13.3-56.7 36-75l7.4-5.9c26.5-21.2 44.6-51 51.2-84.2l2.3-11.4c5.2-26 30.5-42.9 56.5-37.7zM32 192H96c17.7 0 32 14.3 32 32V448c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32V224c0-17.7 14.3-32 32-32z',
        );
        thumbsUpButton.addEventListener('click', function () {
          var feedback = 1;
          handleFeedback(threadId, feedback);
        });

        var thumbsDownButton = createThumbButton(
          'M313.4 479.1c26-5.2 42.9-30.5 37.7-56.5l-2.3-11.4c-5.3-26.7-15.1-52.1-28.8-75.2H464c26.5 0 48-21.5 48-48c0-18.5-10.5-34.6-25.9-42.6C497 236.6 504 223.1 504 208c0-23.4-16.8-42.9-38.9-47.1c4.4-7.3 6.9-15.8 6.9-24.9c0-21.3-13.9-39.4-33.1-45.6c.7-3.3 1.1-6.8 1.1-10.4c0-26.5-21.5-48-48-48H294.5c-19 0-37.5 5.6-53.3 16.1L202.7 73.8C176 91.6 160 121.6 160 153.7V192v48 24.9c0 29.2 13.3 56.7 36 75l7.4 5.9c26.5 21.2 44.6 51 51.2 84.2l2.3 11.4c5.2 26 30.5 42.9 56.5 37.7zM32 384H96c17.7 0 32-14.3 32-32V128c0-17.7-14.3-32-32-32H32C14.3 96 0 110.3 0 128V352c0 17.7 14.3 32 32 32z',
        );
        thumbsDownButton.addEventListener('click', function () {
          var feedback = -1;
          handleFeedback(threadId, feedback);
        });
        var feedbackMsg = document.createElement('span');
        feedbackMsg.innerHTML = 'Are you satisfied with this answer?';

        hrElement.style.border = 'none';
        hrElement.style.height = '1px';
        hrElement.style.backgroundColor = 'black';
        // feedbackDiv.appendChild(hrElement);

        feedbackDiv.appendChild(feedbackMsg);
        feedbackDiv.appendChild(thumbsUpButton);
        feedbackDiv.appendChild(thumbsDownButton);

        // mdBlock.appendChild(feedbackDiv);

        feedbackCompleteSpan.id = 'feedbackComplete-' + threadId;
        feedbackCompleteSpan.innerHTML = 'Thank you for your feedback';
        feedbackCompleteSpan.style.float = 'right';
        feedbackCompleteSpan.style.display = 'none';
      }
    }
    messageElement.appendChild(mdBlock);
    if (sender === 'bot' && showFeedback) {
      messageElement.appendChild(hrElement);
    }
    messageElement.appendChild(feedbackDiv);
    messageElement.appendChild(feedbackCompleteSpan);

    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
  closeButton.click();
  sendMessage(
    'bot',
    'Hi 👋, I’m GelatoGPT. Just ask me any questions you have about GelatoConnect Procurement and I will be happy to help!',
    false,
  );
}

createContainer();
