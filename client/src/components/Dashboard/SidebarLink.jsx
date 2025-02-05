import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../features/auth/authSlice';

const SidebarLink = ({ href, label, icon: Icon, isLogout }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      navigate("/")
    } catch (error) {
        console.error(error)
    }
  };

  return (
    <li className="w-full">
      {isLogout ? (
        <button
          className="flex items-center p-2 w-full text-gray-800 rounded-lg hover:bg-blue-100"
          onClick={handleLogout}
        >
          <Icon className="mr-2" />
          <span>{label}</span>
        </button>
      ) : (
        <Link
          to={href}
          className="flex items-center justify-between p-2 text-gray-800 rounded-lg hover:bg-blue-100"
        >
          <Icon className="mr-2" />
          <span className="flex-1 me-3">{label}</span>
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
