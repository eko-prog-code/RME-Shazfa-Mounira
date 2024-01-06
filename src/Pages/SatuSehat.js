import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './SatuSehat.css'; // Import file CSS

const SatuSehat = () => {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [filterDate, setFilterDate] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('https://rme-shazfa-mounira-default-rtdb.firebaseio.com/patients.json');
      const data = response.data;

      // Convert the object into an array
      const patientsArray = Object.values(data);

      setPatients(patientsArray);
      setFilteredPatients(patientsArray); // Set initial data without filtering
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleFilter = () => {
    // Filter based on the date of Encounter_period_start
    const filteredData = patients.filter(patient => {
      const medicalRecords = Object.values(patient.medical_records || {});

      // Check if any medical record has Encounter_period_start on the selected date
      return medicalRecords.some(record => {
        const recordDate = new Date(record.Encounter_period_start).toLocaleDateString();
        const filterDateStr = filterDate.toLocaleDateString();

        return recordDate === filterDateStr;
      });
    });

    setFilteredPatients(filteredData);
  };

  return (
    <div className="container">
      <h1>Satu Sehat</h1>
      <div>
        <label>Tanggal Berobat:</label>
        <DatePicker
          selected={filterDate}
          onChange={date => setFilterDate(date)}
          dateFormat="yyyy-MM-dd"
          placeholderText="Pilih Tanggal"
          className="datepicker"
        />
        <button onClick={handleFilter} className="filter-button">Filter</button>
      </div>

      <div>
        {filteredPatients.length > 0 ? (
          filteredPatients.map((patient) => (
            <div key={patient.id} className="patient-card">
              <h2>
                {patient.name} <span className="generate-id-text">Generate ID: {Object.values(patient.medical_records || {})[0]?.identifier}</span> 
              </h2>
              <p>Identifier: {patient.identifier}</p>
              <p>Number of Medical Records: {patient.number_medical_records}</p>
              {Object.values(patient.medical_records || {}).map(record => (
                <div key={record.identifier} className="medical-record">
                  <h4>Generate ID: {record.identifier}</h4>
                  <p>Complaint: {record.complaint}</p>
                  <p>Observation: {record.Observation}</p>
                  <p>Condition Physical Examination: {record.condition_physical_examination}</p>
                  <p>Diagnosis: {record.diagnosis}</p>
                  <p>Medication: {record.Medication}</p>
                  <p>Participant: {record.participant}</p>
                  <p>Encounter Period: {record.Encounter_period_start}</p>
                </div>
              ))}
            </div>
          ))
        ) : (
          <p className="no-results">Oops... Tidak ada pasien di tanggal ini!!</p>
        )}
      </div>
    </div>
  );
};

export default SatuSehat;
