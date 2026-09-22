import { apiFetch } from "@/api/api";
import { useAuth } from '@/contexts/AuthContext';
import { BASE_URL, ME } from "@/utils/apiEndpoint";
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  Bell,
  Briefcase,
  Calendar,
  ChevronDown,
  GraduationCap,
  LogOut,
  MapPin,
  Search,
  Settings,
  User2,
  Users
} from "lucide-react";
import { useEffect, useState } from 'react';
import { Badge, Button, Spinner } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import LogoImage from '../common/LogoImage';

export default function MentorDashboard() {
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  useEffect(() => {
    if (user?.assignedPrograms) {
      setPrograms(user.assignedPrograms)
      setLoading(false)
    } else {
      fetchUserData()
    }
  }, [user])

  async function fetchUserData() {
    try {
      const result = await apiFetch(`${ME}`)
      if (result?.payload?.assignedPrograms) {
        setPrograms(result.payload.assignedPrograms)
      }
    } catch (e) {
      console.error("Failed to fetch user data:", e)
    } finally {
      setLoading(false)
    }
  }

  function handleSwitchRole(role) {
    switch (role) {
      case 'MODERATOR': navigate('/user/moderator'); break;
      case 'ASSESSOR': navigate('/user/assessor'); break;
      case 'FACILITATOR': navigate('/user/facilitator'); break;
      case 'MENTOR': navigate('/user/mentor'); break;
      default: navigate('/user/mentor');
    }
  }

  const getUserRoles = () => user?.role || []

  const filteredPrograms = programs.filter(program =>
    program.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    program.description?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getStatusColor = (status) => {
    const colors = {
      'ACTIVE': 'bg-green-500/80',
      'IN_PROGRESS': 'bg-blue-500/80',
      'PENDING': 'bg-yellow-500/80',
      'COMPLETED': 'bg-slate-500/80',
      'CANCELLED': 'bg-red-500/80'
    }
    return colors[status] || 'bg-blue-500/80'
  }

  const getStatusDisplay = (status) => {
    const display = {
      'IN_PROGRESS': 'In Progress',
      'ACTIVE': 'Active',
      'PENDING': 'Pending',
      'COMPLETED': 'Completed',
      'CANCELLED': 'Cancelled'
    }
    return display[status] || status
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Spinner animation="border" className="w-12 h-12 text-blue-600" />
          <p className="text-slate-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 ">
        <div className="mx-auto px-2 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">

            <div className="flex items-center gap-3">
              <LogoImage />
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3">
              {/* Search Bar */}
              <div className="hidden md:flex items-center bg-slate-100 rounded-lg px-3 py-2 border border-slate-200 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all">
                <Search className="w-4 h-4 text-slate-400 mr-2" />
                <input
                  type="text"
                  placeholder="Search programs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none outline-none text-sm w-48 placeholder:text-slate-400 text-slate-700"
                />
              </div>

              {/* Notifications */}
              <button className="relative p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
                <Badge
                  pill
                  bg="primary"
                  className="absolute top-1 right-1 text-[10px] px-1.5 py-0.5 min-w-[18px]"
                >
                  0
                </Badge>
              </button>

              <div>
                <div
                  onClick={() => navigate('profile')}
                  className="flex items-center justify-center border relative rounded-pill p-1 cursor-pointer">
                  <User2 />
                  <Settings size={13} className="absolute bottom-0 -right-1" />
                </div>
              </div>

              {/* Logout */}
              <Button
                variant="outline-danger"
                onClick={logout}
                className="flex items-center gap-2 rounded-lg px-3 py-2 border-slate-300 text-slate-600 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-all font-medium text-sm"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <div className="mb-4 bg-red-600 rounded text-gray-600 p-2 bg-white border">
          <h1 className="text-lg p-0 m-0 font-bold leading-tight">
            Mentor Dashboard
          </h1>
          <p className="text-xs p-0 m-0 text-slate-500">
            Welcome back, <span className="text-gray-600 font-medium">{user?.firstname} {user?.lastname}</span>
          </p>
        </div>



        {/* Programmes Section */}
        <div className="bg-white rounded-lg  p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Your Programmes</h2>
              <p className="text-sm text-slate-500 mt-1">Select a programme to view learners and reports</p>
            </div>

            {/* Mobile Search */}
            <div className="md:hidden relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search programmes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all text-sm"
              />
            </div>
          </div>

          {filteredPrograms.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Briefcase className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-base font-semibold text-slate-900 mb-1">
                {searchQuery ? 'No programmes found' : 'No programmes assigned'}
              </h3>
              <p className="text-sm text-slate-500">
                {searchQuery
                  ? 'Try adjusting your search terms.'
                  : 'You currently don\'t have any programmes assigned to you as a mentor.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredPrograms.map((program) => (
                <div
                  key={program.id}
                  onClick={() => navigate(`program-view/${program.id}`, {
                    state: { program }
                  })}
                  className={`group relative rounded-3xl overflow-hidden transition-all duration-300 cursor-pointer  hover:scale-[1.02] ${selectedProgram?.id === program.id ? "ring-4 ring-blue-500" : ""}`}
                  style={{ height: '320px' }}
                >
                  {/* Background Image */}
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{
                      backgroundImage: `url(${program.imageUrl ? BASE_URL + program.imageUrl : 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=800'})`
                    }}
                  ></div>

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent opacity-90"></div>

                  {/* Content */}
                  <div className="relative z-10 p-6 flex flex-col justify-end h-full text-white">
                    {/* Status Badge */}
                    <div className="absolute top-4 left-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md ${getStatusColor(program.status)}`}>
                        {getStatusDisplay(program.status)}
                      </span>
                    </div>

                    {/* Category Badge */}
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/20 backdrop-blur-md border border-white/30">
                        {program.category}
                      </span>
                    </div>

                    {/* Program Info */}
                    <div className="mb-4">
                      <h3 className="text-2xl font-bold mb-2 line-clamp-1 group-hover:text-blue-200 transition-colors">
                        {program.name}
                      </h3>
                      <p className="text-sm text-slate-300 line-clamp-2 mb-3">
                        {program.description?.replace(/<[^>]*>/g, ' ').substring(0, 100)}...
                      </p>
                    </div>

                    {/* Meta Info */}
                    <div className="flex flex-wrap gap-4 text-sm mb-4">
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(program.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(program.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <MapPin className="w-4 h-4" />
                        <span className="truncate max-w-[150px]">{program.location}</span>
                      </div>
                    </div>

                    {/* Footer Stats */}
                    <div className="flex items-center justify-between pt-4 border-t border-white/20">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5">
                          <Users className="w-4 h-4 text-blue-300" />
                          <span className="font-semibold">{program.enrolledCount || 0}</span>
                          <span className="text-slate-400 text-sm">learners</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <GraduationCap className="w-4 h-4 text-blue-300" />
                          <span className="font-semibold">{program.capacity || 0}</span>
                          <span className="text-slate-400 text-sm">capacity</span>
                        </div>
                      </div>

                      <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <ChevronDown className="w-5 h-5 text-white -rotate-90" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}