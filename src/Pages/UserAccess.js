import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './UserAccess.css';

const UserAccess = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordCorrect, setPasswordCorrect] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const waNumber = '+62895600394345';

  const handleChatButtonClick = () => {
    // Membuka obrolan WhatsApp di aplikasi atau browser
    window.open(`https://wa.me/${waNumber}`, '_blank');
  };


  const correctPasswordFromSourceCode = '24'; // Ganti dengan password yang diinginkan

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Periksa apakah password yang dimasukkan sesuai dengan yang ditetapkan di source code
    const isPasswordCorrect = password === correctPasswordFromSourceCode;
    setPasswordCorrect(isPasswordCorrect);
    setLoading(false);

    if (isPasswordCorrect) {
      // Password benar, arahkan pengguna ke halaman Home
      navigate('/home'); // Ganti dengan path halaman yang diinginkan
    } else {
      // Password salah, set pesan kesalahan
      setError('Password Salah. Silakan coba lagi.');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="user-access-container">
      <h2>KLINIK SHAZFA MOUNIRA</h2>
      {loading ? (
        <img src="/Animation.gif" alt="Loading..." className="loading-animation" />
      ) : (
        <form className="login-form" onSubmit={handleSubmit}>
          <label>
            Masukkan Password:
            <div className="password-input-container">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span
                className={`password-toggle-icon ${showPassword ? 'visible' : ''}`}
                onClick={togglePasswordVisibility}
              >
                {showPassword ? '🙈' : '👁️'}
              </span>
            </div>
          </label>
          <br />
          <button type="submit">Submit</button>
          {error && <p className="error-message">{error}</p>}
        </form>
      )}
     <p className="hidden-text">
        Password: 24: {correctPasswordFromSourceCode}
      </p>
      <p>
        Menemukan Kendala?{" "}
        <button onClick={handleChatButtonClick}>Chat IT on WhatsApp</button>
      </p>
      <p>InovaRME Nexus (PT.InnoView Indo Tech)</p>
    </div>
  );
};

export default UserAccess;
