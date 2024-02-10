// PatientCard.js

import React from 'react';
import { Link } from 'react-router-dom'; // Import the Link component
import './PatientCard.css';

const PatientCard = ({ id, index, name, birthDate, isIndexed, emrData, onAddClick }) => {
  return (
    <div className="patient-card">
      <div className="patient-info">
        <p>Index: {index}</p>
        <p>Name: {name}</p>
        <p>ID: {id}</p>
        <p>Birth Date: {birthDate}</p>
        {isIndexed && <p>Status: Indexed</p>}
        {emrData && <p>EMR Data: {emrData}</p>}
        {!isIndexed && (
          <button onClick={onAddClick}>Add to List</button>
        )}
        {isIndexed && (
          // Place the Link component for the "EMR" button
          <Link to={`/emr/${id}`}>
            <button>EMR</button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default PatientCard;
