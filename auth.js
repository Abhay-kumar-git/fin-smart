document.addEventListener("DOMContentLoaded", function() {
    const signupForm = document.getElementById("signup-form");
    const loginForm = document.getElementById("login-form");

    if (signupForm) {
        signupForm.addEventListener("submit", function(event) {
            event.preventDefault();
            const name = document.getElementById("signup-name").value;
            const email = document.getElementById("signup-email").value;
            const password = document.getElementById("signup-password").value;

            const user = { name, email, password };
            localStorage.setItem(email, JSON.stringify(user));
            alert("Signup successful! Please login.");
            window.location.href = "login.html";
        });
    }

    if (loginForm) {
        loginForm.addEventListener("submit", function(event) {
            event.preventDefault();
            const email = document.getElementById("login-email").value;
            const password = document.getElementById("login-password").value;

            const storedUser = localStorage.getItem(email);
            if (storedUser) {
                const user = JSON.parse(storedUser);
                if (user.password === password) {
                    localStorage.setItem("loggedInUser", email);
                    alert("Login successful!");
                    window.location.href = "dashboard.html";
                } else {
                    alert("Incorrect password.");
                }
            } else {
                alert("User not found. Please sign up first.");
            }
        });
    }
});

function logout() {
    localStorage.removeItem("loggedInUser");
    alert("Logged out successfully!");
    window.location.href = "index.html";
}