document.addEventListener('DOMContentLoaded', function() {
  // Fetch the current tab's URL when the popup is loaded
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    const currentUrl = tabs[0].url;
    document.getElementById('url').value = currentUrl;  // Prefill the URL field
  });
});

document.getElementById('shorten').addEventListener('click', function() {
  const url = document.getElementById('url').value;

  if (!url) {
    alert("Please enter a URL!");
    return;
  }

  fetch('https://maskurl.pythonanywhere.com/add_url', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ url: url })
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      const shortenedUrl = data.short_url;
      document.getElementById('shortenedUrl').textContent = shortenedUrl;
      document.getElementById('shortenedUrl').href = shortenedUrl;  // Make it clickable
      document.getElementById('qrCode').src = `data:image/png;base64,${data.qr_code}`;
      document.getElementById('qrCode').style.display = 'block'; // Show the QR code
    } else {
      alert(data.message);
    }
  })
  .catch(error => {
    console.error('Error shortening URL:', error);
  });
});

// Listen for the background script to send a message
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.type === 'URL_SHORTENED') {
    const shortenedUrl = request.shortUrl;
    document.getElementById('shortenedUrl').textContent = shortenedUrl;
    document.getElementById('shortenedUrl').href = shortenedUrl;  // Make it clickable
    document.getElementById('qrCode').src = `data:image/png;base64,${request.qrCode}`;
    document.getElementById('qrCode').style.display = 'block'; // Show the QR code
  }
});
