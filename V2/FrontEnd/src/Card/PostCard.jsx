// import React, { useEffect, useState, useContext } from 'react';
// import AuthContext from '../Context/AuthContext';
// import { Button } from 'antd';
// import { motion } from 'framer-motion';
// import { genTreeStyle } from 'antd/es/tree/style';

// function Post() {
//     const { authTokens, user } = useContext(AuthContext);
//     const [posts, setPosts] = useState([]);
//     const [liked, setLiked] = useState({})

//     useEffect(() => {
//         const fetchPosts = async () => {
//             const response = await fetch(`http://localhost:8000/social/posts/`, {
//                 method: 'GET',
//                 headers: {
//                     'Authorization': `Dusty ` + String(authTokens.access),
//                     'Content-Type': 'application/json',
//                 },
//             });
//             const data = await response.json();
//             setPosts(data);
//             const likedState = {};
//             data.forEach(post => {
//                 likedState[post.id] = post.likes.includes(user.user_id);
//             });
//             setLiked(likedState);
//         };
//         fetchPosts();
//     }, [authTokens]);

//     // Function to handle liking a post
//     const likePost = async (postId) => {
//         try {
//             const response = await fetch(`http://localhost:8000/social/likePost/${postId}/`, {
//                 method: 'POST',
//                 headers: {
//                     'Authorization': `Dusty ` + String(authTokens.access),
//                     'Content-Type': 'application/json',
//                 },
//             });
//             const data = await response.json();
//             setPosts((prevPosts) =>
//                 prevPosts.map((post) => (post.id === postId ? { ...post, likes_count: data.likes_count, liked: data.liked } : post))
//             );
//             // Toggle the liked status in the liked state
//             setLiked(prevLiked => ({
//                 ...prevLiked,
//                 [postId]: !prevLiked[postId],
//             }));
//         } catch (error) {
//             console.error('Error liking the post:', error);
//         }
//     };

//     // Function to handle sharing a post
//     const sharePost = async (postId) => {
//         try {
//             const response = await fetch(`http://localhost:8000/social/sharePost/${postId}/`, {
//                 method: 'POST',
//                 headers: {
//                     'Authorization': `Dusty ` + String(authTokens.access),
//                     'Content-Type': 'application/json',
//                 },
//             });
//             const data = await response.json();
//             setPosts((prevPosts) =>
//                 prevPosts.map((post) => (post.id === postId ? { ...post, shares_count: data.shares_count } : post))
//             );
//         } catch (error) {
//             console.error('Error sharing the post:', error);
//         }
//     };

//     // const PostCard = ({ post }) => {
//     //     return (
//     //         <motion.div
//     //             className="border p-4 rounded-lg bg-white shadow-lg hover:shadow-xl transition mt-32"
//     //             initial={{ opacity: 0 }}
//     //             animate={{ opacity: 1, scale: 1 }}
//     //             exit={{ opacity: 0, scale: 0.8 }}
//     //             transition={{ duration: 0.3 }}
//     //         >
//     //             <h2>{post.title}</h2>
//     //             <p>{post.content}</p>
//     //             <div className="flex justify-between mt-2">
//     //                 <span className="text-gray-500">Likes: {post.likes_count}</span>
//     //                 <span className="text-gray-500">Shares: {post.shares_count}</span>
//     //             </div>
//     //             <div className="flex justify-end space-x-2 mt-2">
//     //                 <Button
//     //                     type={liked[post.id] ? 'primary' : 'default'}
//     //                     onClick={() => likePost(post.id)}
//     //                 >
//     //                     {liked[post.id] ? 'Dislike' : 'Like'}
//     //                 </Button>
//     //                 <Button type="default" onClick={() => sharePost(post.id)}>Share</Button>
//     //             </div>
//     //         </motion.div>
//     //     );
//     // };

//     const PostCard = ({ post }) => {
//         return (
//             <motion.div
//                 className="relative border p-6 rounded-lg bg-white shadow-lg hover:shadow-xl transition"
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 exit={{ opacity: 0, scale: 0.8 }}
//                 transition={{ duration: 0.3 }}
//             >

//                 {/* Post Header */}
//                 <div className="flex items-center mb-4">
//                     <img
//                         src={`http://localhost:8000${post.profile_image}`}
//                         alt="Profile"
//                         className="w-10 h-10 rounded-full"
//                     />
//                     <div className="ml-4">
//                         <h2 className="text-md font-semibold">{post.author}</h2>
//                         <p className="text-gray-500 text-sm">{post.title}</p>
//                     </div>
//                 </div>

//                 {/* Post Content */}
//                 <p className="mb-4 text-gray-700">{post.content}</p>

//                 {/* Like and Share Counts */}
//                 <div className="flex justify-between items-center mt-4">
//                     <div className="text-gray-600 text-sm">
//                         <span className="mr-4">Likes: {post.likes_count}</span>
//                         <span>Shares: {post.shares_count}</span>
//                     </div>
//                     <p className="text-gray-400 text-xs">
//                         Created at: {new Date(post.created_at).toLocaleString()}
//                     </p>
//                 </div>

//                 {/* Like and Share Buttons */}
//                 <div className="flex justify-between items-center mt-4">
//                     <Button
//                         type={liked[post.id] ? 'primary' : 'default'}
//                         onClick={() => likePost(post.id)}
//                         className="w-24"
//                     >
//                         {liked[post.id] ? 'Dislike' : 'Like'}
//                     </Button>
//                     <Button
//                         type="default"
//                         onClick={() => sharePost(post.id)}
//                         className="w-24"
//                     >
//                         Share
//                     </Button>
//                 </div>
//             </motion.div>
//         );
//     };

//     return (
//         <div className="w-5/6 p-6">
//             <h2 className="text-xl font-semibold mb-4">Posts</h2>
//             <div className="grid grid-cols-1 gap-6">
//                 {posts?.map((post) => (
//                     // post.likes.includes(user.user_id) ? setLiked[post.id] = true : setLiked[post.id] = false

//                     < PostCard key={post.id} post={post} />
//                 ))}
//             </div>
//         </div>
//     );
// }

// export default Post;


import React, { useEffect, useState, useContext } from 'react';
import AuthContext from '../Context/AuthContext';
import { Button } from 'antd';
import { motion } from 'framer-motion';

function Post() {
    const { authTokens, user } = useContext(AuthContext);
    const [posts, setPosts] = useState([]);
    const [liked, setLiked] = useState({})

    useEffect(() => {
        const fetchPosts = async () => {
            const response = await fetch(`http://localhost:8000/social/posts/`, {
                method: 'GET',
                headers: {
                    'Authorization': `Dusty ` + String(authTokens.access),
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            setPosts(data);
            const likedState = {};
            data.forEach(post => {
                likedState[post.id] = post.likes.includes(user.user_id);
            });
            setLiked(likedState);
        };
        fetchPosts();
    }, [authTokens]);

    // Function to handle liking a post
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
                    'Authorization': `Dusty ` + String(authTokens.access),
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

    const PostCard = ({ post }) => {
        return (
            <motion.div
                className="relative border p-6 rounded-lg bg-white shadow-lg hover:shadow-xl transition mt-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
            >
                {/* Post Header */}
                <div className="flex items-center mb-4">
                    <img
                        src={`http://localhost:8000${post.profile_image}`}
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

    return (
        <div className="w-full flex justify-center mt-32">
            <div className="w-5/6 p-6 max-w-2xl">
                <h2 className="text-xl font-semibold mb-4">Posts</h2>
                <div className="grid grid-cols-1 gap-6">
                    {posts?.map((post) => (
                        <PostCard key={post.id} post={post} />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Post;
