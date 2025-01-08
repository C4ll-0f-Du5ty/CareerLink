
import React, { useState, useEffect, useContext } from "react";
import AuthContext from '../../Context/AuthContext';
import { motion } from 'framer-motion'
const Settings = () => {
    const { user, authTokens } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        username: user?.username || "",
        first_name: user?.first_name || "",
        last_name: user?.last_name || "",
        email: user?.email || "",
        bio: "",
    });
    const [error, setError] = useState("");

    useEffect(() => {
        // Fetch the user's current bio
        const fetchUserProfile = async () => {
            let response = await fetch(`http://localhost:8000/users/profile/${user.username}/`, {
                headers: {
                    Authorization: `Dusty ${authTokens.access}`,
                },
            });
            let data = await response.json();
            setFormData((prev) => ({ ...prev, bio: data.bio }));
            console.log(formData)
        };
        fetchUserProfile();
    }, [authTokens, user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch("http://localhost:8000/users/profile/update/", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Dusty ${authTokens.access}`,
            },
            body: JSON.stringify(formData),
        });

        if (response.status === 200) {
            alert("Profile updated successfully!");
        } else {
            const data = await response.json();
            setError(data.error || "An error occurred.");
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <motion.div
            className="flex justify-center items-center min-h-screen bg-gray-100"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <div className="bg-white shadow-xl rounded-lg p-6 w-full max-w-md">
                <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
                    Edit Profile
                </h2>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="Username"
                        className="w-full px-1 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                    />
                    <input
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        placeholder="First Name"
                        className="w-full px-1 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                    />
                    <input
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        placeholder="Last Name"
                        className="w-full px-1 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                    />
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Email"
                        className="w-full px-1 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                    />
                    <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        placeholder="Bio"
                        className="w-full px-1 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                    ></textarea>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-all"
                    >
                        Save Changes
                    </motion.button>
                </form>
            </div>
        </motion.div>
    );
};

export default Settings;
