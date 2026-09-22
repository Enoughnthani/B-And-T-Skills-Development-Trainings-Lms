import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  Users,
  Calendar,
  MapPin,
  GraduationCap,
  Briefcase,
  Clock,
  AlertCircle,
  ChevronRight,
  Search,
  Filter,
  BookOpen,
  LayoutDashboard,
  UserCircle,
  Info,
  ArrowLeft,
  Mail,
  CheckCircle2,
  XCircle,
  Clock3,
  BarChart3,
  Target,
  Award
} from "lucide-react";
import { Button } from "react-bootstrap";

export default function ModeratorProgramView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const programFromState = location.state?.program;
  const [program, setProgram] = useState(programFromState || null);
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  if (!program) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center border border-gray-200">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="h-10 w-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Program Data</h2>
          <p className="text-gray-500 mb-6">Program information is not available. Please return to the programs list.</p>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-all"
          >
            <ArrowLeft size={18} />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const getStatusBadgeColor = (status) => {
    const styles = {
      ACTIVE: "bg-green-50 text-green-700 border-green-200",
      INACTIVE: "bg-gray-50 text-gray-600 border-gray-200",
      PENDING: "bg-yellow-50 text-yellow-700 border-yellow-200"
    };
    return styles[status] || styles.INACTIVE;
  };

  const getProgramStatusColor = (status) => {
    const styles = {
      NOTSTARTED: "bg-yellow-50 text-yellow-700 border-yellow-200",
      INPROGRESS: "bg-blue-50 text-blue-700 border-blue-200",
      COMPLETED: "bg-green-50 text-green-700 border-green-200"
    };
    return styles[status] || "bg-gray-50 text-gray-600 border-gray-200";
  };

  const filteredLearners = (program.enrollmentData || []).filter(learner => {
    const matchesSearch =
      learner.firstname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      learner.lastname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      learner.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || learner.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleLearnerClick = (learner) => {
    navigate(`../learner/${learner.id}`, { state: { program, learner } });
  };

  const progressPercentage = Math.round((program.enrolledCount / program.capacity) * 100);
  const activeLearners = (program.enrollmentData || []).filter(l => l.status === "ACTIVE").length;
  const pendingLearners = (program.enrollmentData || []).filter(l => l.status === "PENDING").length;

  const sidebarItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "learners", label: "Learners", icon: Users, count: program.enrolledCount },
    { id: "info", label: "Program Info", icon: Info },
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <Users className="h-6 w-6 text-gray-600" />
            <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-1 rounded-full">Total</span>
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">{program.enrolledCount}</p>
          <p className="text-gray-500 text-sm">Enrolled Learners</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <CheckCircle2 className="h-6 w-6 text-green-600" />
            <span className="text-xs font-medium bg-green-50 text-green-600 px-2 py-1 rounded-full">Active</span>
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">{activeLearners}</p>
          <p className="text-gray-500 text-sm">Active Learners</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <Clock3 className="h-6 w-6 text-yellow-600" />
            <span className="text-xs font-medium bg-yellow-50 text-yellow-600 px-2 py-1 rounded-full">Pending</span>
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">{pendingLearners}</p>
          <p className="text-gray-500 text-sm">Pending Approval</p>
        </div>
      </div>


      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-gray-600" />
            Important Dates
          </h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <Calendar className="h-6 w-6 text-gray-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">Program Starts</p>
                <p className="text-sm text-gray-500">
                  {new Date(program.startDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <Award className="h-6 w-6 text-gray-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">Program Ends</p>
                <p className="text-sm text-gray-500">
                  {new Date(program.endDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-gray-600" />
            Program Status
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <span className="text-gray-600">Current Status</span>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getProgramStatusColor(program.status)}`}>
                {program.status?.replace(/([A-Z])/g, ' $1').trim()}
              </span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <span className="text-gray-600">Program Type</span>
              <span className="text-gray-900 font-medium">{program.type}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <span className="text-gray-600">Category</span>
              <span className="text-gray-900 font-medium">{program.category}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderLearners = () => (
    <div className="space-y-6">
      {/* Search and Filter Bar */}
      <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search learners by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>
        <div className="sm:w-48 relative">
          <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full pl-12 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer transition-all"
          >
            <option value="ALL">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="PENDING">Pending</option>
          </select>
          <ChevronRight className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 rotate-90 pointer-events-none" />
        </div>
      </div>

      {/* Learners List */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">
            Enrolled Learners
            <span className="ml-2 text-sm font-normal text-gray-500">({filteredLearners.length})</span>
          </h3>
          {statusFilter !== "ALL" && (
            <button
              onClick={() => setStatusFilter("ALL")}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear filters
            </button>
          )}
        </div>

        <div className="divide-y divide-gray-100 ">
          {filteredLearners.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">No learners found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            filteredLearners.map((learner) => (
              <div
                key={learner.id}
                onClick={() => handleLearnerClick(learner)}
                className="p-5 hover:bg-gray-50 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-14 h-14 rounded-full bg-gray-900 flex items-center justify-center text-white font-bold text-lg">
                      {learner.firstname?.[0]}{learner.lastname?.[0]}
                    </div>
                    <div className={`absolute bottom-1 right-1 w-2 h-2 rounded-full border-2 border-white ${learner.status === 'ACTIVE' ? 'bg-green-500' : learner.status === 'PENDING' ? 'bg-yellow-500' : 'bg-gray-400'}`} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                        {learner.firstname} {learner.lastname}
                      </h4>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadgeColor(learner.status)}`}>
                        {learner.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1.5 truncate">
                        <Mail size={14} />
                        {learner.email}
                      </span>
                      <span className="hidden sm:flex items-center gap-1.5">
                        <Calendar size={14} />
                        Enrolled {new Date(learner.enrollmentDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );

  const renderProgramInfo = () => (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Description Card */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-gray-600" />
            Program Description
          </h3>
          {program.description ? (
            <div
              className="prose prose-gray max-w-none text-gray-600 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: program.description }}
            />
          ) : (
            <p className="text-gray-400 italic">No description available for this program.</p>
          )}
        </div>

        {/* Quick Details */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Program Details</h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-500">Program ID</span>
                <span className="font-mono text-gray-900 bg-gray-50 px-3 py-1 rounded-lg text-sm">{program.id}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-500">Status</span>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getProgramStatusColor(program.status)}`}>
                  {program.status}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-500">Type</span>
                <span className="text-gray-900 font-medium">{program.type}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-500">Category</span>
                <span className="text-gray-900 font-medium">{program.category}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Location & Time</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3 text-gray-600">
                <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                <span>{program.location}</span>
              </div>
              <div className="flex items-start gap-3 text-gray-600">
                <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-gray-900 font-medium">Start: {new Date(program.startDate).toLocaleDateString()}</p>
                  <p className="text-gray-500 text-sm">End: {new Date(program.endDate).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 text-gray-600">
                <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
                <span>Assigned: {new Date(program.assignedDate).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <Briefcase className="h-8 w-8 text-gray-600 mb-4" />
          <h4 className="text-lg font-semibold text-gray-900 mb-2">Program Type</h4>
          <p className="text-gray-500">{program.type}</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <GraduationCap className="h-8 w-8 text-gray-600 mb-4" />
          <h4 className="text-lg font-semibold text-gray-900 mb-2">Category</h4>
          <p className="text-gray-500">{program.category}</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <Users className="h-8 w-8 text-gray-600 mb-4" />
          <h4 className="text-lg font-semibold text-gray-900 mb-2">Capacity</h4>
          <p className="text-gray-500">{program.enrolledCount} / {program.capacity} enrolled</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white-600 flex ">
      {/* Sidebar Navigation */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen sticky top-0">
        {/* Logo/Header */}
        <div className="p-6 border-b border-gray-200">
          <Button
            onClick={() => navigate(-1)}
            variant="outline-secondary"
            className="flex items-center"
          >
            <ArrowLeft size={18} />
            <span className="text-sm font-medium">Back to Programs</span>
          </Button>
          <div className="flex items-center my-2">
            <div>
              <h1 className="font-bold text-center text-gray-900 text-sm leading-tight max-w-[140px]">
                {program.name}</h1>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                    ? "bg-gray-900 text-white"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
                {item.count && (
                  <span className={`ml-auto text-xs px-2 py-1 rounded-full ${isActive ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-600"
                    }`}>
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Status */}
        <div className="p-4 border-t border-gray-200">
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-2 h-2 rounded-full ${program.status === 'INPROGRESS' ? 'bg-green-500' : 'bg-yellow-500'}`} />
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Program Status</span>
            </div>
            <p className="text-gray-900 font-semibold">{program.status?.replace(/([A-Z])/g, ' $1').trim()}</p>
            <div className="mt-3 w-full bg-gray-200 rounded-full h-1.5">
              <div
                className="bg-blue-600 h-full rounded-full transition-all"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="px-8 py-4 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 capitalize">{activeTab}</h2>
              <p className="text-gray-500 text-sm mt-1">
                {activeTab === "overview" && "Program dashboard and key metrics"}
                {activeTab === "learners" && "Manage enrolled learners"}
                {activeTab === "info" && "Detailed program information"}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className={`px-4 py-2 rounded-full text-sm font-medium border ${getProgramStatusColor(program.status)}`}>
                {program.status?.replace(/([A-Z])/g, ' $1').trim()}
              </span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-8">
          {activeTab === "overview" && renderOverview()}
          {activeTab === "learners" && renderLearners()}
          {activeTab === "info" && renderProgramInfo()}
        </main>
      </div>
    </div>
  );
}