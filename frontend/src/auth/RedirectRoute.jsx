import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const RedirectRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

export default RedirectRoute;
