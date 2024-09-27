// src/Profile/Profile.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import AuthContext from '../../Context/AuthContext';

const Profile = () => {
    const { username } = useParams();
    let { user, authTokens } = useContext(AuthContext)
    const [profile, setProfile] = useState({});
    const [posts, setPosts] = useState([]);
    const [newPost, setNewPost] = useState("");
    const [loading, setLoading] = useState(true);

    // Fetch user profile and posts
    useEffect(() => {
        const fetchProfile = async () => {
            const response = await fetch(`http://localhost:8000/users/profile/${user.username}/`,
                {
                    method: "GET",
                    headers: {
                        "Authorization": "Dusty " + String(authTokens.access)
                    }

                }
            );
            const data = await response.json();
            setProfile(data);
        };

        const fetchPosts = async () => {
            const response = await fetch(`http://localhost:8000/social/posts/${user.username}`,
                {
                    method: "GET",
                    headers: {
                        "Authorization": "Dusty " + String(authTokens.access)
                    }
                }
            );
            const data = await response.json();
            setPosts(data);
        };

        fetchProfile();
        fetchPosts();
        setLoading(false);
    }, [user.username]);

    const handlePostSubmit = async () => {
        const response = await fetch('http://localhost:8000/social/new/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                content: newPost
            }),
        });

        if (response.ok) {
            const post = await response.json();
            setPosts([post, ...posts]);
            setNewPost("");
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-4 mb-auto mt-32">
            {loading ? (
                <div>Loading...</div>
            ) : (
                <>
                    <div className="flex items-center space-x-4">
                        <img src={`http://localhost:8000${profile.user?.profile_image}`} alt="Profile" className="w-24 h-24 rounded-full" />
                        <div>
                            <h1 className="text-2xl font-bold">{profile.user?.username}</h1>
                            <p>{profile.bio}</p>
                            <div className="space-x-4">
                                <span className="text-sm">Followers: {profile.followers_count}</span>
                                <span className="text-sm">Friends: {profile.friends_count}</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6">
                        <h2 className="text-xl font-semibold">Create a Post</h2>
                        <textarea
                            value={newPost}
                            onChange={(e) => setNewPost(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg"
                            placeholder="Write a new post..."
                        />
                        <button
                            onClick={handlePostSubmit}
                            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md"
                        >
                            Submit
                        </button>
                    </div>

                    <div className="mt-6">
                        <h2 className="text-xl font-semibold">Your Posts</h2>
                        <div className="space-y-4">
                            {posts.map((post) => (
                                <div key={post.id} className="border p-4 rounded-lg">
                                    <p>{post.content}</p>
                                    <div className="flex space-x-2 mt-2">
                                        <button className="text-blue-500">Edit</button>
                                        <button className="text-red-500">Delete</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Profile;
