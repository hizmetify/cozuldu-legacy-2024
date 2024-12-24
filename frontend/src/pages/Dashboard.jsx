import { useDispatch } from 'react-redux';
import { logout } from '../features/authSlice';

const Dashboard = () => {
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await dispatch(logout());
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Logout</h1>
      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded"
      >
        Çıkış Yap
      </button>
    </div>
  );
};

export default Dashboard;
