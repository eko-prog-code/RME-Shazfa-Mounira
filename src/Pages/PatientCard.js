import React from 'react';
import { Link } from 'react-router-dom';
import './PatientCard.css';

const PatientCard = ({ id, index, name, birthDate, isIndexed, emrData, onAddClick, onCheckClick, onDeleteClick, StatusPeriksa }) => {
  return (
    <div className="patient-card">
      <div className="patient-info">
        <p>Index: {index}</p>
        <p>Name: {name}</p>
        <p>ID: {id}</p>
        <p>Birth Date: {birthDate}</p>
        {isIndexed && (
          <div>
            <button
              onClick={onCheckClick}
              className={StatusPeriksa ? 'check-button-checked' : 'check-button'}
              style={{
                width: '60%', // Mengatur lebar tombol menjadi 100%
                height: '40px', // Mengatur tinggi tombol
                marginBottom: '8px', // Menambahkan jarak di bagian bawah setiap tombol
                backgroundColor: StatusPeriksa ? '#25D366' : '#BF00FF', // Warna sesuai kondisi StatusPeriksa
                color: 'white', // Warna teks
              }}
            >
              {StatusPeriksa ? 'Telah Diperiksa' : 'Periksa'}
            </button>
            {/* Tambahkan tombol EMR untuk pasien terindeks */}
            <Link to={`/emr/${id}`}>
              <button
                style={{
                  width: '60%',
                  height: '40px',
                  marginBottom: '8px',
                  backgroundColor: '#007bff',
                  color: 'white',
                }}
              >
                EMR
              </button>
            </Link>
            {/* Tambahkan tombol Delete */}
            <button
              onClick={() => onDeleteClick(id)}
              className="delete-button"
              style={{
                width: '60%',
                height: '40px',
                marginBottom: '8px',
                backgroundColor: 'red',
                color: 'white',
              }}
            >
              Delete
            </button>
          </div>
        )}
        {emrData && <p>EMR Data: {emrData}</p>}
        {!isIndexed && (
          // Hanya render tombol "Add to List" jika pasien belum diindeks
          <button
            onClick={() => onAddClick(id)}
            className="add-to-list-button"
            style={{
              width: '16%',
              height: '40px',
              backgroundColor: '#007bff',
              color: 'white',
            }}
          >
            Add to List
          </button>
        )}
      </div>
    </div>
  );
};

export default PatientCard;
