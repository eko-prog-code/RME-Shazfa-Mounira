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
  const [ihsIdpatient, setIhsIdpatient] = useState("");
  const [loading, setLoading] = useState(false);

useEffect(() => {
  const storedDataString = localStorage.getItem("encounter");

  if (storedDataString) {
    const storedData = JSON.parse(storedDataString);

    setEncounterId(storedData.data.id);
    setDate(storedData.data.period.start);
    setParticipant(storedData.data.participant);
    setPatient(storedData.data.subject.display);

    // Set ihsPatient only if it's available in the stored data
    if (storedData.data.subject.reference) {
      setIhsPatient(storedData.data.subject.reference);
    }

    console.log("Retrieved data from local storage:", storedData);
  } else {
    console.error("No data found in local storage.");
  }
}, []);


  const ihsPatientReference = ihsPatient && ihsPatient.startsWith("Patient/") ? `Patient/${ihsPatient.split('/')[2]}` : '';

if (!ihsPatientReference) {
  console.error("Error: ihsPatientReference is undefined or has an unexpected format.");
}


  const initialFormData = {
  resourceType: "Condition",
  subjectReference: ihsIdpatient,
  patientNik: datas.patientNIK,
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
    reference: ihsPatientReference,
    display: patient,
  },
  encounter: {
    reference: `Encounter/${encounterId}`,
  },
  onsetDateTime: date,
  recordedDate: date,
  identifierSystem: "http://sys-ids.kemkes.go.id/encounter/dfd92855-8cec-4a10-be94-8edd8a097344",
  identifierValue: ihsIdpatient,
  participantReference: ihsId, // Assign ihsId here
  participantDisplay: datas.participant,
  // Add other form fields as needed
};

  useEffect(() => {
    handleGetIHSpatient();
  }, []);


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
              "system": "http://terminology.hl7.org/CodeSystem/condition-category",
              "code": "encounter-diagnosis",
              "display": "Encounter Diagnosis",
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
       reference: initialFormData.subjectReference,
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

  const handleGetIHSpatient = async () => {
    try {
      if (!initialFormData.patientNik) {
        console.error("Error: patientNik is not defined in formData");
        return;
      }

      const tokenResponse = await axios.get(
        "https://shazfabe.cyclic.app/getIHSpatient?identifier=" +
          initialFormData.patientNik
      );
      const accessToken = tokenResponse.data.accessToken;

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      };

      const apiUrl = `https://shazfabe.cyclic.app/getIHSpatient?identifier=${initialFormData.patientNik}`;

      const response = await axios.get(apiUrl, { headers });
      const data = response.data;

      if (data.success) {
        setIhsIdpatient(data.ihsIdpatient);
      } else {
        console.error("Error getting IHS Patient:", data.error);
        throw new Error("Error getting IHS Patient");
      }
    } catch (error) {
      console.error("Error getting or setting IHS Patient:", error);
      throw error; // Propagate the error to saveData
    }
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
