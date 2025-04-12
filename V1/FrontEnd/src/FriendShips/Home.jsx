import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NotificationCard from './NotificationCard'; // Create a separate component for individual notifications

const Profile = () => {
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const response = await axios.get('/api/notifications/'); // Adjust the URL as needed
            setNotifications(response.data);
        } catch (error) {
            console.error('Error fetching notifications', error);
        }
    };

    const toggleNotifications = () => {
        setShowNotifications(!showNotifications);
    };

    const acceptRequest = async (requestId) => {
        try {
            await axios.post(`/api/friend-request/accept/${requestId}/`);
            fetchNotifications(); // Refresh notifications after accepting a request
        } catch (error) {
            console.error('Error accepting friend request', error);
        }
    };

    return (
        <div className="profile-container">
            {/* Your other profile content */}
            <button onClick={toggleNotifications}>Notifications</button>

            {showNotifications && (
                <div className="notification-sidebar">
                    {notifications.map(notification => (
                        <NotificationCard
                            key={notification.id}
                            notification={notification}
                            acceptRequest={acceptRequest}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Profile;
