document.getElementById("appendBtn").addEventListener("click", () => {
  const text = document.getElementById("inputText").value.trim();
  if (!text) {
    document.getElementById("output").textContent = "Please enter text first.";
    return;
  }

  chrome.runtime.sendMessage({ type: "appendRow", row: [text] }, (response) => {
    const out = document.getElementById("output");
    if (response.error) {
      out.textContent = "Error: " + response.error;
    } else {
      out.textContent = "Appended successfully!";
    }
  });
});
