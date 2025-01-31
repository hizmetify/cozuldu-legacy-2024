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
import { useDispatch } from 'react-redux';
import { fetchMe } from './features/auth/authSlice';
import { useEffect } from 'react';
import PublicRoute from './guards/PublicRoute';
import DashboardLayout from './layouts/DashboardLayout';
import MyAds from './pages/MyAds/MyAds';
import Settings from './pages/Settings/Settings';
import MyAdsList from './pages/MyAds/MyAdsList';
import MyAdsNew from './pages/MyAds/MyAdsNew';
import MyAdsDetail from './pages/MyAds/MyAdsDetail';
import MyAdsEdit from './pages/MyAds/MyAdsEdit';

const Home = lazy(() => import('./pages/Home/Home'));
const Login = lazy(() => import('./pages/Login/Login'));

const App = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchMe());
  }, [dispatch]);

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
              <Route index element={<Navigate to={'step-1'} />} />
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
