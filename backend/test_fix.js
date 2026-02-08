const { google } = require("googleapis");
require("dotenv").config();

const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
const GOOGLE_CREDENTIALS = JSON.parse(process.env.GOOGLE_CREDENTIALS);

async function testHeaderMapping() {
    try {
        const auth = new google.auth.GoogleAuth({
            credentials: GOOGLE_CREDENTIALS,
            scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
        });

        const authClient = await auth.getClient();
        const sheetsAPI = google.sheets({ version: "v4", auth: authClient });

        const sheetName = "FEBRUARY 2026";
        console.log(`Testing sheet: ${sheetName}`);

        const result = await sheetsAPI.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: `'${sheetName}'!A1:M`,
        });

        const values = result.data.values || [];
        if (values.length < 2) {
            console.log("No data found");
            return;
        }

        const headers = values[0].map(h => h.trim().toUpperCase());
        console.log("Headers found:", headers);

        const getVal = (row, keys, defaultVal = "") => {
            for (const key of keys) {
                const index = headers.indexOf(key);
                if (index !== -1 && row[index]) {
                    return row[index].trim();
                }
            }
            return defaultVal;
        };

        const dataRows = values.slice(1);
        const cleaned = [];
        for (const row of dataRows) {
            const amountStr = getVal(row, ["AMOUNT", "FEE", "TOTAL", "PRICE"], "0");
            let amount = 0.0;
            try {
                amount = parseFloat(amountStr.replace(/[^0-9.-]+/g, "")) || 0.0;
            } catch (e) {
                amount = 0.0;
            }

            const record = {
                ROOM: getVal(row, ["ROOM", "ROOM NO", "ROOM_NO", "DH_ROOM"]),
                PAID: getVal(row, ["PAID", "STATUS", "PAYMENT", "REMARKS"]).toUpperCase(),
                AMOUNT: amount,
            };

            if (record.ROOM) {
                cleaned.push(record);
            }
        }

        console.log(`Successfully parsed ${cleaned.length} rows`);
        console.log("Sample record:", cleaned[0]);

        if (cleaned.length > 0) {
            console.log("✅ TEST PASSED: Rows are no longer being skipped.");
        } else {
            console.log("❌ TEST FAILED: Rows are still being skipped.");
        }

    } catch (error) {
        console.error("Test failed:", error.message);
    }
}

testHeaderMapping();
