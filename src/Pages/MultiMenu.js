import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './MultiMenu.css';
import PatientCard from './PatientCard';

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
          isChecked: false,
          StatusPeriksa: false, // Added StatusPeriksa
        }));

        setPatientList(patients);
      } else {
        setPatientList([]);
      }
    } catch (error) {
      console.error('Error fetching patient list:', error);
      setPatientList([]);
    }
  };

  const toggleCheckStatus = async (patientId) => {
    try {
      const updatedPatients = patientList.map((patient) => {
        if (patient.id === patientId) {
          return {
            ...patient,
            isChecked: !patient.isChecked,
            StatusPeriksa: !patient.StatusPeriksa,
          };
        }
        return patient;
      });

      const selectedPatient = updatedPatients.find((patient) => patient.id === patientId);

      await axios.put(
        `https://rme-shazfa-mounira-default-rtdb.firebaseio.com/patients/${patientId}.json`,
        {
          ...selectedPatient,
        }
      );

      setPatientList(updatedPatients);
    } catch (error) {
      console.error('Error toggling check status:', error);
    }
  };

  const handleAddToListClick = async (patientId) => {
    console.log('Handle Add Clicked');
    try {
      const currentPatientIndex = await getLastUsedIndex();
      const newPatientIndex = currentPatientIndex + 1;

      const selectedPatient = patientList.find((patient) => patient.id === patientId);

      if (selectedPatient && !selectedPatient.isIndexed) {
        selectedPatient.isIndexed = true;
        selectedPatient.isVisible = true;
        selectedPatient.PatientIndex = newPatientIndex;
        selectedPatient.index = newPatientIndex;
        selectedPatient.StatusPeriksa = false; // Tambahkan StatusPeriksa dengan nilai false

        await axios.put(
          `https://rme-shazfa-mounira-default-rtdb.firebaseio.com/patients/${patientId}.json`,
          selectedPatient
        );

        await updateLastUsedIndex(newPatientIndex);

        setIndexedPatientList([...indexedPatientList, selectedPatient]);
      }
    } catch (error) {
      console.error('Error adding patient to list:', error);
    }
  };


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
    // Menampilkan konfirmasi sebelum menghapus semua indeks
    const isConfirmed = window.confirm("Apakah Anda Yakin akan menghapus Data ini?");

    if (isConfirmed) {
      try {
        const updatedPatients = await Promise.all(
          patientList.map(async (patient) => {
            if (patient.isIndexed) {
              const { PatientIndex, index, isIndexed, isVisible, StatusPeriksa, isChecked, ...updatedPatient } = patient;

              await axios.put(
                `https://rme-shazfa-mounira-default-rtdb.firebaseio.com/patients/${patient.id}.json`,
                updatedPatient
              );

              return updatedPatient;
            }
            return patient;
          })
        );

        await axios.delete(
          'https://rme-shazfa-mounira-default-rtdb.firebaseio.com/lastUsedIndex.json'
        );

        await new Promise((resolve) => setTimeout(resolve, 500));

        const updatedLastUsedIndex = await getLastUsedIndex();

        console.log(
          'Updated lastUsedIndex after deleting all indexes:',
          updatedLastUsedIndex
        );

        setPatientList(updatedPatients);
        setIndexedPatientList([]);
      } catch (error) {
        console.error('Error deleting all indexes:', error);
      }
    }
  };

  const handleDeleteClick = async (patientId) => {
    // Menampilkan konfirmasi sebelum menghapus indeks tertentu
    const isConfirmed = window.confirm("Apakah Anda Yakin akan menghapus Data ini?");

    if (isConfirmed) {
      try {
        const updatedPatients = await Promise.all(
          patientList.map(async (patient) => {
            if (patient.id === patientId && patient.isIndexed) {
              const { PatientIndex, index, isIndexed, isVisible, StatusPeriksa, isChecked, ...updatedPatient } = patient;

              await axios.put(
                `https://rme-shazfa-mounira-default-rtdb.firebaseio.com/patients/${patientId}.json`,
                updatedPatient
              );

              return updatedPatient;
            }
            return patient;
          })
        );

        setPatientList(updatedPatients);
      } catch (error) {
        console.error('Error deleting indexed patient:', error);
      }
    }
  };


  const handleSearchChange = (e) => {
    const searchTerm = e.target.value;
    setSearchTerm(searchTerm);

    const filteredPatients = patientList.map((patient) => {
      if (patient.name) {
        return {
          ...patient,
          isVisible:
            searchTerm === '' ||
            patient.name.toLowerCase().includes(searchTerm.toLowerCase()),
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

  return (
    <div>
      <button onClick={toggleSlideDown} className="button-open">
        Open
      </button>
      <button onClick={toggleSlideUp} className="delete-button">
        Close
      </button>

      {isMenuOpen && (
        <>
          <input
            type="text"
            placeholder="Search Patient"
            value={searchTerm}
            onChange={handleSearchChange}
            className="input-with-blue-border rounded-full ml-16 mr-16"
            style={{ width: '850px' }}
          />

          <div>
          <button onClick={deleteAllIndexes} className="delete-button">
            Delete All Index
          </button>
          </div>

          {searchTerm && (
            <div>
              <h2>Filtered Patients</h2>
              {patientList
                .filter((patient) => !patient.isIndexed && patient.isVisible)
                .map((patient) => (
                  <PatientCard
                    key={patient.id}
                    {...patient}
                    onAddClick={handleAddToListClick}
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
                onCheckClick={() => toggleCheckStatus(patient.id)}
                onDeleteClick={handleDeleteClick}
              />
            ))}
          </div>

        </>
      )}
    </div>
  );
};

export default MultiMenu;
