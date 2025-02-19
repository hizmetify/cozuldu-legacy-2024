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
    'flex items-center w-full px-4 py-2.5 rounded-lg transition-all duration-200 group';
  const activeClasses = 'bg-blue-50 text-blue-600';
  const inactiveClasses = 'text-gray-700 hover:bg-gray-50';
  const logoutClasses = 'text-gray-700 hover:bg-red-50 hover:text-red-600';

  const linkClasses = `${baseClasses} ${
    isActive ? activeClasses : inactiveClasses
  }`;
  const iconClasses = `w-5 h-5 mr-3 transition-transform duration-200 ${
    isActive ? 'text-blue-600' : 'text-gray-500'
  } group-hover:scale-110`;

  return (
    <li>
      {isLogout ? (
        <button
          className={`${baseClasses} ${logoutClasses}`}
          onClick={handleLogout}
        >
          <Icon
            className={`w-5 h-5 mr-3 transition-transform duration-200 text-gray-500 group-hover:text-red-600 group-hover:scale-110`}
          />
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
