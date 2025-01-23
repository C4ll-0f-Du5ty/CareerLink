import { createContext, useState, useEffect } from 'react'
import { jwtDecode } from "jwt-decode";
import jwtEncode from 'jwt-encode';
import { toast } from 'react-toastify'
const AuthContext = createContext()

export default AuthContext;


export const AuthProvider = ({ children }) => {

    const temp = localStorage.getItem("authTokens")
    let [authTokens, setAuthTokens] = useState(() => temp ? JSON.parse(temp) : null)
    let [user, setUser] = useState(() => temp ? jwtDecode(temp) : null)
    let [loading, setLoading] = useState(true)

    let loginUser = async (e) => {
        console.log("Welcome")
        let response = await fetch("http://127.0.0.1:8000/api/token/",
            {
                method: "POST",
                headers: {
                    'content-type': "application/json",
                },
                body: JSON.stringify(
                    {
                        'username': e.target.username.value,
                        'password': e.target.password.value,
                    }
                )
            }
        )
        let data = await response.json()
        if (response.status === 200) {
            setAuthTokens(data)
            setUser(jwtDecode(data.access))
            localStorage.setItem("authTokens", JSON.stringify(data))
            setLoading(true)
            return true
        }
        else {
            toast.error("Wrong Credentials", {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            return false
        }
    }

    let logoutUser = () => {
        setAuthTokens(null)
        setUser(null)
        localStorage.removeItem("authTokens")
        setLoading(false)
        // history.push('/login')
    }

    let updateToken = async () => {
        console.log("updated!!")
        let response = await fetch("http://localhost:8000/api/token/refresh/",
            {
                method: "POST",
                headers: {
                    'content-type': "application/json",
                },
                body: JSON.stringify(
                    {
                        'refresh': authTokens?.refresh
                    }
                )
            }
        )
        const data = await response.json()
        if (response.status === 200) {
            setAuthTokens(data)
            setUser(jwtDecode(data.access))
            localStorage.setItem("authTokens", JSON.stringify(data))
        }
        else {
            logoutUser()
        }

        if (loading) {
            setLoading(false)
        }
    }

    let updateUsername = (newUsername) => {
        setUser((prev) => {
            console.log("Previous User:", prev); // Log before update
            const updatedUser = prev ? { ...prev, username: newUsername } : prev;
            console.log("Updated User:", updatedUser); // Log after update

            // const newAccessToken = jwtEncode(updatedUser, "Dusty");

            // // Update the authTokens with the new access token
            // setAuthTokens((prevTokens) => ({
            //     ...prevTokens,
            //     access: newAccessToken,
            // }));
            return updatedUser;
        });

        // const newAccessToken = jwtEncode(user);
        // localStorage.setItem("authTokens", JSON.stringify(data))
    };

    console.log('Context', user)

    let contextData = {
        user: user,
        updateUsername: updateUsername,
        authTokens: authTokens,
        loginUser: loginUser, // return the function here
        logoutUser: logoutUser,
        updateToken: updateToken
    };

    useEffect(() => {

        if (loading) {
            updateToken()
            console.log(loading)
        }
        const interval = setInterval(() => {
            if (authTokens) {
                updateToken()
            }
        }, 1000 * 60 * 4);

        return () => clearInterval(interval)
    }, [authTokens, loading])

    return (
        <AuthContext.Provider value={contextData}>
            {loading ? null : children}
        </AuthContext.Provider>
    )

}
