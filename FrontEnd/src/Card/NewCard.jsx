import { useContext, useEffect, useState } from 'react';
import React from 'react';
import { Card, Avatar, Typography } from '@mui/material';
import AuthContext from '../Context/AuthContext';

function UserCard() {
    let { authTokens, logoutUser } = useContext(AuthContext)

    let [users, setUsers] = useState([])
    let fetchUsers = async () => {
        const response = await fetch(`http://localhost:8000/users/all`,
            {
                method: "GET",
                headers: {
                    "Authorization": "Dusty " + String(authTokens.access)
                },
            });
        const data = await response.json();
        if (response.status === 200) {
            setUsers(data);
        } else if (response.statusText === 'Unauthorized') {
            logoutUser()
        }
    }

    useEffect(() => {
        fetchUsers();
    }, [])
    return (
        <>
            {users && users.map(user => (
                <Card sx={{ maxWidth: 345 }} key={user}>
                    <Avatar sx={{ m: 1.5 }}>{user.username.charAt(0)}</Avatar>
                    <Typography variant="h6">{user.username}</Typography>
                    <Typography variant="body2">Followers: {user.followers_count}</Typography>
                    <Typography variant="body2">Friends: {user.friends_count}</Typography>
                </Card>
            ))}
        </>
    );
};

export default UserCard;



// import { useContext, useState, useEffect } from 'react';
// import React from 'react';
// import { Card, Avatar, Typography } from '@mui/material';
// import AuthContext from '../Context/AuthContext';

// function UserCard() {
//     let { authTokens, logoutUser } = useContext(AuthContext);

//     let [users, setUsers] = useState([]);  // Initialize as an empty array

//     let fetchUsers = async () => {
//         const response = await fetch(`http://localhost:8000/users/all`, {
//             method: "GET",
//             headers: {
//                 "Authorization": "Dusty " + String(authTokens.access),  // Use "Bearer" instead of "Dusty"
//             },
//         });

//         if (response.status === 200) {
//             const data = await response.json();
//             setUsers(data);
//         } else if (response.status === 401) {  // Handle Unauthorized
//             logoutUser();
//         }
//     };

//     // Call fetchUsers when the component mounts
//     useEffect(() => {
//         fetchUsers();
//     }, []);  // Empty dependency array ensures it runs only once on mount

//     return (
//         <>
//             {users.length > 0 && users.map(user => (
//                 <Card sx={{ maxWidth: 345 }} key={user.id}> {/* Use user.id as key */}
//                     <Avatar sx={{ m: 1.5 }}>{user.username.charAt(0)}</Avatar>
//                     <Typography variant="h6">{user.username}</Typography>
//                     <Typography variant="body2">Followers: {user.followers_count}</Typography>
//                     <Typography variant="body2">Friends: {user.friends_count}</Typography>
//                 </Card>
//             ))}
//         </>
//     );
// }

// export default UserCard;

