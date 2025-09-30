const script = document.createElement('script'); // Creates a script DOM element
script.src = chrome.runtime.getURL('injected-script.js'); // Gets the URL to the script
document.documentElement.appendChild(script); // Append the <script> element to the root of the <html>
// <--- This causes the page to load and execute the script in its own context
script.onload = function() { // Add a listener for when the script is loaded and remove it from the DOM
    this.remove(); // This remove the 'node', the script that overwrote window.fetch remained
};