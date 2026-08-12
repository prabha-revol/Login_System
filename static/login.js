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

        // Login API
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
        if (
            response.ok &&
            data.message === "Login successful"
        ) {

            // Save User ID
            localStorage.setItem(
                "user_id",
                data.user_id
            );

            // Save Username
            localStorage.setItem(
                "username",
                data.username
            );


            console.log(
                "User ID:",
                localStorage.getItem("user_id")
            );

            console.log(
                "Username:",
                localStorage.getItem("username")
            );


            // Open dashboard
            window.location.href =
                `/dashboard?user_id=${data.user_id}`;

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
