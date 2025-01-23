import React, { useState, useEffect, useContext } from "react";
import AuthContext from '../../Context/AuthContext';
import { motion } from 'framer-motion';

const Settings = () => {
    const { user, authTokens, updateUsername } = useContext(AuthContext);
    const [formData, setFormData] = useState({});
    const [originalData, setOriginalData] = useState({});
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchUserProfile = async () => {
            let response = await fetch(`http://localhost:8000/users/profile/${user.username}/`, {
                headers: {
                    Authorization: `Dusty ${authTokens.access}`,
                },
            });
            let data = await response.json();
            setFormData((prev) => ({
                username: data?.user?.username || "",
                first_name: data?.user?.first_name || "",
                last_name: data?.user?.last_name || "",
                email: data?.user?.email || "",
                bio: data?.user?.bio || "",
            }));
            setOriginalData({
                username: user?.username,
                first_name: user?.first_name,
                last_name: user?.last_name,
                email: user?.email,
                bio: user?.bio,
            });
        };
        fetchUserProfile();
    }, [authTokens, user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch("http://localhost:8000/users/update/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Dusty ${authTokens.access}`,
            },
            body: JSON.stringify(formData),
        });

        if (response.status === 200) {
            alert("Profile updated successfully!");
            updateUsername(formData.username);
        } else {
            const data = await response.json();
            setError(data.error || "An error occurred.");
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleResetFields = () => {
        setFormData(originalData);
    };

    return (
        <motion.div
            className="flex flex-col items-center min-h-screen bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <div className="w-full bg-white shadow-md py-6">
                <h1 className="text-center text-3xl font-bold text-gray-800" style={{ marginTop: '85px' }}>Settings</h1>
            </div>
            <motion.div
                className="bg-white shadow-2xl rounded-lg p-8 mt-10 w-full max-w-lg"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                transition={{ duration: 0.3 }}
            >
                <h2 className="text-2xl font-semibold mb-6 text-center text-gray-700">
                    Edit Profile
                </h2>
                {error && (
                    <motion.p
                        className="text-red-500 mb-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        {error}
                    </motion.p>
                )}
                <form onSubmit={handleSubmit} className="space-y-6" style={{ marginRight: "35px" }}>
                    {["username", "first_name", "last_name", "email", "bio"].map((field) => (
                        <motion.div
                            key={field}
                            className="space-y-2"
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: 0.1 }}
                        >
                            <label
                                htmlFor={field}
                                className="block text-sm font-semibold text-gray-600"
                            >
                                {field.replace("_", " ").toUpperCase()}
                            </label>
                            {field === "username" ? (
                                <div
                                    id={field}
                                    className="w-full px-4 py-2 border rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                                >
                                    {formData[field]}
                                </div>
                            ) : field === "bio" ? (
                                <textarea
                                    id={field}
                                    name={field}
                                    value={formData[field]}
                                    onChange={handleChange}
                                    placeholder={`Enter your ${field.replace("_", " ")}`}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                ></textarea>
                            ) : (
                                <input
                                    id={field}
                                    type={field === "email" ? "email" : "text"}
                                    name={field}
                                    value={formData[field]}
                                    onChange={handleChange}
                                    placeholder={`Enter your ${field.replace("_", " ")}`}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                />
                            )}
                        </motion.div>
                    ))}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-all"
                        style={{ position: "relative", left: "3%" }}
                    >
                        Save Changes
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        onClick={handleResetFields}
                        className="w-full bg-gray-300 text-gray-800 py-3 rounded-lg hover:bg-gray-400 transition-all mt-3"
                        style={{ position: "relative", left: "3%" }}
                    >
                        Reset to Original
                    </motion.button>
                </form>
            </motion.div>
        </motion.div>
    );
};

export default Settings;
