chrome.runtime.onMessage.addListener((message, _sender, _sendResponse) => {
  if (message.type === "WRITE_TO_SHEET") {
    writeToSheet(message.data);
  }
});

async function writeToSheet(paymentInfo) {
  const SPREADSHEET_ID = "1bqJmP1S4jOqEfbqQ3pC1F72FiQM9Cpa43hs3pdGuXm8";
  const APPEND_RANGE = "Sheet1!A1";

  chrome.identity.getAuthToken({ interactive: true }, async (token) => {
    if (chrome.runtime.lastError) {
      console.error("Auth error:", chrome.runtime.lastError.message);
      return;
    }

    try {
      const sheetUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${APPEND_RANGE}:append?valueInputOption=USER_ENTERED`;

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
