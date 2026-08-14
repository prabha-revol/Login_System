// =====================================================
// GET USER ID
// =====================================================

const urlParams =
    new URLSearchParams(window.location.search);

let userId =
    urlParams.get("user_id");


// If URL does not contain user_id,
// get it from localStorage

if (!userId) {

    userId =
        localStorage.getItem("user_id");

}


// Save user ID

if (userId) {

    localStorage.setItem(
        "user_id",
        userId
    );

}


console.log(
    "Graph User ID:",
    userId
);


// =====================================================
// HTML ELEMENTS
// =====================================================

const backHistory =
    document.getElementById(
        "backHistory"
    );

const canvas =
    document.getElementById(
        "sensorChart"
    );


// =====================================================
// BACK TO SENSOR HISTORY
// =====================================================

if (backHistory) {

    backHistory.addEventListener(
        "click",
        function () {

            console.log(
                "Back to Sensor History clicked"
            );

            console.log(
                "User ID:",
                userId
            );


            if (!userId) {

                alert(
                    "User ID not found. Please login again."
                );

                return;

            }


            // Go back to History page

            window.location.href =
                `/history?user_id=${userId}`;

        }
    );

}
else {

    console.error(
        "Back History button not found"
    );

}


// =====================================================
// LOAD GRAPH DATA
// =====================================================

async function loadGraph() {

    if (!userId) {

        console.error(
            "User ID not found"
        );

        return;

    }


    try {

        console.log(
            "Calling History API:",
            `/API/History/${userId}`
        );


        // =================================================
        // CALL HISTORY API
        // =================================================

        const response =
            await fetch(
                `/API/History/${userId}`
            );


        console.log(
            "History API Status:",
            response.status
        );


        // =================================================
        // CHECK RESPONSE
        // =================================================

        if (!response.ok) {

            const errorData =
                await response
                .json()
                .catch(
                    () => ({})
                );


            throw new Error(
                errorData.detail ||
                "History API failed"
            );

        }


        // =================================================
        // GET JSON
        // =================================================

        const result =
            await response.json();


        console.log(
            "Graph History Data:",
            result
        );


        // =================================================
        // GET HISTORY
        // =================================================

        const history =
            result.history || [];


        if (
            history.length === 0
        ) {

            console.log(
                "No history data found"
            );

            return;

        }


        // =================================================
        // PREPARE GRAPH DATA
        // =================================================

        const labels = [];

        const values = [];

        let sensorType =
            "Sensor";


        // =================================================
        // LOOP DEVICES
        // =================================================

        history.forEach(
            function(device) {


                sensorType =
                    device.device_type ||
                    "Sensor";


                const sensorData =
                    device.data || [];


                // =========================================
                // LOOP SENSOR RECORDS
                // =========================================

                sensorData.forEach(
                    function(item) {


                        let value =
                            null;


                        // =================================
                        // PRESSURE
                        // =================================

                        if (
                            item.pressure !== null &&
                            item.pressure !== undefined
                        ) {

                            value =
                                item.pressure;

                            sensorType =
                                "Pressure";

                        }


                        // =================================
                        // TEMPERATURE
                        // =================================

                        else if (
                            item.temperature !== null &&
                            item.temperature !== undefined
                        ) {

                            value =
                                item.temperature;

                            sensorType =
                                "Temperature";

                        }


                        // =================================
                        // ADD GRAPH DATA
                        // =================================

                        if (
                            value !== null
                        ) {

                            values.push(
                                value
                            );


                            if (
                                item.created_at
                            ) {

                                labels.push(
                                    new Date(
                                        item.created_at
                                    ).toLocaleString()
                                );

                            }
                            else {

                                labels.push(
                                    "N/A"
                                );

                            }

                        }

                    }
                );

            }
        );


        // =================================================
        // DEBUG
        // =================================================

        console.log(
            "Graph Labels:",
            labels
        );

        console.log(
            "Graph Values:",
            values
        );


        // =================================================
        // CHECK GRAPH DATA
        // =================================================

        if (
            values.length === 0
        ) {

            console.log(
                "No numeric sensor values available"
            );

            return;

        }


        // =================================================
        // CHECK CANVAS
        // =================================================

        if (!canvas) {

            console.error(
                "sensorChart canvas not found"
            );

            return;

        }


        // =================================================
        // CHECK CHART.JS
        // =================================================

        if (
            typeof Chart ===
            "undefined"
        ) {

            console.error(
                "Chart.js is not loaded"
            );

            return;

        }


        // =================================================
        // CREATE GRAPH
        // =================================================

        new Chart(
            canvas,
            {

                type: "line",


                // =========================================
                // DATA
                // =========================================

                data: {

                    labels:
                        labels,

                    datasets: [

                        {

                            label:
                                sensorType,

                            data:
                                values,

                            borderWidth:
                                3,

                            tension:
                                0.3,

                            fill:
                                false,

                            pointRadius:
                                4

                        }

                    ]

                },


                // =========================================
                // OPTIONS
                // =========================================

                options: {

                    responsive:
                        true,

                    maintainAspectRatio:
                        false,


                    plugins: {

                        legend: {

                            display:
                                true

                        }

                    },


                    scales: {

                        x: {

                            title: {

                                display:
                                    true,

                                text:
                                    "Date & Time"

                            }

                        },


                        y: {

                            title: {

                                display:
                                    true,

                                text:
                                    sensorType ===
                                    "Pressure"

                                        ? "Pressure (bar)"

                                        : "Temperature (°C)"

                            }

                        }

                    }

                }

            }
        );

    }


    // =================================================
    // ERROR
    // =================================================

    catch (error) {

        console.error(
            "Graph Error:",
            error
        );

    }

}


// =====================================================
// INITIAL LOAD
// =====================================================

loadGraph();