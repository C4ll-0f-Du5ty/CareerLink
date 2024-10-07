// // src/SearchPage/SearchPage.jsx
// import React, { useState, useEffect } from 'react';
// import { useLocation } from 'react-router-dom';


// const SearchPage = () => {
//     const [query, setQuery] = useState("");
//     const [results, setResults] = useState({ users: [], posts: [] });
//     const location = useLocation();

//     useEffect(() => {
//         const queryParams = new URLSearchParams(location.search);
//         const searchQuery = queryParams.get('q');
//         if (searchQuery) {
//             setQuery(searchQuery);
//             handleSearch(searchQuery); // Call the search function with the query
//         }
//     }, [location]);

//     const handleSearch = async (e) => {
//         const response = await fetch(`http://localhost:8000/social/search?q=${e ? e : query}`);
//         const data = await response.json();
//         setResults(data);
//     };



//     return (
//         <div className="max-w-4xl mx-auto p-4 mt-32">
//             <div className="mt-10 space-y-8">
//                 <div>
//                     <h2 className="text-2xl font-bold text-gray-700 mb-4">Users</h2>
//                     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//                         {results.users.map((user) => (
//                             <div key={user.id} className="user-card bg-white shadow-lg rounded-lg p-4 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
//                                 <img src={`http://localhost:8000${user.profile_image}`} alt={user.username} className="w-16 h-16 rounded-full mb-2" />
//                                 <h3 className="font-bold text-lg">{user.username}</h3>
//                             </div>
//                         ))}
//                     </div>
//                 </div>

//                 <div>
//                     <h2 className="text-2xl font-bold text-gray-700 mb-4">Posts</h2>
//                     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//                         {results.posts.map((post) => (
//                             <div key={post.id} className="post-card bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
//                                 <h3><img src={`http://localhost:8000${post.profile_image}`} alt={post.author} className="w-12 h-12 rounded-full mb-2" />{post.author}</h3>
//                                 <h4 className="text-lg font-semibold">{post.title}</h4>
//                                 <p className="text-gray-600">{post.content}</p>
//                                 <p className="text-sm text-gray-500 mt-2">Posted by {post.author}</p>
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default SearchPage;


import React, { useState, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from 'antd';
import AuthContext from '../Context/AuthContext';
import { toast } from 'react-toastify';


const SearchPage = () => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState({ users: [], posts: [] });
    const [liked, setLiked] = useState({});
    const location = useLocation();
    const { authTokens, user } = useContext(AuthContext)

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const searchQuery = queryParams.get('q');
        if (searchQuery) {
            setQuery(searchQuery);
            handleSearch(searchQuery);
        }
    }, [location]);

    const handleSearch = async (e) => {
        const response = await fetch(`http://localhost:8000/social/search?q=${e || query}`);
        const data = await response.json();
        setResults(data);
    };

    const handleAddFriend = async (userId) => {
        try {
            const response = await fetch(`http://localhost:8000/social/send_friend_request/${userId}/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Dusty ` + String(authTokens.access),
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                console.log('Friend request sent!');
            }
        } catch (error) {
            console.error('Error sending friend request:', error);
        }
    };


    const likePost = async (postId) => {
        try {
            const response = await fetch(`http://localhost:8000/social/likePost/${postId}/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Dusty ` + String(authTokens.access),
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            setResults(prevResults => ({
                ...prevResults,
                posts: prevResults.posts.map(post =>
                    post.id === postId ? { ...post, likes_count: data.likes_count, liked: data.liked } : post
                ),
            }));
            setLiked((prev) => ({ ...prev, [postId]: data.liked }));
        } catch (error) {
            console.error('Error liking the post:', error);
        }
    };

    const sharePost = async (postId) => {
        try {
            const response = await fetch(`http://localhost:8000/social/sharePost/${postId}/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Dusty ` + String(authTokens.access),
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            setResults(prevResults => ({
                ...prevResults,
                posts: prevResults.posts.map(post =>
                    post.id === postId ? { ...post, shares_count: data.shares_count } : post
                ),
            }));
        } catch (error) {
            console.error('Error sharing the post:', error);
        }
    };

    const [friends, setFriends] = useState([]);

    useEffect(() => {
        const fetchFriends = async () => {
            const response = await fetch(`http://localhost:8000/users/friends/${user.username}/`, {
                headers: {
                    'Authorization': `Dusty ` + String(authTokens.access),
                },
            });
            const data = await response.json();
            setFriends(data);
        };

        fetchFriends();
        console.log(friends)
    }, [authTokens]);

    const isFriend = (userId) => (friends && friends.length > 0) ?
        friends.some(friend => friend.id === userId) : false;


    const sendFriendRequest = async (username) => {
        const response = await fetch(`http://localhost:8000/users/friend-request/${username}/`, {
            method: 'POST',
            headers: {
                'Authorization': `Dusty ` + String(authTokens.access),
                'Content-Type': 'application/json',
            },
        });
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
    };

    const UserCard = ({ user }) => (
        <motion.div className="bg-white shadow-lg rounded-lg p-4 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center space-x-4">
                <img src={`http://localhost:8000${user.profile_image}`} alt={user.username} className="w-16 h-16 rounded-full" />
                <div>
                    <h3 className="font-bold text-lg">{user.username}</h3>
                    <p className="text-gray-500 text-sm">{user.email}</p>
                </div>
                {/* Check if friends data is available and the user is not already a friend */}
                {!isFriend(user.id) && (
                    <Button onClick={() => sendFriendRequest(user.username)}>
                        {isFriend(user.id)
                            ? 'Request Pending'
                            : 'Add Friend'}
                        {/* {friends.find(friend => friend.id === user.id && friend.status === 'pending')
                            ? 'Request Pending'
                            : 'Add Friend'} */}
                    </Button>
                )}
            </div>
        </motion.div>
    );



    const PostCard = ({ post }) => (
        <motion.div
            className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 w-full md:w-4/5"
            style={{ minHeight: '300px', minWidth: '800px', width: '100%', wordWrap: 'break-word' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
        >
            <div className="flex items-center mb-4">
                <img
                    src={`http://localhost:8000${post.profile_image}`}
                    alt="Profile"
                    className="w-12 h-12 rounded-full"
                />
                <div className="ml-4">
                    <h2 className="text-md font-semibold">{post.author}</h2>
                    <p className="text-gray-500 text-sm">{post.title}</p>
                </div>
            </div>
            <p className="mb-4 text-gray-700">{post.content}</p>
            <div className="flex justify-between items-center mt-4">
                <div className="text-gray-600 text-sm">
                    <span className="mr-4">Likes: {post.likes_count}</span>
                    <span>Shares: {post.shares_count}</span>
                </div>
                <p className="text-gray-400 text-xs">
                    Created at: {new Date(post.created_at).toLocaleString()}
                </p>
            </div>
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

    return (
        <div className="max-w-4xl mx-auto p-4 mt-32">
            <div className="space-y-16">
                <div>
                    <h2 className="text-2xl font-bold text-gray-700 mb-4">Users</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6">
                        {results.users.map((user) => (
                            <UserCard key={user.id} user={user} handleAddFriend={handleAddFriend} />

                        ))}
                    </div>
                </div>

                <div>
                    <h2 className="text-2xl font-bold text-gray-700 mb-4">Posts</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        <div className="flex flex-col space-y-4">
                            {results.posts.map((post) => (
                                <PostCard key={post.id} post={post} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchPage;
