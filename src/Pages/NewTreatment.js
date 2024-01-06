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
  const [Observation, setObservation] = useState('');
  const [diagnosis, setDiagnosis] = useState(''); // Mengganti dari 'medical_diagnosis' menjadi 'diagnosis'
  const [Medication, setMedication] = useState(''); // Mengganti dari 'Medication' menjadi 'Medication'
  const [tanggal, setTanggal] = useState(format(new Date(), 'dd MMMM yyyy'));
  const [jamMenitDetik, setJamMenitDetik] = useState(format(new Date(), 'HH:mm:ss'));
  const [icdData, setIcdData] = useState([]);
  const [filteredIcdData, setFilteredIcdData] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);

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

  const handleObservationChange = (e) => {
    setObservation(e.target.value); 
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

  const filterIcdData = (filterValue) => {
    const filteredList = icdData.filter(
      (item) => item.code.toLowerCase().includes(filterValue.toLowerCase()) || item.name.toLowerCase().includes(filterValue.toLowerCase())
    );
    setFilteredIcdData(filteredList);
  };

  const handleSubmit = async () => {
  try {
    // Persiapkan data yang akan dikirim ke Firebase Realtime Database
    const dataToSend = {
      timestamp: new Date().getTime(),
      Encounter_period_start: `${tanggal} ${jamMenitDetik}`,  // Combine date and time
      identifier: id,
      complaint: complaint,
      condition_physical_examination: condition_physical_examination,
      Observation: Observation,
      diagnosis: diagnosis,
      Medication: Medication,
      images: uploadedImages,
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
          <input type="text" value={Observation} onChange={handleObservationChange} className="unique-input-field" />
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

