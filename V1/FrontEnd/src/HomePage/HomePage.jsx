// src/HomePage/HomePage.jsx
import React, { useState, useEffect } from 'react';

const HomePage = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch('http://localhost:8000/social/posts/latest');
      const data = await response.json();
      setPosts(data);
    };

    fetchPosts();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4 mt-32">
      <h1 className="text-2xl font-bold mb-4">Latest Posts</h1>
      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="border p-4 rounded-lg">
            <div className="font-bold"><img src={`http://localhost:8000${post.profile_image}`} alt="Profile" className="w-8 h-8 rounded-full" />{post.author}</div>
            <p>{post.content}</p>
            <div className="mt-2 flex space-x-2">
              <button className="text-blue-500">Edit</button>
              <button className="text-red-500">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
