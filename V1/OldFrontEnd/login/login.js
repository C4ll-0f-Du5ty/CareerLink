document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('error-message');
    const logoutButton = document.getElementById('logoutButton');

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        fetch('http://127.0.0.1:8000/api/token/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Login successful:', data);
            localStorage.setItem('access_token', data.access);
            localStorage.setItem('refresh_token', data.refresh);
            window.location.href = '../dashboard/dashboard.html'; // Redirect to dashboard page
        })
        .catch(error => {
            console.error('There was a problem with your fetch operation:', error);
            errorMessage.textContent = 'Invalid username or password';
        });
    });

    logoutButton.addEventListener('click', logoutUser);

    // Check if user is already logged in
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
        window.location.href = '../dashboard/dashboard.html'; // Redirect to dashboard page if already logged in
        logoutButton.style.display = 'block';
    } else {
        logoutButton.style.display = 'none';
    }

    // Add this function at the end of your script.js file
    function logoutUser() {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = 'index.html'; // Redirect back to login page
    }
});


// Add this function at the end of your script.js file
// function logoutUser() {
//     localStorage.removeItem('access_token');
//     localStorage.removeItem('refresh_token');
//     window.location.href = 'login/index.html'; // Redirect back to login page
// }

