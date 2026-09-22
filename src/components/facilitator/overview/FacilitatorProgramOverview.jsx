import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { Badge } from 'react-bootstrap';
import {
  FaBook,
  FaClipboardList,
  FaUsers,
  FaEye
} from 'react-icons/fa';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { apiFetch } from '@/api/api';

export default function FacilitatorProgramOverview() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { programId } = useParams()
  const [program, setProgram] = useState(location?.state?.program);
  const [stats, setStats] = useState({
    totalLearners: 0,
    activeLearners: 0,
    totalUnitStandards: 0,
    totalAssessments: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (program?.id) {
      fetchProgramStats();
      fetchRecentActivities();
    }
  }, [program]);

  useEffect(() => {
    if (!program) {
      getProgram()
    }
  }, [location, programId])

  const getProgram = async () => {
    const data = await apiFetch(`/api/programs/${programId}`)
    setProgram(data?.payload)
  }

  const fetchProgramStats = async () => {
    try {
      const data = await apiFetch(`/api/programs/${program.id}/stats`);
      setStats(data?.payload)
    } catch (error) {
      console.error('Error fetching program stats:', error);
    }
  };

  const fetchRecentActivities = async () => {
    try {
      const activities = await apiFetch(`/api/activities/program/${program.id}?limit=5`);
      setRecentActivities(activities || []);
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const getProgramType = () => {
    return program?.category === "LEARNERSHIP" ? "Learnership" : "Short Course";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 h-screen overflow-y-auto bg-gray-50">
      <div className="max-w-7xl mx-auto p-8">

        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">📚</span>
                <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                  {getGreeting()}, {user?.firstname || 'Facilitator'}!
                </span>
                <Badge bg="secondary">{getProgramType()}</Badge>
              </div>
              <h1 className="text-2xl font-bold text-gray-800">
                {program?.name}
              </h1>
              <p className="text-gray-500 mt-1">Monitor content delivery and learner engagement</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                <FaUsers className="text-blue-500 text-lg" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{stats.totalLearners}</p>
                <p className="text-sm text-gray-500">Total Learners</p>
                <p className="text-xs text-gray-400">{stats.activeLearners} active</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
                <FaBook className="text-emerald-500 text-lg" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{stats.totalUnitStandards}</p>
                <p className="text-sm text-gray-500">Unit Standards</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
                <FaClipboardList className="text-amber-500 text-lg" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{stats.totalAssessments}</p>
                <p className="text-sm text-gray-500">Assessments</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden mb-6">
          <div className="px-5 py-3 border-b border-gray-100">
            <h3 className="font-semibold text-gray-800">Recent Activity</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {recentActivities.length === 0 ? (
              <div className="p-6 text-center text-gray-400">No recent activities</div>
            ) : (
              recentActivities.map((activity) => (
                <div key={activity.id} className="px-5 py-3 flex items-center gap-3 hover:bg-gray-50">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-700">{activity.description}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(activity.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="px-5 py-2 bg-gray-50 border-t border-gray-100 text-right">
            <button
              onClick={() => navigate('activities', { state: { program } })}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              View All →
            </button>
          </div>
        </div>

        {/* Program Description */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h5 className="font-semibold text-gray-800 mb-3">Program Description</h5>
          <div
            className="prose prose-blue max-w-none text-gray-600 leading-relaxed text-sm"
            dangerouslySetInnerHTML={{ __html: program?.description || '' }}
          />
        </div>
      </div>
    </div>
  );
}