import { NavLink } from 'react-router-dom';

const SidebarLink = ({ href, icon: Icon, label, onClick }) => {
  return (
    <li>
      <NavLink to={href} onClick={onClick}>
        {label}
      </NavLink>
    </li>
  );
};

export default SidebarLink;
