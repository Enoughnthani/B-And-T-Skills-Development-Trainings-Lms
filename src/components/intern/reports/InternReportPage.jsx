import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  FaFileAlt, FaPlus, FaEye, FaEdit, FaTrash, FaDownload,
  FaCheckCircle, FaClock, FaTimesCircle, FaUpload,
  FaFilter, FaSearch, FaArrowLeft, FaStar, FaPaperPlane,
  FaSave, FaFilePdf, FaFileWord, FaFileExcel
} from 'react-icons/fa';
import { FiActivity } from 'react-icons/fi';

export default function InternReportPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [viewMode, setViewMode] = useState('grid'); // grid or list

  // Mock reports data - replace with API calls
  const [reports, setReports] = useState([
    { 
      id: 1, 
      title: "Monthly Progress Report - March 2026",
      type: "Monthly Report",
      description: "Completed React module, started Node.js, achieved 85% on assessments...",
      date: "2026-03-28",
      status: "approved",
      score: 85,
      feedback: "Great progress! Keep up the momentum.",
      attachments: ["report.pdf", "timesheet.xlsx"],
      submittedTo: "Mentor",
      reviewedBy: "Mentor",
      reviewedDate: "2026-03-30"
    },
    { 
      id: 2, 
      title: "Weekly Update - Week 12",
      type: "Weekly Report",
      description: "Worked on API integration, completed user authentication module...",
      date: "2026-03-25",
      status: "pending",
      score: null,
      feedback: null,
      attachments: ["weekly_update.docx"],
      submittedTo: "Mentor",
      reviewedBy: null,
      reviewedDate: null
    },
    { 
      id: 3, 
      title: "Monthly Progress Report - February 2026",
      type: "Monthly Report",
      description: "Completed onboarding, learned React basics, built first component...",
      date: "2026-02-28",
      status: "approved",
      score: 92,
      feedback: "Excellent work! Your understanding of React is impressive.",
      attachments: ["feb_report.pdf"],
      submittedTo: "Mentor",
      reviewedBy: "Mentor",
      reviewedDate: "2026-03-02"
    },
    { 
      id: 4, 
      title: "Project Proposal Draft",
      type: "Draft",
      description: "Initial draft of final project proposal...",
      date: "2026-03-20",
      status: "draft",
      score: null,
      feedback: null,
      attachments: [],
      submittedTo: null,
      reviewedBy: null,
      reviewedDate: null
    },
    { 
      id: 5, 
      title: "Weekly Update - Week 10",
      type: "Weekly Report",
      description: "Research on state management solutions...",
      date: "2026-03-10",
      status: "rejected",
      score: null,
      feedback: "Please add more details about challenges faced and solutions implemented.",
      attachments: ["week10.docx"],
      submittedTo: "Mentor",
      reviewedBy: "Mentor",
      reviewedDate: "2026-03-12"
    },
  ]);

  const stats = {
    total: reports.length,
    submitted: reports.filter(r => r.status === 'pending' || r.status === 'approved' || r.status === 'rejected').length,
    approved: reports.filter(r => r.status === 'approved').length,
    pending: reports.filter(r => r.status === 'pending').length,
    rejected: reports.filter(r => r.status === 'rejected').length,
    drafts: reports.filter(r => r.status === 'draft').length,
    avgScore: Math.round(reports.filter(r => r.score).reduce((acc, r) => acc + r.score, 0) / reports.filter(r => r.score).length) || 0
  };

  const getStatusConfig = (status) => {
    switch(status) {
      case 'approved':
        return { label: 'Approved', color: 'emerald', icon: <FaCheckCircle />, bg: 'bg-emerald-50', text: 'text-emerald-600' };
      case 'pending':
        return { label: 'Pending Review', color: 'amber', icon: <FaClock />, bg: 'bg-amber-50', text: 'text-amber-600' };
      case 'rejected':
        return { label: 'Needs Revision', color: 'rose', icon: <FaTimesCircle />, bg: 'bg-rose-50', text: 'text-rose-600' };
      case 'draft':
        return { label: 'Draft', color: 'slate', icon: <FaSave />, bg: 'bg-slate-100', text: 'text-slate-600' };
      default:
        return { label: 'Unknown', color: 'gray', icon: <FaFileAlt />, bg: 'bg-gray-100', text: 'text-gray-600' };
    }
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          report.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'ALL' || report.status === filterStatus.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this report?')) {
      setReports(reports.filter(r => r.id !== id));
    }
  };

  return (
    <div className="flex-1 h-screen overflow-y-auto bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <div className="max-w-7xl mx-auto p-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <FaFileAlt className="text-blue-500 text-xl" />
                <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  My Reports
                </h1>
              </div>
              <p className="text-slate-500">Manage and track all your submitted reports</p>
            </div>
            <button
              onClick={() => navigate('/intern/reports/new')}
              className="group flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
            >
              <FaPlus size={14} className="group-hover:rotate-90 transition-transform duration-300" />
              New Report
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 hover:shadow-md transition">
            <p className="text-xs text-slate-400 uppercase tracking-wide">Total</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">{stats.total}</p>
            <p className="text-xs text-slate-400">reports</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 hover:shadow-md transition">
            <p className="text-xs text-slate-400 uppercase tracking-wide">Submitted</p>
            <p className="text-2xl font-bold text-emerald-600 mt-1">{stats.submitted}</p>
            <p className="text-xs text-slate-400">total submitted</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 hover:shadow-md transition">
            <p className="text-xs text-slate-400 uppercase tracking-wide">Approved</p>
            <p className="text-2xl font-bold text-emerald-600 mt-1">{stats.approved}</p>
            <p className="text-xs text-slate-400">reports</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 hover:shadow-md transition">
            <p className="text-xs text-slate-400 uppercase tracking-wide">Pending</p>
            <p className="text-2xl font-bold text-amber-600 mt-1">{stats.pending}</p>
            <p className="text-xs text-slate-400">awaiting review</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 hover:shadow-md transition">
            <p className="text-xs text-slate-400 uppercase tracking-wide">Drafts</p>
            <p className="text-2xl font-bold text-slate-600 mt-1">{stats.drafts}</p>
            <p className="text-xs text-slate-400">in progress</p>
          </div>
          <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-2xl p-4 shadow-lg">
            <p className="text-xs text-white/60 uppercase tracking-wide">Avg. Score</p>
            <p className="text-2xl font-bold text-white mt-1">{stats.avgScore}%</p>
            <p className="text-xs text-white/40">overall</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={14} />
                <input
                  type="text"
                  placeholder="Search reports by title or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>
            </div>
            <div className="flex gap-2">
              {['ALL', 'SUBMITTED', 'APPROVED', 'PENDING', 'REJECTED', 'DRAFT'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setFilterStatus(filter)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    filterStatus === filter
                      ? 'bg-slate-800 text-white shadow-md'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {filter === 'ALL' ? 'All' : filter.charAt(0) + filter.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition ${viewMode === 'grid' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600'}`}
              >
                ⊞
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition ${viewMode === 'list' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600'}`}
              >
                ≡
              </button>
            </div>
          </div>
        </div>

        {/* Reports Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredReports.map((report) => {
              const statusConfig = getStatusConfig(report.status);
              return (
                <div key={report.id} className="group bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <div className={`px-2.5 py-1 rounded-lg text-xs font-medium ${statusConfig.bg} ${statusConfig.text}`}>
                        <span className="flex items-center gap-1">
                          {statusConfig.icon} {statusConfig.label}
                        </span>
                      </div>
                      {report.score && (
                        <div className="flex items-center gap-0.5">
                          <FaStar className="text-amber-400 text-sm" />
                          <span className="text-sm font-semibold text-slate-700">{report.score}%</span>
                        </div>
                      )}
                    </div>
                    
                    <h3 className="font-semibold text-slate-800 mb-1 line-clamp-1">{report.title}</h3>
                    <p className="text-xs text-slate-400 mb-3">{report.type} • {new Date(report.date).toLocaleDateString()}</p>
                    <p className="text-sm text-slate-600 mb-4 line-clamp-2">{report.description}</p>
                    
                    <div className="flex gap-2">
                      <button className="flex-1 px-3 py-2 bg-slate-50 hover:bg-blue-50 rounded-xl text-slate-600 hover:text-blue-600 transition text-sm font-medium flex items-center justify-center gap-1">
                        <FaEye size={12} /> View
                      </button>
                      {report.status === 'draft' && (
                        <button className="px-3 py-2 bg-slate-50 hover:bg-amber-50 rounded-xl text-slate-600 hover:text-amber-600 transition">
                          <FaEdit size={14} />
                        </button>
                      )}
                      <button onClick={() => handleDelete(report.id)} className="px-3 py-2 bg-slate-50 hover:bg-rose-50 rounded-xl text-slate-600 hover:text-rose-600 transition">
                        <FaTrash size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="text-left p-4 text-xs font-semibold text-slate-500 uppercase">Title</th>
                    <th className="text-left p-4 text-xs font-semibold text-slate-500 uppercase">Type</th>
                    <th className="text-left p-4 text-xs font-semibold text-slate-500 uppercase">Date</th>
                    <th className="text-left p-4 text-xs font-semibold text-slate-500 uppercase">Status</th>
                    <th className="text-left p-4 text-xs font-semibold text-slate-500 uppercase">Score</th>
                    <th className="text-left p-4 text-xs font-semibold text-slate-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredReports.map((report) => {
                    const statusConfig = getStatusConfig(report.status);
                    return (
                      <tr key={report.id} className="hover:bg-slate-50/50 transition">
                        <td className="p-4">
                          <p className="text-sm font-medium text-slate-800">{report.title}</p>
                        </td>
                        <td className="p-4">
                          <span className="text-sm text-slate-600">{report.type}</span>
                        </td>
                        <td className="p-4">
                          <span className="text-sm text-slate-600">{new Date(report.date).toLocaleDateString()}</span>
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${statusConfig.bg} ${statusConfig.text}`}>
                            {statusConfig.icon} {statusConfig.label}
                          </span>
                        </td>
                        <td className="p-4">
                          {report.score ? (
                            <span className="text-sm font-semibold text-slate-700">{report.score}%</span>
                          ) : (
                            <span className="text-sm text-slate-400">—</span>
                          )}
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <button className="p-1.5 text-slate-400 hover:text-blue-500 transition">
                              <FaEye size={14} />
                            </button>
                            {report.status === 'draft' && (
                              <button className="p-1.5 text-slate-400 hover:text-amber-500 transition">
                                <FaEdit size={14} />
                              </button>
                            )}
                            <button onClick={() => handleDelete(report.id)} className="p-1.5 text-slate-400 hover:text-rose-500 transition">
                              <FaTrash size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredReports.length === 0 && (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-100">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaFileAlt className="text-slate-400 text-2xl" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-1">No reports found</h3>
            <p className="text-slate-400 text-sm mb-4">Try adjusting your search or filter criteria</p>
            <button
              onClick={() => navigate('/intern/reports/new')}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition"
            >
              Create your first report
            </button>
          </div>
        )}
      </div>
    </div>
  );
}