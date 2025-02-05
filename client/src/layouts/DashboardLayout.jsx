import Sidebar from '../components/Dashboard/Sidebar';
import DashboardHeader from '../components/Header/DashboardHeader';
import { Outlet } from 'react-router-dom';
const DashboardLayout = () => {
  return (
    <>
      <DashboardHeader />
      <Sidebar />
      <main className="text-gray-500 bg-white sm:ml-64 mt-14">
        <Outlet />
      </main>
    </>
  );
};

export default DashboardLayout;
