const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const axios = require('axios'); // Import modul axios

const app = express();
const port = 5000;

app.use(cors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

app.post('/forward-request', async (req, res) => {
  try {
    // Ambil token dari Firebase Realtime Database
    const firebaseTokenUrl = "https://rme-shazfa-mounira-default-rtdb.firebaseio.com/token.json";
    const response = await axios.get(firebaseTokenUrl);
    const accessToken = response.data.token; // Sesuaikan dengan struktur data Anda

    const apiUrl = 'https://api-satusehat-dev.dto.kemkes.go.id/fhir-r4/v1/Encounter';

    // Log the curl command to the console
    console.log(`curl -X POST "${apiUrl}" -H "Content-Type: application/json" -H "Authorization: Bearer ${accessToken}" -d '${JSON.stringify(req.body)}'`);

    const apiResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(req.body),
    });

    const responseData = await apiResponse.json();
    res.json(responseData);
  } catch (error) {
    console.error('Error forwarding request:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
