import { useEffect, useState } from 'react';
import {
  FaGraduationCap,
  FaUsers,
  FaCalendarCheck,
  FaClock,
  FaPlus,
  FaEye,
  FaUserPlus,
  FaChartLine,
  FaArrowRight
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '@/api/api';
import { PROGRAMS } from '@/utils/apiEndpoint';

export default function ProgramManagementOverview() {
  const [stats, setStats] = useState({
    totalPrograms: 0,
    activePrograms: 0,
    totalEnrollments: 0,
    completedPrograms: 0
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
        activePrograms: programs.filter(p => p.status === 'IN_PROGRESS').length,
        totalEnrollments: programs.reduce((sum, p) => sum + (p.enrollments?.length || 0), 0),
        completedPrograms: programs.filter(p => p.status === 'COMPLETED').length
      });
    } catch (error) {
      console.error('Failed to fetch programs', error);
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    { title: 'Total Programs', value: stats.totalPrograms, icon: FaGraduationCap },
    { title: 'Active Programs', value: stats.activePrograms, icon: FaClock },
    { title: 'Total Enrollments', value: stats.totalEnrollments, icon: FaUsers },
    { title: 'Completed Programs', value: stats.completedPrograms, icon: FaCalendarCheck }
  ];

  const quickActions = [
    {
      title: 'Add New Program',
      description: 'Create a new learnership, internship, or short course',
      icon: FaPlus,
      action: () => navigate('programs/new')
    },
    {
      title: 'View All Programs',
      description: 'Manage and edit existing programs',
      icon: FaEye,
      action: () => navigate('programs')
    },
    {
      title: 'Manage Enrollments',
      description: 'View and manage program enrollments',
      icon: FaUserPlus,
      action: () => navigate('programs/enrollments')
    },
    {
      title: 'View Reports',
      description: 'Program analytics and performance',
      icon: FaChartLine,
      action: () => navigate('programs/reports')
    }
  ];

  return (
    <div className="p-8 h-screen overflow-y-auto max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Program Management</h1>
        <p className="text-gray-500 mt-2 text-base">Manage learnerships, internships, and short courses</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {statsCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg hover:shadow-gray-100/50 transition-all duration-300"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium mb-1">{stat.title}</p>
                  <h3 className="text-3xl font-bold text-gray-900">{stat.value}</h3>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl">
                  <Icon className="text-xl text-gray-700" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="mb-10">
        <h2 className="text-lg font-semibold text-gray-900 mb-5">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, idx) => {
            const Icon = action.icon;
            return (
              <button
                key={idx}
                onClick={action.action}
                className="group bg-white rounded-2xl border border-gray-100 p-5 text-left hover:shadow-lg hover:shadow-gray-100/50 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="bg-gray-900 p-2.5 rounded-xl text-white shrink-0 group-hover:scale-105 transition-transform duration-300">
                    <Icon className="text-base" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-sm mb-1">{action.title}</h3>
                    <p className="text-gray-400 text-xs leading-relaxed">{action.description}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Getting Started CTA */}
      <div className="bg-gray-900 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between flex-wrap gap-6">
          <div className="max-w-lg">
            <h3 className="text-xl font-semibold mb-2">Ready to create your first program?</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Start by adding a new learnership, internship, or short course program to your dashboard.
            </p>
          </div>
          <button
            onClick={() => navigate('programs/new')}
            className="inline-flex items-center gap-2 bg-white text-gray-900 px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-100 transition-colors duration-200"
          >
            <FaPlus className="text-xs" />
            Create Program
            <FaArrowRight className="text-xs" />
          </button>
        </div>
      </div>
    </div>
  );
}