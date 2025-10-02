# Shark-attack network capture

```text
manifest.json
│
├── content.js                (content script, runs in isolated world of webpage)
│   ├── Injects → injected-script.js (into page context)
│   ├── Listens to window.postMessage
│   └── Forwards messages to background.js via chrome.runtime.sendMessage
│
├── injected-script.js        (page context, runs as if part of website)
│   ├── Overrides window.fetch
│   ├── Sees website’s JS variables & API calls
│   └── Posts extracted data with window.postMessage
│
└── background.js             (service worker, extension core)
    ├── Listens to messages from content.js
    ├── Calls chrome.identity.getAuthToken (only works here!)
    └── Writes extracted info into Google Sheets API
```
