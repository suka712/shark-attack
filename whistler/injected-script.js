(function () {
  const originalFetch = window.fetch;

  window.fetch = async function (...args) {
    const requestUrl = typeof args[0] === "string" ? args[0] : args[0].url;

    if (!requestUrl.includes("/api/order/deal/history")) {
      return originalFetch(...args);
    }

    const response = await originalFetch(...args);
    const clonedReponse = response.clone();

    clonedReponse.json().then((json) => {
      try {
        const extracted = extractFields(json);
        if (extracted.length > 0) {
          console.log("Successfully extracted:", extracted);
        }
      } catch (e) {}
    });
  };

  function extractFields(json) {
    // EXTRACT THE SHAPE HERE
    if (!json || !json.data) {
      return;
    }

    return json.data.map(item => ({
      bank: "Some shit"
    }))
  }
});
