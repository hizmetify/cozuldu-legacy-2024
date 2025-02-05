import { useSelector } from 'react-redux';
import { selectSidebar } from '../../features/sidebar/sidebarSlice';
import { FaBullhorn } from 'react-icons/fa6';
import { IoMdSettings } from 'react-icons/io';
import { FaSignOutAlt } from 'react-icons/fa';
import SidebarLink from './SidebarLink';

const sidebarLinks = [
  {
    id: 1,
    href: '/dashboard/my-ads',
    label: 'İlanlarım',
    icon: FaBullhorn,
    isLogout: false,
  },
  {
    id: 2,
    href: '/dashboard/settings',
    label: 'Ayarlar',
    icon: IoMdSettings,
    isLogout: false,
  },
  {
    id: 3,
    label: 'Çıkış yap',
    icon: FaSignOutAlt,
    isLogout: true,
  },
];

const Sidebar = () => {
  const isOpen = useSelector(selectSidebar);

  return (
    <aside
      className={`fixed top-0 left-0 z-30 w-64 h-screen pt-24 bg-white border-r border-blue-200 sm:translate-x-0 transition-transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="h-full px-3 py-5">
        <ul className="font-medium flex items-start gap-2 flex-col">
          {sidebarLinks.map((link) => (
            <SidebarLink key={link.id} {...link} />
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
