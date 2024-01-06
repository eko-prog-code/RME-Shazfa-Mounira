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
    participant: '',
    images: [],
    Encounter_period_start: '', // Ganti properti
  });
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`https://rme-shazfa-mounira-default-rtdb.firebaseio.com/patients/${id}/medical_records/${treatmentId}.json`)
      .then((response) => {
        setTreatmentData(response.data);
        const timestamp = format(new Date(), "yyyy-MM-dd'T'HH:mm:ss");
        setUpdatedTreatmentData({
          complaint: response.data.complaint || '',
          condition_physical_examination: response.data.condition_physical_examination || '',
          Observation: response.data.Observation || '',
          Medication: response.data.Medication || '',
          diagnosis: response.data.diagnosis || '',
          participant: response.data.participant || '',
          images: response.data.images || [],
          Encounter_period_start: timestamp, // Set Encounter_period_start here
        });
      })
      .catch((error) => {
        console.error('Error fetching treatment data:', error);
      });
  }, [id, treatmentId]);


  const handleImageDrop = async (acceptedFiles) => {
    try {
      const uploadPromises = acceptedFiles.map(async (file) => {
        const timestamp = new Date().getTime();
        const formData = new FormData();
        formData.append('file', file);

        // Use URL Firebase Storage to upload the image
        const storageUrl = `https://firebasestorage.googleapis.com/v0/b/rme-shazfa-mounira.appspot.com/o/images%2F${timestamp}_${file.name}?alt=media`;

        await axios.post(storageUrl, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        // Build the image download URL after uploading
        const imageUrl = `https://firebasestorage.googleapis.com/v0/b/rme-shazfa-mounira.appspot.com/o/images%2F${timestamp}_${file.name}?alt=media`;

        // Update state with the image download URL
        setUpdatedTreatmentData((prevData) => ({
          ...prevData,
          images: [...prevData.images, imageUrl],
        }));
      });

      // Wait for all image upload promises to finish
      await Promise.all(uploadPromises);

      setUpdateSuccess(true);
    } catch (error) {
      console.error('Error uploading images:', error);
    }
  };


  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    onDrop: handleImageDrop,
  });

  const updateTreatment = () => {
    const timestamp = format(new Date(), "yyyy-MM-dd'T'HH:mm:ss");
    const updatedDataWithTimestamp = {
      ...updatedTreatmentData,
      identifier: id,
      timestamp: timestamp,
      Encounter_period_start: updatedTreatmentData.Encounter_period_start, // Ganti properti
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


  const renderImagePreviews = () => {
    return (
      <div>
        <h3>Image Previews</h3>
        {updatedTreatmentData.images.map((imageUrl, index) => (
          <img
            key={index}
            src={imageUrl}
            alt={`Image ${index + 1}`}
            className="UpdateTreatment-preview-image"
          />
        ))}
      </div>
    );
  };

  const handleInputChange = (e) => {
    setUpdatedTreatmentData({
      ...updatedTreatmentData,
      [e.target.name]: e.target.value,
    });
  };

  const [doctors, setDoctors] = useState([
    'Dokter Libra',
    'Dokter Chantika',
    'Dr Rena',
    // ... (tambahkan dokter lain jika diperlukan)
  ]);

  return (
    <div className="UpdateTreatment-container">
      <Link to={`/emr/${id}`} className="UpdateTreatment-link">&lt; Back to EMR</Link>
      <h2 className="UpdateTreatment-heading">Update Treatment</h2>
      {treatmentData && (
        <div>
          <p>Treatment ID: {treatmentId}</p>
          <p>TimeStamp: {treatmentData.timestamp}</p>

          <div className="UpdateTreatment-form">

            <label htmlFor="Encounter_period_start" className="UpdateTreatment-label">Encounter Period Start:</label>
            <input
              type="text"
              id="Encounter_period_start"
              name="Encounter_period_start"
              value={updatedTreatmentData.Encounter_period_start}
              onChange={handleInputChange}
              className="UpdateTreatment-input"
            />

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

            {updateSuccess && renderImagePreviews()}

            <label htmlFor="diagnosis" className="UpdateTreatment-label">Diagnosa Medis:</label>
            <input
              type="text"
              id="diagnosis"
              name="diagnosis"
              value={updatedTreatmentData.diagnosis}
              onChange={handleInputChange}
              className="UpdateTreatment-input"
            />

            <label htmlFor="participant" className="UpdateTreatment-label">Dokter DPJP:</label>
            <select
              id="participant"
              name="participant"
              value={updatedTreatmentData.participant}
              onChange={handleInputChange}
              className="UpdateTreatment-input"
            >
              <option value="">Pilih Dokter</option>
              {doctors.map((doctor, index) => (
                <option key={index} value={doctor}>
                  {doctor}
                </option>
              ))}
            </select>

            <button onClick={updateTreatment} className="UpdateTreatment-button">Update Treatment</button>

          </div>
        </div>
      )}
    </div>
  );
};

export default UpdateTreatment;
