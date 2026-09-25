// components/AdminDashboardOverview.jsx
import { apiFetch } from "@/api/api";
import { ADMIN } from "@/utils/apiEndpoint";
import { useEffect, useState } from "react";
import { Badge, Button, Card, Placeholder } from "react-bootstrap";
import {
  FaBan,
  FaBell,
  FaBook,
  FaBriefcase,
  FaBullhorn,
  FaCertificate,
  FaChalkboardTeacher,
  FaCheckCircle,
  FaClipboardCheck,
  FaCog,
  FaEdit,
  FaPlusCircle,
  FaSyncAlt,
  FaTrash,
  FaUpload,
  FaUser,
  FaUserPlus,
  FaUsers,
  FaUserTag,
} from "react-icons/fa";
import { FiClock, FiTarget } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function AdminDashboardOverview({
  visible,
}) {
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getStats();
    getActivities();
  }, []);

  async function getStats() {
    try {
      const result = await apiFetch(`${ADMIN}/stats`);
      if (result?.success) setStats(result?.payload);
    } catch (e) {
      // silently fail
    }
  }

  async function getActivities() {
    try {
      const result = await apiFetch(`${ADMIN}/activities`);
      if (result?.success) setActivities(result?.payload || []);
    } catch (e) {
      // silently fail
    }
  }

  const getNewActivitiesCount = () => {
    const last24Hours = new Date();
    last24Hours.setHours(last24Hours.getHours() - 24);
    return activities.filter((a) => new Date(a.createdAt) > last24Hours).length;
  };

  const formatRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInSeconds < 60) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes} min${diffInMinutes > 1 ? "s" : ""} ago`;
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
    return date.toLocaleDateString("en-ZA");
  };

  const statCards = [
    { title: "Total Users", value: stats?.totalUsers || 0, icon: <FaUsers className="w-7 h-7" />, color: "blue", bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-600", gradient: "from-blue-500 to-indigo-600" },
    { title: "Total Programs", value: stats?.totalPrograms || 0, icon: <FaBook className="w-7 h-7" />, color: "cyan", bg: "bg-cyan-50", border: "border-cyan-200", text: "text-cyan-600", gradient: "from-cyan-400 to-blue-500" },
    { title: "Active Learnerships", value: stats?.totalActiveLearnerships || 0, icon: <FaChalkboardTeacher className="w-7 h-7" />, color: "emerald", bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-600", gradient: "from-emerald-500 to-teal-600" },
    { title: "Active Internships", value: stats?.totalActiveInternships || 0, icon: <FaBriefcase className="w-7 h-7" />, color: "orange", bg: "bg-orange-50", border: "border-orange-200", text: "text-orange-600", gradient: "from-orange-500 to-rose-600" },
    { title: "Active Short Courses", value: stats?.totalActiveShortCourses || 0, icon: <FaCertificate className="w-7 h-7" />, color: "violet", bg: "bg-violet-50", border: "border-violet-200", text: "text-violet-600", gradient: "from-violet-500 to-fuchsia-600" },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">

      {/* ============================================================
          HEADER
          ============================================================ */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 flex items-center gap-2">
            Dashboard
          </h1>
          <p className="text-sm text-gray-600 mt-0.5">
            Track user progress and programme completion
          </p>
        </div>

        {visible && (
          <button className="w-full sm:w-[170px] flex items-center bg-white px-3 py-2 rounded-lg border border-gray-200 shrink-0">
            <Placeholder animation="wave" as="div">
              <Placeholder className="rounded-[50%] w-[35px] h-[35px]" xs={6} />
            </Placeholder>
            <div className="flex-1 ml-2">
              <Placeholder xs={9} size="sm" />
              <Placeholder xs={4} size="sm" />
            </div>
          </button>
        )}
      </div>

      {/* ============================================================
          STAT CARDS
          ============================================================ */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-6 sm:mb-8">
        {statCards.map((stat, index) => (
          <Card
            key={index}
            className={`group relative overflow-hidden bg-white border ${stat.border} rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 ease-out hover:-translate-y-1 cursor-pointer`}
          >
            <div className={`absolute inset-0 ${stat.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

            <Card.Body className="relative p-4 sm:p-6 flex flex-col items-center text-center">
              <p className={`text-[10px] sm:text-xs font-semibold uppercase tracking-wider ${stat.text} mb-3 sm:mb-4 line-clamp-2`}>
                {stat.title}
              </p>

              <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br ${stat.gradient} shadow-lg flex items-center justify-center text-white mb-3 sm:mb-4 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                {stat.icon}
              </div>

              <h2 className="text-xl sm:text-3xl font-bold text-gray-900 tabular-nums">
                {stat.value.toLocaleString()}
              </h2>
            </Card.Body>

            <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`} />
          </Card>
        ))}
      </div>

      {/* ============================================================
          MAIN GRID
          ============================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">

        {/* ---------- Recent Activity ---------- */}
        <div className="lg:col-span-2 space-y-6">
          {activities?.length > 0 && (
            <Card className="border-0 h-full border-t-4 border-blue-500">
              <Card.Header className="bg-white border-0 py-4 px-4 sm:px-6 flex flex-wrap justify-between items-center gap-2">
                <div className="flex items-center gap-2">
                  <h5 className="font-bold text-gray-800 text-base sm:text-lg">Recent Activity</h5>
                  <Badge bg="primary" pill className="px-2 text-[10px] sm:text-xs">
                    {getNewActivitiesCount()} New
                  </Badge>
                </div>

                {activities?.length > 3 && (
                  <Button
                    onClick={() => navigate("activities", { state: { activities } })}
                    variant="link"
                    size="sm"
                    className="text-blue-600 p-0 font-medium text-xs sm:text-sm"
                  >
                    View All →
                  </Button>
                )}
              </Card.Header>

              <Card.Body className="pt-0 px-4 sm:px-6 pb-4">
                <div className="space-y-3 sm:space-y-4">
                  {activities.slice(0, 3).map((act, idx) => {
                    const styles = getActionStyles(act.actionType);
                    const actorName =
                      act.firstname || act.lastname
                        ? `${act.firstname || ""} ${act.lastname || ""}`.trim()
                        : "System";
                    const displayDescription = act.message || act.description;

                    return (
                      <div
                        key={act.id || idx}
                        className={`flex items-start gap-3 sm:gap-4 p-3 sm:p-4 ${styles.bg} rounded-lg transition-all duration-300 border-l-4 ${styles.border} hover:shadow-md`}
                      >
                        <div className={`w-9 h-9 sm:w-10 sm:h-10 ${styles.iconBg} rounded-lg flex items-center justify-center shrink-0`}>
                          {styles.icon}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className={`text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full ${styles.badge}`}>
                              {act.actionType?.replace(/_/g, " ")}
                            </span>
                          </div>

                          <p className={`font-medium ${styles.text} text-xs sm:text-sm break-words`}>
                            {displayDescription}
                          </p>

                          <div className="flex items-center gap-2 mt-1.5 flex-wrap text-[11px] sm:text-xs">
                            <span className="font-semibold text-gray-600 truncate">
                              {actorName}
                            </span>
                            <span className="text-gray-300">•</span>
                            <span className="text-gray-500 flex items-center gap-1 shrink-0">
                              <FiClock size={10} />
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
          )}
        </div>

        {/* ---------- Quick Actions ---------- */}
        <div className="space-y-6">
          <Card className="border-0 border-t-4 border-blue-500">
            <Card.Header className="bg-white border-0 py-4 px-4 sm:px-6 flex items-center gap-2">
              <FiTarget className="text-blue-500" />
              <h5 className="font-bold text-gray-800 text-base sm:text-lg">Quick Actions</h5>
            </Card.Header>
            <Card.Body className="pt-0 px-4 sm:px-6 pb-4 space-y-3">

              {[
                {
                  icon: <FaUserPlus />,
                  label: 'Create User',
                  description: 'Add a new user to the platform',
                  to: '/user/admin/users/new',
                },
                {
                  icon: <FaUpload />,
                  label: 'Bulk Upload Users',
                  description: 'Import multiple users from CSV',
                  to: '/user/admin/users/new/bulk',
                },
                {
                  icon: <FaBullhorn />,
                  label: 'Post Announcement',
                  description: 'Send a notice to LMS users',
                  to: '/user/admin/announcements/new',
                },
                {
                  icon: <FaClipboardCheck />,
                  label: 'Report Hub',
                  description: 'Open learner and assessment reports',
                  to: '/user/admin/reports',
                },
                {
                  icon: <FaBell />,
                  label: 'Notifications',
                  description: 'System events and activity',
                  to: '/user/admin/notifications',
                },
                {
                  icon: <FaCog />,
                  label: 'Settings',
                  description: 'Platform configuration',
                  to: '/user/admin/settings',
                },
              ].map((action, idx) => (
                <Button
                  key={idx}
                  onClick={()=>navigate(action.to)}
                  className="w-full flex items-center gap-3 p-3 text-left border border-gray-200 bg-white text-slate-700 hover:!bg-blue-50 hover:!border-blue-300 hover:!text-blue-700 transition-all rounded-lg"
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                    <span className="text-blue-600">{action.icon}</span>
                  </div>
                  <span className="font-medium text-sm">{action.label}</span>
                </Button>
              ))}
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// ACTION STYLES
// ============================================================
function getActionStyles(actionType) {
  switch (actionType?.toUpperCase()) {
    case "ACTIVATED":
      return {
        bg: "bg-emerald-50",
        border: "border-emerald-200 hover:border-emerald-400",
        text: "text-emerald-700",
        iconBg: "bg-emerald-100",
        icon: <FaCheckCircle className="text-emerald-500 text-base sm:text-lg" />,
        badge: "bg-emerald-100 text-emerald-700",
      };
    case "DEACTIVATED":
      return {
        bg: "bg-rose-50",
        border: "border-rose-200 hover:border-rose-400",
        text: "text-rose-700",
        iconBg: "bg-rose-100",
        icon: <FaBan className="text-rose-500 text-base sm:text-lg" />,
        badge: "bg-rose-100 text-rose-700",
      };
    case "CREATED":
      return {
        bg: "bg-green-50",
        border: "border-green-200 hover:border-green-400",
        text: "text-green-700",
        iconBg: "bg-green-100",
        icon: <FaPlusCircle className="text-green-500 text-base sm:text-lg" />,
        badge: "bg-green-100 text-green-700",
      };
    case "DELETED":
    case "BULK_DELETE":
      return {
        bg: "bg-red-50",
        border: "border-red-200 hover:border-red-400",
        text: "text-red-700",
        iconBg: "bg-red-100",
        icon: <FaTrash className="text-red-500 text-base sm:text-lg" />,
        badge: "bg-red-100 text-red-700",
      };
    case "UPDATED":
      return {
        bg: "bg-amber-50",
        border: "border-amber-200 hover:border-amber-400",
        text: "text-amber-700",
        iconBg: "bg-amber-100",
        icon: <FaEdit className="text-amber-500 text-base sm:text-lg" />,
        badge: "bg-amber-100 text-amber-700",
      };
    case "ROLE_ASSIGN":
    case "BULK_ROLE_ASSIGN":
      return {
        bg: "bg-purple-50",
        border: "border-purple-200 hover:border-purple-400",
        text: "text-purple-700",
        iconBg: "bg-purple-100",
        icon: <FaUserTag className="text-purple-500 text-base sm:text-lg" />,
        badge: "bg-purple-100 text-purple-700",
      };
    case "BULK_CREATE":
      return {
        bg: "bg-teal-50",
        border: "border-teal-200 hover:border-teal-400",
        text: "text-teal-700",
        iconBg: "bg-teal-100",
        icon: <FaUsers className="text-teal-500 text-base sm:text-lg" />,
        badge: "bg-teal-100 text-teal-700",
      };
    case "BULK_STATUS_UPDATE":
      return {
        bg: "bg-indigo-50",
        border: "border-indigo-200 hover:border-indigo-400",
        text: "text-indigo-700",
        iconBg: "bg-indigo-100",
        icon: <FaSyncAlt className="text-indigo-500 text-base sm:text-lg" />,
        badge: "bg-indigo-100 text-indigo-700",
      };
    default:
      return {
        bg: "bg-gray-50",
        border: "border-gray-200 hover:border-gray-400",
        text: "text-gray-700",
        iconBg: "bg-gray-100",
        icon: <FaUser className="text-gray-500 text-base sm:text-lg" />,
        badge: "bg-gray-100 text-gray-700",
      };
  }
}