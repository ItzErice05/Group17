document.getElementById('transferFundsForm').addEventListener('submit', async function(event) {
  event.preventDefault();
  const form = event.target;
  const fundOrigin = form.fundOrigin.value.trim();
  const fundReceiver = form.fundReceiver.value.trim();
  const amount = form.amount.value.trim();

  const endpoint = '[insert API]';
  const payload = { fundOrigin, fundReceiver, amount };

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Server responded with status ${response.status}`);
    }

    const data = await response.json();
    const resultEl = document.getElementById('result');
    resultEl.innerHTML = `
      <p>Transaction successful!</p>
      <p><strong>From:</strong> ${data.transaction.fundOrigin}</p>
      <p><strong>To:</strong> ${data.transaction.fundReceiver}</p>
      <p><strong>Amount:</strong> ${data.transaction.amount}</p>
    `;
    console.log('Response:', data);
  } catch (error) {
    console.error('Error:', error);
    document.getElementById('result').textContent = `Error: ${error.message}`;
  }
});
