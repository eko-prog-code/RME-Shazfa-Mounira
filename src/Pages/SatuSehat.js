import React, { useState, useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import { format } from "date-fns";
import Button from "../components/ui/Button";
import { Link, useNavigate } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import Modal from "react-modal";
import "./SatuSehat.css";
import { getToken } from "../services/auth";
import Mandiri from "./../Images/mandiri.jpg";

const SatuSehat = () => {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [filterDate, setFilterDate] = useState(null);
  const [imageURL, setImageURL] = useState(
    "https://firebasestorage.googleapis.com/v0/b/rme-shazfa-mounira.appspot.com/o/HomeButton%2FSatu%20Sehat%20Icon.png?alt=media&token=d5eb8c3d-abdf-4485-89d8-bbb063c779e6"
  );

  const [paymentStatus, setPaymentStatus] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    // Fetch initial payment status from the server
    fetchPaymentStatus();
  }, []);

  const fetchPaymentStatus = async () => {
    try {
      const response = await axios.get('https://shazfabe.cyclic.app/payment-status');
      setPaymentStatus(response.data.paymentStatus);
    } catch (error) {
      console.error('Error fetching payment status:', error);
    }
  };


  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://rme-shazfa-mounira-default-rtdb.firebaseio.com/patients.json"
      );
      const data = response.data;

      const patientsArray = Object.values(data);

      setPatients(patientsArray);
      setFilteredPatients(patientsArray);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleFilter = () => {
    const filteredData = patients.map((patient) => {
      const medicalRecords = Object.values(patient.medical_records || {});

      const filteredMedicalRecords = Object.values(medicalRecords).filter(
        (record) => {
          const recordDate = new Date(record.Encounter_period_start);
          const filterDateClone = new Date(filterDate);

          recordDate.setHours(0, 0, 0, 0);
          filterDateClone.setHours(0, 0, 0, 0);

          return recordDate.getTime() === filterDateClone.getTime();
        }
      );

      if (filteredMedicalRecords.length > 0) {
        return {
          ...patient,
          medical_records: filteredMedicalRecords.reduce((acc, record) => {
            acc[record.identifier] = record;
            return acc;
          }, {}),
        };
      } else {
        return null;
      }
    });

    const filteredPatientsWithoutNull = filteredData.filter(Boolean);

    setFilteredPatients(filteredPatientsWithoutNull);
  };

  const handleButtonClick = (buttonType, record) => {
    if (paymentStatus === "unpaid") {
      setModalIsOpen(true);
    } else if (paymentStatus === "paid") {
      console.log("Payment is already paid. Additional handling logic can be added here if needed.");
    } else {
      switch (buttonType) {
        case "encounter":
          window.location.href = "/encounter";
          break;
        case "condition":
          window.location.href = "/condition";
          break;
        case "observation-nadi":
          window.location.href = "/nadi";
          break;
        default:
          break;
      }
    }
  };

  const handlePayment = () => {
    // Ubah status pembayaran berdasarkan kondisi sebelumnya
    setPaymentStatus((prevStatus) => (prevStatus === "unpaid" ? "paid" : "unpaid"));
  };


  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleCopyRekening = () => {
    const rekeningNumber = "1730007993125";
    navigator.clipboard.writeText(rekeningNumber)
      .then(() => {
        console.log('Nomor rekening disalin ke clipboard');
        window.alert('Copy Nomor Rekening berhasil!');
      })
      .catch((err) => {
        console.error('Gagal menyalin nomor rekening:', err);
      });
  };


  return (
    <div className="container">
      <img src={imageURL} alt="Satu Sehat" className="satu-sehat-logo" />
      <p>Payment Status: {paymentStatus}</p>
      <div className="flex max-w-lg items-start">
        <label className="mt-1">Tanggal Berobat:</label>
        <DatePicker
          selected={filterDate}
          onChange={(date) => {
            setFilterDate(date);
            handleFilter();
          }}
          dateFormat="yyyy-MM-dd"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholderText="Pilih Tanggal"
        />
        <Button
          onClick={handleFilter}
          className="inline-flex ml-2 text-white bg-[#2196F3] border-0 rounded-md py-3 px-5 focus:outline-none hover:bg-2196F3 text-sm"
        >
          Filter
        </Button>
      </div>

      <div>
        {filteredPatients.length > 0 ? (
          filteredPatients.map((patient) => (
            <div key={patient.id} className="patient-card-satu-sehat">
              <h2>
                {patient.name}{" "}
                <span className="generate-id-text">
                  Generate ID:{" "}
                  {Object.values(patient.medical_records || {})[0]?.identifier}
                </span>
              </h2>
              <p>Identifier: {patient.identifier}</p>
              <p>Number of Medical Records: {patient.number_medical_records}</p>
              {Object.values(patient.medical_records || {}).map((record) => (
                <div key={record.identifier} className="medical-record">
                  <h4>Generate ID: {record.identifier}</h4>
                  <p>Complaint: {record.complaint}</p>
                  <p>Vital Signs:</p>
                  <p>Tanda-Tanda Vital:</p>
                  <p>SystolicBloodPressure: {record.systolicBloodPressure}</p>
                  <p>DiastolicBloodPressure: {record.diastolicBloodPressure}</p>
                  <p>HeartRate: {record.heartRate}</p>
                  <p>BodyTemperature: {record.bodyTemperature}</p>
                  <p>RespiratoryRate: {record.respiratoryRate}</p>
                  <p>
                    Condition Physical Examination:{" "}
                    {record.condition_physical_examination}
                  </p>
                  <p>
                    Diagnosis: {record.diagnosis.code} - {record.diagnosis.name}
                  </p>
                  <p>Medication: {record.Medication}</p>
                  <p>Participant: {record.participant}</p>
                  <p>Participant NIK: {record.doctorNIK}</p>
                  <p>
                    Encounter Period:{" "}
                    {format(
                      new Date(record.Encounter_period_start),
                      "yyyy-MM-dd HH:mm:ss"
                    )}
                  </p>
                  <Link to={paymentStatus === "unpaid" ? "#" : "/encounter"}
                    state={paymentStatus === "unpaid" ? null : {
                      participant: record.participant,
                      patient: patient.name,
                      patientNIK: patient.identifier,
                      periodeStart: record.Encounter_period_start,
                      doctorNIK: record.doctorNIK,
                      paymentStatus,
                    }}>
                    <Button
                      onClick={() => handleButtonClick("encounter", record)}
                      className={`inline-flex ml-2 mt-2 text-white bg-[#2196F3] border-0 rounded-md py-3 px-5 focus:outline-none hover:bg-2196F3 text-sm ${paymentStatus === "unpaid" && "cursor-not-allowed"}`}
                      disabled={paymentStatus === "unpaid"}
                    >
                      Encounter
                    </Button>
                  </Link>
                  {/* ... kode lainnya ... */}
                  <Link to={paymentStatus === "unpaid" ? "#" : "/condition"}
                    state={paymentStatus === "unpaid" ? null : {
                      patient: patient.name,
                      patientNIK: patient.identifier,
                      observation: record.Observation,
                      codeICD: record.diagnosis.code,
                      dx: record.diagnosis.name,
                      paymentStatus,
                    }}>
                    <Button
                      onClick={() => handleButtonClick("condition", record)}
                      className="inline-flex ml-2 mt-2 text-white bg-[#2196F3] border-0 rounded-md py-3 px-5 focus:outline-none hover:bg-2196F3 text-sm"
                      disabled={paymentStatus === "unpaid"}
                    >
                      Condition
                    </Button>
                  </Link>
                  {/* ... kode lainnya ... */}
                  <Link to={paymentStatus === "unpaid" ? "#" : "/nadi"}
                    state={paymentStatus === "unpaid" ? null : {
                      patient: patient.name,
                      patientNIK: patient.identifier,
                      codeICD: record.diagnosis.code,
                      dx: record.diagnosis.name,
                      nadi: record.heartRate,
                      paymentStatus,
                    }}>
                    <Button
                      onClick={() => handleButtonClick("nadi", record)}
                      className="inline-flex ml-2 mt-2 text-white bg-[#2196F3] border-0 rounded-md py-3 px-5 focus:outline-none hover:bg-2196F3 text-sm"
                      disabled={paymentStatus === "unpaid"}
                    >
                      Observation-Nadi
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          ))
        ) : (
          <p className="no-results">
            Oops... Tidak ada pasien di tanggal ini!!
          </p>
        )}
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Unpaid Modal"
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          },
          content: {
            backgroundColor: '#fff',
            border: '1px solid #ccc',
            borderRadius: '8px',
            padding: '20px',
            maxWidth: '400px',
            width: '100%',
            position: 'relative',
          },
        }}
      >
        <div>
          <p>
            Oops! Limit ke satu sehat sudah habis, silahkan tambah kuota dengan transfer ke no rekening <strong>1730007993125</strong> bank Mandiri atas nama <strong>Eko Setiaji</strong> sebesar Rp 200.000
          </p>
          <div className="button-container">
            <Button onClick={handleCopyRekening} className="mr-2">
              Copy Nomor Rekening
            </Button>
            <Button onClick={closeModal} style={{ backgroundColor: 'red', color: 'white' }}>
              Close
            </Button>
          </div>
          <div className="max-w-md text-center" style={{ marginTop: '20px' }}>
            <img src={Mandiri} alt="logo mandiri" />
          </div>
        </div>
      </Modal>

    </div>
  );
};

export default SatuSehat;