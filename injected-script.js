(function () {
  const originalFetch = window.fetch;
  const targetURL = "p2p.mexc.com/api/order/deal/history";

  window.fetch = async function (...args) {
    const requestUrl = typeof args[0] === "string" ? args[0] : args[0].url;

    if (!requestUrl.includes(targetURL)) {
      return originalFetch(...args);
    }

    const originalResponse = await originalFetch(...args); // Copies original reponse to return later - to not break the page

    const clonedResponse = originalResponse.clone(); // Clone the res for data operations

    clonedResponse.json().then((json) => {
      // A helper function to avoid repeating the postMessage logic
      const processTransaction = (json) => {
        try {
          window.postMessage({
            source: "page_context",
            type: "EXTRACTED_INFO",
            data: {
              responseTime: json.responseTime,
              message: json.msg,
            },
          });
        } catch (err) {
          console.error("Error processing a transaction object:", err, transaction);
        }
      };

      if (json.responseTime && json.msg) {
        console.log("A response with .responseTime and .msg found. Attempting extraction");
        processTransaction(json);
      }
    });

    return originalResponse; // Return original Response to not break the page
  };
})();
