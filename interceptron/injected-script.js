(function() {
  const originalFetch = window.fetch;

  window.fetch = async function(...args) {
    const requestUrl = typeof args[0] === 'string' ? args[0] : args[0].url;

    console.log("Intercepting a Fetch request to:", requestUrl);

    const response = await originalFetch(...args);
    const clonedResponse = response.clone();
    clonedResponse.text().then(text => {
      const contentPreview = text.length > 200 ? text.substring(0, 200) + "..." : text;
      console.log("Response from", requestUrl, " | Status:", response.status, " | Preview:", contentPreview);
    }).catch(e => {
      console.error("Error reading response body for:", requestUrl, e);
    });
    return response;
  };
})();