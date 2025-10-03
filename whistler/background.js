import { CONFIG } from "./config.js";

chrome.runtime.onMessage.addListener((message, _sender, _sendResponse) => {
  if (message.type === "DATA_TO_SHEET") {
    writeToSheet(message.data);
  }
});

async function writeToSheet(paymentInfo) {
  chrome.identity.getAuthToken({ interactive: true }, async (token) => {
    if (chrome.runtime.lastError) {
      console.error("Auth error:", chrome.runtime.lastError.message);
      return;
    }
    try {
      const sheetUrl = `https://sheets.googleapis.com/v4/spreadsheets/${CONFIG.sheetId}/values/Sheet1!A1:append?valueInputOption=USER_ENTERED`;

      const content = {
        values: [[paymentInfo.responseTime, paymentInfo.msg]],
      };

      const res = await fetch(sheetUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(content),
      });

      if (!res.ok) {
        console.error("Sheets API error:", await res.text());
        return;
      }

      const data = await res.json();
      console.log("Successfully written to sheet!", data);
    } catch (err) {
      console.error("Request failed:", err);
    }
  });
}
