// ----------------------------------------------------------
// Page context
// ----------------------------------------------------------
(function () {
  const originalFetch = window.fetch;
  const targetURL = 'mexc.com/api/platform/p2p/api/order/info';


  window.fetch = async function (...args) {
    const requestUrl = typeof args[0] === 'string' ? args[0] : args[0].url;

    if (!requestUrl.includes(targetURL)) {
      return originalFetch(...args);
    }

    const originalResponse = await originalFetch(...args);

    const clonedResponse = originalResponse.clone();
    clonedResponse.json().then((json) => {
      // A helper function to avoid repeating the postMessage logic
      const processAndSendInfo = (transaction) => {
        try {
          if (
            transaction?.id &&
            transaction.paymentInfo &&
            transaction.merchantInfo
          ) {
            transaction.paymentInfo.forEach((payment) => {
              window.postMessage(
                {
                  source: 'page_context',
                  type: 'EXTRACTED_INFO',
                  data: {
                    transactionId: transaction.id,
                    createTime: transaction.createTime,
                    quantity: transaction.quantity,
                    price: transaction.price, // Required
                    amount: transaction.amount, // Required
                    coinName: transaction.coinName,
                    bankName: payment.bankName, // Required: VCB / Vietcombank
                    bankAddress: payment.bankAddress, // Required: VCB
                    bankNumber: payment.account, // Required: 1024334
                    merchantName: transaction.merchantInfo.realName, // Required
                  },
                },
                '*'
              );
            });
          }
        } catch (err) {
          console.error(
            'Error processing a transaction object:',
            err,
            transaction
          );
        }
      };

      if (!json?.data) {
        return; // No data to process
      }

      // Case 1: Data is an array of transactions
      if (Array.isArray(json.data)) {
        console.log(
          `Processing ${json.data.length} transaction(s) from ARRAY.`
        );
        json.data.forEach(processAndSendInfo);
      }
      // Case 2: Data is a single transaction object
      else if (typeof json.data === 'object' && json.data !== null) {
        console.log('Processing a SINGLE transaction from OBJECT.');
        processAndSendInfo(json.data);
      }
    });

    return originalResponse;
  };
})();
