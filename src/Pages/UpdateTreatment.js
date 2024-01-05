import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';
import './UpdateTreatment.css';

const UpdateTreatment = () => {
  const { id, treatmentId } = useParams();
  const [treatmentData, setTreatmentData] = useState(null);
  const [updatedTreatmentData, setUpdatedTreatmentData] = useState({
    complaint: '',
    condition_physical_examination: '',
    Observation: '',
    Medication: '',
    diagnosis: '',
    images: [], // Add images array
    // Add additional fields as needed
  });

  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`https://rme-shazfa-mounira-default-rtdb.firebaseio.com/patients/${id}/medical_records/${treatmentId}.json`)
      .then(response => {
        setTreatmentData(response.data);
        setUpdatedTreatmentData({
          complaint: response.data.complaint || '',
          condition_physical_examination: response.data.condition_physical_examination || '',
          Observation: response.data.Observation || '',
          Medication: response.data.Medication || '',
          diagnosis: response.data.diagnosis || '',
          images: response.data.images || [], // Include images field
          // Add additional fields as needed
        });
      })
      .catch(error => {
        console.error('Error fetching treatment data:', error);
      });
  }, [id, treatmentId]);

  const handleInputChange = (e) => {
    if (e.target.name === 'images') {
      const imagesArray = Array.from(e.target.files);
      setUpdatedTreatmentData({
        ...updatedTreatmentData,
        images: imagesArray,
      });
    } else {
      setUpdatedTreatmentData({
        ...updatedTreatmentData,
        [e.target.name]: e.target.value,
      });
    }
  };

  const updateTreatment = () => {
    const timestamp = format(new Date(), "yyyy-MM-dd'T'HH:mm:ss");
    const updatedDataWithTimestamp = {
      ...updatedTreatmentData,
      timestamp: timestamp,
    };

    const formData = new FormData();
    Object.entries(updatedDataWithTimestamp).forEach(([key, value]) => {
      if (key === 'images') {
        value.forEach((image, index) => {
          formData.append(`image${index}`, image);
        });
      } else {
        formData.append(key, value);
      }
    });

    axios.put(`https://rme-shazfa-mounira-default-rtdb.firebaseio.com/patients/${id}/medical_records/${treatmentId}.json`, formData)
      .then(response => {
        console.log('Treatment updated successfully:', response.data);
        navigate(`/emr/${id}`);
      })
      .catch(error => {
        console.error('Error updating treatment:', error);
      });
  };

  return (
    <div className="UpdateTreatment-container">
      <Link to={`/emr/${id}`} className="UpdateTreatment-link">&lt; Back to EMR</Link>
      <h2 className="UpdateTreatment-heading">Update Treatment</h2>
      {treatmentData && (
        <div>
          <p>Treatment ID: {treatmentId}</p>
          <p>Tanggal dan Waktu: {treatmentData.timestamp}</p>

          <div className="UpdateTreatment-form">
            <label htmlFor="complaint" className="UpdateTreatment-label">Keluhan:</label>
            <input
              type="text"
              id="complaint"
              name="complaint"
              value={updatedTreatmentData.complaint}
              onChange={handleInputChange}
              className="UpdateTreatment-input"
            />

            <label htmlFor="condition_physical_examination" className="UpdateTreatment-label">Pemeriksaan Fisik:</label>
            <input
              type="text"
              id="condition_physical_examination"
              name="condition_physical_examination"
              value={updatedTreatmentData.condition_physical_examination}
              onChange={handleInputChange}
              className="UpdateTreatment-input"
            />

            <label htmlFor="Observation" className="UpdateTreatment-label">Observation:</label>
            <input
              type="text"
              id="Observation"
              name="Observation"
              value={updatedTreatmentData.Observation}
              onChange={handleInputChange}
              className="UpdateTreatment-input"
            />

            <label htmlFor="Medication" className="UpdateTreatment-label">Terapi Obat:</label>
            <input
              type="text"
              id="Medication"
              name="Medication"
              value={updatedTreatmentData.Medication}
              onChange={handleInputChange}
              className="UpdateTreatment-input"
            />

            <label htmlFor="diagnosis" className="UpdateTreatment-label">Diagnosa Medis:</label>
            <input
              type="text"
              id="diagnosis"
              name="diagnosis"
              value={updatedTreatmentData.diagnosis}
              onChange={handleInputChange}
              className="UpdateTreatment-input"
            />

            <label htmlFor="images" className="UpdateTreatment-label">Images:</label>
            <input
              type="file"
              id="images"
              name="images"
              onChange={handleInputChange}
              className="UpdateTreatment-input"
              multiple // Allow multiple file selection
            />

            <button onClick={updateTreatment} className="UpdateTreatment-button">Update Treatment</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpdateTreatment;
