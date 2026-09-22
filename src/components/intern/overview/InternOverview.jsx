import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
    FaFileAlt, FaUpload, FaComments, FaEnvelope, FaCalendarAlt,
    FaCheckCircle, FaClock, FaChartLine, FaSignOutAlt,
    FaClipboardList, FaFolderOpen, FaArrowRight, FaEye,
    FaRocket, FaAward
} from 'react-icons/fa';
import { FiActivity } from 'react-icons/fi';
import { ProgressBar } from 'react-bootstrap';

export default function InternOverview() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const [stats, setStats] = useState({
        reportsSubmitted: 3,
        reportsPending: 1,
        assessmentsCompleted: 5,
        totalAssessments: 8,
        progress: 62
    });

    const [recentReports, setRecentReports] = useState([
        { id: 1, title: "Monthly Progress Report - March", date: "28 Mar 2026", status: "approved" },
        { id: 2, title: "Weekly Update - Week 12", date: "25 Mar 2026", status: "pending" },
        { id: 3, title: "Monthly Progress Report - February", date: "28 Feb 2026", status: "approved" },
    ]);

    const getInitials = () => {
        const first = user?.firstname?.[0] || '';
        const last = user?.lastname?.[0] || '';
        return (first + last).toUpperCase();
    };

    const getFullName = () => {
        return `${user?.firstname || ''} ${user?.lastname || ''}`.trim() || 'Intern User';
    };

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
    };

    return (
        <div className="bg-slate-50 flex-1 h-screen overflow-y-auto ">
            <div className="max-w-7xl mx-auto p-8">

                {/* Header with Glass Effect */}
                <div className="bg-zinc-900 rounded-2xl border border-white/20 shadow-lg p-6 mb-8">
                    <div className="flex justify-between items-start">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-2xl">✨</span>
                                <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                                    {getGreeting()}
                                </span>
                            </div>
                            <h1 className="text-3xl font-bold text-slate-50">
                                {user?.firstname || 'Intern'}!
                            </h1>
                            <h6 className='text-slate-50'>Intern Dashboard</h6>
                            <p className="text-gray-400 mt-1">Track your progress and stay ahead</p>
                        </div>
                    </div>
                </div>

                {/* Profile Card - Modern Glass */}
                <div className="bg-zinc-900 rounded-2xl p-6 mb-8 shadow-xl">
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                        <div className="relative">
                            <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center border border-white/30 shadow-lg">
                                <span className="text-white font-bold text-2xl">{getInitials()}</span>
                            </div>
                        </div>
                        <div className="flex-1">
                            <h2 className="text-xl font-bold text-white mb-1">{getFullName()}</h2>
                            <div className="flex flex-wrap gap-4 text-sm text-white/80">
                                <span className="flex items-center gap-1.5">
                                    <FaEnvelope size={12} /> {user?.email}
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <FaCalendarAlt size={12} /> Joined {new Date(user?.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-2 rounded-xl">
                            <FiActivity className="text-white/80" size={16} />
                            <span className="text-white text-sm font-medium">Active</span>
                        </div>
                    </div>
                </div>

                {/* Stats Cards - Modern Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8">
                    <div className="group bg-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-slate-100">
                        <div className="flex items-center justify-between mb-3">
                            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                <FaFileAlt className="text-blue-500 text-lg" />
                            </div>
                            <span className="text-2xl font-bold text-slate-500">{stats.reportsSubmitted}</span>
                        </div>
                        <p className="text-slate-500 font-medium">Reports</p>
                        <p className="text-xs text-slate-500 mt-1">submitted this month</p>
                    </div>

                    <div className="group bg-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-slate-100">
                        <div className="flex items-center justify-between mb-3">
                            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                <FaClock className="text-amber-500 text-lg" />
                            </div>
                            <span className="text-2xl font-bold text-slate-500">{stats.reportsPending}</span>
                        </div>
                        <p className="text-slate-500 font-medium">Pending</p>
                        <p className="text-xs text-slate-500 mt-1">awaiting review</p>
                    </div>

                    <div className="group bg-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-slate-100">
                        <div className="flex items-center justify-between mb-3">
                            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                <FaCheckCircle className="text-emerald-500 text-lg" />
                            </div>
                            <span className="text-2xl font-bold text-slate-500">{stats.assessmentsCompleted}/{stats.totalAssessments}</span>
                        </div>
                        <p className="text-slate-500 font-medium">Assessments</p>
                        <p className="text-xs text-slate-500 mt-1">completed</p>
                    </div>

                    <div className="group bg-slate-100  rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                        <div className="flex items-center justify-between mb-3">
                            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                <FaChartLine className="text-slate-500 text-lg" />
                            </div>
                            <span className="text-2xl font-bold text-slate-500">{stats.progress}%</span>
                        </div>
                        <p className="text-slate-500 font-medium">Overall Progress</p>
                        <ProgressBar
                            now={stats.progress}
                            className="h-1.5 mt-2 rounded-full"
                            style={{ backgroundColor: '#f1f5f9' }}
                        >
                            <div className="bg-slate-600 rounded-full h-1.5 transition-all duration-500" style={{ width: `${stats.progress}%` }} />
                        </ProgressBar>
                    </div>
                </div>

                {/* Quick Actions - Modern Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {[
                        { icon: <FaUpload />, label: "Submit Report", color: "blue", path: "/intern/reports/new", gradient: "from-blue-500 to-blue-600" },
                        { icon: <FaClipboardList />, label: "Assessments", color: "emerald", path: "/intern/assessments", gradient: "from-emerald-500 to-emerald-600" },
                        { icon: <FaFolderOpen />, label: "My Documents", color: "amber", path: "/intern/documents", gradient: "from-amber-500 to-amber-600" },
                        { icon: <FaComments />, label: "Messages", color: "purple", path: "/intern/chat", gradient: "from-purple-500 to-purple-600" },
                    ].map((action, idx) => (
                        <button
                            key={idx}
                            onClick={() => navigate(action.path)}
                            className="group relative overflow-hidden bg-white rounded-2xl p-5 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-slate-100"
                        >
                            <div className={`absolute inset-0 bg-gradient-to-r ${action.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                            <div className={`w-12 h-12 rounded-xl bg-${action.color}-50 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300`}>
                                <div className={`text-${action.color}-500 text-xl`}>{action.icon}</div>
                            </div>
                            <p className="text-slate-700 font-medium text-center">{action.label}</p>
                        </button>
                    ))}
                </div>

                {/* Recent Reports - Modern Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <FaRocket className="text-blue-500" size={18} />
                            <h3 className="font-semibold text-slate-800">Recent Reports</h3>
                        </div>
                        <button
                            onClick={() => navigate('/intern/reports')}
                            className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1 font-medium group"
                        >
                            View All
                            <FaArrowRight size={12} className="group-hover:translate-x-1 transition-transform duration-200" />
                        </button>
                    </div>
                    <div className="divide-y divide-slate-50">
                        {recentReports.map((report, idx) => (
                            <div key={report.id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors group">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                                        <FaFileAlt className="text-slate-400 text-sm" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-700">{report.title}</p>
                                        <p className="text-xs text-slate-400">{report.date}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${report.status === 'approved'
                                            ? 'bg-emerald-50 text-emerald-600'
                                            : 'bg-amber-50 text-amber-600'
                                        }`}>
                                        {report.status === 'approved' ? 'Approved' : 'Pending Review'}
                                    </span>
                                    <button className="text-slate-400 hover:text-blue-500 transition-colors">
                                        <FaEye size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}