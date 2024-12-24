import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Register from '../pages/Register';
import Home from '../pages/Home';
import Login from '../pages/Login';
import PrivateRoute from '../auth/PrivateRoute';
import Dashboard from '../pages/Dashboard';
import RedirectRoute from '../auth/RedirectRoute';

const AppRoutes = () => {
  return (
    <BrowserRouter>
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
    </BrowserRouter>
  );
};

export default AppRoutes;
