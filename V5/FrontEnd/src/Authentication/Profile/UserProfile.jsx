import React, { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import AuthContext from "../../Context/AuthContext";
import { toast } from 'react-toastify';


const UserProfile = () => {
    const { username } = useParams();
    const [profileData, setProfileData] = useState({});
    const [loading, setLoading] = useState(true);
    const [isFriend, setIsFriend] = useState(false);
    const { user, authTokens } = useContext(AuthContext)

    useEffect(() => {
        const fetchProfileWithPosts = async () => {
            try {
                const response = await fetch(
                    `http://localhost:8000/social/profile-with-posts/${username}`,
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Dusty ${authTokens.access}`,
                        },
                    }
                );
                const data = await response.json();
                setProfileData(data);
                console.log(data)
                setIsFriend(data.is_friend);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching profile:", error);
            }
        };

        fetchProfileWithPosts();
    }, [username]);

    const sendFriendRequest = async () => {
        try {
            const response = await fetch(
                `http://localhost:8000/users/friend-request/${username}/`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Dusty ${authTokens.access}`,
                    },
                }
            );
            if (response.status === 201) {
                // alert('Friend request sent!');
                toast('Friend request sent!', {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
            else {
                console.error('Error:', response.error);
                toast.error('Something went wrong. Please try again!', {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
        } catch (error) {
            console.error("Error sending friend request:", error);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
            </div>
        );
    }

    const { profile, posts } = profileData;

    return (
        <motion.div
            className="max-w-4xl mx-auto p-6 mt-16 bg-white shadow-md rounded-lg"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="flex items-center space-x-4">
                <motion.img
                    src={`http://localhost:8000${profile.user?.profile_image}`}
                    alt={`${profile.user?.username}'s profile`}
                    className="w-24 h-24 rounded-full shadow-lg"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5 }}
                />
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">
                        {profile.user?.username}
                    </h1>
                    <p className="text-gray-600 italic">{profile.bio}</p>
                </div>
            </div>

            <motion.div
                className="mt-8 flex justify-between"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
            >
                {user ? (
                    isFriend ? (
                        <button className="py-2 px-4 bg-gray-300 text-gray-700 rounded-lg cursor-not-allowed">
                            Already Friends
                        </button>
                    ) : (
                        <button
                            className="py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                            onClick={sendFriendRequest}
                        >
                            Add Friend
                        </button>
                    )) : (
                    <button
                        className="py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                    >
                        <a href="/login">Login</a>
                    </button>
                )}
            </motion.div>

            <motion.div
                className="mt-8 space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
            >
                <h2 className="text-2xl font-semibold">Posts</h2>
                {posts?.length > 0 ? (
                    posts.map((post, index) => (
                        <motion.div
                            key={index}
                            className="p-4 bg-gray-50 rounded-lg shadow-md"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <div className="flex items-center mb-4">
                                <img
                                    src={`http://localhost:8000${post.profile_image}`}
                                    alt="Profile"
                                    className="w-10 h-10 rounded-full"
                                />
                                <div className="ml-4">
                                    <h3 className="text-md font-bold">{post.title}</h3>
                                    <p className="text-sm text-gray-500">{post.content}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <p className="text-gray-500">No posts available</p>
                )}
            </motion.div>
        </motion.div>
    );
};

export default UserProfile;
