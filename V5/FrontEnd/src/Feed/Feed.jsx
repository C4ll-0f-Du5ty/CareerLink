import React, { useEffect, useState, useContext } from "react";
import { motion } from "framer-motion";
import { Button } from "antd";
import AuthContext from "../Context/AuthContext";
import { toast } from "react-toastify";
import { Link } from 'react-router-dom'
import moment from "moment"; // For handling relative time format

const Feed = () => {
    const { authTokens, user } = useContext(AuthContext);
    const [feedPosts, setFeedPosts] = useState([]);
    const [suggestedUsers, setSuggestedUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [liked, setLiked] = useState({});
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFeedData = async () => {
            try {
                const response = await fetch("http://localhost:8000/social/feed/", {
                    headers: {
                        Authorization: `Dusty ${authTokens.access}`,
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setFeedPosts([...data.friends_posts, ...data.non_friends_posts]);
                    setSuggestedUsers(data.suggested_users);
                } else {
                    throw new Error("Failed to fetch feed data");
                }
            } catch (error) {
                setError(error.message);
                console.error("Error fetching feed:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchFeedData();
    }, [authTokens]);

    const sendFriendRequest = async (username) => {
        try {
            const response = await fetch(`http://localhost:8000/users/friend-request/${username}/`, {
                method: "POST",
                headers: {
                    Authorization: `Dusty ${authTokens.access}`,
                },
            });
            if (response.ok) {
                toast.success(`Friend request sent to ${username}!`);
                setSuggestedUsers((prev) => prev.filter((user) => user.username !== username));
            } else {
                const data = await response.json();
                toast.error(data.error || "Failed to send friend request.");
            }
        } catch (error) {
            console.error("Error sending friend request:", error);
        }
    };

    const likePost = async (postId) => {
        if (liked[postId]) return; // Prevent clicking when already liked

        try {
            const response = await fetch(`http://localhost:8000/social/likePost/${postId}/`, {
                method: "POST",
                headers: {
                    Authorization: `Dusty ${authTokens.access}`,
                    "Content-Type": "application/json",
                },
            });
            const data = await response.json();
            setFeedPosts((prevPosts) =>
                prevPosts.map((post) =>
                    post.id === postId ? { ...post, likes_count: data.likes_count, liked: data.liked } : post
                )
            );
            setLiked((prev) => ({ ...prev, [postId]: data.liked }));
        } catch (error) {
            console.error("Error liking the post:", error);
        }
    };

    const sharePost = async (postId) => {
        try {
            const response = await fetch(`http://localhost:8000/social/sharePost/${postId}/`, {
                method: "POST",
                headers: {
                    Authorization: `Dusty ${authTokens.access}`,
                    "Content-Type": "application/json",
                },
            });
            const data = await response.json();
            setFeedPosts((prevPosts) =>
                prevPosts.map((post) => (post.id === postId ? { ...post, shares_count: data.shares_count } : post))
            );
        } catch (error) {
            console.error("Error sharing the post:", error);
        }
    };

    const formatDate = (date) => {
        return moment(date).fromNow(); // Using moment.js to handle relative time format
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <p className="text-xl font-semibold text-gray-600">Loading feed...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <p className="text-xl font-semibold text-red-600">Error: {error}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-100 p-6" style={{ marginTop: "50px" }}>
            <motion.div
                className="max-w-6xl mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                {/* Suggested Connections */}
                <section className="mb-10">
                    <h2 className="text-2xl font-bold text-gray-700 mb-4">Suggested Connections</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {suggestedUsers.map((user) => (
                            <motion.div
                                key={user.username}
                                className="bg-white shadow-lg rounded-lg p-4 flex items-center justify-between"
                                whileHover={{ scale: 1.03 }}
                                transition={{ type: "spring", stiffness: 120 }}
                            >
                                <div className="flex items-center">
                                    <img
                                        src={`http://localhost:8000${user.profile_image || '/path/to/placeholder.png'}`}
                                        alt={user.username}
                                        className="w-12 h-12 rounded-full mr-4"
                                    />
                                    <div>
                                        <p className="font-semibold text-gray-800"><Link to={`/${user.username}`} className="group text-black">{user.username}</Link></p>
                                        <p className="text-sm text-gray-500">{user.bio || "No bio available"}</p>
                                    </div>
                                </div>
                                <Button
                                    onClick={() => sendFriendRequest(user.username)}
                                    type="primary"
                                    size="small"
                                    className="ml-4"
                                >
                                    Connect
                                </Button>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Feed Posts */}
                <section>
                    <h2 className="text-2xl font-bold text-gray-700 mb-4">Your Feed</h2>
                    <div className="space-y-6">
                        {feedPosts.map((post) => (
                            <motion.div
                                key={post.id}
                                className="bg-white shadow-lg rounded-lg p-6"
                                whileHover={{ scale: 1.02 }}
                                transition={{ type: "spring", stiffness: 120 }}
                            >
                                <div className="flex items-center mb-4">
                                    <img
                                        src={`http://localhost:8000${post.profile_image || '/path/to/placeholder.png'}`}
                                        alt={post.author}
                                        className="w-12 h-12 rounded-full mr-4"
                                    />
                                    <div>
                                        <p className="font-semibold text-gray-800"><Link to={`/${post.author}`} className="group text-black">{post.author}</Link></p>
                                        <p className="text-sm text-gray-500">{post.category || "General"}</p>
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">{post.title}</h3>
                                <p className="text-gray-700 mt-2">{post.content}</p>
                                <p className="text-gray-400 text-xs">
                                    Created at: {(formatDate(post.created_at)).toLocaleString()}
                                </p>{/* Post date */}
                                <div className="flex items-center justify-between mt-4">
                                    <motion.button
                                        className="flex items-center text-gray-600 hover:text-blue-500 transition"
                                        onClick={() => likePost(post.id)}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        👍 <span className="ml-1">{post.likes_count || 0}</span>
                                    </motion.button>
                                    <motion.button
                                        className="flex items-center text-gray-600 hover:text-green-500 transition"
                                        onClick={() => sharePost(post.id)}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        🔄 <span className="ml-1">{post.shares_count || 0}</span>
                                    </motion.button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>
            </motion.div>
        </div>
    );
};

export default Feed;
