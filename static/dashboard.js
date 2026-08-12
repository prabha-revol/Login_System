// =====================================================
// GET USER INFORMATION
// =====================================================

const urlParams = new URLSearchParams(window.location.search);

let userId = urlParams.get("user_id");

// If URL does not contain user_id,
// get it from localStorage
if (!userId) {
    userId = localStorage.getItem("user_id");
}

// Save user ID
if (userId) {
    localStorage.setItem("user_id", userId);
}


// =====================================================
// HTML ELEMENTS
// =====================================================

const userIdElement =
    document.getElementById("userId");

const usernameElement =
    document.getElementById("username");

const sensorContainer =
    document.getElementById("sensorContainer");


// =====================================================
// DISPLAY USER ID
// =====================================================

if (userIdElement) {
    userIdElement.innerText =
        userId || "Not Available";
}


// =====================================================
// DISPLAY USERNAME
// =====================================================

const username =
    localStorage.getItem("username");

console.log(
    "Dashboard User ID:",
    userId
);

console.log(
    "Dashboard Username:",
    username
);

if (usernameElement) {
    usernameElement.innerText =
        username || "User";
}


// =====================================================
// LOAD DASHBOARD
// =====================================================

async function loadDashboard() {

    // -------------------------------------------------
    // CHECK USER ID
    // -------------------------------------------------

    if (!userId) {

        if (sensorContainer) {

            sensorContainer.innerHTML = `
                <div class="error">
                    User ID not found.
                    Please login again.
                </div>
            `;
        }

        return;
    }


    // -------------------------------------------------
    // CHECK SENSOR CONTAINER
    // -------------------------------------------------

    if (!sensorContainer) {

        console.error(
            "sensorContainer element not found."
        );

        return;
    }


    try {

        console.log(
            "Calling Dashboard API for User:",
            userId
        );


        // =================================================
        // DASHBOARD API
        // =================================================

        const response = await fetch(
            `/API/Dashboard/${userId}`
        );


        console.log(
            "Dashboard API Status:",
            response.status
        );


        // =================================================
        // CHECK API RESPONSE
        // =================================================

        if (!response.ok) {

            let errorMessage =
                "Dashboard API failed.";

            try {

                const errorData =
                    await response.json();

                if (errorData.detail) {
                    errorMessage =
                        errorData.detail;
                }

            } catch (error) {

                console.log(
                    "Unable to read error response."
                );
            }

            throw new Error(
                errorMessage
            );
        }


        // =================================================
        // READ JSON
        // =================================================

        const data =
            await response.json();


        console.log(
            "Dashboard Data:",
            data
        );


        // =================================================
        // GET DEVICES
        // =================================================

        const devices =
            data.devices || [];


        // =================================================
        // NO DEVICES
        // =================================================

        if (devices.length === 0) {

            sensorContainer.innerHTML = `

                <div class="no-data">

                    No devices found.

                    <br><br>

                    Click
                    <b>+ Add Device</b>
                    to register a device.

                </div>

            `;

            return;
        }


        // =================================================
        // CLEAR OLD CARDS
        // =================================================

        sensorContainer.innerHTML = "";


        // =================================================
        // CREATE DEVICE CARDS
        // =================================================

        devices.forEach(device => {

            const card =
                document.createElement("div");

            card.className =
                "sensor-card";


            // =================================================
            // DEVICE ID
            // =================================================

            const deviceId =
                device.id ||
                device.device_id;


            // =================================================
            // DEVICE NAME
            // =================================================

            const deviceName =
                device.device_name ||
                "Unknown Device";


            // =================================================
            // DEVICE TYPE
            // =================================================

            const deviceType =
                device.device_type ||
                "N/A";


            const deviceTypeLower =
                deviceType.toLowerCase();


            // =================================================
            // LOCATION
            // =================================================

            const location =
                device.location ||
                "Not Available";


            // =================================================
            // STATUS
            // =================================================

            const status =
                device.status ||
                "Active";


            // =================================================
            // LATEST SENSOR DATA
            // =================================================

            const latestData =
                device.latest_data || {};


            // =================================================
            // SENSOR VALUE
            // =================================================

            let value = "No Data";

            let unit = "";


            // =================================================
            // TEMPERATURE SENSOR
            // =================================================

            if (
                deviceTypeLower.includes(
                    "temperature"
                )
            ) {

                if (
                    latestData.temperature !== null &&
                    latestData.temperature !== undefined
                ) {

                    value =
                        latestData.temperature;

                    unit =
                        "°C";
                }

                else if (
                    latestData.sensor_value !== null &&
                    latestData.sensor_value !== undefined
                ) {

                    value =
                        latestData.sensor_value;

                    unit =
                        "°C";
                }
            }


            // =================================================
            // PRESSURE SENSOR
            // =================================================

            else if (
                deviceTypeLower.includes(
                    "pressure"
                )
            ) {

                if (
                    latestData.pressure !== null &&
                    latestData.pressure !== undefined
                ) {

                    value =
                        latestData.pressure;

                    unit =
                        "bar";
                }

                else if (
                    latestData.sensor_value !== null &&
                    latestData.sensor_value !== undefined
                ) {

                    value =
                        latestData.sensor_value;

                    unit =
                        "bar";
                }
            }


            // =================================================
            // GENERIC SENSOR
            // =================================================

            else if (
                latestData.sensor_value !== null &&
                latestData.sensor_value !== undefined
            ) {

                value =
                    latestData.sensor_value;

                unit =
                    latestData.unit || "";
            }


            // =================================================
            // LAST UPDATED
            // =================================================

            let lastUpdated =
                "Not Available";


            if (latestData.created_at) {

                const date =
                    new Date(
                        latestData.created_at
                    );

                if (!isNaN(date.getTime())) {

                    lastUpdated =
                        date.toLocaleString();
                }
            }

            else if (latestData.timestamp) {

                const date =
                    new Date(
                        latestData.timestamp
                    );

                if (!isNaN(date.getTime())) {

                    lastUpdated =
                        date.toLocaleString();
                }
            }


            // =================================================
            // DEVICE CARD HTML
            // =================================================

            card.innerHTML = `

                <div class="device-header">

                    <h2>

                        <span class="status-dot"></span>

                        ${deviceName}

                    </h2>

                    <span class="device-menu">
                        ⋮
                    </span>

                </div>


                <div class="info">

                    Type:
                    ${deviceType}

                </div>


                <div class="sensor-value">

                    ${value} ${unit}

                </div>


                <div class="info">

                    Location:
                    ${location}

                </div>


                <div class="info">

                    Status:

                    <span class="status">

                        ${status}

                    </span>

                </div>


                <div class="info">

                    Last Updated:

                    ${lastUpdated}

                </div>


                <button
                    class="view-details-btn"
                    onclick="viewDeviceDetails(${device.device_id})"
                >

                    👁 View Details

                </button>

            `;


            // Add card to dashboard
            sensorContainer.appendChild(card);

        });

    }


    // =================================================
    // ERROR
    // =================================================

    catch (error) {

        console.error(
            "Dashboard Error:",
            error
        );


        sensorContainer.innerHTML = `

            <div class="error">

                Unable to load sensor data.

                <br><br>

                ${error.message}

            </div>

        `;
    }
}


// =====================================================
// ADD DEVICE MODAL ELEMENTS
// =====================================================

const addDeviceBtn =
    document.getElementById("addDeviceBtn");

const addDeviceModal =
    document.getElementById("addDeviceModal");

const closeModal =
    document.getElementById("closeModal");

const cancelDevice =
    document.getElementById("cancelDevice");


// =====================================================
// OPEN ADD DEVICE MODAL
// =====================================================

if (addDeviceBtn) {

    addDeviceBtn.addEventListener(
        "click",
        function () {

            if (addDeviceModal) {

                addDeviceModal.style.display =
                    "flex";
            }

        }
    );
}


// =====================================================
// CLOSE MODAL - X BUTTON
// =====================================================

if (closeModal) {

    closeModal.addEventListener(
        "click",
        function () {

            if (addDeviceModal) {

                addDeviceModal.style.display =
                    "none";
            }

        }
    );
}


// =====================================================
// CLOSE MODAL - CANCEL BUTTON
// =====================================================

if (cancelDevice) {

    cancelDevice.addEventListener(
        "click",
        function () {

            if (addDeviceModal) {

                addDeviceModal.style.display =
                    "none";
            }

        }
    );
}


// =====================================================
// CLOSE MODAL WHEN CLICKING OUTSIDE
// =====================================================

if (addDeviceModal) {

    addDeviceModal.addEventListener(
        "click",
        function (event) {

            if (
                event.target ===
                addDeviceModal
            ) {

                addDeviceModal.style.display =
                    "none";
            }

        }
    );
}


// =====================================================
// ADD DEVICE
// =====================================================

async function addDevice() {

    // -------------------------------------------------
    // GET FORM ELEMENTS
    // -------------------------------------------------

    const deviceNameElement =
        document.getElementById(
            "deviceName"
        );

    const deviceTypeElement =
        document.getElementById(
            "deviceType"
        );

    const locationElement =
        document.getElementById(
            "deviceLocation"
        );

    const message =
        document.getElementById(
            "addDeviceMessage"
        );


    // -------------------------------------------------
    // GET VALUES
    // -------------------------------------------------

    const deviceName =
        deviceNameElement
            ? deviceNameElement.value.trim()
            : "";


    const deviceType =
        deviceTypeElement
            ? deviceTypeElement.value.trim()
            : "";


    const location =
        locationElement
            ? locationElement.value.trim()
            : "";


    // =================================================
    // VALIDATION
    // =================================================

    if (!deviceName || !deviceType) {

        if (message) {

            message.style.color =
                "red";

            message.innerText =
                "Please enter Device Name and Device Type.";
        }

        return;
    }


    // =================================================
    // CHECK USER ID
    // =================================================

    if (!userId) {

        if (message) {

            message.style.color =
                "red";

            message.innerText =
                "User ID not found. Please login again.";
        }

        return;
    }


    try {

        console.log(
            "Adding device for User:",
            userId
        );


        // =================================================
        // ADD DEVICE API
        // =================================================

        const response =
            await fetch(
                "/API/AddDevice",
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body: JSON.stringify({

                        device_name:
                            deviceName,

                        device_type:
                            deviceType,

                        location:
                            location || null,

                        user_id:
                            Number(userId)

                    })

                }
            );


        // =================================================
        // READ RESPONSE
        // =================================================

        const data =
            await response.json();


        console.log(
            "Add Device Response:",
            data
        );


        // =================================================
        // CHECK RESPONSE
        // =================================================

        if (!response.ok) {

            throw new Error(
                data.detail ||
                "Failed to add device."
            );
        }


        // =================================================
        // SUCCESS MESSAGE
        // =================================================

        if (message) {

            message.style.color =
                "green";

            message.innerText =
                "Device added successfully!";
        }


        // =================================================
        // CLEAR FORM
        // =================================================

        if (deviceNameElement) {
            deviceNameElement.value = "";
        }

        if (deviceTypeElement) {
            deviceTypeElement.value = "";
        }

        if (locationElement) {
            locationElement.value = "";
        }


        // =================================================
        // CLOSE MODAL + REFRESH
        // =================================================

        setTimeout(
            function () {

                if (addDeviceModal) {

                    addDeviceModal.style.display =
                        "none";
                }

                if (message) {

                    message.innerText = "";
                }

                loadDashboard();

            },
            1000
        );

    }


    // =================================================
    // ADD DEVICE ERROR
    // =================================================

    catch (error) {

        console.error(
            "Add Device Error:",
            error
        );


        if (message) {

            message.style.color =
                "red";

            message.innerText =
                error.message;
        }
    }
}


// =====================================================
// VIEW SENSOR HISTORY
// =====================================================

function openHistory() {

    const currentUserId =
        localStorage.getItem(
            "user_id"
        );


    if (!currentUserId) {

        alert(
            "User ID not found. Please login again."
        );

        return;
    }


    window.location.href =
        `/history?user_id=${currentUserId}`;
}


// =====================================================
// VIEW DEVICE DETAILS
// =====================================================

function viewDeviceDetails(deviceId) {

    console.log(
        "Viewing Device:",
        deviceId
    );


    if (!deviceId) {

        alert(
            "Device ID not available."
        );

        return;
    }


    // Device details page can be connected later.
    alert(
        "Device ID: " + deviceId
    );
}


// =====================================================
// MANUAL REFRESH
// =====================================================

function refreshDashboard() {

    console.log(
        "Manual dashboard refresh"
    );

    loadDashboard();
}


// =====================================================
// INITIAL LOAD
// =====================================================

loadDashboard();


// =====================================================
// AUTO REFRESH EVERY 5 SECONDS
// =====================================================

setInterval(
    loadDashboard,
    5000
);
