import Sidebar from '../components/Dashboard/Sidebar';
import DashboardHeader from '../components/Header/DashboardHeader';
import { Outlet } from 'react-router-dom';
const DashboardLayout = () => {
  return (
    <>
      <DashboardHeader />
      <Sidebar />
      <main className="text-gray-500 bg-gray-100 p-4 sm:ml-64 flex flex-col-reverse lg:flex-row gap-2 transition-all duration-150 mt-14">
        <Outlet />
      </main>
    </>
  );
};

export default DashboardLayout;
