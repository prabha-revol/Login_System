// =====================================================
// GET LOGGED-IN USER ID
// =====================================================

let userId =
    localStorage.getItem("user_id");

console.log("History User ID:", userId);


// =====================================================
// HTML ELEMENTS
// =====================================================

const historyTable =
    document.getElementById("historyTable");

const backDashboard =
    document.getElementById("backDashboard");

const graphBtn =
    document.getElementById("graphBtn");


// =====================================================
// CHECK USER ID
// =====================================================

if (!userId) {

    console.error("User ID not found");

    if (historyTable) {

        historyTable.innerHTML = `
            <tr>
                <td colspan="5" class="empty-message">
                    User ID not found.
                    Please login again.
                </td>
            </tr>
        `;
    }
}


// =====================================================
// BACK TO DASHBOARD
// =====================================================

if (backDashboard) {

    backDashboard.addEventListener(
        "click",
        function () {

            console.log(
                "Dashboard button clicked"
            );

            if (userId) {

                window.location.href =
                    `/dashboard?user_id=${userId}`;

            } else {

                window.location.href =
                    "/dashboard";

            }

        }
    );
}


// =====================================================
// VIEW GRAPH
// =====================================================

if (graphBtn) {

    console.log(
        "Graph button found successfully"
    );

    graphBtn.addEventListener(
        "click",
        function () {

            console.log(
                "VIEW GRAPH BUTTON CLICKED"
            );

            console.log(
                "User ID:",
                userId
            );


            // Check User ID

            if (!userId) {

                alert(
                    "User ID not found. Please login again."
                );

                return;
            }


            // Open Graph page

            const graphURL =
                `/graph?user_id=${userId}`;

            console.log(
                "Opening:",
                graphURL
            );

            window.location.href =
                graphURL;

        }
    );

} else {

    console.error(
        "ERROR: graphBtn element not found"
    );

}


// =====================================================
// LOAD SENSOR HISTORY
// =====================================================

async function loadHistory() {

    if (!userId) {
        return;
    }


    try {

        console.log(
            "Loading history for User ID:",
            userId
        );


        // Call History API

        const response =
            await fetch(
                `/API/History/${userId}`
            );


        console.log(
            "History API Status:",
            response.status
        );


        if (!response.ok) {

            const errorData =
                await response.json()
                .catch(() => ({}));

            throw new Error(
                errorData.detail ||
                "History API failed"
            );
        }


        // Get JSON

        const result =
            await response.json();


        console.log(
            "History API Response:",
            result
        );


        // Clear table

        historyTable.innerHTML = "";


        const history =
            result.history || [];


        // No data

        if (history.length === 0) {

            historyTable.innerHTML = `
                <tr>
                    <td colspan="5"
                        class="empty-message">
                        No history data found.
                    </td>
                </tr>
            `;

            return;
        }


        // =================================================
        // LOOP DEVICES
        // =================================================

        history.forEach(
            function(device) {

                if (
                    !device.data ||
                    device.data.length === 0
                ) {
                    return;
                }


                // =================================================
                // LOOP SENSOR DATA
                // =================================================

                device.data.forEach(
                    function(item) {

                        let value = "N/A";
                        let unit = "N/A";


                        // Temperature

                        if (
                            item.temperature !== null &&
                            item.temperature !== undefined
                        ) {

                            value =
                                item.temperature;

                            unit =
                                "°C";
                        }


                        // Pressure

                        else if (
                            item.pressure !== null &&
                            item.pressure !== undefined
                        ) {

                            value =
                                item.pressure;

                            unit =
                                "bar";
                        }


                        // =================================================
                        // CREATE ROW
                        // =================================================

                        const row =
                            document.createElement("tr");


                        row.innerHTML = `

                            <td>
                                ${
                                    device.device_name ||
                                    "N/A"
                                }
                            </td>

                            <td>
                                ${
                                    device.device_type ||
                                    "N/A"
                                }
                            </td>

                            <td>
                                ${value}
                            </td>

                            <td>
                                ${unit}
                            </td>

                            <td>
                                ${
                                    item.created_at
                                    ? new Date(
                                        item.created_at
                                      ).toLocaleString()
                                    : "N/A"
                                }
                            </td>

                        `;


                        historyTable.appendChild(
                            row
                        );

                    }
                );

            }
        );

    }


    catch (error) {

        console.error(
            "History Error:",
            error
        );


        historyTable.innerHTML = `

            <tr>

                <td
                    colspan="5"
                    class="empty-message"
                >

                    Unable to load history data.

                    <br>

                    ${error.message}

                </td>

            </tr>

        `;

    }

}


// =====================================================
// INITIAL LOAD
// =====================================================

loadHistory();
