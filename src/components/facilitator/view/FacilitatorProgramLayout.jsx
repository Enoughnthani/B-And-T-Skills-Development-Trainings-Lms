import { apiFetch } from '@/api/api';
import DashboardSidebar from '@/components/common/DashboardSidebar';
import { useAuth } from '@/contexts/AuthContext';
import {
  Activity,
  Book,
  ChartArea,
  Home,
  Users,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';

export default function FacilitatorProgramLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { programId } = useParams();
  const { user, logout } = useAuth();
  const [program, setProgram] = useState(location?.state?.program || null);

  const userType = user?.role?.[0]?.toLowerCase() || 'facilitator';
  const homePath = `/user/${userType}`;
  const basePath = `${homePath}/program-view/${programId}`;

  useEffect(() => {
    async function load() {
      try {
        const data = await apiFetch(`/api/programs/${programId}`);
        setProgram(data?.payload);
      } catch {
        // ignore
      }
    }
    if (!program) load();
  }, [programId]);

  const navItems = [
    { icon: <ChartArea size={18} />, label: 'Overview', path: basePath, exact: true },
    { icon: <Book size={18} />, label: 'Unit Standards', path: `${basePath}/unit-standards` },
    { icon: <Users size={18} />, label: 'Learners', path: `${basePath}/learners` },
    { icon: <Activity size={18} />, label: 'Activities', path: `${basePath}/activities` },
  ];
  const programBadge = program ? (
    <div className="px-3 py-2 bg-zinc-900 rounded-lg">
      <div className="text-[10px] font-bold text-[#E30613] tracking-[0.2em] uppercase">
        Programme
      </div>
      <div className="text-xs text-zinc-300 truncate">{program.name}</div>
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
        headerExtra={programBadge}
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