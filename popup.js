document.addEventListener('DOMContentLoaded', () => {
    const statusElement = document.getElementById('status');
    const transactionListElement = document.getElementById('transaction-list');
    const sheetLink = document.getElementById('sheetLink');

    // Request data from the background script when the popup is opened
    chrome.runtime.sendMessage({ type: 'GET_POPUP_DATA' }, (response) => {
        if (chrome.runtime.lastError) {
            statusElement.textContent = 'Error communicating with background script.';
            console.error(chrome.runtime.lastError.message);
            return;
        }

        if (!response) {
            statusElement.textContent = 'No response from background script.';
            console.error('No response from background script.');
            return;
        }

        // Update the link to the Google Sheet
        if (response.sheetId) {
            sheetLink.href = `https://docs.google.com/spreadsheets/d/${response.sheetId}/edit`;
        } else {
            sheetLink.style.display = 'none';
        }

        // Update the list of recent transactions
        transactionListElement.innerHTML = ''; // Clear existing list
        if (response.recentTransactions && response.recentTransactions.length > 0) {
            statusElement.textContent = 'Recently captured transactions:';
            response.recentTransactions.forEach(tx => {
                const li = document.createElement('li');
                const idDiv = document.createElement('div');
                idDiv.className = 'transaction-id';
                idDiv.textContent = `ID: ${tx.transactionId}`;

                const merchantDiv = document.createElement('div');
                merchantDiv.className = 'merchant-name';
                merchantDiv.textContent = `Merchant: ${tx.merchantName}`;

                li.appendChild(idDiv);
                li.appendChild(merchantDiv);
                transactionListElement.appendChild(li);
            });
        } else {
            statusElement.textContent = 'Listening for new transactions...';
        }
    });
});
