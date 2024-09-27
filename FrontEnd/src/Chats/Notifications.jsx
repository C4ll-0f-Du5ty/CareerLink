import React, { useState, useEffect } from 'react';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);

    // useEffect(() => {
    //     const socket = new WebSocket(`ws://localhost:8000/ws/notifications/`);

    //     socket.onmessage = (e) => {
    //         const data = JSON.parse(e.data);
    //         setNotifications((prev) => [...prev, data.message]);
    //     };

    //     return () => {
    //         socket.close();
    //     };
    // }, []);

    return (
        <div>
            <h2 className="text-xl font-semibold">Notifications</h2>
            <div className="space-y-2">
                {notifications.length > 0 ? (
                    notifications.map((notification, index) => (
                        <div key={index} className="p-4 bg-white rounded-lg shadow">
                            {notification}
                        </div>
                    ))
                ) : (
                    <p>No new notifications</p>
                )}
            </div>
        </div>
    );
};

export default Notifications;
