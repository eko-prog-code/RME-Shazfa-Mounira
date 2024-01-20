const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const axios = require('axios'); // Import modul axios
const bodyParser = require('body-parser');

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


const getIHSParticipant = async (identifier, accessToken) => {
  try {
    const firebaseTokenUrl = "https://rme-shazfa-mounira-default-rtdb.firebaseio.com/token.json";
    const response = await axios.get(firebaseTokenUrl);
    const accessToken = response.data.token; 

    console.log('Access Token:', accessToken);
    const apiUrl = `https://api-satusehat-dev.dto.kemkes.go.id/fhir-r4/v1/Practitioner?identifier=https://fhir.kemkes.go.id/id/nik|${identifier}`;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    };

    const participantResponse = await axios.get(apiUrl, { headers });

    if (participantResponse.data && participantResponse.data.entry && participantResponse.data.entry.length > 0) {
      const ihsId = participantResponse.data.entry[0].resource.id;
      return ihsId;
    } else {
      throw new Error('IHS Participant (Practitioner) not found');
    }
  } catch (error) {
    console.error('Error fetching IHS Participant (Practitioner):', error);
    throw error;
  }
};


app.get('/getIHS', async (req, res) => {
  const { identifier, accessToken } = req.query;

  try {
    const ihsId = await getIHSParticipant(identifier, accessToken);
    res.json({ success: true, ihsId });
  } catch (error) {
    console.error('Error in /getIHS endpoint:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

const getIHSPatient = async (identifier, accessToken) => {
  try {
    const firebaseTokenUrl = "https://rme-shazfa-mounira-default-rtdb.firebaseio.com/token.json";
    const response = await axios.get(firebaseTokenUrl);
    const accessToken = response.data.token; 

    console.log('Access Token:', accessToken);
    const apiUrl = `https://api-satusehat-dev.dto.kemkes.go.id/fhir-r4/v1/Patient?identifier=https://fhir.kemkes.go.id/id/nik|${identifier}`;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    };

    const patientResponse = await axios.get(apiUrl, { headers });

    if (patientResponse.data && patientResponse.data.entry && patientResponse.data.entry.length > 0) {
      const ihsIdpatient = patientResponse.data.entry[0].resource.id;
      return ihsIdpatient;
    } else {
      throw new Error('IHS Patient not found');
    }
  } catch (error) {
    console.error('Error fetching IHS Patient:', error);
    throw error;
  }
};


app.get('/getIHSpatient', async (req, res) => {
  const { identifier, accessToken } = req.query;

  try {
    const ihsIdpatient = await getIHSPatient(identifier, accessToken);
    res.json({ success: true, ihsIdpatient });
  } catch (error) {
    console.error('Error in /getIHSpatient endpoint:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

const getIDLocation = async (lokasi, accessToken) => {
  try {
    // Melakukan permintaan ke API eksternal
    const apiUrl = `https://api-satusehat-dev.dto.kemkes.go.id/fhir-r4/v1/Location?organization=${lokasi}`;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    };

    const locationResponse = await axios.get(apiUrl, { headers });

    console.log('locationResponse.data:', locationResponse.data);
    if (locationResponse.data && locationResponse.data.entry && locationResponse.data.entry.length > 0) {
      const IDlocation = locationResponse.data.entry[0].resource.id;
      return IDlocation;
    } else {
      throw new Error('IDlocation not found');
    }
  } catch (error) {
    console.error('Error fetching IDlocation:', error);
    throw error;
  }
};

app.get('/getIDlocation', async (req, res) => {
  try {
    // Mendapatkan lokasi dari query parameter
    const lokasi = req.query.organization;
    console.log('lokasi:', lokasi);

    // Mendapatkan access token dari Firebase
    const firebaseTokenUrl = "https://rme-shazfa-mounira-default-rtdb.firebaseio.com/token.json";
    const response = await axios.get(firebaseTokenUrl);
    const accessToken = response.data.token;

    // Mendapatkan IDlocation dengan menggunakan fungsi getIDLocation
    const IDlocation = await getIDLocation(lokasi, accessToken);

    // Jika sukses, kirim IDlocation sebagai respons
    res.json({ success: true, IDlocation: IDlocation });
  } catch (error) {
    // Jika terjadi kesalahan, kirim pesan error sebagai respons
    console.error('Error in getIDlocation:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
