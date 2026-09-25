import { useAuth } from '@/contexts/AuthContext';
import DashboardSidebar from '@/components/common/DashboardSidebar';
import {
  ArrowLeft,
  ClipboardList,
  Folder,
  TrendingUp,
} from 'lucide-react';
import { Outlet, useLocation, useParams } from 'react-router-dom';

export default function UnitStandardLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const { programId } = useParams();
  const { unitStandard } = location.state || {};

  const userType = user?.role?.[0]?.toLowerCase() || 'facilitator';
  const basePath = `/user/${userType}/program-view/${programId}`;
  const unitPath = unitStandard?.id
    ? `${basePath}/unit-standards/${unitStandard.id}`
    : `${basePath}/unit-standards`;

  const navItems = [
    {
      icon: <ArrowLeft size={18} />,
      label: 'Programme view',
      path: basePath,
      exact: true,
    },
    {
      icon: <TrendingUp size={18} />,
      label: 'Overview',
      path: unitPath,
      exact: true,
    },
    {
      icon: <Folder size={18} />,
      label: 'Content',
      path: `${unitPath}/content`,
    },
    {
      icon: <ClipboardList size={18} />,
      label: 'Assessments',
      path: `${unitPath}/assessments`,
    },
  ];

  const unitStandardBadge = unitStandard ? (
    <div className="px-3 py-2 bg-zinc-900 rounded-lg">
      <div className="text-[10px] font-bold text-[#E30613] tracking-[0.2em] uppercase">
        Unit standard
      </div>
      <div className="text-xs text-zinc-300 truncate">
        {unitStandard.title || unitStandard.name}
      </div>
    </div>
  ) : null;

  return (
    <div className="h-screen flex text-zinc-800 bg-zinc-50 overflow-hidden">
      <DashboardSidebar
        menuItems={navItems}
        roleLabel={user?.role?.[0]?.replace(/_/g, ' ') || 'Facilitator'}
        homePath={basePath}
        user={user}
        onLogout={logout}
        headerExtra={unitStandardBadge}
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