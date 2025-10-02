// Inject our page script into the site
const s = document.createElement("script");
s.src = chrome.runtime.getURL("injected-script.js");
(document.head || document.documentElement).appendChild(s);
s.onload = () => s.remove();

// Listen for messages from the page
window.addEventListener("message", (event) => {
  if (event.source !== window) return;
  if (event.data?.source === "whistler" && event.data.type === "EXTRACTED_INFO") {
    console.log("Content script received:", event.data.data);
    chrome.runtime.sendMessage({
      type: "WRITE_TO_SHEET",
      data: event.data.data,
    });
  }
});