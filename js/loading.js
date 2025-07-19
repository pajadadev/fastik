document.getElementById('tiktokForm').addEventListener('submit', async function(event) {
  event.preventDefault();
  const popup = document.getElementById('popup');
  const url = document.getElementById('url').value;
  // Show the popup
  popup.classList.remove('hidden');

  try {

    const response = await fetch('/.netlify/functions/api/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });

    const data = await response.json();

    if (data.status === 'success') {
      document.getElementById('result').style.display = 'block';
      document.getElementById('videoUrl').href = data.videoUrl;
      document.getElementById('videoHD').href = data.videoHD;
      document.getElementById('error').style.display = 'none';
      setTimeout(() => {
        popup.classList.add('hidden');
      }, 3000);
    } else {
      document.getElementById('error').innerText = data.error || 'An error occurred';
      document.getElementById('error').style.display = 'block';
      document.getElementById('result').style.display = 'none';
      setTimeout(() => {
        popup.classList.add('hidden');
      }, 3000);
    }
  } catch (error) {
    document.getElementById('error').innerText = 'Failed to download video try another url';
    document.getElementById('error').style.display = 'block';
    document.getElementById('result').style.display = 'none';
    setTimeout(() => {
      popup.classList.add('hidden');
    }, 3000);
  }
});
