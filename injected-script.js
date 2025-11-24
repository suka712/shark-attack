(function () {
  const originalFetch = window.fetch;
  const targetURL = "p2p.mexc.com/api/order/deal/history";

  window.fetch = async function (...args) {
    const requestUrl = typeof args[0] === "string" ? args[0] : args[0].url;

    if (!requestUrl.includes(targetURL)) {
      return originalFetch(...args);
    }

    const originalResponse = await originalFetch(...args);

    const clonedResponse = originalResponse.clone();
    clonedResponse.json().then((json) => {
      // A helper function to avoid repeating the postMessage logic
      const processTransaction = (transaction) => {
        try {
          if (transaction?.id && transaction.paymentInfo && transaction.merchantInfo) {
            transaction.paymentInfo.forEach(payment => {
              window.postMessage(
                {
                  source: "page_context",
                  type: "EXTRACTED_INFO",
                  data: {
                    // Transaction details: ID, coin price, amount etc.
                    transactionId: transaction.id,
                    createTime: transaction.createTime,
                    quantity: transaction.quantity,
                    price: transaction.price,
                    amount: transaction.amount, // Amount to pay in VND
                    coinName: transaction.coinName,
                    // Payment details: where to send money
                    bankName: payment.bankName,
                    bankAddress: payment.bankAddress,
                    bankNumber: payment.account, // Acc number: 10320443
                    merchantName: transaction.merchantInfo.realName,
                  },
                },
                "*"
              );
            });
          }
        } catch (err) {
          console.error("Error processing a transaction object:", err, transaction);
        }
      };

      if (!json?.data) {
        return; // No data to process
      }

      // Case 1: Data is an array of transactions
      if (Array.isArray(json.data)) {
        console.log(`Processing ${json.data.length} transaction(s) from ARRAY.`);
        json.data.forEach(processTransaction);
      } 
      // Case 2: Data is a single transaction object
      else if (typeof json.data === 'object' && json.data !== null) {
        console.log("Processing a SINGLE transaction from OBJECT.");
        processTransaction(json.data);
      }
    });

    return originalResponse;
  };
})();
