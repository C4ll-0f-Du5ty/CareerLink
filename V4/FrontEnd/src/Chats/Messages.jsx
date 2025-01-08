import React, { useState, useEffect, useContext, useRef } from 'react';
import AuthContext from '../Context/AuthContext';

const Messages = ({ friendUsername }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [ws, setWs] = useState(null);
    const messageEndRef = useRef(null);
    let { authTokens, user } = useContext(AuthContext);

    const generateRoomKey = (username1, username2) => {
        const sortedUsernames = [username1, username2].sort();
        return `${sortedUsernames.join('_')}`;
    };

    const scrollToBottom = () => {
        messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        const fetchChatHistory = async () => {
            const response = await fetch(`http://localhost:8000/users/chatHistory/${friendUsername}/`, {
                method: "GET",
                headers: {
                    "Authorization": "Dusty " + String(authTokens.access),
                }
            });
            const data = await response.json();

            setMessages(data.map(msg => ({
                content: msg.content,
                isSelf: msg.sender === user.user_id,
            }
            )));
            scrollToBottom();
        };

        fetchChatHistory();
        let key = generateRoomKey(user.username, friendUsername);
        const socket = new WebSocket(`ws://localhost:8000/ws/chat/${key}/`);

        socket.onmessage = (e) => {
            const data = JSON.parse(e.data);
            console.log('Incoming message:', data);
            setMessages((prevMessages) => [...prevMessages, {
                content: data.message,
                isSelf: data.sender === user.user_id
            }]);
            scrollToBottom();
        };

        socket.onerror = (error) => {
            console.error("WebSocket error: ", error);
        };

        socket.onclose = (e) => {
            console.log('WebSocket connection closed: ', e);
        };

        setWs(socket);

        return () => {
            if (socket.readyState === WebSocket.OPEN) {
                socket.close();
            }
        };
    }, [friendUsername, authTokens]);

    const sendMessage = () => {
        if (ws && newMessage.trim() !== "") {
            ws.send(JSON.stringify({
                message: newMessage,
                'sender': user.username
            }));
            setNewMessage("");
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <div className="p-4 flex flex-col h-full">
            <div className="flex-grow h-64 overflow-y-auto border rounded p-2 space-y-2 bg-white" style={{ display: 'flex', flexDirection: 'column' }}>
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`p-2 rounded-lg ${msg.isSelf ? 'bg-blue-500 text-white text-right ml-auto' : 'bg-gray-200 text-black mr-auto'}`}
                        style={{ wordBreak: 'break-word', maxWidth: '80%' }} // Ensure messages wrap properly
                    >
                        {msg.content}
                    </div>
                ))}
                <div ref={messageEndRef} />
            </div>
            <div className="mt-4 flex items-center">
                <input
                    value={newMessage}
                    autoFocus={true}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className='w-full p-2 border border-gray-300 rounded-lg'
                    placeholder="Type a message..."
                />
                <button
                    onClick={sendMessage}
                    className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300"
                >
                    Send
                </button>
            </div>
        </div>

    );
};

export default Messages;
