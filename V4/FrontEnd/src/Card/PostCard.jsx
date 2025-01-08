import { motion } from 'framer-motion';
import { useState, useEffect, useContext } from 'react'
import { Modal, Select, Input, Button } from 'antd';
import AuthContext from '../Context/AuthContext';



const { Option } = Select;

const PostCard = ({ post, onEdit, onDelete, profile, likePost, sharePost, liked }) => {
    const { authTokens } = useContext(AuthContext)
    // Post functionality:


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


export default PostCard
