history.js

// Get logged-in User ID

const userId = localStorage.getItem("user_id");


// Get HTML elements

const historyTable =
    document.getElementById("historyTable");

const backDashboard =
    document.getElementById("backDashboard");


// Check User ID

if (!userId) {

    historyTable.innerHTML = `
        <tr>
            <td colspan="5">
                User ID not found
            </td>
        </tr>
    `;

}


// Back to Dashboard

backDashboard.addEventListener("click", function () {

    if (userId) {

        window.location.href =
            `/dashboard?user_id=${userId}`;

    } else {

        window.location.href =
            "/dashboard";

    }

});


// Load History

async function loadHistory() {

    try {

        console.log(
            "Loading history for User ID:",
            userId
        );


        // Call History API

        const response =
            await fetch(`/API/History/${userId}`);


        console.log(
            "History Response:",
            response.status
        );


        if (!response.ok) {

            throw new Error(
                "History API failed"
            );

        }


        // Convert response to JSON

        const data =
            await response.json();


        console.log(
            "History Data:",
            data
        );


        // Clear old table data

        historyTable.innerHTML = "";


        // API may return:
        //
        // [
        //    {...},
        //    {...}
        // ]
        //
        // OR:
        //
        // {
        //    "history": [...]
        // }

        let history = data;


        if (data.history) {

            history =
                data.history;

        }


        // Check whether data exists

        if (
            !Array.isArray(history) ||
            history.length === 0
        ) {

            historyTable.innerHTML = `
                <tr>
                    <td colspan="5">
                        No history data found
                    </td>
                </tr>
            `;

            return;

        }


        // Create table rows

        history.forEach(item => {


            // Default values

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


            // Create row

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    ${item.device_name || "N/A"}
                </td>


                <td>
                    ${item.device_type || "N/A"}
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


            // Add row to table

            historyTable.appendChild(row);

        });

    }


    catch (error) {

        console.error(
            "History Error:",
            error
        );


        historyTable.innerHTML = `
            <tr>
                <td colspan="5">
                    Unable to load history data
                </td>
            </tr>
        `;

    }

}


// Load history when page opens

if (userId) {

    loadHistory();

}
