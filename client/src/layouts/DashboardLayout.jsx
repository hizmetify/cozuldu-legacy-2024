import Sidebar from '../components/Dashboard/Sidebar';
import DashboardHeader from '../components/Header/DashboardHeader';
import { Outlet } from 'react-router-dom';
const DashboardLayout = () => {
  return (
    <>
      <DashboardHeader />
      <Sidebar />
      <main className="text-gray-500 bg-gray-100 pt-4 pl-2 sm:ml-64 mt-14">
        <Outlet />
      </main>
    </>
  );
};

export default DashboardLayout;
