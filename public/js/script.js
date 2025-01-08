const BASE_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:3000' 
  : 'https://url-shortener-4hvu.onrender.com';

document.getElementById('urlForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  const result = document.getElementById('result');
  const urlInput = document.getElementById('url_input');
  
  try {
    const response = await fetch(`${BASE_URL}/api/shorturl/new`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `url=${encodeURIComponent(urlInput.value)}`
    });
    const data = await response.json();
    result.style.display = 'block';
    result.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
  } catch (error) {
    result.style.display = 'block';
    result.innerHTML = `Error: ${error.message}`;
  }
});

async function testCreateShortUrl() {
  const exampleUrl = document.getElementById('example_url').value;
  const resultDiv = document.getElementById('example_result');
  const shortUrlExample = document.getElementById('short_url_example');
  
  try {
    const response = await fetch(`${BASE_URL}/api/shorturl/new`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `url=${encodeURIComponent(exampleUrl)}`
    });
    const data = await response.json();
    resultDiv.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
    
    // Update the example URL with the new short_url
    if (data.short_url) {
      const shortIdSpan = shortUrlExample.querySelector('.short-id');
      shortIdSpan.textContent = data.short_url;
    }
  } catch (error) {
    resultDiv.innerHTML = `Error: ${error.message}`;
  }
}
