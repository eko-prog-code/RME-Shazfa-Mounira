import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SendToWhatsAppForm = () => {
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [whatsappNumbers, setWhatsappNumbers] = useState([]);

  useEffect(() => {
    // Mengambil data nomor WhatsApp dari Firebase saat komponen dimuat
    const fetchData = async () => {
      try {
        const response = await axios.get('https://rme-shazfa-mounira-default-rtdb.firebaseio.com/patients.json');
        const data = response.data;

        // Mengambil nomor WhatsApp dari data Firebase dan menyimpannya dalam state
        const numbers = Object.values(data).map((patient) => patient.whatsappNumber);
        setWhatsappNumbers(numbers);
      } catch (err) {
        setError('Gagal mengambil data nomor WhatsApp');
      }
    };

    fetchData();
  }, []);

  const handleSendToWhatsApp = () => {
    // Ganti 'YOUR_MESSAGE' dengan pesan yang ingin Anda kirim
    const messageText = 'YOUR_MESSAGE';

    // Loop melalui setiap nomor WhatsApp dan buat URL
    whatsappNumbers.forEach(async (phoneNumber) => {
      try {
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(messageText)}`;

        // Mengirim pesan ke nomor WhatsApp menggunakan window.open
        window.open(whatsappUrl, '_blank');
        setSuccess(true);
      } catch (err) {
        setError('Gagal mengirim pesan');
      }
    });
  };

  return (
    <div>
      <h1>Formulir Pengiriman Pesan ke WhatsApp</h1>
      <form>
        <label>
          Pesan:
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} />
        </label>
        <button type="button" onClick={handleSendToWhatsApp}>
          Kirim ke WhatsApp
        </button>
      </form>

      {success && <p>Pesan berhasil dikirim!</p>}
      {error && <p>{error}</p>}
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <SendToWhatsAppForm />
    </div>
  );
}

export default App;
