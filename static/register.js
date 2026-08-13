async function registerUser() {

    const username =
        document.getElementById("username").value.trim();

    const email =
        document.getElementById("email").value.trim();

    const password =
        document.getElementById("password").value.trim();

    const message =
        document.getElementById("message");


    // ==============================
    // VALIDATION
    // ==============================

    if (!username || !email || !password) {

        message.style.color = "red";
        message.innerText =
            "Please fill all required fields.";

        return;
    }


    try {

        console.log(
            "Registering user:",
            username
        );


        // ==============================
        // REGISTER API
        // ==============================

        const response = await fetch(
            "/API/RegisterUser",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    username: username,
                    email: email,
                    password: password,
                    role: "user"
                })
            }
        );


        const data =
            await response.json();


        console.log(
            "Register Response:",
            data
        );


        // ==============================
        // CHECK RESPONSE
        // ==============================

        if (!response.ok) {

            throw new Error(
                data.detail ||
                "Registration failed"
            );
        }


        // ==============================
        // SUCCESS
        // ==============================

        message.style.color = "green";

        message.innerText =
            "Registration successful! Redirecting to Login...";


        // ==============================
        // GO TO LOGIN
        // ==============================

        setTimeout(
            function () {

                window.location.href =
                    "/Login";

            },
            1500
        );

    }

    catch (error) {

        console.error(
            "Registration Error:",
            error
        );

        message.style.color = "red";

        message.innerText =
            error.message;
    }
}