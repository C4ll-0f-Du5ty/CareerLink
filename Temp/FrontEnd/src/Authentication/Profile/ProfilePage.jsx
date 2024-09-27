import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../../Context/AuthContext';
import UserCard from '../../Card/NewCard.jsx'

const ProfilePage = () => {
    // const { username } = useParams();
    const [profile, setProfile] = useState(null);
    const { authTokens, user, logoutUser } = useContext(AuthContext);

    useEffect(() => {
        // console.log("gg")
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await fetch(`http://localhost:8000/users/profile/${user.username}/`,
                {
                    method: "GET",
                    headers: {
                        "Authorization": "Dusty " + String(authTokens.access)
                    },
                });

            // if (!response.ok) {
            //     throw new Error(`HTTP error! status: ${response.status}`);
            // }

            const data = await response.json();
            if (response.status === 200) {
                setProfile(data);
            } else if (response.statusText === 'Unauthorized') {
                logoutUser()
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    };

    if (!profile) return <p>Loading...</p>;

    return (
        <div>
            <h1>{profile.user.username}s Profile</h1>
            <p>Followers: {profile.followers_count}</p>
            <p>Friends: {profile.friends_count}</p>
            <br />
            <UserCard/>
        </div>
    );
};

export default ProfilePage;
