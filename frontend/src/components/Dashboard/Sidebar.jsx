import { useSelector, useDispatch } from 'react-redux';
import { selectSidebar } from '../../features/sidebarSlice';
import SidebarLink from './SidebarLink';
import { useCallback } from 'react';
import { logout } from '../../features/authSlice';

const Sidebar = () => {
  const dispatch = useDispatch();
  const handleLogout = useCallback(async () => {
    try {
      dispatch(logout());
    } catch (error) {
      console.error(error);
    }
  }, [dispatch]);
  const isSidebarOpen = useSelector(selectSidebar);
  return (
    <aside
      className={`fixed top-0 left-0 z-30 w-64 h-screen pt-24 bg-white border-r border-gray-200 sm:translate-x-0  transition-transform ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="h-full px-3 py-5">
        <ul className="font-medium flex items-start gap-2 flex-col">
          <SidebarLink onClick={handleLogout} label={"Çıkış yap"} />
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
