import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';
import { useDropzone } from 'react-dropzone';
import './NewTreatment.css';

const NewTreatment = () => {
  const { id } = useParams();
  const [complaint, setComplaint] = useState('');
  const [condition_physical_examination, setConditionPhysicalExamination] = useState('');
  const [systolicBloodPressure, setSystolicBloodPressure] = useState('');
  const [diastolicBloodPressure, setDiastolicBloodPressure] = useState('');
  const [heartRate, setHeartRate] = useState('');
  const [bodyTemperature, setBodyTemperature] = useState('');
  const [respiratoryRate, setRespiratoryRate] = useState('');
  const [Observation, setObservation] = useState('');
  const [diagnosis, setDiagnosis] = useState(''); // Mengganti dari 'medical_diagnosis' menjadi 'diagnosis'
  const [Medication, setMedication] = useState(''); // Mengganti dari 'Medication' menjadi 'Medication'
  const [participant, setParticipant] = useState('');
  const [tanggal, setTanggal] = useState(format(new Date(), 'dd MMMM yyyy'));
  const [jamMenitDetik, setJamMenitDetik] = useState(format(new Date(), 'HH:mm:ss'));
  const [icdData, setIcdData] = useState([]);
  const [filteredIcdData, setFilteredIcdData] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [doctorNIK, setDoctorNIK] = useState('');

  // Fungsi untuk menangani penurunan gambar
  const onDrop = async (acceptedFiles) => {
    try {
      const uploadPromises = acceptedFiles.map(async (file) => {
        const timestamp = new Date().getTime();
        const formData = new FormData();
        formData.append('file', file);

        // Gunakan URL Firebase Storage untuk mengunggah gambar
        const storageUrl = `https://firebasestorage.googleapis.com/v0/b/rme-shazfa-mounira.appspot.com/o/images%2F${timestamp}_${file.name}?alt=media`;

        await axios.post(storageUrl, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        // Bangun URL gambar setelah diunggah
        const imageUrl = `https://firebasestorage.googleapis.com/v0/b/rme-shazfa-mounira.appspot.com/o/images%2F${timestamp}_${file.name}?alt=media`;

        // Perbarui state dengan URL gambar yang diunggah
        setUploadedImages((prevImages) => [...prevImages, imageUrl]);
      });

      // Tunggu semua janji unggahan gambar selesai
      await Promise.all(uploadPromises);
    } catch (error) {
      console.error('Error saat mengunggah file:', error);
    }
  };

  // Konfigurasi hook UseDropzone
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: 'image/*',
    multiple: true,
  });

  useEffect(() => {
    // Fetch ICD data from the API or use a predefined list
    // For testing purposes, I'll use a predefined list
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

  const intervalId = setInterval(() => {
    setJamMenitDetik(format(new Date(), 'HH:mm:ss'));
  }, 1000);

  const handleComplaintChange = (e) => {
    setComplaint(e.target.value);
  };

  const handleConditionPhysicalExaminationChange = (e) => {
    setConditionPhysicalExamination(e.target.value);
  };

  const handleDiagnosisChange = (e) => {
    const filterValue = e.target.value;
    setDiagnosis(filterValue);
    setIsTyping(!!filterValue);
    filterIcdData(filterValue);
  };

  const handleMedicationChange = (e) => {
    setMedication(e.target.value);
  };

  const handleDiagnosisItemClick = (selectedDiagnosis) => {
    setDiagnosis(`${selectedDiagnosis.code} - ${selectedDiagnosis.name}`);
    setFilteredIcdData([]);
  };

  const handleSystolicBloodPressureChange = (e) => {
    const value = e.target.value;
    if (!isNaN(value)) {
      setSystolicBloodPressure(value);
    }
  };

  const handleDiastolicBloodPressureChange = (e) => {
    const value = e.target.value;
    if (!isNaN(value)) {
      setDiastolicBloodPressure(value);
    }
  };

  const handleHeartRateChange = (e) => {
    const value = e.target.value;
    if (!isNaN(value)) {
      setHeartRate(value);
    }
  };

  const handleBodyTemperatureChange = (e) => {
    const value = e.target.value;
    if (!isNaN(value)) {
      setBodyTemperature(value);
    }
  };

  const handleRespiratoryRateChange = (e) => {
    const value = e.target.value;
    if (!isNaN(value)) {
      setRespiratoryRate(value);
    }
  };


  useEffect(() => {
    // Fetch NIK data from the API or use a predefined list
    // For testing purposes, I'll use a predefined list
    const doctorNIKData = {
      'dr. Yohanes hendra budi santoso': '3215131301790004',
      'dr. yesi novia Ambarani': '3205155812920006',
      'Practitioner 1': '7209061211900001',
      // ... (tambahkan NIK dokter lain jika diperlukan)
    };

    // Set NIK dokter berdasarkan nama dokter yang dipilih
    setDoctorNIK(doctorNIKData[participant]);
  }, [participant]);


  const [doctors, setDoctors] = useState([
    'dr. Yohanes hendra budi santoso',
    'dr. yesi novia Ambarani',
    'Practitioner 1',
    // ... (tambahkan dokter lain jika diperlukan)
  ]);

  const handleParticipantChange = (e) => {
    setParticipant(e.target.value);
  };

  const filterIcdData = (filterValue) => {
    const filteredList = icdData.filter(
      (item) =>
        item.code.toLowerCase().includes(filterValue.toLowerCase()) ||
        item.name.toLowerCase().includes(filterValue.toLowerCase())
    );
    setFilteredIcdData(filteredList);
  };

  const handleSubmit = async () => {
    try {
      // Persiapkan data yang akan dikirim ke Firebase Realtime Database
      const [diagnosisCode, diagnosisName] = diagnosis.split(" - ");
      const dataToSend = {
        timestamp: new Date().getTime(),
        Encounter_period_start: new Date(`${tanggal} ${jamMenitDetik}`),
        identifier: id,
        complaint: complaint,
        condition_physical_examination: condition_physical_examination,
        diagnosis: {
          code: diagnosisCode,
          name: diagnosisName,
        },
        Medication: Medication,
        participant: participant,
        doctorNIK: doctorNIK,
        images: uploadedImages,
        systolicBloodPressure: systolicBloodPressure,
        diastolicBloodPressure: diastolicBloodPressure,
        heartRate: heartRate,
        bodyTemperature: bodyTemperature,
        respiratoryRate: respiratoryRate,
      };

      // Kirim data ke Firebase Realtime Database
      await axios.post(`https://rme-shazfa-mounira-default-rtdb.firebaseio.com/patients/${id}/medical_records.json`, dataToSend);

      console.log('Data pengobatan berhasil disimpan');
      window.location.href = `/emr/${id}`;
    } catch (error) {
      console.error('Terjadi kesalahan:', error);
    }
  };

  return (
    <div className="unique-new-treatment-container">
      <h2 className="unique-new-treatment-heading">Tambah Pengobatan</h2>
      <div className="unique-form-container">
        <div className="unique-data-pengobatan">
          <h3>Tanggal</h3>
          <input type="text" value={tanggal} readOnly className="unique-input-field" />
          <h3>Waktu</h3>
          <input type="text" value={jamMenitDetik} readOnly className="unique-input-field" />
          <h3>Keluhan</h3>
          <input type="text" value={complaint} onChange={handleComplaintChange} className="unique-input-field" />
          <h3>Pemeriksaan Fisik</h3>
          <input type="text" value={condition_physical_examination} onChange={handleConditionPhysicalExaminationChange} className="unique-input-field" />
          <div {...getRootProps()} className="unique-dropzone">
            <input {...getInputProps()} />
            <p>Drag 'n' drop some files here, or click to select files</p>
          </div>
          {uploadedImages.length > 0 && (
            <div>
              <h3>Preview Images</h3>
              {uploadedImages.map((imageUrl, index) => (
                <img key={index} src={imageUrl} alt={`Uploaded ${index + 1}`} className="unique-uploaded-image" />
              ))}
            </div>
          )}
          <h3>Tanda Vital</h3>
          <label>Systolic Blood Pressure:</label>
          <input
            type="text"
            value={systolicBloodPressure}
            onChange={handleSystolicBloodPressureChange}
            className="unique-input-field"
          />

          <label>Diastolic Blood Pressure:</label>
          <input
            type="text"
            value={diastolicBloodPressure}
            onChange={handleDiastolicBloodPressureChange}
            className="unique-input-field"
          />

          <label>Heart Rate:</label>
          <input
            type="text"
            value={heartRate}
            onChange={handleHeartRateChange}
            className="unique-input-field"
          />

          <label>Suhu Badan:</label>
          <input
            type="text"
            value={bodyTemperature}
            onChange={handleBodyTemperatureChange}
            className="unique-input-field"
          />

          <label>Respiratory Rate:</label>
          <input
            type="text"
            value={respiratoryRate}
            onChange={handleRespiratoryRateChange}
            className="unique-input-field"
          />

          <h3>Diagnosa Medis</h3>
          <input
            type="text"
            value={diagnosis}
            onChange={handleDiagnosisChange}
            className="unique-input-field"
            placeholder="Filter or click to select"
          />
          {isTyping && (
            <ul className="unique-filtered-list">
              {filteredIcdData.map((item) => (
                <li
                  key={item.code}
                  onClick={() => handleDiagnosisItemClick(item)}
                >
                  {highlightSearchResult(item.code, diagnosis)} - {highlightSearchResult(item.name, diagnosis)}
                </li>
              ))}
            </ul>
          )}

          <h3>Terapi Obat</h3>
          <input type="text" value={Medication} onChange={handleMedicationChange} className="unique-input-field" />
          <h3>Participant</h3>
          <select value={participant} onChange={handleParticipantChange} className="unique-input-field">
            <option value="">Pilih Dokter</option>
            {doctors.map((doctor, index) => (
              <option key={index} value={doctor}>
                {doctor}
              </option>
            ))}
          </select>
        </div>
        <button onClick={handleSubmit} className="unique-submit-button rounded-button">
          Submit
        </button>
        <Link to={`/emr/${id}`} className="unique-back-link">
          Kembali ke EMR
        </Link>
      </div>
    </div>
  );
};

const highlightSearchResult = (text, search) => {
  if (!search) return text;

  // Split the text into parts based on the search term
  const parts = text.split(new RegExp(`(${search})`, 'gi'));

  return (
    <span>
      {parts.map((part, i) => (
        <span key={i} style={part.toLowerCase() === search.toLowerCase() ? { color: 'blue', fontWeight: 'bold' } : {}}>
          {part}
        </span>
      ))}
    </span>
  );
};

export default NewTreatment;

