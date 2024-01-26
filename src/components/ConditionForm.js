import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./ConditionForm.css";

const ConditionForm = ({ datas }) => {
  const [encounterId, setEncounterId] = useState(null);
  const [date, setDate] = useState(null);
  const [participant, setParticipant] = useState([]);
  const [patient, setPatient] = useState(null);
  const [ihsPatient, setIhsPatient] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedDataString = localStorage.getItem("encounter");

    if (storedDataString) {
      const storedData = JSON.parse(storedDataString);

      setEncounterId(storedData.data.id);
      setDate(storedData.data.period.start);
      setParticipant(storedData.data.participant);
      setPatient(storedData.data.subject.display);
      setIhsPatient(storedData.data.subject.reference);
      console.log("Retrieved data from local storage:", storedData);
    } else {
      console.error("No data found in local storage.");
    }
  }, []);

  const initialFormData = {
    resourceType: "Condition",
    clinicalStatus: {
      coding: [
        {
          system: "http://terminology.hl7.org/CodeSystem/condition-clinical",
          code: "active",
          display: "Active",
        },
      ],
    },
    category: [
      {
        coding: [
          {
            system: "http://terminology.hl7.org/CodeSystem/condition-category",
            code: "encounter-diagnosis",
            display: "Encounter Diagnosis",
          },
        ],
      },
    ],
    code: {
      coding: [
        {
          system: "http://hl7.org/fhir/sid/icd-10",
          code: datas.codeICD,
          display: datas.dx,
        },
      ],
    },
    subject: {
      reference: `Patient/${ihsPatient}`, // Updated to use ihsPatient
      display: patient,
    },
    encounter: {
      reference: `Encounter/${encounterId}`, // Updated to use encounterId
    },
    onsetDateTime: date, // Updated to use date
    recordedDate: date, // Updated to use date
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    fetchTokenFromFirebase()
      .then((res) => saveData(res))
      .catch((err) => console.log(err));
  };

  const [accessToken, setAccessToken] = useState(null);

  const fetchTokenFromFirebase = async () => {
    try {
      const firebaseTokenUrl =
        "https://rme-shazfa-mounira-default-rtdb.firebaseio.com/token.json";
      const response = await axios.get(firebaseTokenUrl);
      const tokenFromFirebase = response.data.token;

      if (tokenFromFirebase) {
        console.log("Token dari Firebase:", tokenFromFirebase);
        setAccessToken(tokenFromFirebase);
      } else {
        console.error("Token tidak ditemukan dari Firebase.");
        return null;
      }
    } catch (error) {
      console.error("Error fetching access token from Firebase:", error);
      return null;
    }
  };

  const saveData = async () => {
    const postConditionEndpoint =
      "https://shazfabe.cyclic.app/forward-request-condition";

    const data = {
      resourceType: "Condition",
      clinicalStatus: {
        coding: [
          {
            system: "http://terminology.hl7.org/CodeSystem/condition-clinical",
            code: "active",
            display: "Active",
          },
        ],
      },
      category: [
        {
          coding: [
            {
              system:
                "http://terminology.hl7.org/CodeSystem/condition-category",
              code: "encounter-diagnosis",
              display: "Encounter Diagnosis",
            },
          ],
        },
      ],
      code: {
        coding: [
          {
            system: "http://hl7.org/fhir/sid/icd-10",
            code: datas.codeICD,
            display: datas.dx,
          },
        ],
      },
      subject: {
        reference: `Patient/${ihsPatient}`, // Updated to use ihsPatient
        display: patient,
      },
      encounter: {
        reference: `Encounter/${encounterId}`, // Updated to use encounterId
      },
      onsetDateTime: date, // Updated to use date
      recordedDate: date, // Updated to use date
    };

    setLoading(true);
    axios
      .post(postConditionEndpoint, data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        console.log("data: ", res);
        localStorage.setItem("condition", JSON.stringify(data));
      })
      .catch((err) => console.error("Gagal mengirim data:", err.response))
      .finally(() => setLoading(false));
  };

  return (
    <div className="card-container">
      <div className="glow-card">
        <Link to={"/satusehat"}>
          <button className="back-button">Back</button>
        </Link>
        <h1>Condition Page</h1>
        <p className="info-text">Encounter ID: {encounterId}</p>

        <p className="info-text left-align-text">Patient Name: {patient}</p>
        <p className="info-text left-align-text">Patient ID: {ihsPatient}</p>
        <p className="info-text left-align-text">Code ICD: {initialFormData.code.coding[0].code}</p>
        <p className="info-text left-align-text">Dx Medis: {initialFormData.code.coding[0].display}</p>
        <p className="info-text left-align-text">Date: {date}</p>

        <ul className="participant-list left-align-text">
          {participant.map((datas, index) => (
            <li key={index}>
              <strong>Name:</strong> {datas.individual.display}
              <br />
              <strong>Reference:</strong> {datas.individual.reference}
              <br />
            </li>
          ))}
        </ul>

        <button
          className="submit-button"
          onClick={handleSubmit}
          disabled={loading}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default ConditionForm;
