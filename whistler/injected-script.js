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
      try {
        if (json?.responseTime && json?.msg) {
          window.postMessage(
            {
              source: "whistler",
              type: "EXTRACTED_INFO",
              data: {
                responseTime: json.responseTime,
                msg: json.msg,
              },
            },
            "*"
          );
        }
      } catch (err) {
        console.error("Error extracting info:", err);
      }
    });

    return originalResponse;
  };
})();
