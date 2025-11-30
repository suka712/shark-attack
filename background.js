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

// Load data from storage when the extension starts
chrome.storage.local.get(['recent_transactions'], (result) => {
  if (result.recent_transactions) {
    recentTransactionsPopup = result.recent_transactions;
  }
});

const writeToSheet = async (transactionInfo, sheetId) => {
  const transactionId = transactionInfo.transactionId; // Unique ID for deduplication
  const tableName = 'BUY 2025-03-29';
  const { processed_ids = [] } = await getStorageData(['processed_ids']);

  if (processed_ids.includes(transactionId)) {
    console.log('Duplicate transaction found. Skipping entry.');
    return;
  }

  try {
    const token = await getAuthToken(true);

    // Find the first empty row in column A
    const columnARange = `${tableName}!A:A`;
    const getColumnAUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${columnARange}`;

    const columnARes = await fetch(getColumnAUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!columnARes.ok) {
      console.error('Sheets API error (reading column A):', await columnARes.text());
      return;
    }

    const columnAData = await columnARes.json();
    const lastRow = columnAData.values ? columnAData.values.length : 0;
    const nextRow = lastRow + 1;

    // Write data to the next empty row
    const writeRange = `${tableName}!A${nextRow}`;
    const sheetUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${writeRange}?valueInputOption=USER_ENTERED`;
    const content = {
      values: [
        [
          transactionInfo.transactionId,
          transactionInfo.createTime,
          transactionInfo.bankName,
          transactionInfo.bankAddress,
          transactionInfo.bankNumber,
          transactionInfo.merchantName,
          transactionInfo.amount,
          transactionInfo.price,
        ],
      ],
    };
    const res = await fetch(sheetUrl, {
      method: 'PUT', // Use PUT to update a specific range
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

// // transactionInfo.transactionId,
// // transactionInfo.createTime,
// // transactionInfo.bankName,
// // transactionInfo.bankAddress,
// // transactionInfo.bankNumber,
// // transactionInfo.merchantName,
// // transactionInfo.amount,
// // transactionInfo.price,

// const dummy1 = {
//   transactionId: '121212',
//   createTime: '1212',
//   bankName: 'VCB',
//   bankAddress: 'VCB',
//   bankNumber: '1024562341',
//   merchantName: 'NGUYEN QUANG KHIEM',
//   amount: 120000,
//   price: 24000,
// }

// writeToSheet(dummy1, '1fUKGkvsZHcJx-zP7PuOJ6hwv3X_TzfFTeq098oQ6a8Y')