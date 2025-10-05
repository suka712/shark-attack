import { Config } from "./config.js";

const getStorageData = (keys) => {
  return new Promise((resolve) => {
    chrome.storage.local.get(keys, (result) => resolve(result));
  });
}

const setStorageData = (data) => {
return new Promise((resolve) => {
    chrome.storage.local.set(data, () => resolve());
  });
}

const getAuthToken = (interactive) => {
  return new Promise((resolve, reject) => {
    chrome.identity.getAuthToken({ interactive }, (token) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(token);
      }
    });
  });
}

chrome.runtime.onMessage.addListener((message, _sender, _sendResponse) => {
  const sheetId = Config.targetSheetId; 
  // Receives extracted info and append it to the sheet
  if (message.type === "DATA_TO_SHEET") {
    dedupeAndWriteToSheet(message.data, sheetId);
  }
});

const dedupeAndWriteToSheet = async (paymentInfo, sheetId) => {
  const transactionId = paymentInfo.msg; // Dummy ID 

  const { processed_ids = [] } = await getStorageData(['processed_ids']);

  if (processed_ids.includes(transactionId)) {
    console.log("Duplicate transaction found. Skipping entry.");
    return;
  }

  try {
    const token = await getAuthToken(true);
    // Write data to specified Googlesheet
    const sheetUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Sheet1!A1:append?valueInputOption=USER_ENTERED`;
    const content = {
      values: [[paymentInfo.responseTime, paymentInfo.msg]],
    };
    const res = await fetch(sheetUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-type": "application/json",
      },
      body: JSON.stringify(content),
    });

    if (!res.ok) {
      console.error("Sheets API error:", await res.text());
      return;
    }

    const data = await res.json();
    console.log("Successfully written to sheet:", data);

    processed_ids.push(transactionId);
    await setStorageData({ processed_ids: processed_ids });
    console.log(`Transaction ${transactionId} saved.`);
  } catch (err) {
    console.error("Write failed:", err);
  }
}
