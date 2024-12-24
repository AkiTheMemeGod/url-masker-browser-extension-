chrome.runtime.onInstalled.addListener(function() {
  console.log('URL Masker Extension Installed');
});

chrome.action.onClicked.addListener(function(tab) {
  if (!tab || !tab.url) {
    console.error("No active tab URL found");
    return;
  }

  const currentUrl = tab.url; 
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
