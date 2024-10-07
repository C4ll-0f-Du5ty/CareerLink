import React, { useState, useEffect, useContext, Fragment } from 'react';
import { Rnd } from 'react-rnd'; // For draggable chat window
import { Modal, Select, Input, Button } from 'antd';
import AuthContext from '../../Context/AuthContext';
import Messages from '../../Chats/Messages';
import Notifications from '../../Chats/Notifications';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';


const { Option } = Select;

const Profile = () => {
    let { user, authTokens } = useContext(AuthContext);
    const [profile, setProfile] = useState({});
    const [friends, setFriends] = useState([]);
    const [posts, setPosts] = useState([]);
    const [newPost, setNewPost] = useState({ title: '', content: '', category: 'social' });
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [loading, setLoading] = useState(true);
    const [activeFriend, setActiveFriend] = useState(null);
    const [chatVisible, setChatVisible] = useState(false); // Toggle chat window

    // updates for changing the Profile Image:
    const [image, setImage] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    const handleImageChange = (event) => {
        setImage(event.target.files[0]);
    };

    const handleSubmit = async () => {
        const formData = new FormData();
        formData.append('profile_image', image);

        const response = await fetch('http://localhost:8000/users/update_image/', {
            method: 'PUT',
            headers: {
                'Authorization': 'Dusty ' + String(authTokens.access),
            },
            body: formData,
        });

        if (response.ok) {
            // Optionally refresh the page or update the UI
            // alert('Profile image updated successfully!');
            toast('Profile image updated successfully!', {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            setModalVisible(false);
        } else {
            alert('Failed to update profile image.');
        }
    };

    // New Upadtes for adding Notifications..:
    const [notifications, setNotifications] = useState([]);

    const fetchNotifications = async () => {
        const response = await fetch(`http://localhost:8000/users/notifications/${user.username}/`, {
            method: 'GET',
            headers: {
                'Authorization': 'Dusty ' + String(authTokens.access),
            },
        });
        const data = await response.json();
        setNotifications(data);
    };


    // Post functionality:
    const [liked, setLiked] = useState({})

    const likePost = async (postId) => {
        try {
            const response = await fetch(`http://localhost:8000/social/likePost/${postId}/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Dusty ${authTokens.access}`,
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            setPosts((prevPosts) =>
                prevPosts.map((post) => (post.id === postId ? { ...post, likes_count: data.likes_count, liked: data.liked } : post))
            );
            // Toggle the liked status in the liked state
            setLiked(prevLiked => ({
                ...prevLiked,
                [postId]: !prevLiked[postId],
            }));
        } catch (error) {
            console.error('Error liking the post:', error);
        }
    };

    // Function to handle sharing a post
    const sharePost = async (postId) => {
        try {
            const response = await fetch(`http://localhost:8000/social/sharePost/${postId}/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Dusty ${authTokens.access}`,
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            setPosts((prevPosts) =>
                prevPosts.map((post) => (post.id === postId ? { ...post, shares_count: data.shares_count } : post))
            );
        } catch (error) {
            console.error('Error sharing the post:', error);
        }
    };


    // Updates+++++++++++++++++++++++++++++++++

    const [editingPost, setEditingPost] = useState(null); // State to store the post being edited
    const [editPostData, setEditPostData] = useState({ title: '', content: '', category: 'social' }); // Data for editing
    const handleEditPost = (post) => {
        setEditingPost(post);
        setEditPostData({ title: post.title, content: post.content, category: post.category });
        updatePost()
    };

    const updatePost = async () => {
        const response = await fetch(`http://localhost:8000/social/posts/${editingPost.id}/edit/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Dusty ' + String(authTokens.access),
            },
            body: JSON.stringify(editPostData),
        });

        if (response.ok) {
            const updatedPost = await response.json();
            setPosts((prevPosts) => prevPosts.map((post) => (post.id === updatedPost.id ? updatedPost : post)));
            setEditingPost(null); // Close the edit modal
            setEditPostData({ title: '', content: '', category: 'social' }); // Reset edit data
        }
    };

    const deletePost = async (postId) => {
        const response = await fetch(`http://localhost:8000/social/posts/${postId}/delete/`, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Dusty ' + String(authTokens.access),
            },
        });

        if (response.ok) {
            setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
        }
    };

    const PostCard = ({ post, onEdit, onDelete }) => {
        return (
            <motion.div
                className="relative border p-6 rounded-lg bg-white shadow-lg hover:shadow-xl transition"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
            >
                {/* Options button */}
                <div className="absolute top-4 right-4">
                    <Select
                        defaultValue="Options"
                        style={{ width: 100 }}
                        onChange={(value) => {
                            if (value === 'edit') {
                                onEdit(post);
                            } else if (value === 'delete') {
                                onDelete(post.id);
                            }
                        }}
                    >
                        <Option value="edit">Edit</Option>
                        <Option value="delete">Delete</Option>
                    </Select>
                </div>

                {/* Post Header */}
                <div className="flex items-center mb-4">
                    <img
                        src={`http://localhost:8000${profile.user?.profile_image}`}
                        alt="Profile"
                        className="w-10 h-10 rounded-full"
                    />
                    <div className="ml-4">
                        <h2 className="text-md font-semibold">{post.author}</h2>
                        <p className="text-gray-500 text-sm">{post.title}</p>
                    </div>
                </div>

                {/* Post Content */}
                <p className="mb-4 text-gray-700">{post.content}</p>

                {/* Like and Share Counts */}
                <div className="flex justify-between items-center mt-4">
                    <div className="text-gray-600 text-sm">
                        <span className="mr-4">Likes: {post.likes_count}</span>
                        <span>Shares: {post.shares_count}</span>
                    </div>
                    <p className="text-gray-400 text-xs">
                        Created at: {new Date(post.created_at).toLocaleString()}
                    </p>
                </div>

                {/* Like and Share Buttons */}
                <div className="flex justify-between items-center mt-4">
                    <Button
                        type={liked[post.id] ? 'primary' : 'default'}
                        onClick={() => likePost(post.id)}
                        className="w-24"
                    >
                        {liked[post.id] ? 'Dislike' : 'Like'}
                    </Button>
                    <Button
                        type="default"
                        onClick={() => sharePost(post.id)}
                        className="w-24"
                    >
                        Share
                    </Button>
                </div>
            </motion.div>
        );
    };

    // ________________________________________

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
            const response = await fetch(`http://localhost:8000/users/friends/${user.username}/`, {
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
            // console.log(data)
            const likedState = {};
            data.forEach(post => {
                likedState[post.id] = post.likes.includes(user.user_id);
            });
            setLiked(likedState);
        };

        fetchProfile();
        fetchFriends();
        fetchPosts();
        fetchNotifications()
        setLoading(false);
    }, [user.username]);

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
        setChatVisible(true); // Show chat window
    };

    // console.log(posts[0])
    return (
        <Fragment>
            {/* Profile Info */}
            <div className="max-w-4xl mx-auto p-4 mb-auto mt-32">
                {loading ? (
                    <div>Loading...</div>
                ) : (
                    <>
                        {/* User Info */}
                        <div className="flex items-center space-x-4">
                            <img
                                src={`http://localhost:8000${profile.user?.profile_image}`}
                                alt="Profile"
                                className="w-24 h-24 rounded-full shadow-lg"
                                onClick={() => setModalVisible(true)}
                                style={{ cursor: 'pointer', width: '100px', height: '100px' }} // Adjust as needed
                            />
                            <Modal
                                title="Update Profile Image"
                                visible={modalVisible}
                                onCancel={() => setModalVisible(false)}
                                footer={[
                                    <Button key="submit" type="primary" onClick={handleSubmit}>
                                        Update
                                    </Button>,
                                ]}
                            >
                                <input type="file" accept="image/*" onChange={handleImageChange} />
                            </Modal>
                            <div>
                                <h1 className="text-3xl font-bold">{profile.user?.username}</h1>
                                <p className="text-gray-600">{profile.bio}</p>
                                <div className="flex space-x-4 mt-2">
                                    <span className="text-sm font-semibold">Followers: {profile.followers_count}</span>
                                    <span className="text-sm font-semibold">Friends: {profile.friends_count}</span>
                                </div>
                            </div>
                        </div>

                        {/* Create Post Button */}
                        <div className="mt-6">
                            <Button type="primary" onClick={() => setIsModalVisible(true)}>
                                Create Post
                            </Button>
                        </div>

                        {/* Modal for Creating Post */}
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

                        {/* Friends List */}
                        <div className="flex mt-8">
                            {/* Left Sidebar for Friends */}
                            <div className="w-1/6 h-auto bg-white shadow-lg rounded-lg p-4">
                                <h2 className="text-lg font-semibold mb-4">Your Friends</h2>
                                <div className="space-y-2">
                                    {friends.map((friend) => (
                                        <div
                                            key={friend.id}
                                            onClick={() => openChatWithFriend(friend)}
                                            className="cursor-pointer flex items-center space-x-3 p-2 bg-gray-50 rounded-lg shadow hover:shadow-lg transition-all hover:bg-gray-100"
                                        >
                                            <img src={`http://localhost:8000${friend.profile_image}`} alt={friend.username} className="w-10 h-10 rounded-full" />
                                            <p className="text-sm">{friend.username}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Posts Section */}
                            <div className="w-5/6 p-6">
                                <h2 className="text-xl font-semibold mb-4">Your Posts</h2>
                                <div className="grid grid-cols-1 gap-6">
                                    {posts.map((post) => (
                                        <PostCard
                                            key={post.id}
                                            post={post}
                                            onEdit={handleEditPost}
                                            onDelete={deletePost}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Chat Window */}
                        {chatVisible && activeFriend && (
                            <Rnd
                                default={{
                                    x: 100,
                                    y: 100,
                                    width: 320,
                                    height: 400,
                                }}
                                minWidth={320}
                                minHeight={400}
                                bounds="window"
                                className="z-50 bg-white shadow-lg p-4 rounded-lg"
                            >
                                <div className="flex justify-between items-center">
                                    <h2 className="text-lg font-semibold">{`Chat with ${activeFriend.username}`}</h2>
                                    <Button danger size="small" onClick={() => setChatVisible(false)}>Close</Button>
                                </div>
                                <Messages friendUsername={activeFriend.username} />
                            </Rnd>
                        )}

                    </>
                )}
            </div>
            {/* Edit Post Modal */}
            <Modal
                title="Edit Post"
                visible={Boolean(editingPost)}
                onOk={updatePost}
                onCancel={() => setEditingPost(null)}
            >
                <Input
                    placeholder="Post Title"
                    value={editPostData.title}
                    onChange={(e) => setEditPostData({ ...editPostData, title: e.target.value })}
                    className="mb-2"
                />
                <Input.TextArea
                    placeholder="Post Content"
                    value={editPostData.content}
                    onChange={(e) => setEditPostData({ ...editPostData, content: e.target.value })}
                    className="mb-2"
                />
                <Select
                    value={editPostData.category}
                    onChange={(value) => setEditPostData({ ...editPostData, category: value })}
                >
                    <Option value="job">Job Post</Option>
                    <Option value="social">Social Post</Option>
                    <Option value="education">Educational Post</Option>
                </Select>
            </Modal>
        </Fragment>
    );
};

export default Profile;
