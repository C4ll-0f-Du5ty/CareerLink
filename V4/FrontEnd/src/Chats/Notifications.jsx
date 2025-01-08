import React, { useState, useEffect, useContext } from 'react';
import AuthContext from '../Context/AuthContext';
import { Button } from 'antd';
import { toast } from 'react-toastify';


const Notification = () => {
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const { authTokens } = useContext(AuthContext);

    useEffect(() => {
        const fetchNotifications = async () => {
            const response = await fetch('http://localhost:8000/users/notifications/', {
                headers: {
                    'Authorization': `Dusty ` + String(authTokens.access),
                },
            });
            const data = await response.json();
            setNotifications(data);
        };

        fetchNotifications();
    }, [authTokens]);

    const handleMouseEnter = () => {
        setShowNotifications(true); // Show immediately when hovering
    };

    const handleMouseLeave = () => {
        const interval = setInterval(() => {
            setShowNotifications(false); // Hide when leaving both button and notification area
        }, 1000 * 3);
        return () => clearInterval(interval)
    };

    const toggleNotifications = () => {
        setShowNotifications(prevState => !prevState); // Toggle the notification state
    };

    const acceptFriendRequest = async (friendRequestId) => {
        const response = await fetch(`http://localhost:8000/users/friend-request/accept/${friendRequestId}/`, {
            method: 'POST',
            headers: {
                'Authorization': `Dusty ` + String(authTokens.access),
                'Content-Type': 'application/json',
            },
        });
        if (response.ok) {
            // alert('Friend request accepted!');
            toast('Friend request accepted!', {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            // setNotifications(notifications.filter(n => n.id !== requestId));
            setNotifications(notifications.filter(n => n.friend_request_id !== friendRequestId));
        }
    };
    console.log(notifications)

    return (
        <div
            className="relative"
        // onMouseEnter={handleMouseEnter}
        // onMouseLeave={handleMouseLeave}
        >
            <Button className="bg-white text-blue-500 p-2 rounded-lg" onClick={toggleNotifications}>🔔 Notifications</Button>
            {showNotifications && (
                <div
                    className="absolute top-10 left-0 w-64 bg-white shadow-lg rounded-lg p-4"
                // onMouseEnter={handleMouseEnter}
                // onMouseLeave={handleMouseLeave}
                >
                    {notifications.length > 0 ? (
                        notifications.map((notification) => (
                            <div key={notification.id} className="mb-2 p-2 border-b border-gray-200">
                                <p className="text-lg text-gray-500"><strong>{notification.from_user}</strong> {notification.type}</p>
                                <p className="text-xs text-gray-500">{new Date(notification.created_at).toLocaleString()}</p>
                                {notification.type === 'friend_request' && (
                                    <Button
                                        type="primary"
                                        size="small"
                                        onClick={() => acceptFriendRequest(notification.friend_request)}
                                    >
                                        Accept
                                    </Button>
                                )}
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-500">No notifications</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default Notification;
