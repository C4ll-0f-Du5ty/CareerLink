import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Import icons
// import { FaEdit, FaSignOutAlt } from 'react-icons/fa';

// Import styles
import './Profile.css';
import AuthContext from '../../Context/AuthContext';

function Profile() {

    let { user, logoutUser } = useContext(AuthContext)

    // const { authTokens, logoutUser } = useContext(AuthContext);
    // const [userData, setUserData] = useState(null);

    // useEffect(() => {
    //     if (authTokens) {
    //         // Fetch user data from your backend API
    //         // Replace this with your actual API call
    //         const fetchData = async () => {
    //             try {
    //                 const response = await fetch('https://your-api-url.com/user', {
    //                     method: 'GET',
    //                     headers: {
    //                         'Authorization': `Bearer ${authTokens}`,
    //                         'Content-Type': 'application/json'
    //                     }
    //                 });
    //                 const data = await response.json();
    //                 setUserData(data);
    //             } catch (error) {
    //                 console.error('Error fetching user data:', error);
    //             }
    //         };
    //         fetchData();
    //     }
    // }, [authTokens]);

    const handleLogout = () => {
        alert('You are logged out, kiddin!!');
    };

    return (
        <div className="profile-container">
            <div className="profile-header">
                <h1>My Profile</h1>
                <button onClick={logoutUser} className="logout-button">
                    Logout
                </button>
            </div>

            {user ? (
                <main className="profile-main">
                    <section className="profile-info">
                        <img src={user.avatar || 'default-avatar.jpg'} alt="User Avatar" className="avatar" />
                        <div className="info">
                            <h2>{user.name}</h2>
                            <p>Email: {user.email}</p>
                            <p>Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
                        </div>
                    </section>

                    <section className="profile-stats">
                        <div className="stat">
                            <span className="value">{user.postsCount || 0}</span>
                            <span className="label">Posts</span>
                        </div>
                        <div className="stat">
                            <span className="value">{user.followersCount || 0}</span>
                            <span className="label">Followers</span>
                        </div>
                        <div className="stat">
                            <span className="value">{user.followingCount || 0}</span>
                            <span className="label">Following</span>
                        </div>
                    </section>

                    <footer className="profile-footer">
                        <Link to="/edit-profile" className="edit-profile-link">
                            <img src="./images/tools.png" /> Edit Profile
                        </Link>
                    </footer>
                </main>
            ) : (
                <div className="loading-message">
                    Loading profile...
                </div>
            )}
        </div>
    );
}

export default Profile;
