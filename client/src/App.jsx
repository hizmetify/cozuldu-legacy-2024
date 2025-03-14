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

const lazyLoad = (importFunc) => {
  const Component = lazy(importFunc);
  Component.preload = importFunc;
  return Component;
};

const Home = lazyLoad(() => import('./pages/Home/Home'));
const Login = lazyLoad(() => import('./pages/Login/Login'));
const MyAds = lazyLoad(() => import('./pages/MyAds/MyAds'));
const Settings = lazyLoad(() => import('./pages/Settings/Settings'));
const MyAdsList = lazyLoad(() => import('./pages/MyAds/MyAdsList'));
const MyAdsNew = lazyLoad(() => import('./pages/MyAds/MyAdsNew'));
const MyAdsDetail = lazyLoad(() => import('./pages/MyAds/MyAdsDetail'));
const MyAdsEdit = lazyLoad(() => import('./pages/MyAds/MyAdsEdit'));
const CategoryAds = lazyLoad(() => import('./pages/CategoryAds'));
const EmailVerify = lazyLoad(() => import('./pages/EmailVerify/EmailVerify'));
const ResetPassword = lazyLoad(() =>
  import('./pages/ResetPassword/ResetPassword')
);

import StepOne from './components/Register/StepOne';
import StepTwo from './components/Register/StepTwo';
import StepThree from './components/Register/StepThree';
import { clearToast } from './features/toast/toastSlice';
import { toast } from 'react-hot-toast';
import Contact from './pages/Contact';
import Statistika from './pages/Statistika/Statistika';
import IlanListesi from './pages/TestPage/test';
import Favories from './pages/Favories/Favories';

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
        <Suspense
          fallback={
            <div className="flex items-center justify-center h-screen">
              <Spinner />
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path='/test' element={<IlanListesi/>}/>
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <DashboardLayout />
                </PrivateRoute>
              }
            >
              <Route index element={<Navigate to="my-ads" replace />} />
              <Route path="my-ads" element={<MyAds />}>
                <Route index element={<MyAdsList />} />
                <Route path="new" element={<MyAdsNew />} />
                <Route path=":adId" element={<MyAdsDetail />} />
                <Route path=":adId/edit" element={<MyAdsEdit />} />
              </Route>
              <Route path="settings" element={<Settings />} />
              <Route path='statistika' element={<Statistika/>} />
              <Route path='favories' element={<Favories/>} />
            </Route>
            
            <Route path="/category/:categoryId" element={<CategoryAds />} />
            <Route path="/contact" element={<Contact />} />

            <Route
              path="/login"
              element={
                <PublicRoute restricted={true}>
                  <Login />
                </PublicRoute>
              }
            />
            <Route path="/emailverify" element={<EmailVerify />} />
            <Route path="/resetPassword/:email" element={<ResetPassword />} />
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
