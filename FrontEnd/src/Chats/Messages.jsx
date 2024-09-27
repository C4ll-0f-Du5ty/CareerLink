// src/Messages/Messages.jsx
import React, { useState, useEffect } from 'react';

const Messages = ({ friendUsername }) => { // Accept friendUsername as prop
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [ws, setWs] = useState(null);

    const socket = new WebSocket(`ws://localhost:8000/ws/chat/${friendUsername}/`);
    useEffect(() => {

        socket.onmessage = (e) => {
            const data = JSON.parse(e.data);
            setMessages((prevMessages) => [...prevMessages, data.message]);
        };

        socket.onerror = (error) => {
            console.error("WebSocket error: ", error);
        };

        socket.onclose = (e) => {
            console.log('WebSocket connection closed: ', e);
        };

        setWs(socket);

        // return () => {
        //     socket.close();
        // };
    }, [friendUsername]);

    const sendMessage = () => {
        if (ws) {
            ws.send(JSON.stringify({ message: newMessage }));
            setNewMessage("");
        }
    };

    return (
        <div className="p-4">
            <div className="h-64 overflow-y-scroll border rounded p-2 space-y-2">
                {messages.map((msg, index) => (
                    <div key={index} className={`p-2 rounded-lg ${msg.isSelf ? 'bg-blue-100 text-right' : 'bg-gray-100'}`}>
                        {msg}
                    </div>
                ))}
            </div>
            <div className="mt-4 flex items-center">
                <input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    placeholder="Type a message..."
                />
                <button
                    onClick={sendMessage}
                    className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-md"
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default Messages;
