import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PediatricDrug.css';

const PediatricDrug = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [beratBadan, setBeratBadan] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get('https://medictech-since-2022-default-rtdb.asia-southeast1.firebasedatabase.app/PediatricDrug.json')
      .then((response) => {
        console.log(response.data);
        setData(response.data);
        setFilteredData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []);

  const handleSearch = () => {
    const filtered = data.filter((item) => {
      if (!item) return false; // Menangani item yang null atau undefined

      const isMatchingTitle = item.title.toLowerCase().includes(searchKeyword.toLowerCase());
      const isMatchingBeratBadan = beratBadan === '' || parseInt(item.bb, 10) === parseInt(beratBadan, 10);

      return isMatchingTitle && isMatchingBeratBadan;
    });

    setFilteredData(filtered);
  };

  return (
    <div className="pediatric-drug">
      <h2>Pediatric Drug</h2>
      <div className="search">
        <input
          type="text"
          className="border border-blue-500 rounded-md p-2"
          placeholder="Cari Resep Obat berdasarkan Diagnosa Medis..."
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
        />
        <input
          type="text"
          className="border border-blue-500 rounded-md p-2"
          placeholder="Masukkan Berat Badan (kg)"
          value={beratBadan}
          onChange={(e) => setBeratBadan(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white p-2 rounded-md ml-2"
          onClick={handleSearch}
        >
          Cari
        </button>
      </div>
      {loading ? (
        <div className="loading-container flex justify-center items-center h-screen">
          <img
            src="/Animation.gif"
            alt="Loading Animation"
            style={{ width: '100px', height: '100px' }}
          />
        </div>
      ) : (
        <div className="card-container">
          {filteredData.length === 0 ? (
            <p>Opps, Data yang Anda Cari belum ada..!!</p>
          ) : (
            filteredData.map(
              (item) =>
                item && (
                  <div
                    className={`card`}
                    key={item.id}
                  >
                    <h3>{item.title}</h3>
                    <ul>
                    <li>{item.senin}</li>
                    <li>{item.selasa}</li>
                    <li>{item.rabu}</li>
                    <li>{item.kamis}</li>
                    <li>{item.jumat}</li>
                    <li>{item.sabtu}</li>
                    <li>{item.minggu}</li>
                    <li>{item.siji}</li>
                    <li>{item.loro}</li>
                    <li>{item.telu}</li>
                    <li>{item.papat}</li>
                    <li>{item.limo}</li>
                    <li>{item.enem}</li>
                    <li>{item.pitu}</li>
                  </ul>
                  </div>
                )
            )
          )}
        </div>
      )}
    </div>
  );
};

export default PediatricDrug;
