import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const ConditionForm = ({ datas }) => {
  const [encounterId, setEncounterId] = useState(null);
  const [date, setDate] = useState(null);
  const [participant, setParticipant] = useState([]);
  const [patient, setPatient] = useState(null);
  const [ihsPatient, setIhsPatient] = useState(null);

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
  return (
    <>
      <Link to={"/satusehat"}>
        <button
          className=" text-white bg-[#2196F3] border-0 rounded-md py-2 px-5 focus:outline-none hover:bg-2196F3 text-sm"
          type="submit"
        >
          Back
        </button>
      </Link>
      <p className="text-center">encounter id: {encounterId}</p>
      <p className="text-center">observation: {datas.observation}</p>
      <p className="text-center">patient name: {patient}</p>
      <p className="text-center">patient id: {ihsPatient}</p>
      <p className="text-center">date: {date}</p>

      <ul className="text-center">
        {participant.map((datas, index) => (
          <li key={index}>
            <strong>Name:</strong> {datas.individual.display}
            <br />
            <strong>Reference:</strong> {datas.individual.reference}
            <br />
          </li>
        ))}
      </ul>
    </>
  );
};

export default ConditionForm;
