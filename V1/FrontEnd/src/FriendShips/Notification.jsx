// NotificationCard.jsx
import React from 'react';

const NotificationCard = ({ notification, acceptRequest }) => {
    const { from_user, type, created_at, is_read, id } = notification;

    const handleAccept = () => {
        acceptRequest(id);
    };

    return (
        <div className={`notification-card ${is_read ? 'read' : 'unread'}`}>
            <p>{from_user} sent you a {type.replace('_', ' ')}.</p>
            <p>{new Date(created_at).toLocaleString()}</p>
            {type === 'friend_request' && !is_read && (
                <button onClick={handleAccept}>Accept</button>
            )}
        </div>
    );
};

export default NotificationCard;
