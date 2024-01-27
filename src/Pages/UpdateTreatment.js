import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';
import { useDropzone } from 'react-dropzone';
import './UpdateTreatment.css';

const UpdateTreatment = () => {
  const { id, treatmentId } = useParams();
  const [treatmentData, setTreatmentData] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [updatedTreatmentData, setUpdatedTreatmentData] = useState({
    complaint: '',
    condition_physical_examination: '',
    Medication: '',
    diagnosis: '',
    participant: '',
    images: [],
    Encounter_period_start: '', // Ganti properti
    systolicBloodPressure: '',
    diastolicBloodPressure: '',
    heartRate: '',
    bodyTemperature: '',
    respiratoryRate: '',
  });
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const navigate = useNavigate();
  const [doctorNIK, setDoctorNIK] = useState('');
  const [icdData, setIcdData] = useState([]);
  const [filteredIcdData, setFilteredIcdData] = useState([]);
  const [diagnosis, setDiagnosis] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [initialDiagnosis, setInitialDiagnosis] = useState('');
  const [diagnosisData, setDiagnosisData] = useState([]);

  useEffect(() => {
    const predefinedIcdData = [
      { code: 'A00', name: 'Cholera' },
      { code: 'A00.0', name: 'Cholera due to vibrio cholerae 01, biovar cholerae' },
      { code: 'A00.1', name: 'Cholera due to vibrio cholerae 01, biovar eltor' },
      { code: 'A00.9', name: 'Cholera, unspecified' },
      { code: 'A01', name: 'Typhoid and paratyphoid fevers' },
      { code: 'A01.0', name: 'Typhoid fever' },
      { code: 'A01.1', name: 'Paratyphoid fever a' },
      { code: 'A01.2', name: 'Paratyphoid fever b' },
      { code: 'A01.3', name: 'Paratyphoid fever c' },
      { code: 'A01.4', name: 'Paratyphoid fever, unspecified' },
      { code: 'A02', name: 'Other salmonella infections' },
      { code: 'A02.0', name: 'Salmonella enteritis' },
      { code: 'A02.1', name: 'Salmonella septicaemia' },
      { code: 'A02.2', name: 'Localized salmonella infections' },
      { code: 'A02.8', name: 'Other specified salmonella infections' },
      { code: 'A02.9', name: 'Salmonella infection, unspecified' },
      { code: 'A03', name: 'Shigellosis' },
      { code: 'A03.0', name: 'Shigellosis due to shigella dysenteriae' },
      { code: 'A03.1', name: 'Shigellosis due to shigella flexneri' },
      { code: 'A03.2', name: 'Shigellosis due to shigella boydii' },
      { code: 'A03.3', name: 'Shigellosis due to shigella sonnei' },
      { code: 'A03.8', name: 'Other shigellosis' },
      { code: 'A03.9', name: 'Shigellosis, unspecified' },
      { code: 'A04', name: 'Other bacterial intestinal infections' },
      { code: 'A04.0', name: 'Enteropathogenic escherichia coli infection' },
      { code: 'A04.1', name: 'Enterotoxigenic escherichia coli infection' },
      { code: 'A04.2', name: 'Enteroinvasive escherichia coli infection' },
      { code: 'A04.3', name: 'Enterohaemorrhagic escherichia coli infection' },
      { code: 'A04.4', name: 'Other intestinal escherichia coli infections' },
      { code: 'A04.5', name: 'Campylobacter enteritis' },
      { code: 'A04.6', name: 'Enteritis due to yersinia enterocolitica' },
      { code: 'A04.7', name: 'Enterocolitis due to clostridium difficile' },
      { code: 'A04.8', name: 'Other specified bacterial intestinal infections' },
      { code: 'A04.9', name: 'Bacterial intestinal infection, unspecified' },
      { code: 'A05', name: 'Other bacterial foodborne intoxications, not elsewhere classified' },
      { code: 'A05.0', name: 'Foodborne staphylococcal intoxication' },
      { code: 'A05.1', name: 'Botulism' },
      { code: 'A05.2', name: 'Foodborne clostridium perfringens intoxication' },
      { code: 'A05.3', name: 'Foodborne vibrio parahaemolyticus intoxication' },
      { code: 'A05.4', name: 'Foodborne bacillus cereus intoxication' },
      { code: 'A05.8', name: 'Other specified bacterial foodborne intoxications' },
      { code: 'A05.9', name: 'Bacterial foodborne intoxication, unspecified' },
      { code: 'A06', name: 'Amoebiasis' },
      { code: 'A06.0', name: 'Acute amoebic dysentery' },
      { code: 'A06.1', name: 'Chronic intestinal amoebiasis' },
      { code: 'A06.2', name: 'Amoebic nondysenteric colitis' },
      { code: 'A06.3', name: 'Amoeboma of intestine' },
      { code: 'A06.4', name: 'Amoebic liver abscess' },
      { code: 'A06.5', name: 'Amoebic lung abscess' },
      { code: 'A06.6', name: 'Amoebic brain abscess' },
      { code: 'A06.7', name: 'Cutaneous amoebiasis' },
      { code: 'A06.8', name: 'Amoebic infection of other sites' },
      { code: 'A06.9', name: 'Amoebiasis, unspecified' },
      { code: 'A07', name: 'Other protozoal intestinal diseases' },
      { code: 'A07.0', name: 'Balantidiasis' },
      { code: 'A07.1', name: 'Giardiasis [lambliasis]' },
      { code: 'A07.2', name: 'Cryptosporidiosis' },
      { code: 'A07.3', name: 'Isosporiasis' },
      { code: 'A07.8', name: 'Other specified protozoal intestinal diseases' },
      { code: 'A07.9', name: 'Protozoal intestinal disease, unspecified' },
      { code: 'A08', name: 'Viral and other specified intestinal infections' },
      { code: 'A08.0', name: 'Rotaviral enteritis' },
      { code: 'A08.1', name: 'Acute gastroenteropathy due to norwalk agent' },
      { code: 'A08.2', name: 'Adenoviral enteritis' },
      { code: 'A08.3', name: 'Other viral enteritis' },
      { code: 'A08.4', name: 'Viral intestinal infection, unspecified' },
      { code: 'A08.5', name: 'Other specified intestinal infections' },
      { code: 'A09', name: 'Diarrhoea and gastroenteritis of presumed infectious origin' },
      { code: 'A09.0', name: 'Other and unspecified gastroenteritis and colitis of infectious origin' },
      { code: 'A09.9', name: 'Gastroenteritis and colitis of unspecified origin' },
      { code: 'A15', name: 'Respiratory tuberculosis, bacteriologically and histologically confirmed' },
      { code: 'A15.0', name: 'Tb lung confirm sputum microscopy with or without culture' },
      { code: 'A15.1', name: 'Tuberculosis of lung, confirmed by culture only' },
      { code: 'A15.2', name: 'Tuberculosis of lung, confirmed histologically' },
      { code: 'A15.3', name: 'Tuberculosis of lung, confirmed by unspecified means' },
      { code: 'A15.4', name: 'Tb intrathoracic lymph nodes confirm bact histologically' },
      { code: 'A15.5', name: 'Tuberculosis of larynx, trachea & bronchus conf bact/hist`y' },
      { code: 'A15.6', name: 'Tuberculous pleurisy, conf bacteriologically/his`y' },
      { code: 'A15.7', name: 'Primary respiratory tb confirm bact and histologically' },
      { code: 'A15.8', name: 'Other respiratory tb confirm bact and histologically' },
      { code: 'A15.9', name: 'Respiratory tb unspec confirm bact and histologically' },
      { code: 'A16', name: 'Respiratory tuberculosis, not confirmed bacteriologically or histologically' },
      { code: 'A16.0', name: 'Tuberculosis of lung, bacteriologically & histolog`y neg' },
      { code: 'A16.1', name: 'Tuberculosis lung bact and histological examin not done' },
      { code: 'A16.2', name: 'Tb lung without mention of bact or histological confirm' },
      { code: 'A16.3', name: 'Tb intrathoracic lymph node without bact or hist confirm' },
      { code: 'A16.4', name: 'Tb larynx trachea and bronchus without bact or hist confirm' },
      { code: 'A16.5', name: 'Tb pleurisy without mention of bact or histological confirm' },
      { code: 'A16.7', name: 'Prim respiratory tb without mention of bact or hist confirm' },
      { code: 'A16.8', name: 'Oth respiratory tb without mention of bact or hist confirm' },
      { code: 'A16.9', name: 'Resp tb unspec without mention of bact or hist confirm' },
      { code: 'A17', name: 'Tuberculosis of nervous system' },
      { code: 'A17.0', name: 'Tuberculous meningitis' },
      { code: 'A17.1', name: 'Meningeal tuberculoma' },
      { code: 'A17.8', name: 'Other tuberculosis of nervous system' },
      { code: 'A17.9', name: 'Tuberculosis of nervous system unspecified' },
      { code: 'A18', name: 'Tuberculosis of other organs' },
      { code: 'A18.0', name: 'Tuberculosis of bones and joints' },
      { code: 'A18.1', name: 'Tuberculosis of genitourinary system' },
      { code: 'A18.2', name: 'Tuberculous peripheral lymphadenopathy' },
      { code: 'A18.3', name: 'Tuberculosis of intestines, peritoneum and mesenteric glands' },
      { code: 'A18.4', name: 'Tuberculosis of skin and subcutaneous tissue' },
      { code: 'A18.5', name: 'Tuberculosis of eye' },
      { code: 'A18.6', name: 'Tuberculosis of ear' },
      { code: 'A18.7', name: 'Tuberculosis of adrenal glands' },
      { code: 'A18.8', name: 'Tuberculosis of other specified organs' },
      { code: 'A19', name: 'Miliary tuberculosis' },
      { code: 'A19.0', name: 'Acute miliary tuberculosis of a single specified site' },
      { code: 'A19.1', name: 'Acute miliary tuberculosis of multiple sites' },
      { code: 'A19.2', name: 'Acute miliary tuberculosis, unspecified' },
      { code: 'A19.8', name: 'Other miliary tuberculosis' },
      { code: 'A19.9', name: 'Miliary tuberculosis, unspecified' },
      { code: 'A20', name: 'Plague' },
      { code: 'A20.0', name: 'Bubonic plague' },
      { code: 'A20.1', name: 'Cellulocutaneous plague' },
      { code: 'A20.2', name: 'Pneumonic plague' },
      { code: 'A20.3', name: 'Plague meningitis' },
      { code: 'A20.7', name: 'Septicaemic plague' },
      { code: 'A20.8', name: 'Other forms of plague' },
      { code: 'A18.2', name: 'Tuberculous peripheral lymphadenopathy' },
      { code: 'A18.3', name: 'Tuberculosis of intestines, peritoneum and mesenteric glands' },
      { code: 'A18.4', name: 'Tuberculosis of skin and subcutaneous tissue' },
      { code: 'A18.5', name: 'Tuberculosis of eye' },
      { code: 'A18.6', name: 'Tuberculosis of ear' },
      { code: 'A18.7', name: 'Tuberculosis of adrenal glands' },
      { code: 'A18.8', name: 'Tuberculosis of other specified organs' },
      { code: 'A19', name: 'Miliary tuberculosis' },
      { code: 'A19.0', name: 'Acute miliary tuberculosis of a single specified site' },
      { code: 'A19.1', name: 'Acute miliary tuberculosis of multiple sites' },
      { code: 'A19.2', name: 'Acute miliary tuberculosis, unspecified' },
      { code: 'A19.8', name: 'Other miliary tuberculosis' },
      { code: 'A19.9', name: 'Miliary tuberculosis, unspecified' },
      { code: 'A20', name: 'Plague' },
      { code: 'A20.0', name: 'Bubonic plague' },
      { code: 'A20.1', name: 'Cellulocutaneous plague' },
      { code: 'A20.2', name: 'Pneumonic plague' },
      { code: 'A20.3', name: 'Plague meningitis' },
      { code: 'A20.7', name: 'Septicaemic plague' },
      { code: 'A20.8', name: 'Other forms of plague' },
      { code: 'A23.3', name: 'Brucellosis due to brucella canis' },
      { code: 'A23.8', name: 'Other brucellosis' },
      { code: 'A23.9', name: 'Brucellosis, unspecified' },
      { code: 'A24', name: 'Glanders and melioidosis' },
      { code: 'A24.0', name: 'Glanders' },
      { code: 'A24.1', name: 'Acute and fulminating melioidosis' },
      { code: 'A24.2', name: 'Subacute and chronic melioidosis' },
      { code: 'A24.3', name: 'Other melioidosis' },
      { code: 'A24.4', name: 'Melioidosis, unspecified' },
      { code: 'A25', name: 'Rat-bite fevers' },
      { code: 'A25.0', name: 'Spirillosis' },
      { code: 'A25.1', name: 'Streptobacillosis' },
      { code: 'A25.9', name: 'Rat-bite fever, unspecified' },
      { code: 'A26', name: 'Erysipeloid' },
      { code: 'A26.0', name: 'Cutaneous erysipeloid' },
      { code: 'A26.7', name: 'Erysipelothrix septicaemia' },
      { code: 'A26.8', name: 'Other forms of erysipeloid' },
      { code: 'A26.9', name: 'Erysipeloid, unspecified' },
      { code: 'A27', name: 'Leptospirosis' },
      { code: 'A27.0', name: 'Leptospirosis icterohaemorrhagica' },
      { code: 'A27.8', name: 'Other forms of leptospirosis' },
      { code: 'A27.9', name: 'Leptospirosis, unspecified' },
      { code: 'A28', name: 'Other zoonotic bacterial diseases, not elsewhere classified' },
      { code: 'A28.0', name: 'Pasteurellosis' },
      { code: 'A28.1', name: 'Cat-scratch disease' },
      { code: 'A28.2', name: 'Extraintestinal yersiniosis' },
      { code: 'A28.8', name: 'Other specified zoonotic bacterial diseases nec' },
      { code: 'A28.9', name: 'Zoonotic bacterial disease, unspecified' },
      { code: 'A30', name: 'Leprosy [Hansen disease]' },
      { code: 'A30.0', name: 'Indeterminate leprosy' },
      { code: 'A30.1', name: 'Tuberculoid leprosy' },
      { code: 'A30.2', name: 'Borderline tuberculoid leprosy' },
      { code: 'A30.3', name: 'Borderline leprosy' },
      { code: 'A30.4', name: 'Borderline lepromatous leprosy' },
      { code: 'A30.5', name: 'Lepromatous leprosy' },
      { code: 'A30.8', name: 'Other forms of leprosy' },
      { code: 'A30.9', name: 'Leprosy, unspecified' },
      { code: 'A31', name: 'Infection due to other mycobacteria' },
      { code: 'A31.0', name: 'Pulmonary mycobacterial infection' },
      { code: 'A31.1', name: 'Cutaneous mycobacterial infection' },
      { code: 'A31.8', name: 'Other mycobacterial infections' },
      { code: 'A31.9', name: 'Mycobacterial infection, unspecified' },
      { code: 'A32', name: 'Listeriosis' },
      { code: 'A32.0', name: 'Cutaneous listeriosis' },
      { code: 'A32.1', name: 'Listerial meningitis and meningoencephalitis' },
      { code: 'A32.7', name: 'Listerial septicaemia' },
      { code: 'A32.8', name: 'Other forms of listeriosis' },
      { code: 'A32.9', name: 'Listeriosis, unspecified' },
      { code: 'A33', name: 'Tetanus neonatorum' },
      { code: 'A34', name: 'Obstetrical tetanus' },
      { code: 'A35', name: 'Other tetanus' },
      { code: 'A36', name: 'Diphtheria' },
      { code: 'A36.0', name: 'Pharyngeal diphtheria' },
      { code: 'A36.1', name: 'Nasopharyngeal diphtheria' },
      { code: 'A36.2', name: 'Laryngeal diphtheria' },
      { code: 'A36.3', name: 'Cutaneous diphtheria' },
      { code: 'A36.8', name: 'Other diphtheria' },
      { code: 'A36.9', name: 'Diphtheria, unspecified' },
      { code: 'A37', name: 'Whooping cough' },
      { code: 'A37.0', name: 'Whooping cough due to bordetella pertussis' },
      { code: 'A37.1', name: 'Whooping cough due to bordetella parapertussis' },
      { code: 'A37.8', name: 'Whooping cough due to other bordetella species' },
      { code: 'A37.9', name: 'Whooping cough, unspecified' },
      { code: 'A38', name: 'Scarlet fever' },
      { code: 'A39', name: 'Meningococcal infection' },
      { code: 'A39.0', name: 'Meningococcal meningitis' },
      { code: 'A39.1', name: 'Waterhouse-Friderichsen syndrome' },
      { code: 'A39.2', name: 'Acute meningococcaemia' },
      { code: 'A39.3', name: 'Chronic meningococcaemia' },
      { code: 'A39.4', name: 'Meningococcaemia, unspecified' },
      { code: 'A39.5', name: 'Meningococcal heart disease' },
      { code: 'A39.8', name: 'Other meningococcal infections' },
      { code: 'A39.9', name: 'Meningococcal infection, unspecified' },
      { code: 'A40', name: 'Streptococcal sepsis' },
      { code: 'A40.0', name: 'Septicaemia due to streptococcus, group A' },
      { code: 'A40.1', name: 'Septicaemia due to streptococcus, group B' },
      { code: 'A40.2', name: 'Septicaemia due to streptococcus, group D' },
      { code: 'A40.3', name: 'Septicaemia due to streptococcus pneumoniae' },
      { code: 'A40.8', name: 'Other streptococcal septicaemia' },
      { code: 'A40.9', name: 'Streptococcal septicaemia, unspecified' },
      { code: 'A41', name: 'Other sepsis' },
      { code: 'A41.0', name: 'Septicaemia due to Staphylococcus aureus' },
      { code: 'A41.1', name: 'Septicaemia due to other specified Staphylococcus' },
      { code: 'A41.2', name: 'Septicaemia due to unspecified Staphylococcus' },
      { code: 'A41.3', name: 'Septicaemia due to Haemophilus influenzae' },
      { code: 'A41.4', name: 'Septicaemia due to anaerobes' },
      { code: 'A41.5', name: 'Septicaemia due to other gram-negative organisms' },
      { code: 'A41.8', name: 'Other specified septicaemia' },
      { code: 'A41.9', name: 'Septicaemia, unspecified' },
      { code: 'A42', name: 'Actinomycosis' },
      { code: 'A42.0', name: 'Pulmonary actinomycosis' },
      { code: 'A42.1', name: 'Abdominal actinomycosis' },
      { code: 'A42.2', name: 'Cervicofacial actinomycosis' },
      { code: 'A42.7', name: 'Actinomycotic septicaemia' },
      { code: 'A42.8', name: 'Other forms of actinomycosis' },
      { code: 'A42.9', name: 'Actinomycosis, unspecified' },
      { code: 'A43', name: 'Nocardiosis' },
      { code: 'A43.0', name: 'Pulmonary nocardiosis' },
      { code: 'A43.1', name: 'Cutaneous nocardiosis' },
      { code: 'A43.8', name: 'Other forms of nocardiosis' },
      { code: 'A43.9', name: 'Nocardiosis, unspecified' },
      { code: 'A44', name: 'Bartonellosis' },
      { code: 'A44.0', name: 'Systemic bartonellosis' },
      { code: 'A44.1', name: 'Cutaneous and mucocutaneous bartonellosis' },
      { code: 'A44.8', name: 'Other forms of bartonellosis' },
      { code: 'A44.9', name: 'Bartonellosis, unspecified' },
      { code: 'A46', name: 'Erysipelas' },
      { code: 'A48', name: 'Other bacterial diseases, not elsewhere classified' },
      { code: 'A48.0', name: 'Gas gangrene' },
      { code: 'A48.1', name: "Legionnaires' disease" },
      { code: 'A48.2', name: "Nonpneumonic legionnaires' disease [pontiac fever]" },
      { code: 'A48.3', name: 'Toxic shock syndrome' },
      { code: 'A48.4', name: 'Brazilian purpuric fever' },
      { code: 'A48.8', name: 'Other specified bacterial diseases' },
      { code: 'A49', name: 'Bacterial infection of unspecified site' },
      { code: 'A49.0', name: 'Staphylococcal infection, unspecified' },
      { code: 'A49.1', name: 'Streptococcal infection, unspecified' }
      // ... (predefined codes and names)
    ];

    setIcdData(predefinedIcdData);
  }, []);

  useEffect(() => {
    const doctorNIKData = {
      'dr. Yohanes hendra budi santoso': '3215131301790004',
      'dr. yesi novia Ambarani': '3205155812920006',
      'Practitioner 1': '7209061211900001',
      // ... (add NIK for other doctors if needed)
    };

    setDoctorNIK(doctorNIKData[updatedTreatmentData.participant]);

    // Define the 'doctors' array
    const doctorsArray = ['dr. Yohanes hendra budi santoso', 'dr. yesi novia Ambarani', 'Practitioner 1'];
    setDoctors(doctorsArray); // Add this line to set the 'doctors' state

  }, [updatedTreatmentData.participant]);


  useEffect(() => {
    axios
      .get(`https://rme-shazfa-mounira-default-rtdb.firebaseio.com/patients/${id}/medical_records/${treatmentId}.json`)
      .then((response) => {
        setTreatmentData(response.data);
        const timestamp = format(new Date(), "yyyy-MM-dd'T'HH:mm:ss");
        setUpdatedTreatmentData({
          complaint: response.data.complaint || '',
          condition_physical_examination: response.data.condition_physical_examination || '',
          Medication: response.data.Medication || '',
          diagnosis: response.data.diagnosis || '',
          participant: response.data.participant || '',
          images: response.data.images || [],
          Encounter_period_start: timestamp,
          systolicBloodPressure: response.data.systolicBloodPressure || '',
          diastolicBloodPressure: response.data.diastolicBloodPressure || '',
          heartRate: response.data.heartRate || '',
          bodyTemperature: response.data.bodyTemperature || '',
          respiratoryRate: response.data.respiratoryRate || '',
        });
      })
      .catch((error) => {
        console.error('Error fetching treatment data:', error);
      });
  }, [id, treatmentId]);

  useEffect(() => {
    const doctorNIKData = {
      'dr. Yohanes hendra budi santoso': '3215131301790004',
      'dr. yesi novia Ambarani': '3205155812920006',
      'Practitioner 1': '7209061211900001',
      // ... (add NIK for other doctors if needed)
    };

    setDoctorNIK(doctorNIKData[updatedTreatmentData.participant]);
  }, [updatedTreatmentData.participant]);

  useEffect(() => {
    axios
      .get(`https://rme-shazfa-mounira-default-rtdb.firebaseio.com/patients/${id}/medical_records/${treatmentId}/diagnosis.json`)
      .then((response) => {
        if (response.data) {
          setDiagnosisData(response.data);
        }
      })
      .catch((error) => {
        console.error('Error fetching diagnosis data:', error);
      });
  }, [id, treatmentId]);

  const handleImageDrop = async (acceptedFiles) => {
    try {
      const uploadPromises = acceptedFiles.map(async (file) => {
        const timestamp = new Date().getTime();
        const formData = new FormData();
        formData.append('file', file);

        const storageUrl = `https://firebasestorage.googleapis.com/v0/b/rme-shazfa-mounira.appspot.com/o/images%2F${timestamp}_${file.name}?alt=media`;

        await axios.post(storageUrl, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        const imageUrl = `https://firebasestorage.googleapis.com/v0/b/rme-shazfa-mounira.appspot.com/o/images%2F${timestamp}_${file.name}?alt=media`;

        setUpdatedTreatmentData((prevData) => ({
          ...prevData,
          images: [...prevData.images, imageUrl],
        }));
      });

      await Promise.all(uploadPromises);

      setUpdateSuccess(true);
    } catch (error) {
      console.error('Error uploading images:', error);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    onDrop: handleImageDrop,
  });

  const updateTreatment = () => {
    const diagnosisArray = typeof updatedTreatmentData.diagnosis === 'string'
      ? updatedTreatmentData.diagnosis.split(" - ")
      : ['', ''];

    const [diagnosisCode, diagnosisName] = diagnosisArray;
    const timestamp = format(new Date(), "yyyy-MM-dd'T'HH:mm:ss");
    const updatedDataWithTimestamp = {
      ...updatedTreatmentData,
      identifier: id,
      timestamp: timestamp,
      doctorNIK: doctorNIK,
      Encounter_period_start: updatedTreatmentData.Encounter_period_start,
      systolicBloodPressure: updatedTreatmentData.systolicBloodPressure,
      diastolicBloodPressure: updatedTreatmentData.diastolicBloodPressure,
      heartRate: updatedTreatmentData.heartRate,
      bodyTemperature: updatedTreatmentData.bodyTemperature,
      respiratoryRate: updatedTreatmentData.respiratoryRate,
      diagnosis: {
        code: diagnosisCode,
        name: diagnosisName,
      },
    };

    axios
      .put(
        `https://rme-shazfa-mounira-default-rtdb.firebaseio.com/patients/${id}/medical_records/${treatmentId}.json`,
        updatedDataWithTimestamp
      )
      .then((response) => {
        console.log('Treatment updated successfully:', response.data);
        navigate(`/emr/${id}`);
      })
      .catch((error) => {
        console.error('Error updating treatment:', error);
      });
  };

  const renderImagePreviews = () => {
    return (
      <div>
        <h3>Image Previews</h3>
        {updatedTreatmentData.images.map((imageUrl, index) => (
          <img
            key={index}
            src={imageUrl}
            alt={`Image ${index + 1}`}
            className="UpdateTreatment-preview-image"
          />
        ))}
      </div>
    );
  };

  const handleInputChange = (e) => {
    setUpdatedTreatmentData({
      ...updatedTreatmentData,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    if (treatmentData) {
      const { diagnosis } = treatmentData;
      if (diagnosis && diagnosis.code && diagnosis.name) {
        setInitialDiagnosis(`${diagnosis.code} - ${diagnosis.name}`);
      }
    }
  }, [treatmentData]);

  const handleDiagnosisChange = (e) => {
    const inputValue = e.target.value;
    setDiagnosis(inputValue);
    setIsTyping(true);
    filterIcdData(inputValue);
  };

  const filterIcdData = (filterValue) => {
    const lowerCaseFilterValue = filterValue.toLowerCase();
    const filteredList = icdData
      .map((item) => {
        const lowerCaseCode = item.code.toLowerCase();
        const lowerCaseName = item.name.toLowerCase();
        const codeParts = highlightSearchResult(lowerCaseCode, lowerCaseFilterValue);
        const nameParts = highlightSearchResult(lowerCaseName, lowerCaseFilterValue);
  
        return {
          ...item,
          code: codeParts,
          name: nameParts,
        };
      })
      .filter((item) => {
        // Check if either code or name has any highlighted parts
        return item.code.some((part) => part.isHighlighted) || item.name.some((part) => part.isHighlighted);
      });
  
    setFilteredIcdData(filteredList);
  };
  

  const highlightSearchResult = (text, search) => {
    if (!search) return [text];

    // Split the text into parts based on the search term
    const parts = text.split(new RegExp(`(${search})`, 'gi'));

    return parts.map((part, i) => ({
      text: part,
      isHighlighted: part.toLowerCase() === search.toLowerCase(),
    }));
  };

  const handleDiagnosisItemClick = (selectedDiagnosis) => {
    setDiagnosis(`${selectedDiagnosis.code} - ${selectedDiagnosis.name}`);
    setIsTyping(false);

    setUpdatedTreatmentData((prevData) => ({
      ...prevData,
      diagnosis: `${selectedDiagnosis.code} - ${selectedDiagnosis.name}`,
    }));
  };

  const handleKeyPress = (e) => {
    const isValidInput = /^\d*\.?\d*$/.test(e.key);
    if (!isValidInput) {
      e.preventDefault();
    }
  };

  return (
    <div className="UpdateTreatment-container">
      <Link to={`/emr/${id}`} className="UpdateTreatment-link">&lt; Back to EMR</Link>
      <h2 className="UpdateTreatment-heading">Update Treatment</h2>
      {treatmentData && (
        <div>
          <p>Treatment ID: {treatmentId}</p>
          <p>TimeStamp: {treatmentData.timestamp}</p>

          <div className="UpdateTreatment-form">

            <label htmlFor="Encounter_period_start" className="UpdateTreatment-label">Encounter Period Start:</label>
            <input
              type="text"
              id="Encounter_period_start"
              name="Encounter_period_start"
              value={updatedTreatmentData.Encounter_period_start}
              onChange={handleInputChange}
              className="UpdateTreatment-input"
            />

            <label htmlFor="complaint" className="UpdateTreatment-label">Keluhan:</label>
            <input
              type="text"
              id="complaint"
              name="complaint"
              value={updatedTreatmentData.complaint}
              onChange={handleInputChange}
              className="UpdateTreatment-input"
            />

            <label htmlFor="condition_physical_examination" className="UpdateTreatment-label">Pemeriksaan Fisik:</label>
            <input
              type="text"
              id="condition_physical_examination"
              name="condition_physical_examination"
              value={updatedTreatmentData.condition_physical_examination}
              onChange={handleInputChange}
              className="UpdateTreatment-input"
            />

            <label htmlFor="Observation" className="UpdateTreatment-label">Tanda Vital:</label>
            <label htmlFor="systolicBloodPressure" className="UpdateTreatment-label">Systolic Blood Pressure:</label>
            <input
              type="text"
              id="systolicBloodPressure"
              name="systolicBloodPressure"
              value={updatedTreatmentData.systolicBloodPressure}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              className="UpdateTreatment-input"
            />

            <label htmlFor="diastolicBloodPressure" className="UpdateTreatment-label">Diastolic Blood Pressure:</label>
            <input
              type="text"
              id="diastolicBloodPressure"
              name="diastolicBloodPressure"
              value={updatedTreatmentData.diastolicBloodPressure}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              className="UpdateTreatment-input"
            />

            <label htmlFor="heartRate" className="UpdateTreatment-label">Heart Rate:</label>
            <input
              type="text"
              id="heartRate"
              name="heartRate"
              value={updatedTreatmentData.heartRate}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              className="UpdateTreatment-input"
            />

            <label htmlFor="bodyTemperature" className="UpdateTreatment-label">Suhu Badan:</label>
            <input
              type="text"
              id="bodyTemperature"
              name="bodyTemperature"
              value={updatedTreatmentData.bodyTemperature}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              className="UpdateTreatment-input"
            />

            <label htmlFor="respiratoryRate" className="UpdateTreatment-label">Respiratory Rate:</label>
            <input
              type="text"
              id="respiratoryRate"
              name="respiratoryRate"
              value={updatedTreatmentData.respiratoryRate}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              className="UpdateTreatment-input"
            />

            <label htmlFor="Medication" className="UpdateTreatment-label">Terapi Obat:</label>
            <input
              type="text"
              id="Medication"
              name="Medication"
              value={updatedTreatmentData.Medication}
              onChange={handleInputChange}
              className="UpdateTreatment-input"
            />

            <div {...getRootProps()} className="UpdateTreatment-dropzone">
              <input {...getInputProps()} />
              <p>Drag 'n' drop some images here, or click to select files</p>
            </div>
            {updateSuccess && (
              <p className="UpdateTreatment-success-message">Update Images berhasil!</p>
            )}

            {updateSuccess && renderImagePreviews()}

            <label htmlFor="diagnosis" className="UpdateTreatment-label">Diagnosa Medis:</label>
            <input
              type="text"
              id="diagnosis"
              name="diagnosis"
              value={diagnosis}
              onChange={handleDiagnosisChange}
              className="UpdateTreatment-input"
              placeholder="Filter atau klik untuk memilih"
            />
            {isTyping && (
              <ul className="unique-filtered-list">
                {filteredIcdData.map((item) => (
                  <li key={item.code}>
                    {item.code.map((part, i) => (
                      <span
                        key={i}
                        style={part.isHighlighted ? { color: 'blue', fontWeight: 'bold' } : {}}
                      >
                        {part.text}
                      </span>
                    ))} - {item.name.map((part, i) => (
                      <span
                        key={i}
                        style={part.isHighlighted ? { color: 'blue', fontWeight: 'bold' } : {}}
                      >
                        {part.text}
                      </span>
                    ))}
                  </li>
                ))}
              </ul>
            )}
            {initialDiagnosis && (
              <p>
                Diagnosa Awal: {initialDiagnosis}
              </p>
            )}
            <label htmlFor="participant" className="UpdateTreatment-label">Dokter DPJP:</label>
            <select
              id="participant"
              name="participant"
              value={updatedTreatmentData.participant}
              onChange={handleInputChange}
              className="UpdateTreatment-input"
            >
              <option value="">Pilih Dokter</option>
              {doctors.map((doctor, index) => (
                <option key={index} value={doctor}>
                  {doctor}
                </option>
              ))}
            </select>

            <button onClick={updateTreatment} className="UpdateTreatment-button">Update Treatment</button>

          </div>
        </div>
      )}
    </div>
  );
};

export default UpdateTreatment;
