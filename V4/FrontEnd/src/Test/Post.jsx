import { useEffect, useRef, useState, useContext } from 'react'
import AuthContext from '../Context/AuthContext';
import { Modal, Select, Input, Button } from 'antd';
import { motion } from 'framer-motion';
import useApiCall from '../CustomHooks/ApiCall'

const { Option } = Select;

function Post() {
    const api = useApiCall()
    let { user, authTokens } = useContext(AuthContext);
    const [profile, setProfile] = useState()
    const [posts, setPosts] = useState([]);


    const [editingPost, setEditingPost] = useState(null); // State to store the post being edited
    const [editPostData, setEditPostData] = useState({ title: '', content: '', category: 'social' }); // Data for editing
    const handleEditPost = (post) => {
        setEditingPost(post);
        setEditPostData({ title: post.title, content: post.content, category: post.category });
        updatePost()
    };

    const updatePost = async () => {
        const response = await api({
            url: `http://localhost:8000/social/posts/${editingPost.id}/edit/`,
            method: 'PUT',
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
        const response = await api({
            url: `http://localhost:8000/social/posts/${postId}/delete/`,
            method: 'DELETE',
        });

        if (response.ok) {
            setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
        }
    };

    useEffect(() => {
        const fetchPosts = async () => {
            const response = await api({
                url: `http://localhost:8000/social/posts/${user.username}`,
                method: "GET",
            });
            const data = await response.json();
            setPosts(data);
            console.log(data)
        };
        const fetchUser = async () => {
            const response = await api({
                url: `http://localhost:8000/users/profile/${user.username}/`,
                method: "GET",
            });
            const data = await response.json();
            setProfile(data);
        }
        fetchUser();
        fetchPosts();

    }, [])
    const PostCard = ({ post, onEdit, onDelete }) => {
        return (
            <motion.div
                className="border p-4 rounded-lg bg-white shadow-lg hover:shadow-xl transition"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
            >
                <div className="flex items-center mb-4">
                    <img
                        src={`http://localhost:8000${profile.user?.profile_image}`}
                        alt="Profile"
                        className="w-8 h-8 rounded-full"
                    />
                    <div className="ml-3">
                        <h2 className="text-md font-semibold">{post.author}</h2>
                        <p className="text-gray-500 text-sm">{post.title}</p>
                    </div>
                </div>
                <p>{post.content}</p>
                <div className="mt-2">
                    <span className="text-gray-600">Category: {post.category}</span>
                    <div className="flex justify-between mt-2">
                        <span className="text-gray-500">Likes: {post.likes_count}</span>
                        <span className="text-gray-500">Shares: {post.shares_count}</span>
                    </div>
                    <p className="text-gray-400 text-sm">
                        Created at: {new Date(post.created_at).toLocaleString()}
                    </p>
                </div>
                <div className="flex justify-end space-x-2 mt-2">
                    <Button type="primary" onClick={() => onEdit(post)}>Edit</Button>
                    <Button type="danger" onClick={() => onDelete(post.id)}>Delete</Button>
                </div>
            </motion.div>
        );
    };

    return (
        <>
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
            {/* Edit Post Modal */}
            <Modal
                title="Edit Post"
                open={Boolean(editingPost)}
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

        </>
    )
}

export default Post
