// src/SearchPage/SearchPage.jsx
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';


const SearchPage = () => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState({ users: [], posts: [] });
    const location = useLocation();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const searchQuery = queryParams.get('q');
        if (searchQuery) {
            setQuery(searchQuery);
            handleSearch(searchQuery); // Call the search function with the query
        }
    }, [location]);

    const handleSearch = async (e) => {
        const response = await fetch(`http://localhost:8000/social/search?q=${e ? e : query}`);
        const data = await response.json();
        setResults(data);
    };



    return (
        <div className="max-w-4xl mx-auto p-4 mt-32">
            {/* <h1 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">Search</h1>
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full p-4 border-2 border-gray-300 rounded-lg shadow-lg mb-4 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300"
                placeholder="Search for users or posts..."
            />
            <button
                onClick={handleSearch}
                className="w-full bg-gradient-to-r from-blue-400 to-blue-600 text-white px-4 py-2 rounded-md shadow-md transition-transform duration-300 hover:scale-105"
            >
                Search
            </button> */}

            <div className="mt-10 space-y-8">
                <div>
                    <h2 className="text-2xl font-bold text-gray-700 mb-4">Users</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {results.users.map((user) => (
                            <div key={user.id} className="user-card bg-white shadow-lg rounded-lg p-4 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                <img src={`http://localhost:8000${user.profile_image}`} alt={user.username} className="w-16 h-16 rounded-full mb-2" />
                                <h3 className="font-bold text-lg">{user.username}</h3>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <h2 className="text-2xl font-bold text-gray-700 mb-4">Posts</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {results.posts.map((post) => (
                            <div key={post.id} className="post-card bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                <h3><img src={`http://localhost:8000${post.profile_image}`} alt={post.author} className="w-12 h-12 rounded-full mb-2" />{post.author}</h3>
                                <h4 className="text-lg font-semibold">{post.title}</h4>
                                <p className="text-gray-600">{post.content}</p>
                                <p className="text-sm text-gray-500 mt-2">Posted by {post.author}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchPage;
