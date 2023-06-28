import React from "react";

const isProd = true;

const vanjaCloudUrl = isProd
    ? "https://cloud.vanja.oljaca.me"
    : "https://dev.cloud.vanja.oljaca.me";

async function getBlogAPI(blogId) {
    // todo: blog id to query param? /${blogId}
    const response = await fetch(`${vanjaCloudUrl}/api/main/blog`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({blogId})
    });
    const json = await response.json();
    console.log(json);
    return json;
}

async function sendMessageAPI(blogId, context, message) {
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
        getBlogAPI(blogId).then(blog => {
            setInitialized(true);
            setBlogId(blog.id)
            setBlogText(blog.text);
            console.log(blog);
        });
        return <div>initializing</div>
    }

    return (<div>
        <h1>Hello world!</h1>
        <div>id: {blogId}</div>
        <p>{blogText}</p>
        <button onClick={e => sendMessageAPI(blogId, null, 'test')}>test</button>
        <ChatInterface blogId={blogId}/>
    </div>);
}

import React, {useState} from 'react';

const ChatInterface = ({blogId}) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');


    const sendMessage = async (message) => {
        // Add the message to the chat box
        const m = [...messages, {text: message, sender: 'user'}]
        setMessages(m);

        // Call your async function to get a response from the server
        const response = await sendMessageAPI(blogId, messages, message);

        // Add the response to the chat box
        setMessages([...m, {text: response, sender: 'server'}]);
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
                {messages.map((message, index) => (
                    <div key={index}>
                        <strong>{message.sender}:</strong> {message.text}
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

export default ChatInterface;
