# Hostel Fees Insight

Automated food fee reporting system using Google Sheets.

## Google Cloud Console Setup

To fix or update the Google Sheets integration, follow these steps in the [Google Cloud Console](https://console.cloud.google.com/):

1.  **Create/Select a Project**: Ensure you have a project created.
2.  **Enable APIs**: Search for **"Google Sheets API"** and click **Enable**.
3.  **Create Service Account**:
    - Go to **APIs & Services > Credentials**.
    - Click **Create Credentials > Service Account**.
    - Give it a name (e.g., `food-fee-reader`) and click **Create and Continue**.
    - Skip role assignment and click **Done**.
4.  **Generate JSON Key**:
    - Click on the newly created Service Account email.
    - Go to the **Keys** tab.
    - Click **Add Key > Create new key**.
    - Select **JSON** and click **Create**. The file will download automatically.
5.  **Configure `.env`**:
    - Open the downloaded JSON file.
    - Copy the entire content of the JSON file.
    - Paste it into `backend/.env` as the value for `GOOGLE_CREDENTIALS`.
    - Example: `GOOGLE_CREDENTIALS='{"type": "service_account", ...}'`
6.  **Share Google Sheet**:
    - Copy the Service Account email (e.g., `food-fee-reader@...gserviceaccount.com`).
    - Open your [Google Sheet](https://docs.google.com/spreadsheets/d/1YPP7Od3pgOJJ_SiYg7SX5BY201_Hamjw/edit).
    - Click the **Share** button.
    - Paste the Service Account email and give it **Viewer** or **Editor** access.
7.  **Set Spreadsheet ID**:
    - Copy the ID from the sheet URL (the part between `/d/` and `/edit`).
    - Update `SPREADSHEET_ID` in `backend/.env`.

## Backend Setup

1.  Navigate to `server/`.
2.  Run `npm install`.
3.  Run `node server.js` to start the backend.