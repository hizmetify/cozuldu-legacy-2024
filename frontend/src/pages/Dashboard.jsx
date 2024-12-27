import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/authSlice';
import { memo, useCallback } from 'react';

const Dashboard = () => {
  const user = useSelector((state) => state.auth.user);
  console.log(user.name);
  
  const dispatch = useDispatch();

  const handleLogout = useCallback(async () => {
    try {
      await dispatch(logout());
    } catch (error) {
      console.error(error);
    }
  }, [dispatch]);

  return (
    <div>
      <h1>Logout</h1>
      {<h2>{user.name}</h2>}
      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded"
      >
        Çıkış Yap
      </button>
    </div>
  );
};

export default memo(Dashboard);
