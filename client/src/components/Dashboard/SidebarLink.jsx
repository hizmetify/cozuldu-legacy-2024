import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../features/auth/authSlice';

const SidebarLink = ({ href, label, icon: Icon, isLogout }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = href && location.pathname.startsWith(href);

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      navigate('/');
    } catch (error) {
      console.error(error);
    }
  };

  const baseClasses =
    'flex items-center w-full px-4 py-3 rounded-lg transition-all duration-200 group';
  const activeClasses =
    'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md shadow-blue-200';
  const inactiveClasses = 'text-blue-900 hover:bg-blue-100/50';
  const logoutClasses = 'text-blue-900 hover:bg-red-100 hover:text-red-600';

  const linkClasses = `${baseClasses} ${
    isActive ? activeClasses : inactiveClasses
  }`;

  const iconActiveClasses =
    'w-5 h-5 mr-3 text-white transition-transform duration-200 group-hover:scale-110';
  const iconInactiveClasses =
    'w-5 h-5 mr-3 text-blue-600 transition-transform duration-200 group-hover:scale-110';
  const iconLogoutClasses =
    'w-5 h-5 mr-3 text-blue-600 transition-transform duration-200 group-hover:text-red-600 group-hover:scale-110';

  const iconClasses = isLogout
    ? iconLogoutClasses
    : isActive
    ? iconActiveClasses
    : iconInactiveClasses;

  return (
    <li>
      {isLogout ? (
        <button
          className={`${baseClasses} ${logoutClasses}`}
          onClick={handleLogout}
        >
          <Icon className={iconClasses} />
          <span className="font-medium">{label}</span>
        </button>
      ) : (
        <Link to={href} className={linkClasses}>
          <Icon className={iconClasses} />
          <span className="font-medium">{label}</span>
        </Link>
      )}
    </li>
  );
};

SidebarLink.propTypes = {
  href: PropTypes.string,
  label: PropTypes.string.isRequired,
  icon: PropTypes.elementType.isRequired,
  isLogout: PropTypes.bool.isRequired,
};

export default SidebarLink;
