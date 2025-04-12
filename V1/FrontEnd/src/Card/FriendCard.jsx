import React from 'react';

const FriendCard = ({ friend, onClick }) => {
    return (
        <div
            onClick={onClick}
            className="bg-white shadow-lg rounded-lg p-4 cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
        >
            <img src={`http://localhost:8000${friend.profile_image}`} alt={friend.username} className="w-16 h-16 rounded-full mb-2" />
            <h3 className="font-bold text-lg">{friend.username}</h3>
        </div>
    );
};

export default FriendCard;
