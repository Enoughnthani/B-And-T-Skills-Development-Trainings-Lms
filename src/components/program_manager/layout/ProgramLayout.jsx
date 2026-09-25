import { Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import DashboardSidebar from '@/components/common/DashboardSidebar';
import {
  FaTachometerAlt, FaGraduationCap, FaUsers,
  FaClipboardCheck, FaBullhorn, FaUser,
} from 'react-icons/fa';

const MENU = [
  { icon: <FaTachometerAlt />,  label: 'Overview',     path: '/user/program-manager' },
  { icon: <FaGraduationCap />,  label: 'Programmes',   path: '/user/program-manager/programmes' },
  { icon: <FaUsers />,          label: 'Learners',     path: '/user/program-manager/learners' },
  { icon: <FaClipboardCheck />, label: 'Assessments',  path: '/user/program-manager/assessments' },
  { icon: <FaBullhorn />,       label: 'Announcements',path: '/user/program-manager/announcements' },
  { icon: <FaUser />,           label: 'Profile',      path: '/user/program-manager/profile' },
];

export default function ProgramManagerLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="h-screen flex text-zinc-800 bg-zinc-50 overflow-hidden">
      <DashboardSidebar
        menuItems={MENU}
        roleLabel="Program Manager"
        homePath="/user/program-manager"
        user={user}
        onLogout={logout}
      />

      <main
        data-scroll-container
        className="flex-1 min-w-0 h-screen overflow-y-auto bg-zinc-50"
      >
        <div className="md:hidden h-14" />
        <Outlet />
      </main>
    </div>
  );
}