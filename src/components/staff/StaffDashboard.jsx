import { apiFetch } from '@/api/api';
import { useAuth } from '@/contexts/AuthContext';
import { BASE_URL } from '@/utils/apiEndpoint';
import {
  ArrowRight,
  Bell,
  BookOpen,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ClipboardCheck,
  Clock,
  FileText,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  MapPin,
  Search,
  Settings,
  User2,
  UserCheck,
  Users,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import LogoImage from '../common/LogoImage';

const ROLE_CONFIG = {
  MODERATOR: {
    title: 'Moderator',
    icon: LayoutDashboard,
    roleFilter: 'MODERATOR',
    stats: [
      { key: 'totalPrograms', label: 'Total programmes', icon: LayoutDashboard },
      { key: 'activePrograms', label: 'Active now', icon: Calendar },
      { key: 'totalEnrolled', label: 'Total enrolled', icon: Users },
    ],
    getStats: (programs) => ({
      totalPrograms: programs.length,
      activePrograms: programs.filter((p) => p.status === 'ACTIVE').length,
      totalEnrolled: programs.reduce((acc, p) => acc + (p.enrolledCount || 0), 0),
    }),
    getCardBadge: (program) =>
      program.enrolledCount > 0
        ? `${program.enrolledCount}/${program.capacity} enrolled`
        : null,
    getFooterValue: (program) => ({
      count: program.enrolledCount || 0,
      label: 'enrolled',
      icon: Users,
    }),
    navigateTo: (programId) => `/user/moderator/program-view/${programId}`,
    emptyMessage:
      "You don't have any programmes assigned to you as a moderator yet.",
  },
  ASSESSOR: {
    title: 'Assessor',
    icon: ClipboardCheck,
    roleFilter: 'ASSESSOR',
    stats: [
      { key: 'totalPrograms', label: 'Total programmes', icon: LayoutDashboard },
      { key: 'pendingReview', label: 'Pending review', icon: Clock },
      { key: 'totalSubmissions', label: 'Submissions', icon: CheckCircle2 },
    ],
    getStats: (programs, user) => {
      const getPending = (p) =>
        p.submissions?.filter(
          (s) => s.status === 'PENDING' && s.assessorId === user?.id
        ).length || 0;
      const getTotal = (p) =>
        p.submissions?.filter((s) => s.assessorId === user?.id).length || 0;
      return {
        totalPrograms: programs.length,
        pendingReview: programs.reduce((acc, p) => acc + getPending(p), 0),
        totalSubmissions: programs.reduce((acc, p) => acc + getTotal(p), 0),
      };
    },
    getCardBadge: (program, user) => {
      const pending =
        program.submissions?.filter(
          (s) => s.status === 'PENDING' && s.assessorId === user?.id
        ).length || 0;
      return pending > 0 ? `${pending} pending` : null;
    },
    getFooterValue: (program, user) => {
      const total =
        program.submissions?.filter((s) => s.assessorId === user?.id)
          .length || 0;
      return { count: total, label: 'submissions', icon: Users };
    },
    navigateTo: (programId) => `/user/assessor/program-view/${programId}`,
    emptyMessage:
      "You don't have any programmes assigned to you as an assessor yet.",
  },
  FACILITATOR: {
    title: 'Facilitator',
    icon: Users,
    roleFilter: 'FACILITATOR',
    stats: [
      { key: 'totalPrograms', label: 'Total programmes', icon: LayoutDashboard },
      { key: 'activeLearners', label: 'Active learners', icon: UserCheck },
      { key: 'upcomingSessions', label: 'Upcoming sessions', icon: Clock },
    ],
    getStats: (programs) => {
      const getUpcoming = (p) =>
        p.sessions?.filter((s) => new Date(s.date) > new Date()).length || 0;
      return {
        totalPrograms: programs.length,
        activeLearners: programs.reduce(
          (acc, p) => acc + (p.enrolledCount || 0),
          0
        ),
        upcomingSessions: programs.reduce((acc, p) => acc + getUpcoming(p), 0),
      };
    },
    getCardBadge: (program) =>
      program.enrolledCount > 0 ? `${program.enrolledCount} learners` : null,
    getFooterValue: (program) => {
      const upcoming =
        program.sessions?.filter((s) => new Date(s.date) > new Date()).length ||
        0;
      return { count: upcoming, label: 'sessions', icon: BookOpen };
    },
    navigateTo: (programId) => `/user/facilitator/program-view/${programId}`,
    emptyMessage:
      "You don't have any programmes assigned to you as a facilitator yet.",
  },
};

const STATUS_STYLES = {
  IN_PROGRESS: 'bg-zinc-100 text-zinc-700',
  INPROGRESS: 'bg-zinc-100 text-zinc-700',
  PENDING: 'bg-red-50 text-[#E30613]',
  COMPLETED: 'bg-zinc-900 text-white',
  NOT_STARTED: 'bg-zinc-100 text-zinc-500',
  NOTSTARTED: 'bg-zinc-100 text-zinc-500',
  ACTIVE: 'bg-zinc-100 text-zinc-700',
  CANCELLED: 'bg-red-50 text-[#E30613]',
};

const STATUS_LABELS = {
  IN_PROGRESS: 'In progress',
  INPROGRESS: 'In progress',
  PENDING: 'Pending',
  COMPLETED: 'Completed',
  NOT_STARTED: 'Not started',
  NOTSTARTED: 'Not started',
  ACTIVE: 'Active',
  CANCELLED: 'Cancelled',
};

export default function StaffDashboard() {
  const { user, logout } = useAuth();
  const [programs, setPrograms] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const currentRole = useMemo(() => {
    const path = location.pathname.toLowerCase();
    if (path.includes('moderator')) return 'MODERATOR';
    if (path.includes('assessor')) return 'ASSESSOR';
    if (path.includes('facilitator')) return 'FACILITATOR';
    return 'FACILITATOR';
  }, [location.pathname]);

  const config = ROLE_CONFIG[currentRole];
  const stats = config.getStats(programs, user);
  const HeaderIcon = config.icon || LayoutDashboard;

  useEffect(() => {
    setPrograms(
      user?.assignedPrograms?.filter((program) =>
        program.assignedRoles?.includes(config.roleFilter)
      ) || []
    );
  }, [currentRole, user, config.roleFilter]);

  function handleSwitchRole(role) {
    const paths = {
      MODERATOR: '/user/moderator',
      ASSESSOR: '/user/assessor',
      FACILITATOR: '/user/facilitator',
    };
    navigate(paths[role] || '/user/facilitator');
  }

  const userRoles = user?.role || [];

  const filteredPrograms = programs.filter(
    (program) =>
      program.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      program.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  function formatDate(dateString) {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('en-ZA', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }

  function formatDateShort(dateString) {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-ZA', {
      day: 'numeric',
      month: 'short',
    });
  }

  function cleanDescription(html) {
    if (!html) return '';
    const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    return text.length > 140 ? text.substring(0, 140) + '…' : text;
  }

  return (
    <div className="min-h-screen bg-zinc-50">

      <header className="sticky top-0 z-40 bg-white border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            <div className="flex items-center gap-3 shrink-0">
              <LogoImage onClick={() => navigate(`/user/${currentRole.toLowerCase()}`)} />
            </div>

            <div className="hidden md:flex items-center flex-1 max-w-md">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-3.5 h-3.5" />
                <input
                  type="text"
                  placeholder="Search programmes…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-zinc-50 border border-zinc-200 rounded-lg focus:border-[#E30613] focus:bg-white outline-none transition-colors"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">

              <button
                className="relative w-10 h-10 flex items-center justify-center text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors"
                aria-label="Notifications"
              >
                <Bell size={18} />
              </button>

              {userRoles.length > 1 && (
                <Dropdown align="end">
                  <Dropdown.Toggle className="!bg-white !border !border-zinc-300 !text-zinc-700 hover:!border-zinc-400 !shadow-none !text-sm !font-medium !rounded-lg !px-3 !py-2 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E30613]" />
                    <span className="hidden sm:inline">{config.title}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
                  </Dropdown.Toggle>

                  <Dropdown.Menu className="min-w-[180px] border border-zinc-200 rounded-lg shadow-lg py-1 mt-1">
                    <div className="px-3 py-2 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                      Switch role
                    </div>
                    {userRoles.map((role) => (
                      <Dropdown.Item
                        key={role}
                        onClick={() => handleSwitchRole(role)}
                        className={`flex items-center gap-3 text-sm py-2 px-3 rounded-md mx-1 ${
                          currentRole === role
                            ? 'bg-red-50 text-[#E30613] font-semibold'
                            : 'text-zinc-700 hover:!bg-zinc-50'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            currentRole === role ? 'bg-[#E30613]' : 'bg-zinc-300'
                          }`}
                        />
                        {role.replace(/_/g, ' ')}
                        {currentRole === role && (
                          <span className="ml-auto text-[10px] bg-white px-1.5 py-0.5 rounded text-[#E30613]">
                            Active
                          </span>
                        )}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              )}

              <button
                onClick={() => navigate('profile')}
                className="w-10 h-10 flex items-center justify-center text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors"
                aria-label="Profile"
              >
                <User2 size={18} />
              </button>

              <button
                onClick={logout}
                className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-zinc-600 hover:text-[#E30613] hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

        <div className="mb-6">
          <h1 className="text-xl sm:text-2xl font-extrabold text-zinc-900 mb-1">
            {config.title} dashboard
          </h1>
          <p className="text-sm text-zinc-500">
            Welcome back, {user?.firstname} {user?.lastname}.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          {config.stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.key}
                className="bg-white border border-zinc-200 rounded-xl p-4"
              >
                <div className="w-9 h-9 bg-zinc-100 rounded-lg flex items-center justify-center mb-3">
                  <Icon className="text-zinc-600" size={14} />
                </div>
                <div className="text-2xl font-extrabold text-zinc-900 tabular-nums mb-0.5">
                  {stats[stat.key]}
                </div>
                <div className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
          <div className="min-w-0">
            <h2 className="text-base font-bold text-zinc-900">
              Assigned programmes
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              {currentRole === 'MODERATOR' &&
                'Manage and oversee your learning programmes.'}
              {currentRole === 'ASSESSOR' &&
                'Select a programme to review and assess submissions.'}
              {currentRole === 'FACILITATOR' &&
                'Select a programme to manage sessions and learners.'}
            </p>
          </div>

          <div className="relative w-full sm:w-72 md:hidden shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-3.5 h-3.5" />
            <input
              type="text"
              placeholder="Search programmes…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-zinc-300 rounded-lg focus:border-[#E30613] outline-none transition-colors"
            />
          </div>
        </div>

        {filteredPrograms.length === 0 ? (
          <div className="bg-white border border-zinc-200 rounded-xl p-12 text-center">
            <div className="w-14 h-14 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <HeaderIcon className="text-zinc-400" size={20} />
            </div>
            <h3 className="font-bold text-zinc-900 mb-1">
              {searchQuery ? 'No programmes found' : 'No programmes assigned yet'}
            </h3>
            <p className="text-sm text-zinc-500 max-w-md mx-auto">
              {searchQuery
                ? 'Try adjusting your search terms.'
                : config.emptyMessage}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPrograms.map((program) => {
              const cardBadge = config.getCardBadge(program, user);
              const footerValue = config.getFooterValue(program, user);
              const FooterIcon = footerValue.icon;

              return (
                <div
                  key={program.id}
                  onClick={() =>
                    navigate(config.navigateTo(program.id), {
                      state: { program },
                    })
                  }
                  className="group bg-white border border-zinc-200 rounded-xl overflow-hidden hover:border-zinc-400 transition-colors cursor-pointer flex flex-col"
                >
                  <div className="relative h-40 bg-zinc-900 overflow-hidden">
                    {program.imageUrl ? (
                      <img
                        src={BASE_URL + program.imageUrl}
                        alt={program.name}
                        className="w-full h-full object-cover opacity-70 group-hover:opacity-60 transition-opacity"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <HeaderIcon className="text-zinc-700" size={32} />
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/80 via-zinc-900/20 to-transparent" />

                    <div className="absolute top-3 left-3">
                      <span
                        className={`inline-block text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider ${
                          STATUS_STYLES[program.status] ||
                          'bg-zinc-100 text-zinc-600'
                        }`}
                      >
                        {STATUS_LABELS[program.status] || program.status}
                      </span>
                    </div>

                    {cardBadge && (
                      <div className="absolute top-3 right-3">
                        <span className="inline-block text-[10px] font-bold bg-[#E30613] text-white px-2 py-1 rounded uppercase tracking-wider">
                          {cardBadge}
                        </span>
                      </div>
                    )}

                    <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                        <ArrowRight className="w-3.5 h-3.5 text-zinc-900" />
                      </div>
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col">
                    <h3 className="font-bold text-zinc-900 mb-2 line-clamp-1 group-hover:text-[#E30613] transition-colors">
                      {program.name}
                    </h3>

                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {program.type && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-zinc-100 text-zinc-600 px-2 py-1 rounded">
                          <FileText size={9} />
                          {program.type}
                        </span>
                      )}
                      {program.category && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-zinc-100 text-zinc-600 px-2 py-1 rounded">
                          <GraduationCap size={9} />
                          {program.category.replace(/_/g, ' ')}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-zinc-500 leading-relaxed mb-3 line-clamp-2">
                      {cleanDescription(program.description)}
                    </p>

                    <div className="space-y-2 mt-auto">
                      <div className="flex items-center gap-2 text-xs text-zinc-600">
                        <div className="w-6 h-6 rounded bg-zinc-100 flex items-center justify-center shrink-0">
                          <Calendar className="w-3 h-3 text-zinc-500" />
                        </div>
                        <span className="truncate">
                          {formatDateShort(program.startDate)} – {formatDate(program.endDate)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-zinc-600">
                        <div className="w-6 h-6 rounded bg-zinc-100 flex items-center justify-center shrink-0">
                          <MapPin className="w-3 h-3 text-zinc-500" />
                        </div>
                        <span className="truncate">
                          {program.location || 'Location not specified'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-4 pt-3 border-t border-zinc-100 text-xs text-zinc-500">
                      <FooterIcon size={11} className="shrink-0" />
                      <span className="font-bold text-zinc-700 tabular-nums">
                        {footerValue.count}
                      </span>
                      <span className="truncate">{footerValue.label}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}