import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchMe } from './features/authSlice';
import AppRoutes from './routes/routes';

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchMe());
  }, [dispatch]);

  return <AppRoutes />;
};

export default App;