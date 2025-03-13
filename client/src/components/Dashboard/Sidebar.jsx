import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useRef } from 'react';
import {
  selectSidebar,
  toggleSidebar,
} from '../../features/sidebar/sidebarSlice';
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
  const dispatch = useDispatch();
  const isOpen = useSelector(selectSidebar);

  const sidebarRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        isOpen
      ) {
        dispatch(toggleSidebar());
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dispatch, isOpen]);

  return (
    <aside
      ref={sidebarRef}
      className={`fixed top-0 left-0 z-30 w-64 h-screen pt-24 bg-white border-r border-neutral-200 transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } sm:translate-x-0`}
    >
      <div className="h-full px-3 py-5">
        <ul className="space-y-1.5">
          {sidebarLinks.map((link) => (
            <SidebarLink key={link.id} {...link} />
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
