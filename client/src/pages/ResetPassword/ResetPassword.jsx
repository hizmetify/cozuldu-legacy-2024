import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { passwordChange } from '../../api/authApi';

const ResetPassword = () => {
  const { email } = useParams(); // URL'den email'i al
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert('Parolalar eşleşmiyor!');
      return;
    }

    try {
        let response = await passwordChange({ email, password }) 
        
      alert('Parola başarıyla sıfırlandı!');
      navigate('/login');
    } catch (error) {
      console.error('Hata:', error);
      alert('Bir hata oluştu!');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-md shadow-lg w-1/3">
        <h2 className="text-center text-2xl font-bold mb-4">Parola Sıfırla</h2>
        <p className="text-center mb-4">{email} için yeni parola girin:</p>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Yeni Parola"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border rounded-md mb-3"
          />
          <input
            type="password"
            placeholder="Yeni Parola Tekrar"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-3 border rounded-md mb-3"
          />
          <button
            type="submit"
            className="w-full p-3 bg-blue-500 text-white rounded-md"
          >
            Parolayı Güncelle
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
