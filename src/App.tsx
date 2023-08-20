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
import ColourSpinner from "./ColourSpinner";
import { generateAnalogousColors } from "./colours";


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

  const colours = generateAnalogousColors([[100,100, 100], [197,227,250]])

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

            <ColourSpinner visible={false || inflight != 0} transitionSpeed={3}
                           // endColor={[100,0,0]} startColor={[50,120,100]}
              endColor={colours[1]} startColor={colours[0]}
                           pauseDuration={0.5}
            />
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