

// Get user ID from URL first
const urlParams = new URLSearchParams(window.location.search);
let userId = urlParams.get("user_id");

// If URL has no user ID, get it from localStorage
if (!userId) {
    userId = localStorage.getItem("user_id");
}

// Save user ID to localStorage
if (userId) {
    localStorage.setItem("user_id", userId);
}

console.log("User ID:", userId);

const userIdElement = document.getElementById("userId");
const sensorContainer = document.getElementById("sensorContainer");

// Display User ID
if (userId) {
    userIdElement.innerText = userId;
} else {
    userIdElement.innerText = "Not Available";
}


// Load dashboard data
async function loadDashboard() {

    if (!userId) {
        sensorContainer.innerHTML = `
            <div class="error">
                User ID not found
            </div>
        `;
        return;
    }

    try {

        console.log("Calling Dashboard API for User:", userId);

        const response = await fetch(
            `/API/Dashboard/${userId}`
        );

        console.log(
            "Dashboard API Status:",
            response.status
        );

        if (!response.ok) {
            throw new Error("Dashboard API failed");
        }

        const data = await response.json();

        console.log("Dashboard Data:", data);

        sensorContainer.innerHTML = "";

        // API returns:
        // {
        //   user_id: 1,
        //   devices: [...]
        // }

        const devices = data.devices || [];

        if (devices.length === 0) {

            sensorContainer.innerHTML = `
                <div class="no-data">
                    No devices found
                </div>
            `;

            return;
        }


        // Create device cards
        devices.forEach(device => {

            const card = document.createElement("div");

            card.className = "sensor-card";


            // Get latest data
            const latestData = device.latest_data || {};

            let value = "No Data";
            let unit = "";

            // Temperature device
            if (
                device.device_type &&
                device.device_type.toLowerCase() === "temperature"
            ) {

                if (latestData.temperature !== null &&
                    latestData.temperature !== undefined) {

                    value = latestData.temperature;
                    unit = "°C";
                }

            }


            // Pressure device
            else if (
                device.device_type &&
                device.device_type.toLowerCase() === "pressure"
            ) {

                if (latestData.pressure !== null &&
                    latestData.pressure !== undefined) {

                    value = latestData.pressure;
                    unit = "bar";
                }

            }


            // Last updated time
            let lastUpdated = "Not Available";

            if (latestData.created_at) {

                const date = new Date(
                    latestData.created_at
                );

                lastUpdated = date.toLocaleString();

            }


            card.innerHTML = `

                <h2>
                    ${device.device_name || "Unknown Device"}
                </h2>

                <div class="info">
                    Type:
                    ${device.device_type || "N/A"}
                </div>

                <div class="sensor-value">
                    ${value} ${unit}
                </div>

                <div class="info">
                    Location:
                    ${device.location || "Not Available"}
                </div>

                <div class="info">
                    Status:
                    <span class="status">
                        ${device.status || "Active"}
                    </span>
                </div>

                <div class="info">
                    Last Updated:
                    ${lastUpdated}
                </div>

            `;


            sensorContainer.appendChild(card);

        });

    }

    catch (error) {

        console.error(
            "Dashboard Error:",
            error
        );

        sensorContainer.innerHTML = `
            <div class="error">
                Unable to load sensor data
            </div>
        `;
    }
}


// First load
loadDashboard();


// Refresh every 5 seconds
setInterval(
    loadDashboard,
    5000
);
function openHistory() {

    const userId =
        localStorage.getItem("user_id");

    console.log(
        "Opening history for user:",
        userId
    );


    if (!userId) {

        alert(
            "User ID not found. Please login again."
        );

        return;
    }


    window.location.href =
        `/history?user_id=${userId}`;
}