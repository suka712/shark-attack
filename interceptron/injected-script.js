(function() {
  // window.fetch is a original function of Chrome, we save it here - just in case.
  const originalFetch = window.fetch;

  window.fetch = async function(...args) { //  This replaces the ORIGINAL with our script
    // If the first arg is a string ie fetch('/api', ...), print it
    // If the first arg is a fetch(new Request(...), ...), gets its URL
    const requestUrl = typeof args[0] === 'string' ? args[0] : args[0].url;
    // Log the URL
    console.log("Intercepting a Fetch request to:", requestUrl);
    const response = await originalFetch(...args); // Get the response of the ORIGINAL FETCH
    const clonedResponse = response.clone(); // Clone the res - its a stream, we need to clone it to not mess it up
    clonedResponse.text().then(text => {
      const contentPreview = text.length > 200 ? text.substring(0, 200) + "..." : text;
      console.log("Response from", requestUrl, " | Status:", response.status, " | Preview:", contentPreview);
    }).catch(e => {
      console.error("Error reading response body for:", requestUrl, e);
    });
    return response; // Returns the original response in order not to break the page
  };
})();