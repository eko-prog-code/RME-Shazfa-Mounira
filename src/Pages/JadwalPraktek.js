// JadwalPraktek.js

import React, { useState, useEffect } from "react";
import axios from "axios";
import "./JadwalPraktek.css"; // Import the CSS file

const JadwalPraktek = () => {
  const [jadwal, setJadwal] = useState({
    Senin: "",
    Selasa: "",
    Rabu: "",
    Kamis: "",
    Jumat: "",
    Sabtu: "",
    Minggu: "",
  });
  const [isModalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://rme-shazfa-mounira-default-rtdb.firebaseio.com/JadwalPraktek.json"
      );

      if (response.data) {
        setJadwal(response.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleInputChange = (day, value) => {
    setJadwal((prevJadwal) => ({
      ...prevJadwal,
      [day]: value,
    }));
  };

  const handleSave = async () => {
    try {
      await axios.put(
        "https://rme-shazfa-mounira-default-rtdb.firebaseio.com/JadwalPraktek.json",
        jadwal
      );

      console.log("Jadwal berhasil disimpan");
      setModalOpen(true);
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const weekdays = ["Senin", "Selasa", "Rabu", "Kamis"];
  const weekends = ["Jumat", "Sabtu", "Minggu"];

  return (
    <div className="flex-container">
      <h3 className="title">Atur Jadwal Anda secara Real-Time</h3>
      <form className="new-form-container">
        {weekdays.map((day) => (
          <div key={day} className="input-container">
            <label className="label">{day}</label>
            <input
              type="text"
              value={jadwal[day]}
              onChange={(e) => handleInputChange(day, e.target.value)}
              className="input-field"
            />
          </div>
        ))}
        {weekends.map((day) => (
          <div key={day} className="input-container">
            <label className="label">{day}</label>
            <input
              type="text"
              value={jadwal[day]}
              onChange={(e) => handleInputChange(day, e.target.value)}
              className="input-field"
            />
          </div>
        ))}
      </form>
      <button className="button" onClick={handleSave}>
        Simpan Jadwal
      </button>
      {isModalOpen && (
        <div className="modal-container">
          <div className="modal-content">
            <p className="modal-title">Jadwal Praktek sudah diperbarui!</p>
            <button className="modal-button" onClick={closeModal}>
              Tutup Modal
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default JadwalPraktek;
