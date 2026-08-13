// =====================================================
// GET LOGGED-IN USER ID
// =====================================================

const userId = localStorage.getItem("user_id");


// =====================================================
// HTML ELEMENTS
// =====================================================

const historyTable =
    document.getElementById("historyTable");

const backDashboard =
    document.getElementById("backDashboard");


// =====================================================
// CHECK USER ID
// =====================================================

if (!userId) {

    if (historyTable) {

        historyTable.innerHTML = `
            <tr>
                <td colspan="5">
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
        // CHECK API RESPONSE
        // =================================================

        if (!response.ok) {

            const errorData =
                await response.json()
                .catch(() => ({}));

            throw new Error(
                errorData.detail ||
                "History API failed"
            );

        }


        // =================================================
        // READ JSON
        // =================================================

        const result =
            await response.json();


        console.log(
            "History API Response:",
            result
        );


        // =================================================
        // CLEAR OLD TABLE
        // =================================================

        historyTable.innerHTML = "";


        // =================================================
        // GET HISTORY
        // =================================================

        const history =
            result.history || [];


        console.log(
            "History records:",
            history
        );


        // =================================================
        // NO HISTORY
        // =================================================

        if (history.length === 0) {

            historyTable.innerHTML = `
                <tr>
                    <td colspan="5">
                        No history data found.
                    </td>
                </tr>
            `;

            return;
        }


        // =================================================
        // LOOP THROUGH DEVICES
        // =================================================

        history.forEach(device => {

            // ---------------------------------------------
            // CHECK SENSOR DATA
            // ---------------------------------------------

            if (
                !device.data ||
                device.data.length === 0
            ) {

                return;
            }


            // ---------------------------------------------
            // LOOP THROUGH SENSOR RECORDS
            // ---------------------------------------------

            device.data.forEach(item => {


                // =========================================
                // DEFAULT VALUE / UNIT
                // =========================================

                let value = "N/A";

                let unit = "N/A";


                // =========================================
                // TEMPERATURE
                // =========================================

                if (
                    item.temperature !== null &&
                    item.temperature !== undefined
                ) {

                    value =
                        item.temperature;

                    unit =
                        "°C";
                }


                // =========================================
                // PRESSURE
                // =========================================

                else if (
                    item.pressure !== null &&
                    item.pressure !== undefined
                ) {

                    value =
                        item.pressure;

                    unit =
                        "bar";
                }


                // =========================================
                // DATE & TIME
                // =========================================

                let dateTime = "N/A";


                if (
                    item.created_at !== null &&
                    item.created_at !== undefined
                ) {

                    const date =
                        new Date(
                            item.created_at
                        );


                    if (
                        !isNaN(
                            date.getTime()
                        )
                    ) {

                        dateTime =
                            date.toLocaleString();

                    }

                }


                // =========================================
                // CREATE TABLE ROW
                // =========================================

                const row =
                    document.createElement("tr");


                row.innerHTML = `

                    <td>
                        ${device.device_name || "N/A"}
                    </td>

                    <td>
                        ${device.device_type || "N/A"}
                    </td>

                    <td>
                        ${value}
                    </td>

                    <td>
                        ${unit}
                    </td>

                    <td>
                        ${dateTime}
                    </td>

                `;


                // =========================================
                // ADD ROW TO TABLE
                // =========================================

                historyTable.appendChild(row);

            });

        });


        // =================================================
        // CHECK IF NO ROWS WERE CREATED
        // =================================================

        if (
            historyTable.children.length === 0
        ) {

            historyTable.innerHTML = `
                <tr>
                    <td colspan="5">
                        No sensor records found.
                    </td>
                </tr>
            `;

        }

    }


    // =====================================================
    // ERROR
    // =====================================================

    catch (error) {

        console.error(
            "History Error:",
            error
        );


        historyTable.innerHTML = `

            <tr>

                <td colspan="5">

                    Unable to load history data.

                    <br><br>

                    ${error.message}

                </td>

            </tr>

        `;

    }

}


// =====================================================
// INITIAL LOAD
// =====================================================

if (userId) {

    loadHistory();

}
