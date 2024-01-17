import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Pages/Home';
import EMR from './Pages/EMR';
import NewTreatment from './Pages/NewTreatment';
import InternisDrug from './Pages/InternisDrug';
import PediatricDrug from './Pages/PediatricDrug';
import UserAccess from './Pages/UserAccess';
import ToothDrug from './Pages/ToothDrug'; // Import ToothDrug component
import DermaDrug from './Pages/DermaDrug'; // Import DermaDrug component
import ServiceSetting from './Pages/ServiceSetting';
import ListBelanjaObat from './Pages/ListBelanjaObat';
import UpdateTreatment from './Pages/UpdateTreatment';
import Encounter from './Pages/Encounter'
import SatuSehat from './Pages/SatuSehat';


const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<UserAccess />} />
          <Route path="/home" element={<Home />} />
          <Route path="/emr/:id" element={<EMR />} />
          <Route path="/emr/:id/tambah-pengobatan" element={<NewTreatment />} />
          <Route path="/emr/:id/update-treatment/:treatmentId" element={<UpdateTreatment />} />
          <Route path="/internis" element={<InternisDrug />} />
          <Route path="/satusehat" element={<SatuSehat />} />
          <Route path="/pediatric" element={<PediatricDrug />} />
          <Route path="/tooth-drug" element={<ToothDrug />} /> {/* New route for ToothDrug */}
          <Route path="/derma-drug" element={<DermaDrug />} /> {/* New route for DermaDrug */}
          <Route path="/service-setting" element={<ServiceSetting />} />
          <Route path="/list-belanja-obat" element={<ListBelanjaObat />} />
          <Route path="/encounter" element={<Encounter />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
