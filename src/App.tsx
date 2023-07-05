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
import * as Spinners from 'react-spinners';

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

import React, { useState, useEffect } from 'react';

function ColorChangingComponent() {
  const [color, setColor] = useState('hsl(0, 100%, 50%)');
  const [transitionDuration, setTransitionDuration] = useState('0.433s');

  useEffect(() => {
    let hue = 0;
    const intervalId = setInterval(() => {
      hue = (hue + 1) % 360;
      setColor(`hsl(${hue}, 100%, 50%)`);

      // Oscillate transition duration between 0.433s and 1.3s
      setTransitionDuration(`${(Math.sin(hue / 60) + 1) / 2 * 0.867 + 0.433}s`);
    }, 20);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div
      style={{
        backgroundColor: color,
        transition: `background-color ${transitionDuration} cubic-bezier(0.47, 0, 0.745, 0.715)`,
        width: '100vw',
        height: '100vh',
      }}
    />
  );
}

function ChatInterface({blogId}) {
  const [context, setContext] = useState<MessageModel[]>([]);
  const [inflight, setInflight] = useState(0);

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
            <Spinners.PacmanLoader
              loading={inflight != 0}
              color="goldenrod"
              size={15} />
          </MessageList>
          <MessageInput placeholder="Type message here"
                  onSend={async (message) => {
                    console.log('sending', message)
                    addMessage('user', message);
                    setInflight(i => i + 1)
                    const r = await sendMessageAPI(blogId, [], message)
                    console.log('received', r)
                    addMessage('system', r);
                    setInflight(i => i - 1)
                  }}
            />
        </ChatContainer>
      </MainContainer>
    </div>);
}