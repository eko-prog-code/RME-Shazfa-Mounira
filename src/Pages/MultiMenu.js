import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PatientCard from './PatientCard';
import { Link } from 'react-router-dom';
import "./MultiMenu.css"

const MultiMenu = () => {
  const [patientList, setPatientList] = useState([]);
  const [indexedPatientList, setIndexedPatientList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isMenuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    fetchPatientList();
  }, []);

  useEffect(() => {
    const indexedPatients = Array.isArray(patientList)
      ? patientList.filter((patient) => patient.isIndexed).sort((a, b) => a.index - b.index)
      : [];

    setIndexedPatientList(indexedPatients);
  }, [patientList]);

  const fetchPatientList = async () => {
    try {
      const response = await axios.get(
        'https://rme-shazfa-mounira-default-rtdb.firebaseio.com/patients.json'
      );

      if (response.data) {
        const patients = Object.keys(response.data).map((key) => ({
          id: key,
          ...response.data[key],
          isVisible: false,
        }));

        setPatientList(patients);
      } else {
        setPatientList([]); // Set patients to an empty array if there's no data
      }
    } catch (error) {
      console.error('Error fetching patient list:', error);
      setPatientList([]); // Set patients to an empty array in case of an error
    }
  };

  const getNextIndexAndAddPatient = async (patientId) => {
    try {
      // Ambil nomor PatientIndex dari Firebase atau defaultkan ke 0 jika tidak ada
      const currentPatientIndex = await getLastUsedIndex();
      const newPatientIndex = currentPatientIndex + 1;

      const selectedPatient = patientList.find((patient) => patient.id === patientId);

      if (selectedPatient && !selectedPatient.isIndexed) {
        selectedPatient.isIndexed = true;
        selectedPatient.isVisible = true;
        selectedPatient.PatientIndex = newPatientIndex; // Atur nilai PatientIndex di objek yang sudah ada
        selectedPatient.index = newPatientIndex; // Atur nilai index di objek yang sudah ada

        // Simpan data pasien dengan nomor PatientIndex baru ke Firebase
        await axios.put(
          `https://rme-shazfa-mounira-default-rtdb.firebaseio.com/patients/${patientId}.json`,
          selectedPatient
        );

        // Simpan nomor PatientIndex baru ke Firebase
        await updateLastUsedIndex(newPatientIndex);

        // Perbarui indexedPatientList dengan pasien baru
        setIndexedPatientList([...indexedPatientList, selectedPatient]);
      }
    } catch (error) {
      console.error('Error adding patient:', error);
    }
  };


  const handleSearchChange = (e) => {
    const searchTerm = e.target.value;
    setSearchTerm(searchTerm);

    const filteredPatients = patientList.map((patient) => {
      if (patient.name) {
        return {
          ...patient,
          isVisible: searchTerm === '' || patient.name.toLowerCase().includes(searchTerm.toLowerCase()),
        };
      } else {
        return {
          ...patient,
          isVisible: false,
        };
      }
    });

    setPatientList(filteredPatients);
  };

  const toggleSlideDown = () => {
    setMenuOpen(true);
  };

  const toggleSlideUp = () => {
    setMenuOpen(false);
  };

  // Fungsi untuk mendapatkan nomor index terakhir dari Firebase
  const getLastUsedIndex = async () => {
    try {
      const response = await axios.get(
        'https://rme-shazfa-mounira-default-rtdb.firebaseio.com/lastUsedIndex.json'
      );
      return response.data || 0;
    } catch (error) {
      console.error('Error fetching last used index:', error);
      return 0;
    }
  };

  // Fungsi untuk memperbarui nomor index terakhir di Firebase
  const updateLastUsedIndex = async (newIndex) => {
    try {
      await axios.put(
        'https://rme-shazfa-mounira-default-rtdb.firebaseio.com/lastUsedIndex.json',
        newIndex
      );
    } catch (error) {
      console.error('Error updating last used index:', error);
    }
  };

  const deleteAllIndexes = async () => {
    try {
      // Hapus seluruh index pada setiap pasien di Firebase
      const updatedPatients = await Promise.all(
        patientList.map(async (patient) => {
          if (patient.isIndexed) {
            // Hapus properti yang tidak diinginkan
            const { PatientIndex, index, isIndexed, isVisible, ...updatedPatient } = patient;

            // Hapus index pada Firebase
            await axios.put(
              `https://rme-shazfa-mounira-default-rtdb.firebaseio.com/patients/${patient.id}.json`,
              updatedPatient
            );

            return updatedPatient;
          }
          return patient;
        })
      );

      // Hapus variabel lastUsedIndex pada Firebase
      await axios.delete(
        'https://rme-shazfa-mounira-default-rtdb.firebaseio.com/lastUsedIndex.json'
      );

      // Jeda sejenak untuk memastikan pembaruan terbaru
      await new Promise(resolve => setTimeout(resolve, 500));

      // Ambil nilai terbaru lastUsedIndex setelah jeda
      const updatedLastUsedIndex = await getLastUsedIndex();

      console.log("Updated lastUsedIndex after deleting all indexes:", updatedLastUsedIndex);

      // Update state dengan index yang sudah dihapus
      setPatientList(updatedPatients);
      setIndexedPatientList([]);
    } catch (error) {
      console.error('Error deleting all indexes:', error);
    }
  };

  return (
    <div>
      <button onClick={toggleSlideDown} className="button-open">Open</button>
      <button onClick={toggleSlideUp} className="delete-button">Close</button>

      {isMenuOpen && (
        <>
          <input
            type="text"
            placeholder="Search Patient"
            value={searchTerm}
            onChange={handleSearchChange}
            className="input-with-blue-border"
          />

          <button onClick={deleteAllIndexes} className="delete-button">
            Delete All Index
          </button>

          {searchTerm && (
            <div>
              <h2>Filtered Patients</h2>
              {patientList
                .filter((patient) => !patient.isIndexed && patient.isVisible)
                .map((patient) => (
                  <PatientCard
                    key={patient.id}
                    {...patient}
                    isIndexed={patient.isIndexed}
                    emrData={patient.emr}
                    onAddClick={() => getNextIndexAndAddPatient(patient.id)}
                  />
                ))}
            </div>
          )}

          <div>
            <h2>Indexed Patients</h2>
            {indexedPatientList.map((patient, index) => (
              <PatientCard
                key={patient.id}
                {...patient}
                index={index + 1}
                emrData={patient.emr}
                onAddClick={() => getNextIndexAndAddPatient(patient.id)}
              />
            ))}
          </div>

        </>
      )}
    </div>
  );
};

export default MultiMenu;
