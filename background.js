chrome.runtime.onInstalled.addListener(function() {
  console.log('URL Masker Extension Installed');
});

chrome.action.onClicked.addListener(function(tab) {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    const currentUrl = tabs[0].url;

    // Call the Flask app to shorten the URL
    fetch('https://maskurl.pythonanywhere.com/add_url', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ url: currentUrl })
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        // Send a message to the popup with the shortened URL and QR code
        chrome.runtime.sendMessage({
          type: 'URL_MASKED',
          shortUrl: data.short_url,
          qrCode: data.qr_code
        });
      } else {
        console.error("Error Masking URL:", data.message);
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
  });
});
