import { useEffect, useState } from 'react';
import { emailVerify } from '../../api/authApi';
import { useNavigate } from 'react-router-dom';
import { showToast } from '../../features/toast/toastSlice';

const EmailVerify = () => {
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');
  const [timeLeft, setTimeLeft] = useState(180);
  const navigate = useNavigate();

  const handleChange = (e) => {
    let value = e.target.value.toUpperCase();
    if (/^[0-9A-Z-]{0,9}$/.test(value)) {
      if (value.length === 4 && !value.includes('-')) {
        value += '-';
      }
      setCode(value);
    }
  };
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
      showToast({ message: 'Kod formatı hatalı', type: 'error' });
      return;
    }

    const response = await emailVerify({ code });

    if (response?.status === 'success') {
      navigate('/dashboard/my-ads/new');
    } else if (response?.status === 'false') {
      setMessage('Girilen kod hatalı');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 via-blue-500 to-purple-500 px-4">
      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md">
        <div className="flex justify-center mb-6">
          <svg
            className="w-16 h-16 text-indigo-600"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 11c.667-2 .667-2.6 0-3.2-.667-.6-1.333-.6-2 0-.667.6-.667 1.2 0 3.2.667 2 1.333 2.6 2 3.2.667.6 1.333.6 2 0 .667-.6.667-1.2 0-3.2zm0 0v3"
            />
          </svg>
        </div>
        <h2 className="text-center text-2xl font-bold text-gray-800 mb-1">
          Kodu Doğrula
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Lütfen gelen e-postadaki kodu giriniz
        </p>
        <div className="flex justify-center mb-4">
          <input
            type="text"
            name="code"
            placeholder="XXXX-XXXX"
            maxLength="9"
            value={code}
            onChange={handleChange}
            className="text-center text-xl font-bold tracking-widest bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 
              focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
          />
        </div>

        <button
          onClick={handleSubmit}
          className="w-full py-3 text-white font-semibold rounded-lg
            bg-gradient-to-r from-indigo-600 to-indigo-500 hover:to-indigo-700
            transition shadow-md hover:shadow-lg focus:outline-none"
        >
          Doğrula
        </button>

        <div className="mt-5 text-center text-gray-600">
          <h1 className="text-sm">
            Kodu girmek için kalan süre:
            <span className="font-medium text-gray-800">
              {' '}
              {minutes} dakika {seconds < 10 ? `0${seconds}` : seconds} saniye
            </span>
          </h1>
        </div>
        {message && (
          <p className="mt-5 text-center text-red-500 font-medium">{message}</p>
        )}
      </div>
    </div>
  );
};

export default EmailVerify;
