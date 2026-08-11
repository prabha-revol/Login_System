async function login() {

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const response = await fetch("/API/Login", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({

            username: username,
            password: password

        })

    });

    const data = await response.json();

    if (data.status === "success") {

        localStorage.setItem("user_id", data.user_id);

        window.location.href = "/dashboard";

    } else {

        document.getElementById("message").innerHTML =
        "Invalid Username or Password";

    }

}