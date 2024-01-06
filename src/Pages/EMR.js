import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { FaTimes } from 'react-icons/fa'; // Impor ikon "X" dari react-icons/fa
import { format, differenceInHours } from 'date-fns';
import './EMR.css';

const EMR = () => {
    const { id } = useParams();

    const [patientDetails, setPatientDetails] = useState(null);
    const [treatments, setTreatments] = useState([]);
    const [allergyIntolerance, setAllergyIntolerance] = useState('');
    const [healthHistory, setHealthHistory] = useState('');
    const [zoomedImage, setZoomedImage] = useState(null);
    const isEditable = (timestamp) => {
        const hoursDifference = differenceInHours(new Date(), new Date(timestamp));
        return hoursDifference <= 24;
    };


    useEffect(() => {
        // Mengambil data pasien
        axios.get(`https://rme-shazfa-mounira-default-rtdb.firebaseio.com/patients/${id}.json`)
            .then(response => {
                setPatientDetails(response.data);

                // Mengambil data alergi dan riwayat kesehatan dari Firebase (jika ada)
                if (response.data) {
                    setAllergyIntolerance(response.data.AllergyIntolerance || '');
                    setHealthHistory(response.data.HealthHistory || '');
                }
            })
            .catch(error => {
                console.error('Terjadi kesalahan:', error);
            });

        // Mengambil data riwayat pengobatan
        axios.get(`https://rme-shazfa-mounira-default-rtdb.firebaseio.com/patients/${id}/medical_records.json`)
            .then(response => {
                const treatmentsArray = Object.keys(response.data).map(recordId => ({
                    id: recordId,
                    ...response.data[recordId],
                }));
                setTreatments(treatmentsArray.reverse()); // Reverse the array
            })
            .catch(error => {
                console.error('Terjadi kesalahan:', error);
            });
    }, [id]);

    const handleAllergyIntoleranceChange = (e) => {
        setAllergyIntolerance(e.target.value);
    };

    const handleHealthHistoryChange = (e) => {
        setHealthHistory(e.target.value);
    };

    const saveAllergyIntoleranceAndHealthHistory = () => {
        // Simpan data alergi dan riwayat kesehatan ke Firebase sesuai dengan ID pasien
        axios.put(`https://rme-shazfa-mounira-default-rtdb.firebaseio.com/patients/${id}.json`, {
            ...patientDetails, // Menyertakan data pasien yang sudah ada
            AllergyIntolerance: allergyIntolerance,
            HealthHistory: healthHistory
        })
            .then(response => {
                console.log('Data alergi dan riwayat kesehatan berhasil disimpan');
            })
            .catch(error => {
                console.error('Terjadi kesalahan:', error);
            });
    };

    const deleteAllergyIntolerance = () => {
        // Hapus data alergi dari Firebase sesuai dengan ID pasien
        axios.put(`https://rme-shazfa-mounira-default-rtdb.firebaseio.com/patients/${id}.json`, {
            ...patientDetails, // Menyertakan data pasien yang sudah ada
            AllergyIntolerance: '',
            HealthHistory: healthHistory
        })
            .then(response => {
                console.log('Data alergi berhasil dihapus');
                setAllergyIntolerance('');
            })
            .catch(error => {
                console.error('Terjadi kesalahan:', error);
            });
    };

    const deleteHealthHistory = () => {
        // Hapus data riwayat kesehatan dari Firebase sesuai dengan ID pasien
        axios.put(`https://rme-shazfa-mounira-default-rtdb.firebaseio.com/patients/${id}.json`, {
            ...patientDetails, // Menyertakan data pasien yang sudah ada
            AllergyIntolerance: allergyIntolerance,
            HealthHistory: ''
        })
            .then(response => {
                console.log('Riwayat kesehatan berhasil dihapus');
                setHealthHistory('');
            })
            .catch(error => {
                console.error('Terjadi kesalahan:', error);
            });
    };

    const confirmDelete = (treatmentId) => {
        const isConfirmed = window.confirm("Apakah Anda yakin akan menghapus data ini?");
        if (isConfirmed) {
            deleteTreatmentRecord(treatmentId);
        }
    };

    const deleteTreatmentRecord = (treatmentId) => {
        // Hapus data riwayat pengobatan dari Firebase sesuai dengan ID treatment
        axios.delete(`https://rme-shazfa-mounira-default-rtdb.firebaseio.com/patients/${id}/medical_records/${treatmentId}.json`)
            .then(response => {
                console.log('Riwayat pengobatan berhasil dihapus');
                // Refresh data riwayat pengobatan setelah penghapusan
                const updatedTreatments = treatments.filter(treatment => treatment.id !== treatmentId);
                setTreatments(updatedTreatments);
            })
            .catch(error => {
                console.error('Terjadi kesalahan:', error);
            });
    };

    return (
        <div>
            <Link to="/home" className="home-link">
                <img src='https://firebasestorage.googleapis.com/v0/b/rekammedis-70985.appspot.com/o/images__14_-removebg-preview.png?alt=media&token=dac5fd74-4670-4ce9-a490-4f01637c2f22' />
            </Link>

            <h2>Electronic Medical Records (EMR)</h2>
            <div className="emr-container">
                <div className="patient-details">
                    {patientDetails && (
                        <div>
                            <div className="biodata-pasien">
                                <h4>Biodata Pasien</h4>
                                <h5>NIK         : {patientDetails.identifier}</h5>
                                <p>Nomor RM     : {patientDetails.number_medical_records}</p>
                                <p>Nama         : {patientDetails.name}</p>
                                <p>Tanggal Lahir: {patientDetails.birthDate}</p>
                            </div>
                            <div>
                                <h5>
                                    <span className="allergies-label">Alergi</span>
                                    {allergyIntolerance && (
                                        <span className="delete-icon-wrapper">
                                            <FaTimes onClick={deleteAllergyIntolerance} className="delete-icon" color="white" />
                                        </span>
                                    )}
                                </h5>
                                {allergyIntolerance ? (
                                    <div>
                                        <p>{allergyIntolerance}</p>
                                    </div>
                                ) : (
                                    <p>Tidak ada alergi</p>
                                )}
                            </div>

                            <div>
                                <h5>
                                    <span className="health-history-label">Riwayat Kesehatan</span>
                                    {healthHistory && (
                                        <span className="delete-icon-wrapper">
                                            <FaTimes onClick={deleteHealthHistory} className="delete-icon" color="white" />
                                        </span>
                                    )}
                                </h5>
                                {healthHistory ? (
                                    <div>
                                        <p>{healthHistory}</p>
                                    </div>
                                ) : (
                                    <p>Tidak ada riwayat kesehatan</p>
                                )}
                            </div>

                            <div>
                                <h4 className="ubah-text">Ubah Alergi</h4>
                                <input className="my-input" type="text" value={allergyIntolerance} onChange={handleAllergyIntoleranceChange} />
                            </div>
                            <div>
                                <h4 className="ubah-text">Ubah Riwayat Kesehatan</h4>
                                <input className="my-input" type="text" value={healthHistory} onChange={handleHealthHistoryChange} />
                            </div>

                            <button className="button-save" onClick={saveAllergyIntoleranceAndHealthHistory}>
                                Simpan
                            </button>

                        </div>
                    )}
                </div>

                <div className="treatments">
                    <Link to={`/emr/${id}/tambah-pengobatan`}>
                        <img src="https://firebasestorage.googleapis.com/v0/b/rekammedis-70985.appspot.com/o/ButtonBerobat.png?alt=media&token=5f8a6c51-c2e7-44d0-9609-d5e521aa9a13" alt="Tambah Pengobatan" />
                    </Link>
                    <h3>Riwayat Pengobatan</h3>
                    {treatments
                        .slice()
                        .sort((a, b) => b.timestamp - a.timestamp)
                        .map(treatment => (
                            <div className="treatment-card" key={treatment.id}>
                                {/* Tambahkan gambar sampah */}
                                <img
                                    src="/trash.png" // Ganti dengan path menuju gambar sampah
                                    alt="Delete"
                                    className="delete-treatment-icon" // Ganti dengan nama kelas yang unik
                                    style={{ maxWidth: '80%', height: 'auto' }}
                                    onClick={() => confirmDelete(treatment.id)}
                                />

                                {/* Display "Edit" button only if the treatment is editable */}
                                {isEditable(treatment.timestamp) ? (
                                    <Link to={`/emr/${id}/update-treatment/${treatment.id}`}>
                                        <button>Edit</button>
                                    </Link>
                                ) : (
                                    <button onClick={() => alert('Mohon maaf, fungsi edit tidak bisa dilakukan karena sudah 24 jam!')}>
                                        Edit
                                    </button>
                                )}

                                <p>Tanggal dan Waktu: {format(new Date(treatment.timestamp), 'dd MMMM yyyy HH:mm:ss')}</p>
                                <p>Keluhan: {treatment.complaint}</p>
                                <p>Pemeriksaan Fisik: {treatment.condition_physical_examination}</p>
                                <p>Tanda-Tanda Vital: {treatment.Observation}</p>
                                <p>Terapi Obat: {treatment.Medication}</p>
                                <p>Diagnosa Medis: {treatment.diagnosis}</p>
                                <p>DPJP (Participant): {treatment.participant}</p>
                                {treatment.images && treatment.images.length > 0 && (
                                    <img
                                        src={treatment.images[0]} // Ganti dengan sumber gambar dari treatment
                                        alt={`Treatment ${treatment.id}`}
                                        className="treatment-image"
                                        onClick={() => setZoomedImage(treatment.images[0])}
                                    />
                                )}
                            </div>
                        ))}
                </div>

                {zoomedImage && (
                    <div className="zoom-modal" onClick={() => setZoomedImage(null)}>
                        <img src={zoomedImage} alt="Zoomed Image" className="zoomed-image" />
                    </div>
                )}

            </div>
        </div>
    );
};

export default EMR;
