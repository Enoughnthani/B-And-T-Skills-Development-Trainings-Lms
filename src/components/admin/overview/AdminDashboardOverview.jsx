// components/AdminDashboardOverview.jsx
import { apiFetch } from "@/api/api";
import { ADMIN } from "@/utils/apiEndpoint";
import { useEffect, useState } from "react";
import { Badge, Button, Card, Placeholder } from "react-bootstrap";
import {
  FaBan,
  FaBook,
  FaBriefcase,
  FaBullhorn,
  FaCertificate,
  FaChalkboardTeacher,
  FaCheckCircle,
  FaEdit,
  FaPlusCircle,
  FaSyncAlt,
  FaTrash,
  FaUser,
  FaUserPlus,
  FaUsers,
  FaUserTag
} from "react-icons/fa";
import { FiClock, FiTarget } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function AdminDashboardOverview({
  users,
  visible,
  user,
  handleMenuItemClick,
  setStep,
  setShowModal
}) {

  const [response, setResponse] = useState(null)
  const [stats, setStats] = useState(null)
  const [activities, setActivities] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    getStats()
    getActivities()
  }, [])



  async function getStats() {
    try {

      const result = await apiFetch(`${ADMIN}/stats`)
      setResponse(result)

      if (result?.success) {
        setStats(result?.payload)
      }

    } catch (e) {
      setResponse({ success: false, message: "An error occured while fetching stats." })
    }
  }

  async function getActivities() {
    try {
      const result = await apiFetch(`${ADMIN}/activities`)
      setResponse(result)

      if (result?.success) {
        setActivities(result?.payload)
      }

    } catch (e) {
      setResponse({ success: false, message: "An error occured while fetching activities." })
    }
  }

  const getNewActivitiesCount = () => {
    const last24Hours = new Date();
    last24Hours.setHours(last24Hours.getHours() - 24);

    return activities.filter(activity =>
      new Date(activity.createdAt) > last24Hours
    ).length;
  };

  const formatRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} min${diffInMinutes > 1 ? 's' : ''} ago`;
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;

    return date.toLocaleDateString();
  };


  return (
    <main className="flex-1 p-6 overflow-y-auto h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            Dashboard
          </h1>
          <p className="text-gray-600">Track intern progress and learnership completion</p>
        </div>
        <div className="flex items-center gap-4">
          {visible ? (
            <>
              <button
                className="w-[170px] m-0 flex items-center bg-white px-2 rounded-lg border border-gray-200 ">
                <Placeholder animation="wave" as="div">
                  <Placeholder className="m rounded-[50%] w-[35px] h-[35px]" xs={6} />
                </Placeholder>

                <div className="flex-1">
                  <Placeholder xs={9} size="sm" />
                  <Placeholder xs={4} size="sm" />
                </div>
              </button>
            </>)
            : (
              <></>
            )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {[
          { title: "Total Users", value: stats?.totalUsers || 0, icon: <FaUsers className="w-8 h-8" />, color: "blue", bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-600", gradient: "from-blue-500 to-indigo-600" },
          { title: "Total Programs", value: stats?.totalPrograms || 0, icon: <FaBook className="w-8 h-8" />, color: "cyan", bg: "bg-cyan-50", border: "border-cyan-200", text: "text-cyan-600", gradient: "from-cyan-400 to-blue-500" },
          { title: "Active Learnerships", value: stats?.totalActiveLearnerships || 0, icon: <FaChalkboardTeacher className="w-8 h-8" />, color: "emerald", bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-600", gradient: "from-emerald-500 to-teal-600" },
          { title: "Active Internships", value: stats?.totalActiveInternships || 0, icon: <FaBriefcase className="w-8 h-8" />, color: "orange", bg: "bg-orange-50", border: "border-orange-200", text: "text-orange-600", gradient: "from-orange-500 to-rose-600" },
          { title: "Active Short Courses", value: stats?.totalActiveShortCourses || 0, icon: <FaCertificate className="w-8 h-8" />, color: "violet", bg: "bg-violet-50", border: "border-violet-200", text: "text-violet-600", gradient: "from-violet-500 to-fuchsia-600" },
        ].map((stat, index) => (
          <Card
            key={index}
            className={`group relative overflow-hidden bg-white border ${stat.border} rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 ease-out hover:-translate-y-1 cursor-pointer`}
          >
            {/* Hover background */}
            <div className={`absolute inset-0 ${stat.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

            <Card.Body className="relative p-6 flex flex-col items-center text-center">
              {/* Title - Top */}
              <p className={`text-xs font-semibold uppercase tracking-wider ${stat.text} mb-4`}>
                {stat.title}
              </p>

              {/* Icon - Middle */}
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${stat.gradient} shadow-lg shadow-${stat.color}-500/30 flex items-center justify-center text-white mb-4 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                {stat.icon}
              </div>

              {/* Value - Bottom */}
              <h2 className="text-3xl font-bold text-gray-900 tabular-nums">
                {stat.value.toLocaleString()}
              </h2>
            </Card.Body>

            {/* Bottom accent line */}
            <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`} />
          </Card>
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {activities?.length > 0 &&
            <Card className="border-0 h-full border-t-4 border-blue-500">
              <Card.Header className="bg-white border-0 py-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <h5 className="font-bold text-gray-800">Recent Activity</h5>
                  <Badge bg="primary" pill className="px-2">{getNewActivitiesCount()} New</Badge>
                </div>

                {activities?.length > 3 &&
                  <Button
                    onClick={() => navigate('activities', { state: { activities: activities } })}
                    variant="link" size="sm" className="text-blue-600 p-0 font-medium"
                  >
                    View All →
                  </Button>
                }
              </Card.Header>

              <Card.Body className="pt-0">
                <div className="space-y-4">
                  {activities.slice(0, 3).map((act, idx) => {
                    const getActionStyles = (actionType) => {
                      switch (actionType?.toUpperCase()) {
                        case 'ACTIVATED':
                          return {
                            bg: 'bg-emerald-50',
                            border: 'border-emerald-200 hover:border-emerald-400',
                            text: 'text-emerald-700',
                            iconBg: 'bg-emerald-100',
                            icon: <FaCheckCircle className="text-emerald-500 text-lg" />,
                            badge: 'bg-emerald-100 text-emerald-700'
                          };
                        case 'DEACTIVATED':
                          return {
                            bg: 'bg-rose-50',
                            border: 'border-rose-200 hover:border-rose-400',
                            text: 'text-rose-700',
                            iconBg: 'bg-rose-100',
                            icon: <FaBan className="text-rose-500 text-lg" />,
                            badge: 'bg-rose-100 text-rose-700'
                          };
                        case 'CREATED':
                          return {
                            bg: 'bg-green-50',
                            border: 'border-green-200 hover:border-green-400',
                            text: 'text-green-700',
                            iconBg: 'bg-green-100',
                            icon: <FaPlusCircle className="text-green-500 text-lg" />,
                            badge: 'bg-green-100 text-green-700'
                          };
                        case 'DELETED':
                        case 'BULK_DELETE':
                          return {
                            bg: 'bg-red-50',
                            border: 'border-red-200 hover:border-red-400',
                            text: 'text-red-700',
                            iconBg: 'bg-red-100',
                            icon: <FaTrash className="text-red-500 text-lg" />,
                            badge: 'bg-red-100 text-red-700'
                          };
                        case 'UPDATED':
                          return {
                            bg: 'bg-amber-50',
                            border: 'border-amber-200 hover:border-amber-400',
                            text: 'text-amber-700',
                            iconBg: 'bg-amber-100',
                            icon: <FaEdit className="text-amber-500 text-lg" />,
                            badge: 'bg-amber-100 text-amber-700'
                          };
                        case 'ROLE_ASSIGN':
                        case 'BULK_ROLE_ASSIGN':
                          return {
                            bg: 'bg-purple-50',
                            border: 'border-purple-200 hover:border-purple-400',
                            text: 'text-purple-700',
                            iconBg: 'bg-purple-100',
                            icon: <FaUserTag className="text-purple-500 text-lg" />,
                            badge: 'bg-purple-100 text-purple-700'
                          };
                        case 'BULK_CREATE':
                          return {
                            bg: 'bg-teal-50',
                            border: 'border-teal-200 hover:border-teal-400',
                            text: 'text-teal-700',
                            iconBg: 'bg-teal-100',
                            icon: <FaUsers className="text-teal-500 text-lg" />,
                            badge: 'bg-teal-100 text-teal-700'
                          };
                        case 'BULK_STATUS_UPDATE':
                          return {
                            bg: 'bg-indigo-50',
                            border: 'border-indigo-200 hover:border-indigo-400',
                            text: 'text-indigo-700',
                            iconBg: 'bg-indigo-100',
                            icon: <FaSyncAlt className="text-indigo-500 text-lg" />,
                            badge: 'bg-indigo-100 text-indigo-700'
                          };
                        default:
                          return {
                            bg: 'bg-gray-50',
                            border: 'border-gray-200 hover:border-gray-400',
                            text: 'text-gray-700',
                            iconBg: 'bg-gray-100',
                            icon: <FaUser className="text-gray-500 text-lg" />,
                            badge: 'bg-gray-100 text-gray-700'
                          };
                      }
                    };

                    const styles = getActionStyles(act.actionType);

                    // Format the actor name
                    const actorName = act.firstname || act.lastname
                      ? `${act.firstname || ''} ${act.lastname || ''}`.trim()
                      : 'System';

                    // Determine what to display in the description
                    const displayDescription = act.message || act.description;

                    return (
                      <div
                        key={act.id || idx}
                        className={`flex items-start gap-4 p-4 ${styles.bg} rounded-lg transition-all duration-300 border-l-4 ${styles.border} hover:shadow-md`}
                      >
                        <div className={`w-10 h-10 ${styles.iconBg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                          {styles.icon}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${styles.badge}`}>
                              {act.actionType?.replace(/_/g, ' ')}
                            </span>
                          </div>

                          <p className={`font-medium ${styles.text} text-sm break-words`}>
                            {displayDescription}
                          </p>

                          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                            <span className="text-sm font-semibold text-gray-600">
                              {actorName}
                            </span>
                            <span className="text-xs text-gray-400">•</span>
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <FiClock size={11} />
                              {formatRelativeTime(act.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card.Body>
            </Card>
          }
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card className="border-0  border-t-4 border-blue-500">
            <Card.Header className="bg-white border-0 py-4 flex items-center gap-2">
              <FiTarget className="text-blue-500" />
              <h5 className="font-bold text-gray-800">Quick Actions</h5>
            </Card.Header>
            <Card.Body className="pt-0 space-y-3">
              {[
                { icon: <FaUserPlus />, label: "Create User", variant: "outline-primary", event: () => navigate('users/new') },
              ].map((action, idx) => (
                <Button
                  onClick={action.event}
                  key={idx}
                  variant={action.variant}
                  className="w-full d-flex align-items-center gap-3 p-3 text-left border text-slate-700 hover:!text-slate-50 hover: transition-all"
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600">{action.icon}</span>
                  </div>
                  <span className="font-medium">{action.label}</span>
                </Button>
              ))}
            </Card.Body>
          </Card>


        </div>
      </div>
    </main>
  );
}