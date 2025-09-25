const SPREADSHEET_ID = "1bqJmP1S4jOqEfbqQ3pC1F72FiQM9Cpa43hs3pdGuXm8"; // Your sheet ID
const APPEND_RANGE = "Sheet1!A1"; // Adjust if needed

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "appendRow") {
    chrome.identity.getAuthToken({ interactive: true }, async (token) => {
      if (chrome.runtime.lastError) {
        console.error("Auth error:", chrome.runtime.lastError);
        sendResponse({ error: chrome.runtime.lastError.message });
        return;
      }

      try {
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${APPEND_RANGE}:append?valueInputOption=USER_ENTERED`;

        const body = { values: [message.row] };

        const res = await fetch(url, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });

        if (!res.ok) {
          const text = await res.text();
          console.error("Sheets API error:", text);
          sendResponse({ error: text });
          return;
        }

        const data = await res.json();
        sendResponse({ success: true, result: data });
      } catch (err) {
        console.error("Request failed:", err);
        sendResponse({ error: err.message });
      }
    });

    return true; // keep sendResponse alive
  }
});
