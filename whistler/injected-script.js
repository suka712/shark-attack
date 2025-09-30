(function () {
  const originalFetch = window.fetch;

  const targetURL = "p2p.mexc.com/api";

  window.fetch = async function (...args) {
    const requestUrl = typeof args[0] === "string" ? args[0] : args[0].url;
    if (!requestUrl.includes(targetURL)) {
      return originalFetch(...args);
    }

    const originalResponse = await originalFetch(...args);

    const clonedReponse = originalResponse.clone();
    clonedReponse.json().then((json) => {
      try {
        const paymentInfo = extractPaymentInfo(json);
        if (paymentInfo.length > 0) {
          console.log("Successful extraction:", paymentInfo);
        }
      } catch (error) {
        console.log("Error extracting info:", error);
      }
    });

    return originalResponse; // Return original response to not break the page
  };

  // Helper function
  function extractPaymentInfo(json) {
    // if (!json?.data?.paymentInfo || !json?.data?.merchantInfo) {
    //   return null;
    // }

    return ("Specific string found in ", targetURL);

    // return {
    //   bankName: json.data.paymentInfo.bankName ?? null,
    //   bankAddress: json.data.paymentInfo.bankAddress ?? null,
    //   accountNumber: json.data.paymentInfo.accountNumber ?? null,
    //   merchantName: json.data.merchantInfo.realName ?? null,
    // };
  }
})();
