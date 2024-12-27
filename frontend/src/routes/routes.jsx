import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PrivateRoute from '../auth/PrivateRoute';
import RedirectRoute from '../auth/RedirectRoute';
import { Suspense, lazy, useEffect, useState } from 'react';
import Spinner from '../components/UI/Spinner';

const Home = lazy(() => import('../pages/Home'));
const Register = lazy(() => import('../pages/Register'));
const Dashboard = lazy(() => import('../pages/Dashboard'));
const Login = lazy(() => import('../pages/Login'));
const AppRoutes = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <BrowserRouter>
      {!loaded ? (
        <Spinner />
      ) : (
        <Suspense fallback={<Spinner />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/register"
              element=<RedirectRoute>
                <Register />
              </RedirectRoute>
            />
            <Route
              path="login"
              element=<RedirectRoute>
                <Login />
              </RedirectRoute>
            />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
          </Routes>
        </Suspense>
      )}
    </BrowserRouter>
  );
};

export default AppRoutes;
