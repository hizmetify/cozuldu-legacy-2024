import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import Header from '../components/Header/Header';

const PublicRoute = ({ restricted = false }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const location = useLocation();
  const isLogin=localStorage.getItem('isLogin')
  const isRegisterPage = location.pathname.startsWith('/register');

  if (isLogin&& isAuthenticated && restricted) {
    return <Navigate to="/dashboard" />;
  }
  return (
    <>
      { isRegisterPage ? null : <Header />}
      <Outlet />
    </>
  );
};

PublicRoute.propTypes = {
  restricted: PropTypes.bool,
};

export default PublicRoute;
