import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';
import { useDropzone } from 'react-dropzone';
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
    images: [],
  });
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`https://rme-shazfa-mounira-default-rtdb.firebaseio.com/patients/${id}/medical_records/${treatmentId}.json`)
      .then((response) => {
        setTreatmentData(response.data);
        setUpdatedTreatmentData({
          complaint: response.data.complaint || '',
          condition_physical_examination: response.data.condition_physical_examination || '',
          Observation: response.data.Observation || '',
          Medication: response.data.Medication || '',
          diagnosis: response.data.diagnosis || '',
          images: response.data.images || [],
        });
      })
      .catch((error) => {
        console.error('Error fetching treatment data:', error);
      });
  }, [id, treatmentId]);

  const handleInputChange = (e) => {
    setUpdatedTreatmentData({
      ...updatedTreatmentData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageDrop = (acceptedFiles) => {
    const updatedImages = acceptedFiles.map(file =>
      URL.createObjectURL(file)
    );
  
    const updatedImageArray = [...updatedTreatmentData.images];
    if (updatedImageArray.length > 0) {
      updatedImageArray[0] = updatedImages[0];
    } else {
      updatedImageArray.push(updatedImages[0]);
    }
  
    setUpdatedTreatmentData({
      ...updatedTreatmentData,
      images: updatedImageArray,
    });

    setUpdateSuccess(true);
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    onDrop: handleImageDrop,
  });

  const updateTreatment = () => {
    const timestamp = format(new Date(), "yyyy-MM-dd'T'HH:mm:ss");
    const updatedDataWithTimestamp = {
      ...updatedTreatmentData,
      timestamp: timestamp,
    };

    axios
      .put(
        `https://rme-shazfa-mounira-default-rtdb.firebaseio.com/patients/${id}/medical_records/${treatmentId}.json`,
        updatedDataWithTimestamp
      )
      .then((response) => {
        console.log('Treatment updated successfully:', response.data);
        navigate(`/emr/${id}`);
      })
      .catch((error) => {
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

            <label htmlFor="Observation" className="UpdateTreatment-label">Tanda Vital:</label>
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

            <div {...getRootProps()} className="UpdateTreatment-dropzone">
              <input {...getInputProps()} />
              <p>Drag 'n' drop some images here, or click to select files</p>
            </div>
            {updateSuccess && (
              <p className="UpdateTreatment-success-message">Update Images berhasil!</p>
            )}

            <label htmlFor="diagnosis" className="UpdateTreatment-label">Diagnosa Medis:</label>
            <input
              type="text"
              id="diagnosis"
              name="diagnosis"
              value={updatedTreatmentData.diagnosis}
              onChange={handleInputChange}
              className="UpdateTreatment-input"
            />

            <button onClick={updateTreatment} className="UpdateTreatment-button">Update Treatment</button>

          </div>
        </div>
      )}
    </div>
  );
};

export default UpdateTreatment;
