import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaGraduationCap,
  FaUsers,
  FaCalendarCheck,
  FaClock,
  FaPlus,
  FaEye,
  FaUserPlus,
  FaChartLine,
  FaArrowRight,
} from 'react-icons/fa';
import { apiFetch } from '@/api/api';
import { PROGRAMS } from '@/utils/apiEndpoint';

export default function ProgramManagementOverview() {
  const [stats, setStats] = useState({
    totalPrograms: 0,
    activePrograms: 0,
    totalEnrollments: 0,
    completedPrograms: 0,
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getPrograms();
  }, []);

  const getPrograms = async () => {
    try {
      setLoading(true);
      const result = await apiFetch(`${PROGRAMS}`, { method: 'GET' });
      const programs = result?.payload || [];

      setStats({
        totalPrograms: programs.length,
        activePrograms: programs.filter((p) => p.status === 'IN_PROGRESS').length,
        totalEnrollments: programs.reduce(
          (sum, p) => sum + (p.enrollments?.length || 0),
          0
        ),
        completedPrograms: programs.filter((p) => p.status === 'COMPLETED').length,
      });
    } catch (error) {
      // silently fail
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    { title: 'Total Programmes', value: stats.totalPrograms,     icon: FaGraduationCap, to: 'programmes' },
    { title: 'Active',           value: stats.activePrograms,    icon: FaClock,         to: 'programmes?status=IN_PROGRESS' },
    { title: 'Enrolments',       value: stats.totalEnrollments,  icon: FaUsers,         to: 'programmes/enrollments' },
    { title: 'Completed',        value: stats.completedPrograms, icon: FaCalendarCheck, to: 'programmes?status=COMPLETED' },
  ];

  const quickActions = [
    { title: 'Add New Programme',    description: 'Create a learnership, internship or short course', icon: FaPlus,     to: 'programmes/new' },
    { title: 'View All Programmes',  description: 'Manage and edit existing programmes',              icon: FaEye,      to: 'programs' },
    { title: 'Manage Enrolments',    description: 'View and manage learner enrolments',               icon: FaUserPlus, to: 'programmes/enrollments' },
    { title: 'View Reports',         description: 'Programme analytics and performance',              icon: FaChartLine,to: 'programmes/reports' },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">

      {/* Heading */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-extrabold text-black mb-1">
          Programme Management
        </h1>
        <p className="text-sm text-zinc-500">
          Manage learnerships, internships and short courses.
        </p>
      </div>

      {/* Stats — 2 per row on phones, 4 per row on desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        {statsCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <button
              key={idx}
              onClick={() => navigate(stat.to)}
              className="group text-left bg-white border border-zinc-200 rounded-xl p-3 sm:p-4 hover:border-black transition-colors min-w-0"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 bg-zinc-100 group-hover:bg-black rounded-lg flex items-center justify-center transition-colors mb-2 sm:mb-3">
                <Icon className="text-zinc-600 group-hover:text-white text-xs sm:text-sm transition-colors" />
              </div>
              <div className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-black tabular-nums leading-tight mb-0.5">
                {loading ? '—' : stat.value}
              </div>
              <div className="text-[10px] sm:text-[11px] font-medium text-zinc-500 uppercase tracking-wider truncate">
                {stat.title}
              </div>
            </button>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="mb-6 sm:mb-8">
        <h2 className="text-base font-bold text-black mb-3 sm:mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {quickActions.map((action, idx) => {
            const Icon = action.icon;
            return (
              <button
                key={idx}
                onClick={() => navigate(action.to)}
                className="group text-left bg-white border border-zinc-200 rounded-xl p-3 sm:p-4 hover:border-black transition-colors flex items-center gap-3 min-w-0"
              >
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-zinc-100 group-hover:bg-black rounded-lg flex items-center justify-center shrink-0 transition-colors">
                  <Icon className="text-zinc-600 group-hover:text-white text-xs sm:text-sm transition-colors" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-xs sm:text-sm text-black mb-0.5 truncate">
                    {action.title}
                  </div>
                  <div className="text-[11px] sm:text-xs text-zinc-500 leading-snug line-clamp-2">
                    {action.description}
                  </div>
                </div>
                <FaArrowRight
                  size={10}
                  className="text-zinc-300 group-hover:text-black group-hover:translate-x-0.5 transition-all shrink-0 hidden sm:block"
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-zinc-900 rounded-2xl p-5 sm:p-6 lg:p-8 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="max-w-lg">
            <h3 className="text-base sm:text-lg lg:text-xl font-bold mb-1.5">
              Ready to create your first programme?
            </h3>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
              Start by adding a learnership, internship or short course to your dashboard.
            </p>
          </div>
          <button
            onClick={() => navigate('programmes/new')}
            className="inline-flex items-center justify-center gap-2 bg-white text-black px-4 sm:px-5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold hover:bg-zinc-100 transition-colors shrink-0 w-full sm:w-auto whitespace-nowrap"
          >
            <FaPlus size={10} />
            Create Programme
            <FaArrowRight size={10} />
          </button>
        </div>
      </div>
    </div>
  );
}