document.addEventListener('DOMContentLoaded', function() {
    const contentDiv = document.getElementById('content');

    // Function to check if user is logged in
    function checkLoginStatus() {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
            window.location.href = '../login/login.html'; // Redirect to login page if not logged in
        } else {
            // User is logged in, so we can safely show the dashboard content
            showDashboardContent();
        }
    }

    // Function to show dashboard content
    function showDashboardContent() {
        contentDiv.innerHTML = `
            <header>
                <h1>User Dashboard</h1>
                <button id="logoutButton">Logout</button>
            </header>

            <main class="dashboard-content">
                <h2>Welcome, User!</h2>
                <p>This is your secure dashboard area.</p>
            </main>
        `;

        const logoutButton = document.getElementById('logoutButton');
        logoutButton.addEventListener('click', function(e) {
            e.preventDefault(); 
            logoutUser();
        });

        // Function to display user info
        function displayUserInfo() {
            const accessToken = localStorage.getItem('access_token');
            if (accessToken) {
                document.querySelector('.dashboard-content').innerHTML += `
                    <p>Your access token: ${accessToken.substring(0, 20)}...</p>
                `;
            }
        }

        displayUserInfo();

        // Add event listener to refresh token periodically
        setInterval(checkLoginStatus, 60000); // Check every minute
    }

    // Logout function
    function logoutUser() {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '../login/login.html'; // Redirect back to login page
    }

    // Check login status immediately
    checkLoginStatus();
});

// Add event listener for token refresh (you'll need to implement this server-side)
// function refreshToken() {
//     const refreshToken = localStorage.getItem('refresh_token');
//     if (!refreshToken) return;

//     fetch('/api/token/refresh/', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//             refresh: refreshToken
//         })
//     })
//     .then(response => response.json())
//     .then(data => {
//         if (data.access) {
//             localStorage.setItem('access_token', data.access);
//             console.log('Access token refreshed successfully');
//         } else {
//             console.error('Failed to refresh access token');
//         }
//     })
//     .catch(error => {
//         console.error('Error refreshing token:', error);
//         // If refresh fails, log out the user
//         logoutUser();
//     });
// }

// Call refreshToken every hour
// setInterval(refreshToken, 3600000); // 3600000 milliseconds = 1 hour
