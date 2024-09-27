import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import AuthContext from '../../Context/AuthContext';
// Import Modal Component (e.g., from Material-UI or Ant Design)
import { Modal, Select, Input, Button } from 'antd';  // Using Ant Design for example

const { Option } = Select;

const Profile = () => {
    let { user, authTokens } = useContext(AuthContext);
    const [profile, setProfile] = useState({});
    const [posts, setPosts] = useState([]);
    const [newPost, setNewPost] = useState({ title: '', content: '', category: 'social' });
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [loading, setLoading] = useState(true);

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

    // Handle Edit Post (could be similar to handlePostSubmit with pre-filled data in the modal)
    const handleEditPost = async (postId) => {
        // Open modal with pre-filled post data
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
                        <Button type="primary" onClick={() => setIsModalVisible(true)}>
                            Create Post
                        </Button>
                    </div>

                    <Modal
                        title="Create New Post"
                        visible={isModalVisible}
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
    );
};

export default Profile;
