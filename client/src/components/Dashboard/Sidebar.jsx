import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useRef } from 'react';
import {
  selectSidebar,
  toggleSidebar,
} from '../../features/sidebar/sidebarSlice';
import { FaBullhorn } from 'react-icons/fa6';
import { IoMdSettings } from 'react-icons/io';
import { FaSignOutAlt } from 'react-icons/fa';
import { DiGoogleAnalytics } from 'react-icons/di';
import { MdFavorite } from 'react-icons/md';
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
    href: '/dashboard/statistics',
    label: 'İstatistikler',
    icon: DiGoogleAnalytics,
    isLogout: false,
  },
  {
    id: 3,
    href: '/dashboard/favorites',
    label: 'Favoriler',
    icon: MdFavorite,
    isLogout: false,
  },
  {
    id: 4,
    href: '/dashboard/settings',
    label: 'Ayarlar',
    icon: IoMdSettings,
    isLogout: false,
  },
  {
    id: 5,
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
      className={`fixed top-0 left-0 z-30 w-64 h-screen pt-24 bg-gradient-to-b from-white to-blue-50 border-r border-blue-100 transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } sm:translate-x-0 shadow-lg shadow-blue-100/50`}
    >
      <div className="h-full px-3 py-5">
        <div className="mb-6 px-4">
          <h2 className="text-lg font-bold text-blue-800">Dashboard</h2>
          <p className="text-sm text-blue-600 opacity-75">Hesabınızı yönetin</p>
        </div>
        <ul className="space-y-2">
          {sidebarLinks.map((link) => (
            <SidebarLink key={link.id} {...link} />
          ))}
        </ul>

        {/*         <div className="absolute bottom-8 left-0 right-0 px-6">
          <div className="p-4 rounded-lg bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-md">
            <h3 className="font-medium mb-2">İlanlarınızı Yükseltin</h3>
            <p className="text-xs text-blue-100 mb-3">Premium üyelik ile ilanlarınız daha fazla görüntülensin</p>
            <button className="w-full py-1.5 bg-white text-blue-700 rounded text-sm font-medium hover:bg-blue-50 transition-colors">
              Premium'a Geç
            </button>
          </div>
        </div> */}
      </div>
    </aside>
  );
};

export default Sidebar;
