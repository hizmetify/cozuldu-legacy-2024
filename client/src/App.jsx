import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { Suspense, lazy, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { HelmetProvider } from 'react-helmet-async';

import PrivateRoute from './guards/PrivateRoute';
import PublicRoute from './guards/PublicRoute';
import Spinner from './components/UI/Spinner';
import RegisterLayout from './layouts/RegisterLayout';
import DashboardLayout from './layouts/DashboardLayout';
import { fetchMe } from './features/auth/authSlice';

const Home = lazy(() => import('./pages/Home/Home'));
const Login = lazy(() => import('./pages/Login/Login'));
const MyAds = lazy(() => import('./pages/MyAds/MyAds'));
const Settings = lazy(() => import('./pages/Settings/Settings'));
const MyAdsList = lazy(() => import('./pages/MyAds/MyAdsList'));
const MyAdsNew = lazy(() => import('./pages/MyAds/MyAdsNew'));
const MyAdsDetail = lazy(() => import('./pages/MyAds/MyAdsDetail'));
const MyAdsEdit = lazy(() => import('./pages/MyAds/MyAdsEdit'));

import StepOne from './components/Register/StepOne';
import StepTwo from './components/Register/StepTwo';
import StepThree from './components/Register/StepThree';
import { clearToast } from './features/toast/toastSlice';
import { toast } from 'react-hot-toast';

const App = () => {
  const dispatch = useDispatch();

  const queue = useSelector((state) => state.toast.queue);

  useEffect(() => {
    dispatch(fetchMe());
  }, [dispatch]);

  useEffect(() => {
    if (queue.length > 0) {
      queue.forEach(({ message, type }) => {
        toast[type](message);
      });

      dispatch(clearToast()); 
    }
  }, [queue, dispatch]);




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
                  <DashboardLayout />
                </PrivateRoute>
              }
            >
              <Route path="my-ads" element={<MyAds />}>
                <Route index element={<MyAdsList />} />
                <Route path="new" element={<MyAdsNew />} />
                <Route path=":adId" element={<MyAdsDetail />} />
                <Route path=":adId/edit" element={<MyAdsEdit />} />
              </Route>
              <Route path="settings" element={<Settings />} />
            </Route>

            <Route
              path="/login"
              element={
                <PublicRoute restricted={true}>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute restricted={true}>
                  <RegisterLayout />
                </PublicRoute>
              }
            >
              <Route index element={<Navigate to="step-1" />} />
              <Route path="step-1" element={<StepOne />} />
              <Route path="step-2" element={<StepTwo />} />
              <Route path="step-3" element={<StepThree />} />
            </Route>
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Suspense>
      </Router>
    </HelmetProvider>
  );
};

export default App;
