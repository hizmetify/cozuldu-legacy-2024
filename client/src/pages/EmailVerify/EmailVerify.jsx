import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdEmail, MdTimer, MdArrowForward, MdError } from 'react-icons/md';
import { emailVerify } from '../../api/authApi';
import { showToast } from '../../features/toast/toastSlice';

const EmailVerify = () => {
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');
  const [timeLeft, setTimeLeft] = useState(180);
  const [isLoading, setIsLoading] = useState(false);
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

    setIsLoading(true);
    try {
      const response = await emailVerify({ code });
      if (response?.status === 'success') {
        navigate('/dashboard/my-ads/new');
      } else {
        setMessage('Girilen kod hatalı');
      }
    } catch (error) {
      setMessage('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  const progressPercentage = (timeLeft / 180) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gray-100">
            <div
              className="h-full bg-indigo-600 transition-all duration-1000 ease-linear"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>

          <div className="text-center space-y-2">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 mb-4">
              <MdEmail className="h-7 w-7" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              E-posta Doğrulama
            </h1>
            <p className="text-gray-500">
              Lütfen e-postanıza gönderilen doğrulama kodunu giriniz
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <input
                type="text"
                placeholder="XXXX-XXXX"
                maxLength="9"
                value={code}
                onChange={handleChange}
                className="w-full text-center text-2xl font-mono tracking-[0.5em] rounded-lg border 
                  bg-gray-50 py-4 px-3 placeholder:text-gray-300 placeholder:tracking-[0.2em] 
                  placeholder:font-normal focus:outline-none focus:ring-2 
                  focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200"
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-lg text-white font-medium bg-indigo-600 
                hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
                transition-all duration-200 flex items-center justify-center gap-2
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Doğrula
                  <MdArrowForward className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <MdTimer className="w-4 h-4" />
              <span>
                {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
              </span>
            </div>

            {message && (
              <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                <MdError className="w-4 h-4" />
                <p>{message}</p>
              </div>
            )}
          </div>
        </div>
        <p className="text-center text-sm text-gray-500 mt-4">
          Kod gelmedi mi?{' '}
          <button className="text-indigo-600 hover:text-indigo-700 font-medium">
            Tekrar Gönder
          </button>
        </p>
      </div>
    </div>
  );
};

export default EmailVerify;
