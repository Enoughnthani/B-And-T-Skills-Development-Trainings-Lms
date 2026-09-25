import { Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import DashboardSidebar from '@/components/common/DashboardSidebar';
import {
  FaChartLine, FaUsers, FaTasks, FaHistory,
  FaBell, FaCog, FaQuestionCircle,FaBullhorn,
  FaInbox
} from 'react-icons/fa';


const MENU = [
  { icon: <FaChartLine />, label: 'Dashboard', path: '/user/admin' },
  { icon: <FaUsers />, label: 'Users', path: '/user/admin/users' },
  { icon: <FaBullhorn />, label: 'Announcement', path: '/user/admin/announcements' },
  { icon: <FaInbox />, label: 'Enquiries', path: '/user/admin/enquiries' },
  { icon: <FaTasks />, label: 'Reports', path: '/user/admin/reports' },
  { icon: <FaHistory />, label: 'Activities', path: '/user/admin/activities' },
  { icon: <FaBell />, label: 'Notifications', path: '/user/admin/notifications' },
  { icon: <FaCog />, label: 'Settings', path: '/user/admin/settings' },
  { icon: <FaQuestionCircle />, label: 'Help', path: '/user/admin/help' },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="h-screen flex text-zinc-800 bg-zinc-50 overflow-hidden">
      <DashboardSidebar
        menuItems={MENU}
        roleLabel="Admin Panel"
        homePath="/user/admin"
        user={user}
        onLogout={logout}
      />

<main
  data-scroll-container
  className="flex-1 min-w-0 overflow-y-auto bg-zinc-50"
>
  <Outlet />
</main>
     
    </div>
  );
}