const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 8096;
const TIMEOUT = 1000; // Timeout in milliseconds

app.get('/numbers', async (req, res) => {
  try {
    const urlQueries = req.query.url;

    if (!urlQueries) {
      return res.status(400).json({ error: 'Missing url parameter' });
    }

    const urls = Array.isArray(urlQueries) ? urlQueries : [urlQueries];
    const fetchPromises = urls.map(fetchData);

    const results = await Promise.all(fetchPromises);
    const mergedNumbers = mergeArrays(results);
    const uniqueSortedNumbers = sortAndMakeUnique(mergedNumbers);

    return res.json({ numbers: uniqueSortedNumbers });
  } catch (error) {
    console.error(`Error processing request: ${error.message}`);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`number-management-service is running on port ${PORT}`);
});

async function fetchData(url) {
  try {
    const response = await axios.get(url, { timeout: TIMEOUT });
    return response.data.numbers || [];
  } catch (error) {
    console.error(`Error fetching data from ${url}: ${error.message}`);
    return [];
  }
}

function mergeArrays(arrays) {
  return arrays.reduce((merged, arr) => merged.concat(arr), []);
}

function sortAndMakeUnique(arr) {
  const uniqueNumbers = Array.from(new Set(arr));
  uniqueNumbers.sort((a, b) => a - b);
  return uniqueNumbers;
}


const path = require('path');

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});
