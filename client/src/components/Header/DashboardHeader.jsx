import { useDispatch } from 'react-redux';
import { toggleSidebar } from '../../features/sidebar/sidebarSlice';
import { HiOutlineMenuAlt2 } from 'react-icons/hi';
import { Link } from 'react-router-dom';

const DashboardHeader = () => {
  const dispatch = useDispatch();
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white border-b border-gray-200">
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 justify-start">
            <button className="sm:hidden flex items-center p-2 text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300">
              <HiOutlineMenuAlt2
                className="text-2xl"
                onClick={() => dispatch(toggleSidebar())}
              />
            </button>
            <Link className="font-bold text-2xl uppercase">Logo</Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
