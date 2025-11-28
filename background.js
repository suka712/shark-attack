import { Config } from './config.js';

// ----------------------------------------------------------
// Backend
// ----------------------------------------------------------

// Store last 5 transactions in memory for the popup
let recentTransactionsPopup = [];

const getStorageData = (keys) => {
  return new Promise((resolve) => {
    chrome.storage.local.get(keys, (result) => resolve(result));
  });
};

const setStorageData = (data) => {
  return new Promise((resolve) => {
    chrome.storage.local.set(data, () => resolve());
  });
};

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
};

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  const sheetId = Config.targetSheetId;

  // Listener to write to sheet
  if (message.type === 'DATA_TO_SHEET') {
    writeToSheet(message.data, sheetId);
    return true;
  }

  // Listener for the popup UI
  if (message.type === 'GET_POPUP_DATA') {
    sendResponse({
      sheetId: sheetId,
      recentTransactions: recentTransactionsPopup,
    });
  }

  return true; // Keep message channel open
});

// Load initial data from storage when the extension starts
chrome.storage.local.get(['recent_transactions'], (result) => {
  if (result.recent_transactions) {
    recentTransactionsPopup = result.recent_transactions;
  }
});

const writeToSheet = async (transactionInfo, sheetId) => {
  const transactionId = transactionInfo.transactionId; // Unique ID for deduplication

  const { processed_ids = [] } = await getStorageData(['processed_ids']);

  if (processed_ids.includes(transactionId)) {
    console.log('Duplicate transaction found. Skipping entry.');
    return;
  }

  try {
    const token = await getAuthToken(true);
    // Write data to specified Googlesheet
    const sheetUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Sheet1!A1:append?valueInputOption=USER_ENTERED`;
    const content = {
      values: [
        [
          // Follows order exactly like in the sheet.
          transactionInfo.transactionId,
          transactionInfo.createTime,
          transactionInfo.bankName, // Name: MB
          transactionInfo.bankAddress, // Address: MB
          transactionInfo.bankNumber, // Number: 1024334
          transactionInfo.merchantName,
          transactionInfo.amount, // VND
          transactionInfo.price,
        ],
      ],
    };
    const res = await fetch(sheetUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-type': 'application/json',
      },
      body: JSON.stringify(content),
    });

    if (!res.ok) {
      console.error('Sheets API error:', await res.text());
      return;
    }

    const data = await res.json();
    console.log('Successfully written to sheet:', data);

    // Add to dedupe list and save
    processed_ids.push(transactionId);
    await setStorageData({ processed_ids: processed_ids });
    console.log(`Transaction ${transactionId} saved.`);

    // Add to recent transactions list for the popup
    recentTransactionsPopup.unshift(transactionInfo); // Add to the beginning
    if (recentTransactionsPopup.length > 5) {
      recentTransactionsPopup.pop(); // Keep the list at 5 items
    }
    // Persist the recent transactions list
    await setStorageData({ recent_transactions: recentTransactionsPopup });
  } catch (err) {
    console.error('Writing to sheet failed:', err);
  }
};
