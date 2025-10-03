// Inject our page script into the site
const script = document.createElement("script");
script.src = chrome.runtime.getURL("injected-script.js");
(document.head || document.documentElement).appendChild(script);
script.onload = () => script.remove();

// Listen for messages from the page
window.addEventListener("message", (event) => {
  if (event.source !== window) return;
  if (event.data?.source === "page_context" && event.data.type === "EXTRACTED_INFO") {
    console.log("Content script received:", event.data.data);
    chrome.runtime.sendMessage({
      type: "DATA_TO_SHEET",
      data: event.data.data,
    });
  }
});