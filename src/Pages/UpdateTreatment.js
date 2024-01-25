import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';
import { useDropzone } from 'react-dropzone';
import './UpdateTreatment.css';

const UpdateTreatment = () => {
  const { id, treatmentId } = useParams();
  const [treatmentData, setTreatmentData] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [updatedTreatmentData, setUpdatedTreatmentData] = useState({
    complaint: '',
    condition_physical_examination: '',
    Medication: '',
    diagnosis: '',
    participant: '',
    images: [],
    Encounter_period_start: '', // Ganti properti
    systolicBloodPressure: '',
    diastolicBloodPressure: '',
    heartRate: '',
    bodyTemperature: '',
    respiratoryRate: '',
  });
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const navigate = useNavigate();
  const [doctorNIK, setDoctorNIK] = useState('');
  const [icdData, setIcdData] = useState([]);
  const [filteredIcdData, setFilteredIcdData] = useState([]);
  const [diagnosis, setDiagnosis] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [initialDiagnosis, setInitialDiagnosis] = useState('');
  const [diagnosisData, setDiagnosisData] = useState([]);

  useEffect(() => {
    const predefinedIcdData = [
      { code: 'A03.9', name: 'Dysentery, unspecified' },
      { code: 'A90', name: 'Dengue fever [classical dengue]' },
      // ... (predefined codes and names)
    ];

    setIcdData(predefinedIcdData);
  }, []);

  useEffect(() => {
    const doctorNIKData = {
      'dr. Yohanes hendra budi santoso': '3215131301790004',
      'dr. yesi novia Ambarani': '3205155812920006',
      'Practitioner 1': '7209061211900001',
      // ... (add NIK for other doctors if needed)
    };
  
    setDoctorNIK(doctorNIKData[updatedTreatmentData.participant]);
  
    // Define the 'doctors' array
    const doctorsArray = ['dr. Yohanes hendra budi santoso', 'dr. yesi novia Ambarani', 'Practitioner 1'];
    setDoctors(doctorsArray); // Add this line to set the 'doctors' state
  
  }, [updatedTreatmentData.participant]);
  

  useEffect(() => {
    axios
      .get(`https://rme-shazfa-mounira-default-rtdb.firebaseio.com/patients/${id}/medical_records/${treatmentId}.json`)
      .then((response) => {
        setTreatmentData(response.data);
        const timestamp = format(new Date(), "yyyy-MM-dd'T'HH:mm:ss");
        setUpdatedTreatmentData({
          complaint: response.data.complaint || '',
          condition_physical_examination: response.data.condition_physical_examination || '',
          Medication: response.data.Medication || '',
          diagnosis: response.data.diagnosis || '',
          participant: response.data.participant || '',
          images: response.data.images || [],
          Encounter_period_start: timestamp,
          systolicBloodPressure: response.data.systolicBloodPressure || '',
          diastolicBloodPressure: response.data.diastolicBloodPressure || '',
          heartRate: response.data.heartRate || '',
          bodyTemperature: response.data.bodyTemperature || '',
          respiratoryRate: response.data.respiratoryRate || '',
        });
      })
      .catch((error) => {
        console.error('Error fetching treatment data:', error);
      });
  }, [id, treatmentId]);

  useEffect(() => {
    const doctorNIKData = {
      'dr. Yohanes hendra budi santoso': '3215131301790004',
      'dr. yesi novia Ambarani': '3205155812920006',
      'Practitioner 1': '7209061211900001',
      // ... (add NIK for other doctors if needed)
    };

    setDoctorNIK(doctorNIKData[updatedTreatmentData.participant]);
  }, [updatedTreatmentData.participant]);

  useEffect(() => {
    axios
      .get(`https://rme-shazfa-mounira-default-rtdb.firebaseio.com/patients/${id}/medical_records/${treatmentId}/diagnosis.json`)
      .then((response) => {
        if (response.data) {
          setDiagnosisData(response.data);
        }
      })
      .catch((error) => {
        console.error('Error fetching diagnosis data:', error);
      });
  }, [id, treatmentId]);

  const handleImageDrop = async (acceptedFiles) => {
    try {
      const uploadPromises = acceptedFiles.map(async (file) => {
        const timestamp = new Date().getTime();
        const formData = new FormData();
        formData.append('file', file);

        const storageUrl = `https://firebasestorage.googleapis.com/v0/b/rme-shazfa-mounira.appspot.com/o/images%2F${timestamp}_${file.name}?alt=media`;

        await axios.post(storageUrl, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        const imageUrl = `https://firebasestorage.googleapis.com/v0/b/rme-shazfa-mounira.appspot.com/o/images%2F${timestamp}_${file.name}?alt=media`;

        setUpdatedTreatmentData((prevData) => ({
          ...prevData,
          images: [...prevData.images, imageUrl],
        }));
      });

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
    const diagnosisArray = typeof updatedTreatmentData.diagnosis === 'string'
      ? updatedTreatmentData.diagnosis.split(" - ")
      : ['', ''];

    const [diagnosisCode, diagnosisName] = diagnosisArray;
    const timestamp = format(new Date(), "yyyy-MM-dd'T'HH:mm:ss");
    const updatedDataWithTimestamp = {
      ...updatedTreatmentData,
      identifier: id,
      timestamp: timestamp,
      doctorNIK: doctorNIK,
      Encounter_period_start: updatedTreatmentData.Encounter_period_start,
      systolicBloodPressure: updatedTreatmentData.systolicBloodPressure,
      diastolicBloodPressure: updatedTreatmentData.diastolicBloodPressure,
      heartRate: updatedTreatmentData.heartRate,
      bodyTemperature: updatedTreatmentData.bodyTemperature,
      respiratoryRate: updatedTreatmentData.respiratoryRate,
      diagnosis: {
        code: diagnosisCode,
        name: diagnosisName,
      },
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

  useEffect(() => {
    if (treatmentData) {
      const { diagnosis } = treatmentData;
      if (diagnosis && diagnosis.code && diagnosis.name) {
        setInitialDiagnosis(`${diagnosis.code} - ${diagnosis.name}`);
      }
    }
  }, [treatmentData]);

  const handleDiagnosisChange = (e) => {
    const inputValue = e.target.value;
    setDiagnosis(inputValue);
    setIsTyping(true);
    filterIcdData(inputValue);
  };

  const filterIcdData = (filterValue) => {
    const filteredList = icdData.filter(
      (item) =>
        item.code.toLowerCase().includes(filterValue.toLowerCase()) ||
        item.name.toLowerCase().includes(filterValue.toLowerCase())
    );
    setFilteredIcdData(filteredList);
  };

  const handleDiagnosisItemClick = (selectedDiagnosis) => {
    setDiagnosis(`${selectedDiagnosis.code} - ${selectedDiagnosis.name}`);
    setIsTyping(false);

    setUpdatedTreatmentData((prevData) => ({
      ...prevData,
      diagnosis: `${selectedDiagnosis.code} - ${selectedDiagnosis.name}`,
    }));
  };

  const handleKeyPress = (e) => {
    const isValidInput = /^\d*\.?\d*$/.test(e.key);
    if (!isValidInput) {
      e.preventDefault();
    }
  };

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
            <label htmlFor="systolicBloodPressure" className="UpdateTreatment-label">Systolic Blood Pressure:</label>
            <input
              type="text"
              id="systolicBloodPressure"
              name="systolicBloodPressure"
              value={updatedTreatmentData.systolicBloodPressure}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              className="UpdateTreatment-input"
            />

            <label htmlFor="diastolicBloodPressure" className="UpdateTreatment-label">Diastolic Blood Pressure:</label>
            <input
              type="text"
              id="diastolicBloodPressure"
              name="diastolicBloodPressure"
              value={updatedTreatmentData.diastolicBloodPressure}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              className="UpdateTreatment-input"
            />

            <label htmlFor="heartRate" className="UpdateTreatment-label">Heart Rate:</label>
            <input
              type="text"
              id="heartRate"
              name="heartRate"
              value={updatedTreatmentData.heartRate}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              className="UpdateTreatment-input"
            />

            <label htmlFor="bodyTemperature" className="UpdateTreatment-label">Suhu Badan:</label>
            <input
              type="text"
              id="bodyTemperature"
              name="bodyTemperature"
              value={updatedTreatmentData.bodyTemperature}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              className="UpdateTreatment-input"
            />

            <label htmlFor="respiratoryRate" className="UpdateTreatment-label">Respiratory Rate:</label>
            <input
              type="text"
              id="respiratoryRate"
              name="respiratoryRate"
              value={updatedTreatmentData.respiratoryRate}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
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
              value={diagnosis}
              onChange={handleDiagnosisChange}
              className="UpdateTreatment-input"
              placeholder="Filter atau klik untuk memilih"
            />
            {isTyping && (
              <ul className="unique-filtered-list">
                {filteredIcdData.map((item) => (
                  <li key={item.code} onClick={() => handleDiagnosisItemClick(item)}>
                    {`${item.code} - ${item.name}`}
                  </li>
                ))}
              </ul>
            )}

            {initialDiagnosis && (
              <p>
                Diagnosa Awal: {initialDiagnosis}
              </p>
            )}
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
