(function() {
  // window.fetch is a original function of Chrome, we save it here - just in case.
  const originalFetch = window.fetch;

  window.fetch = async function(...args) { //  This replaces the ORIGINAL with our script
    console.log('Original args:', args); // Original args, see what it is

    const requestUrl = typeof args[0] === 'string' ? args[0] : args[0].url;
    console.log("Intercepted URL:", requestUrl); // To see what it is

    const originalReponse = await originalFetch(...args); // Get the response of the ORIGINAL FETCH
    console.log('Original reponse:', originalReponse);

    const clonedResponse = originalReponse.clone(); // Clone the res - its a stream, we need to clone it to not mess it up

    clonedResponse.text().then(text => {
      const contentPreview = text.length > 200 ? text.substring(0, 200) + "..." : +text;
      console.log("Response from", requestUrl, " | Status:", originalReponse.status, " | Preview:", contentPreview);
    }).catch(e => {
      console.error("Error reading response body for:", requestUrl, e);
    });

    return originalReponse; // Returns the original response in order not to break the page
  };
})();