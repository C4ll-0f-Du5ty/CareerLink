// src/Messages/Messages.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const Messages = () => {
    const { friendUsername } = useParams(); // Assuming we pass the friend's username as a parameter
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [ws, setWs] = useState(null);

    useEffect(() => {
        // Connect to the WebSocket server
        const socket = new WebSocket(`ws://localhost:8000/ws/chat/${friendUsername}/`);
        socket.onmessage = (e) => {
            const data = JSON.parse(e.data);
            setMessages((prevMessages) => [...prevMessages, data.message]);
        };
        setWs(socket);

        return () => {
            socket.close();
        };
    }, [friendUsername]);

    const sendMessage = () => {
        if (ws) {
            ws.send(JSON.stringify({ message: newMessage }));
            setNewMessage("");
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-2xl font-bold">Chat with {friendUsername}</h1>
            <div className="border p-4 rounded-lg h-80 overflow-y-scroll space-y-2">
                {messages.map((msg, index) => (
                    <div key={index} className="p-2 bg-gray-200 rounded-lg">
                        {msg}
                    </div>
                ))}
            </div>

            <div className="mt-4 flex">
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
