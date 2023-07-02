import React, { useState } from 'react';
import styles from "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
} from "@chatscope/chat-ui-kit-react";

const isProd = true;

const vanjaCloudUrl = isProd
  ? "https://cloud.vanja.oljaca.me"
  : "https://dev.cloud.vanja.oljaca.me";

async function sendMessageAPI(blogId, context, message) {
  console.log('sending', blogId, context, message)
  const response = await fetch(`${vanjaCloudUrl}/api/main/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({blogId, context, message})
  });

  const json = await response.json();
  console.log(json);
  return json.response;
}


export function App() {
  const [blogId, setBlogId] = React.useState(1); // [state, setState
  const [blogText, setBlogText] = React.useState('');
  const [initialized, setInitialized] = React.useState(false);

  if (!initialized) {
    console.log('initializing')
    setInitialized(true);
    return <div>initializing</div>
  }

  return (<div>
    <div>test</div>
    <button onClick={e => sendMessageAPI(blogId, null, 'test')}>test</button>
    <ChatInterface blogId={blogId}/>
  </div>);
}

function ChatInterface({blogId}) {
  return (
    <div style={{position: "relative", height: "500px"}}>
      <MainContainer>
        <ChatContainer>
          <MessageList>
            <Message
              model={{
                message: "Hello my friend",
                sentTime: "just now",
                sender: "Joe",
              }}
            />
            <Message
              model={{
                message: "Hello my friend\n\nkjdsjfds",
                sentTime: "just now",
                sender: "Joe",
              }}
            />
            <Message
              model={{
                message: "Hello my friendHello my friendHello my friendHello my friendHello my friendHello my friendHello my friendHello my friendHello my friendHello my friendHello my friendHello my friendHello my friendHello my friendHello my friendHello my friendHello my friendHello my friendHello my friendHello my friendHello my friend",
                sentTime: "just now",
                sender: "Joe",
              }}
            />
          </MessageList>
          <MessageInput placeholder="Type message here"/>
        </ChatContainer>
      </MainContainer>
    </div>);
}

const ChatInterface2 = ({blogId}) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');


  const sendMessage = async (message) => {
    // Add the message to the chat box
    const m = [...messages, {text: message, type: 'user'}]
    setMessages(m);

    console.log('updated local context', m)

    // Call your async function to get a response from the server
    const response = await sendMessageAPI(blogId, messages, message);

    console.log('response', response)
    // Add the response to the chat box
    const m2 = [...m, {text: response, type: 'system'}];
    setMessages(m2);
    console.log('updated local context', m2)
    return null;
  };

  const handleSend = () => {
    if (input.trim() !== '') {
      sendMessage(input);
      setInput('');
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div>
      <div>
        UPDATED
        {messages.map((message, index) => (
          <div key={index}>
            <strong>{message.type}:</strong> {message.text}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={handleKeyPress}
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
};