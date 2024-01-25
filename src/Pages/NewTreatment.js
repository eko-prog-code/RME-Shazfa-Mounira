import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';
import { useDropzone } from 'react-dropzone';
import './NewTreatment.css';

const NewTreatment = () => {
  const { id } = useParams();
  const [complaint, setComplaint] = useState('');
  const [condition_physical_examination, setConditionPhysicalExamination] = useState('');
   const [systolicBloodPressure, setSystolicBloodPressure] = useState('');
  const [diastolicBloodPressure, setDiastolicBloodPressure] = useState('');
  const [heartRate, setHeartRate] = useState('');
  const [bodyTemperature, setBodyTemperature] = useState('');
  const [respiratoryRate, setRespiratoryRate] = useState('');
  const [Observation, setObservation] = useState('');
  const [diagnosis, setDiagnosis] = useState(''); // Mengganti dari 'medical_diagnosis' menjadi 'diagnosis'
  const [Medication, setMedication] = useState(''); // Mengganti dari 'Medication' menjadi 'Medication'
  const [participant, setParticipant] = useState('');
  const [tanggal, setTanggal] = useState(format(new Date(), 'dd MMMM yyyy'));
  const [jamMenitDetik, setJamMenitDetik] = useState(format(new Date(), 'HH:mm:ss'));
  const [icdData, setIcdData] = useState([]);
  const [filteredIcdData, setFilteredIcdData] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [doctorNIK, setDoctorNIK] = useState('');

  // Fungsi untuk menangani penurunan gambar
  const onDrop = async (acceptedFiles) => {
    try {
      const uploadPromises = acceptedFiles.map(async (file) => {
        const timestamp = new Date().getTime();
        const formData = new FormData();
        formData.append('file', file);

        // Gunakan URL Firebase Storage untuk mengunggah gambar
        const storageUrl = `https://firebasestorage.googleapis.com/v0/b/rme-shazfa-mounira.appspot.com/o/images%2F${timestamp}_${file.name}?alt=media`;

        await axios.post(storageUrl, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        // Bangun URL gambar setelah diunggah
        const imageUrl = `https://firebasestorage.googleapis.com/v0/b/rme-shazfa-mounira.appspot.com/o/images%2F${timestamp}_${file.name}?alt=media`;

        // Perbarui state dengan URL gambar yang diunggah
        setUploadedImages((prevImages) => [...prevImages, imageUrl]);
      });

      // Tunggu semua janji unggahan gambar selesai
      await Promise.all(uploadPromises);
    } catch (error) {
      console.error('Error saat mengunggah file:', error);
    }
  };

  // Konfigurasi hook UseDropzone
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: 'image/*',
    multiple: true,
  });

  useEffect(() => {
    // Fetch ICD data from the API or use a predefined list
    // For testing purposes, I'll use a predefined list
    const predefinedIcdData = [
      { code: 'A03.9', name: 'Dysentery, unspecified' },
      { code: 'A90', name: 'Dengue fever [classical dengue]' },
      // ... (predefined codes and names)
    ];

    setIcdData(predefinedIcdData);
  }, []);

  const intervalId = setInterval(() => {
    setJamMenitDetik(format(new Date(), 'HH:mm:ss'));
  }, 1000);

  const handleComplaintChange = (e) => {
    setComplaint(e.target.value);
  };

  const handleConditionPhysicalExaminationChange = (e) => {
    setConditionPhysicalExamination(e.target.value);
  };

  const handleDiagnosisChange = (e) => {
    setDiagnosis(e.target.value);
    setIsTyping(!!e.target.value);
    filterIcdData(e.target.value);
  };

  const handleMedicationChange = (e) => {
    setMedication(e.target.value);
  };

  const handleDiagnosisItemClick = (selectedDiagnosis) => {
    setDiagnosis(`${selectedDiagnosis.code} - ${selectedDiagnosis.name}`);
    setFilteredIcdData([]);
  };

   const handleSystolicBloodPressureChange = (e) => {
    const value = e.target.value;
    if (!isNaN(value)) {
      setSystolicBloodPressure(value);
    }
  };

  const handleDiastolicBloodPressureChange = (e) => {
    const value = e.target.value;
    if (!isNaN(value)) {
      setDiastolicBloodPressure(value);
    }
  };

  const handleHeartRateChange = (e) => {
    const value = e.target.value;
    if (!isNaN(value)) {
      setHeartRate(value);
    }
  };

  const handleBodyTemperatureChange = (e) => {
    const value = e.target.value;
    if (!isNaN(value)) {
      setBodyTemperature(value);
    }
  };

  const handleRespiratoryRateChange = (e) => {
    const value = e.target.value;
    if (!isNaN(value)) {
      setRespiratoryRate(value);
    }
  };


  useEffect(() => {
    // Fetch NIK data from the API or use a predefined list
    // For testing purposes, I'll use a predefined list
    const doctorNIKData = {
      'dr. Yohanes hendra budi santoso': '3215131301790004',
      'dr. yesi novia Ambarani': '3205155812920006',
      'Practitioner 1': '7209061211900001',
      // ... (tambahkan NIK dokter lain jika diperlukan)
    };
  
    // Set NIK dokter berdasarkan nama dokter yang dipilih
    setDoctorNIK(doctorNIKData[participant]);
  }, [participant]);
  

  const [doctors, setDoctors] = useState([
    'dr. Yohanes hendra budi santoso',
    'dr. yesi novia Ambarani',
    'Practitioner 1',
    // ... (tambahkan dokter lain jika diperlukan)
  ]);

  const handleParticipantChange = (e) => {
    setParticipant(e.target.value);
  };

  const filterIcdData = (filterValue) => {
    const filteredList = icdData.filter(
      (item) => item.code.toLowerCase().includes(filterValue.toLowerCase()) || item.name.toLowerCase().includes(filterValue.toLowerCase())
    );
    setFilteredIcdData(filteredList);
  };

  const handleSubmit = async () => {
    try {
      // Persiapkan data yang akan dikirim ke Firebase Realtime Database
      const [diagnosisCode, diagnosisName] = diagnosis.split(" - ");
      const dataToSend = {
        timestamp: new Date().getTime(),
        Encounter_period_start: new Date(`${tanggal} ${jamMenitDetik}`),
        identifier: id,
        complaint: complaint,
        condition_physical_examination: condition_physical_examination,
        diagnosis: {
          code: diagnosisCode,
          name: diagnosisName,
        },
        Medication: Medication,
        participant: participant,
        doctorNIK: doctorNIK,
        images: uploadedImages,
        systolicBloodPressure: systolicBloodPressure,
        diastolicBloodPressure: diastolicBloodPressure,
        heartRate: heartRate,
        bodyTemperature: bodyTemperature,
        respiratoryRate: respiratoryRate,
      };

      // Kirim data ke Firebase Realtime Database
      await axios.post(`https://rme-shazfa-mounira-default-rtdb.firebaseio.com/patients/${id}/medical_records.json`, dataToSend);

      console.log('Data pengobatan berhasil disimpan');
      window.location.href = `/emr/${id}`;
    } catch (error) {
      console.error('Terjadi kesalahan:', error);
    }
  };

  return (
    <div className="unique-new-treatment-container">
      <h2 className="unique-new-treatment-heading">Tambah Pengobatan</h2>
      <div className="unique-form-container">
        <div className="unique-data-pengobatan">
          <h3>Tanggal</h3>
          <input type="text" value={tanggal} readOnly className="unique-input-field" />
          <h3>Waktu</h3>
          <input type="text" value={jamMenitDetik} readOnly className="unique-input-field" />
          <h3>Keluhan</h3>
          <input type="text" value={complaint} onChange={handleComplaintChange} className="unique-input-field" />
          <h3>Pemeriksaan Fisik</h3>
          <input type="text" value={condition_physical_examination} onChange={handleConditionPhysicalExaminationChange} className="unique-input-field" />
          <div {...getRootProps()} className="unique-dropzone">
            <input {...getInputProps()} />
            <p>Drag 'n' drop some files here, or click to select files</p>
          </div>
          {uploadedImages.length > 0 && (
            <div>
              <h3>Preview Images</h3>
              {uploadedImages.map((imageUrl, index) => (
                <img key={index} src={imageUrl} alt={`Uploaded ${index + 1}`} className="unique-uploaded-image" />
              ))}
            </div>
          )}
           <h3>Tanda Vital</h3>
          <label>Systolic Blood Pressure:</label>
          <input
            type="text"
            value={systolicBloodPressure}
            onChange={handleSystolicBloodPressureChange}
            className="unique-input-field"
          />

          <label>Diastolic Blood Pressure:</label>
          <input
            type="text"
            value={diastolicBloodPressure}
            onChange={handleDiastolicBloodPressureChange}
            className="unique-input-field"
          />

          <label>Heart Rate:</label>
          <input
            type="text"
            value={heartRate}
            onChange={handleHeartRateChange}
            className="unique-input-field"
          />

          <label>Suhu Badan:</label>
          <input
            type="text"
            value={bodyTemperature}
            onChange={handleBodyTemperatureChange}
            className="unique-input-field"
          />

          <label>Respiratory Rate:</label>
          <input
            type="text"
            value={respiratoryRate}
            onChange={handleRespiratoryRateChange}
            className="unique-input-field"
          />

          <h3>Diagnosa Medis</h3>
          <input
            type="text"
            value={diagnosis}
            onChange={handleDiagnosisChange}
            className="unique-input-field"
            placeholder="Filter or click to select"
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
          <h3>Terapi Obat</h3>
          <input type="text" value={Medication} onChange={handleMedicationChange} className="unique-input-field" />
          <h3>Participant</h3>
          <select value={participant} onChange={handleParticipantChange} className="unique-input-field">
            <option value="">Pilih Dokter</option>
            {doctors.map((doctor, index) => (
              <option key={index} value={doctor}>
                {doctor}
              </option>
            ))}
          </select>
        </div>
        <button onClick={handleSubmit} className="unique-submit-button rounded-button">
          Submit
        </button>
        <Link to={`/emr/${id}`} className="unique-back-link">
          Kembali ke EMR
        </Link>
      </div>
    </div>
  );
};

export default NewTreatment;

