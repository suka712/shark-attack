const script = document.createElement('script');
script.src = chrome.runtime.getURL('injected-script.js');
document.documentElement.appendChild(script);

script.onload = function() {
    this.remove();
};