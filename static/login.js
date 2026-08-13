
async function login() {

    const username =
        document.getElementById("username").value.trim();

    const password =
        document.getElementById("password").value.trim();

    const message =
        document.getElementById("message");

    // Validation
    if (!username || !password) {

        message.innerText =
            "Please enter Username and Password.";

        return;
    }

    try {

        const response = await fetch(
            "/API/Login",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    username: username,
                    password: password
                })
            }
        );

        const data =
            await response.json();

        console.log(
            "Login Response:",
            data
        );

        // Login successful
        if (response.ok) {

            // =========================
            // SAVE USER INFORMATION
            // =========================

            localStorage.setItem(
                "user_id",
                data.user_id
            );

            localStorage.setItem(
                "username",
                data.username
            );

            localStorage.setItem(
                "email",
                data.email
            );

            localStorage.setItem(
                "role",
                data.role
            );

            console.log(
                "Saved Username:",
                localStorage.getItem("username")
            );

            console.log(
                "Saved User ID:",
                localStorage.getItem("user_id")
            );

            // =========================
            // GO TO DASHBOARD
            // =========================

            window.location.href =
                "/dashboard?user_id=" +
                data.user_id;
        }

        else {

            message.innerText =
                data.detail ||
                "Invalid Username or Password.";
        }

    }

    catch (error) {

        console.error(
            "Login Error:",
            error
        );

        message.innerText =
            "Unable to connect to server.";
    }
}


// =====================================================
// LOGIN FORM SUBMIT
// =====================================================

document
    .getElementById("loginForm")
    .addEventListener(
        "submit",
        function(event) {

            event.preventDefault();

            login();
        }
    );
