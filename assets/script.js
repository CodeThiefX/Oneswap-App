// Wait for the page to load before executing the script
document.addEventListener("DOMContentLoaded", () => {
    // Replace YOUR_INFURA_API_KEY with the API key you obtained from Infura
    const infuraApiKey = 'bc04eb06653141e08d69793defb2837b';
    const provider = `https://mainnet.infura.io/v3/${infuraApiKey}`;
  
    // Initialize Web3 with the Infura provider
    const web3 = new Web3(new Web3.providers.HttpProvider(provider));
  
    const resultsPerPage = 10; // Number of results to display per page
    let currentPage = 1;
    let totalTransactions = 0;
    let pendingTransactions = [];
  
    // Function to fetch mempool data and update the table
    async function fetchMempoolData() {
      try {
        // Get the current block number
        const blockNumber = await web3.eth.getBlockNumber();
  
        // Get the pending transactions using the current block number
        const blockData = await web3.eth.getBlock(blockNumber, true);
  
        // Get the pending transactions from the block data
        pendingTransactions = blockData.transactions;
        totalTransactions = pendingTransactions.length;
  
        // Sort transactions by timestamp in descending order (most recent first)
        pendingTransactions.sort((a, b) => b.timestamp - a.timestamp);
  
        // Update the table with the current page data
        updateTable();
      } catch (error) {
        console.error('Error fetching mempool data:', error);
      }
    }
  
    // Function to update the table with the current page data
    function updateTable() {
      const startIndex = (currentPage - 1) * resultsPerPage;
      const endIndex = Math.min(startIndex + resultsPerPage, totalTransactions);
  
      // Create the table header
      let tableHTML = `
        <table>
          <thead class="tbl-header">
            <tr>
              <th>Hash</th>
              <th>From</th>
              <th>To</th>
              <th>Value (ETH)</th>
              <th>Gas Price (Wei)</th>
            </tr>
          </thead>
          <tbody>
      `;
  
      // Populate the table rows with the current page data
      for (let i = startIndex; i < endIndex; i++) {
        const tx = pendingTransactions[i];
        tableHTML += `
          <tr>
            <td>${tx.hash}</td>
            <td>${tx.from}</td>
            <td>${tx.to}</td>
            <td>${web3.utils.fromWei(tx.value, 'ether')}</td>
            <td>${tx.gasPrice}</td>
          </tr>
        `;
      }
  
      // Close the table
      tableHTML += '</tbody></table>';
  
      // Display the mempool data table on the website
      const mempoolDataElement = document.getElementById('mempool-data');
      mempoolDataElement.innerHTML = tableHTML;
  
      // Update the navigation buttons and page number display
      updateNavigationButtons();
    }
  
    // Function to update the navigation buttons and page number display
    function updateNavigationButtons() {
      const prevButton = document.getElementById('prev-button');
      const nextButton = document.getElementById('next-button');
      const pageNumber = document.getElementById('page-number');
      const totalPages = Math.ceil(totalTransactions / resultsPerPage);
  
      prevButton.disabled = currentPage === 1;
      nextButton.disabled = currentPage === totalPages;
      pageNumber.textContent = `Page ${currentPage} / ${totalPages}`;
    }
  
    // Function to navigate to the previous page
    function goToPreviousPage() {
      if (currentPage > 1) {
        currentPage--;
        updateTable();
      }
    }
  
    // Function to navigate to the next page
    function goToNextPage() {
      const totalPages = Math.ceil(totalTransactions / resultsPerPage);
      if (currentPage < totalPages) {
        currentPage++;
        updateTable();
      }
    }
  
    // Add event listeners to the navigation buttons
    const prevButton = document.getElementById('prev-button');
    const nextButton = document.getElementById('next-button');
    prevButton.addEventListener('click', goToPreviousPage);
    nextButton.addEventListener('click', goToNextPage);
  
    // Fetch initial mempool data and display the table
    fetchMempoolData();
  
    // Update the mempool data every 2 seconds
    setInterval(fetchMempoolData, 2000);
  });
  
  
  
  
  
  

//   API_KEY
//   bc04eb06653141e08d69793defb2837b