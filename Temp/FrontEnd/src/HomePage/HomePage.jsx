import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../Context/AuthContext';

const HomePage = () => {
    const [profiles, setProfiles] = useState([]);

    let [reTry, setReTry] = useState(true)
    let { authTokens, logoutUser, updateToken } = useContext(AuthContext)
    // useEffect(() => {
    //     axios.get('users/profiles/')
    //         .then(res => setProfiles(res.data))
    //         .catch(err => console.error(err));
    // }, []);
    useEffect(() => {
        fetchProfiles();
    }, []);

    const fetchProfiles = async () => {
        // try {
        const response = await fetch('http://localhost:8000/users/profiles/',
            {
                method: "GET",
                headers: {
                    "Authorization": "Dusty " + String(authTokens?.access)
                }
            }
        );

        // if (!response.ok) {
        //     throw new Error(`HTTP error! status: ${response.status}`);
        // }

        const data = await response.json();
        if (response.status === 200) {
            setProfiles(data);
        } else if (response.statusText === 'Unauthorized' && reTry) {
            console.log(authTokens.access)
            await updateToken();  // Try to refresh the token
            console.log("-----------------------------------------")
            console.log(authTokens.access)
            setReTry(false)
            return fetchProfiles();
            // Retry the request after updating the token
        } else {
            logoutUser();  // If it still fails, log out the user
        }
    }

    return (
        <div>
            <h1>Home Page</h1>
            <ul>
                {profiles && profiles.map(profile => (
                    <li key={profile.id}>
                        {profile.user.username} - Followers: {profile.followers_count}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default HomePage;
