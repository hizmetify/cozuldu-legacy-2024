import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { Suspense, lazy } from 'react';
import PrivateRoute from './guards/PrivateRoute';
import Spinner from './components/UI/Spinner';
import { HelmetProvider } from 'react-helmet-async';
import RegisterLayout from './layouts/RegisterLayout';
import StepOne from './components/Register/StepOne';
import StepTwo from './components/Register/StepTwo';
import StepThree from './components/Register/StepThree';

const Home = lazy(() => import('./pages/Home/Home'));
const Dashboard = lazy(() => import('./pages/Dashboard/Dashboard'));
const Login = lazy(() => import('./pages/Login/Login'));
const Register = lazy(() => import('./pages/Register/Register'));

const App = () => {
  return (
    <HelmetProvider>
      <Router>
        <Suspense fallback={<Spinner />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<RegisterLayout />}>
              <Route index element={<Navigate to={'step-1'} />} />
              <Route path="step-1" element={<StepOne />} />
              <Route path="step-2" element={<StepTwo />} />
              <Route path="step-3" element={<StepThree />} />
            </Route>
          </Routes>
        </Suspense>
      </Router>
    </HelmetProvider>
  );
};

export default App;
