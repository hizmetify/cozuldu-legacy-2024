import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PrivateRoute from '../auth/PrivateRoute';
import RedirectRoute from '../auth/RedirectRoute';
import { Suspense, lazy, useEffect, useState } from 'react';
import Spinner from '../components/UI/Spinner';
import FormLayout from '../layouts/FormLayout';
import StepOne from '../components/forms/StepOne';
import StepTwo from '../components/forms/StepTwo';
import StepThree from '../components/forms/StepThree';

const Home = lazy(() => import('../pages/Home'));
const Login = lazy(() => import('../pages/Login'));
const Dashboard = lazy(() => import('../pages/Dashboard'));

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
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<FormLayout />}>
              <Route index element={<StepOne />} />
              <Route path="step-2" element={<StepTwo />} />
              <Route path="step-3" element={<StepThree />} />
            </Route>
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
