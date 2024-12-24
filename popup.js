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
      document.getElementById('shortenedUrl').href = shortenedUrl;  
      document.getElementById('qrCode').src = `data:image/png;base64,${data.qr_code}`;
      document.getElementById('qrCode').style.display = 'block'; 
    } else {
      alert(data.message);
    }
  })
  .catch(error => {
    console.error('Error shortening URL:', error);
  });
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.type === 'URL_SHORTENED') {
    const shortenedUrl = request.shortUrl;
    document.getElementById('shortenedUrl').textContent = shortenedUrl;
    document.getElementById('shortenedUrl').href = shortenedUrl;  
    document.getElementById('qrCode').src = `data:image/png;base64,${request.qrCode}`;
    document.getElementById('qrCode').style.display = 'block'; 
  }
});
