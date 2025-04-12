// ChatComponent.jsx
import React, { useEffect, useState } from 'react';

const ChatComponent = ({ roomName }) => {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const socket = new WebSocket(`ws://localhost:8000/ws/chat/${roomName}/`);

        socket.onmessage = (e) => {
            const data = JSON.parse(e.data);
            setMessages((prevMessages) => [...prevMessages, data.message]);
        };

        return () => {
            socket.close();
        };
    }, [roomName]);

    const sendMessage = () => {
        const socket = new WebSocket(`ws://localhost:8000/ws/chat/${roomName}/`);
        socket.onopen = () => {
            socket.send(JSON.stringify({ message }));
        };
    };

    return (
        <div>
            <div className="chat-window">
                {messages.map((msg, idx) => (
                    <p key={idx}>{msg}</p>
                ))}
            </div>
            <input value={message} onChange={(e) => setMessage(e.target.value)} />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
};

export default ChatComponent;
