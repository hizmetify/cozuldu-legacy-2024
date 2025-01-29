import Sidebar from '../components/Dashboard/Sidebar';
import DashboardHeader from '../components/Header/DashboardHeader';
import { Outlet } from 'react-router-dom';
const DashboardLayout = () => {
  return (
    <>
      <DashboardHeader />
      <Sidebar />
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default DashboardLayout;
