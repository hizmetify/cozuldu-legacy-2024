import { useEffect, useState } from 'react';
import { emailVerify } from '../../api/authApi';
import { useNavigate } from 'react-router-dom'; 
import { showToast } from '../../features/toast/toastSlice';
const EmailVerify = () => {
    const [code, setCode] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    const handleChange = (e) => {
      let value = e.target.value.toUpperCase();
      
      if (/^[0-9A-Z-]{0,9}$/.test(value)) {
        if (value.length === 4 && !value.includes("-")) {
          value += "-"; 
        }
        setCode(value);
      }
    };
    const [timeLeft, setTimeLeft] = useState(180); 

    useEffect(() => {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer); 
            navigate('/');
          }
          return prevTime - 1;
        });
      }, 1000); 
  
      return () => clearInterval(timer);
    }, [navigate]); 
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
  
    const handleSubmit = async () => {
      if (!/^[0-9A-Z]{4}-[0-9A-Z]{4}$/.test(code)) {
        showToast({message:'Kod formatı hatalı',  type: 'error' }) 
        return;
      } 
      
      let response=await emailVerify({code}) 
      
      if(response?.status=='success'){
          navigate("/dashboard/my-ads/new")
        }
      else if(response.status=='false'){ 
          alert('Girilen kod Hatalı')
        }
      
    };
  return (
    <> 
       <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h2 className="mb-4 text-2xl font-bold text-gray-700">Kod Doğrulama</h2>
      
      <input
        type="text"
        value={code}
        name='code'
        onChange={handleChange}
        maxLength="9"
        className="w-48 h-12 text-center text-xl font-bold border-2 border-gray-400 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
        placeholder="XXXX-XXXX"
      />

      <button
        onClick={handleSubmit}
        className="mt-4 px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition"
      >
        Doğrula
      </button>
      <div>
      <h1>Kodu girmek için kalan süre {minutes} dakika {seconds} saniye </h1>
    </div>
      {message && (
        <p className="mt-3 text-lg font-medium text-red-500">{message}</p>
      )}
    </div>
    </>
  );
};

export default EmailVerify;
