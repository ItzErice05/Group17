async function loadTransactions() {
  const tableBody = document.getElementById("transactionsBody");
  const endpoint = "[api]";

  try {
    const response = await fetch(endpoint);
    if (!response.ok) throw new Error(`Server returned ${response.status}`);

    const transactions = await response.json();
    tableBody.innerHTML = "";

    if (transactions.length === 0) {
      tableBody.innerHTML = "<tr><td colspan='4'>No transactions yet.</td></tr>";
      return;
    }

    transactions.forEach(tx => {
      const tr = document.createElement("tr");
      const date = new Date(tx.date).toLocaleString();

      tr.innerHTML = `
        <td>${date}</td>
        <td>${tx.fundOrigin}</td>
        <td>${tx.fundReceiver}</td>
        <td>${tx.amount}</td>
      `;
      tableBody.appendChild(tr);
    });

  } catch (error) {
    console.error("Error fetching transactions:", error);
    tableBody.innerHTML = `<tr><td colspan="4">Error: ${error.message}</td></tr>`;
  }
}

loadTransactions();
