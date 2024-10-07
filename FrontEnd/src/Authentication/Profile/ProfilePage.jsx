import React, { useState, useEffect, useContext, Fragment } from 'react';
import { useParams } from 'react-router-dom';
import AuthContext from '../../Context/AuthContext';
// Import Modal Component (e.g., from Material-UI or Ant Design)
import { Modal, Select, Input, Button, Drawer } from 'antd';  // Using Ant Design for example

import FriendCard from '../../Card/FriendCard'
import Messages from '../../Chats/Messages'
import Notifications from '../../Chats/Notifications'

const { Option } = Select;

const Profile = () => {
    let { user, authTokens } = useContext(AuthContext);
    const [drawerVisible, setDrawerVisible] = useState(false);  // For controlling chat drawer
    const [profile, setProfile] = useState({});
    const [friends, setFriends] = useState([]);  // New state for friends
    const [posts, setPosts] = useState([]);
    const [newPost, setNewPost] = useState({ title: '', content: '', category: 'social' });
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [loading, setLoading] = useState(true);
    const [activeFriend, setActiveFriend] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            const response = await fetch(`http://localhost:8000/users/profile/${user.username}/`, {
                method: "GET",
                headers: {
                    "Authorization": "Dusty " + String(authTokens.access),
                }
            });
            const data = await response.json();
            setProfile(data);
        };

        const fetchFriends = async () => {
            const response = await fetch(`http://localhost:8000/users/friends/${user.username}/`, { // Update this URL as needed
                method: "GET",
                headers: {
                    "Authorization": "Dusty " + String(authTokens.access),
                }
            });
            const data = await response.json();
            setFriends(data);
        };

        const fetchPosts = async () => {
            const response = await fetch(`http://localhost:8000/social/posts/${user.username}`, {
                method: "GET",
                headers: {
                    "Authorization": "Dusty " + String(authTokens.access),
                }
            });
            const data = await response.json();
            setPosts(data);
        };

        fetchProfile();
        fetchFriends();
        fetchPosts();
        setLoading(false);
    }, [user.username]);

    // Handle Post Submission
    const handlePostSubmit = async () => {
        const response = await fetch('http://localhost:8000/social/new/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "Dusty " + String(authTokens.access),
            },
            body: JSON.stringify(newPost),
        });

        if (response.ok) {
            const post = await response.json();
            setPosts([post, ...posts]);
            setNewPost({ title: '', content: '', category: 'social' });
            setIsModalVisible(false);
        }
    };

    const openChatWithFriend = (friend) => {
        setActiveFriend(friend);
        setDrawerVisible(true);
    };

    // Handle Edit Post (could be similar to handlePostSubmit with pre-filled data in the modal)
    const handleEditPost = async (postId) => {
        // Open modal with pre-filled post data
    };

    return (
        <Fragment>
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
                            <Button type="primary" onClick={() => setIsModalVisible(true)}>
                                Create Post
                            </Button>
                        </div>

                        <Modal
                            title="Create New Post"
                            open={isModalVisible}
                            onOk={handlePostSubmit}
                            onCancel={() => setIsModalVisible(false)}
                        >
                            <Input
                                placeholder="Post Title"
                                value={newPost.title}
                                onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                                className="mb-2"
                            />
                            <Input.TextArea
                                placeholder="Post Content"
                                value={newPost.content}
                                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                                className="mb-2"
                            />
                            <Select
                                defaultValue="social"
                                onChange={(value) => setNewPost({ ...newPost, category: value })}
                            >
                                <Option value="job">Job Post</Option>
                                <Option value="social">Social Post</Option>
                                <Option value="education">Educational Post</Option>
                            </Select>
                        </Modal>

                        {/* Friend List Section */}
                        <div className="flex">
                            {/* Left Sidebar for Friends */}
                            <div className="w-1/4 bg-gray-200 p-4" key={user.username}>
                                <h2 className="text-xl font-semibold">Your Friends</h2>
                                <div className="space-y-4" key={user.username}>
                                    {friends.map((friend) => (
                                        <div
                                            key={friend.id}
                                            onClick={() => {
                                                setActiveFriend(friend.username)
                                                console.log(friend)
                                            }
                                            }
                                            className="cursor-pointer p-4 bg-white rounded-lg shadow hover:bg-gray-100"
                                        >
                                            <img src={`http://localhost:8000${friend.profile_image}`} alt={friend.username} className="w-12 h-12 rounded-full" />
                                            <p>{friend.username}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Main Content for Messaging */}
                            <div className="w-3/4 p-4">
                                {activeFriend ? (
                                    <div>
                                        <h2 className="text-xl font-semibold">Chat with {activeFriend.username}</h2>
                                        <Messages friendUsername={activeFriend} />
                                    </div>
                                ) : (
                                    <p>Select a friend to start chatting.</p>
                                )}
                            </div>

                            {/* Right Sidebar for Notifications */}
                            <div className="w-1/4 bg-gray-200 p-4">
                                <Notifications />
                            </div>
                        </div>
                        {/* End Friends */}

                        {/* Messaging Section */}
                        {/* {activeFriend && (
                        <div className="mt-6">
                            <h2 className="text-xl font-semibold">Chat with {activeFriend.username}</h2>
                            <Messages friendUsername={activeFriend.username} />
                        </div>
                    )} */}

                        <div className="mt-6">
                            <h2 className="text-xl font-semibold">Your Posts</h2>
                            <div className="space-y-4">
                                {posts.map((post) => (
                                    <div key={post.id} className="border p-4 rounded-lg">

                                        <h2 className="font-bold"><img src={`http://localhost:8000${profile.user?.profile_image}`} alt="Profile" className="w-8 h-8 rounded-full" />{profile.user.username}</h2>
                                        <h3 className="font-bold">{post.title}</h3>
                                        <p>{post.content}</p>
                                        <span>{post.category}</span>
                                        <div className="flex space-x-2 mt-2">
                                            <Button type="link" onClick={() => handleEditPost(post.id)}>Edit</Button>
                                            <Button type="link" danger>Delete</Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </Fragment>
    );
};

export default Profile;
