import React, { useState } from 'react';
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput, MessageType,
} from "@chatscope/chat-ui-kit-react";
import { MessageModel, MessagePayload } from "@chatscope/chat-ui-kit-react/src/components/Message/Message";
import { MessageDirection } from "@chatscope/chat-ui-kit-react/src/types/unions";

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
    <ChatInterface blogId={blogId}/>
  </div>);
}

function ChatInterface({blogId}) {
  const [context, setContext] = useState<MessageModel[]>([]);

  function addMessage(sender, text) {
    const m = {
      message: text,
      sentTime: new Date().toLocaleTimeString(),
      sender: sender,
      direction: sender == "system" ? 'incoming' : 'outgoing'
    } as MessageModel;
    setContext(old => [...old, m])
  }

  return (
    <div style={{position: "relative", height: "500px"}}>
      <MainContainer>
        <ChatContainer>
          <MessageList>
            { context.map((model, index) => (
              <Message
                key={index}
                model={model}
                />))
            }
          </MessageList>
          <MessageInput placeholder="Type message here"
                  onSend={async (message) => {
                    console.log('sending', message)
                    addMessage('user', message);
                    const r = await sendMessageAPI(blogId, [], message)
                    console.log('received', r)
                    addMessage('system', r);
                  }}
            />
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