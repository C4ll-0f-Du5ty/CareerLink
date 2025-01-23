import React, { useState, useEffect, useContext } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from 'antd';
import AuthContext from '../Context/AuthContext';
import { toast } from 'react-toastify';
import moment from "moment";


const SearchPage = () => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState({ users: [], posts: [] });
    const [liked, setLiked] = useState({});
    const location = useLocation();
    const { authTokens, user } = useContext(AuthContext)
    const Navigate = useNavigate()

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const searchQuery = queryParams.get('q');
        if (searchQuery) {
            setQuery(searchQuery);
            handleSearch(searchQuery);
        }
    }, [location]);

    const handleSearch = async (e) => {
        const response = await fetch(`http://localhost:8000/social/search?q=${e || query}&key=${user?.username}`);
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

    const handleGuests = () => {
        Navigate('/login')
    }

    const UserCard = ({ Cuser }) => (
        <motion.div className="bg-white shadow-lg rounded-lg p-4 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center space-x-4">
                <img src={`http://localhost:8000${Cuser.profile_image}`} alt={Cuser.username} className="w-16 h-16 rounded-full" />
                <div>
                    <Link to={`/${Cuser.username}`} className="group text-black"> <h3 className="font-bold text-lg group-hover:scale-110 group-hover:text-blue-500 transition-transform duration-300 ease-in-out"> {Cuser.username} </h3> </Link>
                    <p className="text-gray-500 text-sm">{Cuser.email}</p>
                </div>
                {/* Check if friends data is available and the user is not already a friend */}
                {!isFriend(Cuser.id) ? (
                    <Button onClick={() => {
                        if (!user) {
                            toast.error("You're not authenticated to Send Friend Request", {
                                position: "top-center",
                                autoClose: 5000,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                                progress: undefined,
                            });
                            handleGuests()
                        }
                        else sendFriendRequest(Cuser.username);
                    }}>
                        {isFriend(Cuser.id)
                            ? 'Request Pending'
                            : 'Add Friend'}
                    </Button>
                ) :
                    // <Button onClick={() => alert("YAY")}>
                    //     {isFriend(Cuser.id)
                    //         ? 'Request Pending'
                    //         : 'Add Friend'}
                    // </Button>
                    <button className="py-2 px-4 bg-gray-300 text-gray-700 rounded-lg cursor-not-allowed">
                        Already Friends
                    </button>
                }
            </div>
        </motion.div>
    );


    const formatDate = (date) => {
        return moment(date).fromNow()
    }

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
                    <h2 className="text-md font-semibold"><Link to={`/${post.author}`} className="group text-black">{post.author}</Link></h2>
                    <p className="text-sm text-gray-500">{post.category || "General"}</p>
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
                    Created at: {(formatDate(post.created_at)).toLocaleString()}
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
                        {results.users.map((Cuser) => (
                            <UserCard key={Cuser.id} Cuser={Cuser} handleAddFriend={handleAddFriend} />

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
