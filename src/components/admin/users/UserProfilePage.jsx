import CopyButton from '@/hooks/Clipboard';
import { formatLastLogin } from "@/utils/formatLastLogin";
import { readableDate } from "@/utils/readableDate";
import { Activity, Award, Briefcase, Calendar, Clock, CreditCard, Edit, Mail, Phone, Shield, User } from 'lucide-react';
import { Button } from 'react-bootstrap';
import { FaArrowLeft, FaBookOpen, FaBuilding, FaCalendar, FaChalkboardTeacher, FaClipboardCheck, FaCrown, FaGavel, FaMapMarkerAlt, FaSeedling, FaTag, FaUserGraduate } from 'react-icons/fa';
import { FiUser } from 'react-icons/fi';
import { useLocation, useNavigate } from 'react-router-dom';

const UserProfilePage = ({ onEditProfile }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = location?.state || {};


  const getInitials = () => {
    const first = user?.firstname?.[0] || '';
    const last = user?.lastname?.[0] || '';
    return (first + last).toUpperCase();
  };

  const getFullName = () => {
    return `${user?.firstname || ''} ${user?.lastname || ''}`.trim() || 'Unknown User';
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleEditProfile = () => {
    if (onEditProfile) {
      onEditProfile();
    } else {
      navigate(`edit`, { state: { user: user } });
    }
  };

  const getProgramStatusBadge = (status) => {
    switch (status) {
      case 'NOT_STARTED': return { text: 'NOT STARTED', color: 'font-bold bg-gray-100 text-gray-600' };
      case 'IN_PROGRESS': return { text: 'IN PROGRESS', color: 'font-bold bg-blue-100 text-blue-700' };
      case 'COMPLETED': return { text: 'COMPLETED', color: 'font-bold bg-green-100 text-green-700' };
      default: return { text: status, color: 'font-bold bg-gray-100 text-gray-600' };
    }
  };

  return (
    <div className="overflow-y-auto h-screen w-full bg-white">

      <div className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <Button
              variant="outline-secondary"
              onClick={handleBack}
              className="border-0 flex items-center gap-2"
            >
              <FaArrowLeft size={16} />
              Back
            </Button>
            <div className="w-8" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <div className="flex items-start gap-6 mb-10">
          <div className="relative">
            <div className="p-2 bg-gray-900 rounded-2xl flex items-center justify-center text-white text-2xl sm:text-3xl font-medium shadow-sm">
              {getInitials()}
            </div>
          </div>

          <div className="flex-1 pt-1">
            <h1 className="text-2xl sm:text-3xl font-medium text-gray-900 mb-2">
              {getFullName()}
            </h1>
            <div className="flex items-center gap-2 flex-wrap">
              {user?.role?.slice(0, 2).map((role, idx) => (
                <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gray-50 text-gray-700 text-xs font-medium border border-gray-100">
                  {getRoleIcon(role, 12)}
                  {role}
                </span>
              ))}
              {user?.role?.length > 2 && (
                <span className="inline-flex items-center px-3 py-1 rounded-lg bg-gray-50 text-gray-600 text-xs font-medium">
                  +{user.role.length - 2}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={() => navigate(`edit`, { state: { user } })}
            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            <Edit className="w-4 h-4" />
            Edit
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
          <div className="p-4 rounded-xl bg-zinc-800">
            <div className="flex items-center gap-2 text-slate-50 mb-1">
              <Activity className="w-4 h-4" />
              <span className="text-xs uppercase tracking-wide">Status</span>
            </div>
            <p className="text-sm font-medium text-slate-50">{user?.status || 'ACTIVE'}</p>
          </div>

          <div className="p-4 rounded-xl bg-zinc-800">
            <div className="flex items-center gap-2 text-gray-400 mb-1">
              <Calendar className="w-4 h-4" />
              <span className="text-xs uppercase tracking-wide">Member since</span>
            </div>
            <p className="text-sm font-medium text-slate-50">{readableDate(user?.createdAt)}</p>
          </div>

          <div className="p-4 rounded-xl bg-zinc-800">
            <div className="flex items-center gap-2 text-gray-400 mb-1">
              <Clock className="w-4 h-4" />
              <span className="text-xs uppercase tracking-wide">Last active</span>
            </div>
            <p className="text-sm font-medium text-slate-50">
              {formatLastLogin(user?.lastLogin) || 'Never'}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-zinc-800">
            <div className="flex items-center gap-2 text-gray-400 mb-1">
              <Award className="w-4 h-4" />
              <span className="text-xs uppercase tracking-wide">Roles</span>
            </div>
            <p className="text-sm font-medium text-slate-50">{user?.role?.length || 0}</p>
          </div>

          <div className="p-4 rounded-xl bg-zinc-800">
            <div className="flex items-center gap-2 text-gray-400 mb-1">
              <Briefcase className="w-4 h-4" />
              <span className="text-xs uppercase tracking-wide">Programs</span>
            </div>
            <p className="text-sm font-medium text-slate-50">{user?.assignedPrograms?.length || 0}</p>
          </div>
        </div>

        {/* Two Column Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Personal Information */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
              Personal Information
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 -ml-3 rounded-lg hover:bg-gray-50 transition-colors">
                <User className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Full Name</p>
                  <p className="text-sm text-gray-900">{getFullName()}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 -ml-3 rounded-lg hover:bg-gray-50 transition-colors">
                <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Date of Birth</p>
                  <p className="text-sm text-gray-900">{readableDate(user?.dob) || '—'}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 -ml-3 rounded-lg hover:bg-gray-50 transition-colors">
                <Shield className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Gender</p>
                  <p className="text-sm text-gray-900">{user?.gender || '—'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
              Contact Information
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 -ml-3 rounded-lg hover:bg-gray-50 transition-colors">
                <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                <div className='w-full flex items-center gap-2'>
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Email</p>
                    <p className="text-sm text-gray-900">{user?.email || '—'}</p>
                  </div>

                  <div className='ms-auto  mb-auto'>
                    <CopyButton text={user?.email}/>
                  </div>
                </div>

              </div>

              <div className="flex items-start gap-3 p-3 -ml-3 rounded-lg hover:bg-gray-50 transition-colors">
                <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Phone</p>
                  <p className="text-sm text-gray-900">{user?.contactNumber || '—'}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 -ml-3 rounded-lg hover:bg-gray-50 transition-colors">
                <CreditCard className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">ID Number</p>
                  <p className="text-sm font-mono text-gray-900">{user?.idNo || '—'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className='lg:col-span-2 grid grid-cols-1 lg:grid-cols-2 gap-8'>
            {/* All Roles Section */}
            <div>
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                All Roles & Permissions
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {user?.role?.map((role, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-3 rounded-lg bg-gray-50 border border-gray-100">
                    {getRoleIcon(role, 16)}
                    <span className="text-sm font-medium text-gray-700">{role}</span>
                  </div>
                ))}
                {(!user?.role || user.role.length === 0) && (
                  <div className="text-sm text-gray-400 italic col-span-full text-center py-4">No roles assigned</div>
                )}
              </div>
            </div>

            {/* Assigned Programs Section */}
            <div>
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                Assigned Programs
              </h3>
              {user?.assignedPrograms && user.assignedPrograms.length > 0 ? (
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                  {user.assignedPrograms.map((program, idx) => {
                    const statusBadge = getProgramStatusBadge(program.status);
                    return (
                      <div key={idx} className="border border-gray-100 rounded-xl p-3 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                              <FaBuilding className="text-blue-500 text-sm" />
                            </div>
                            <h4 className="font-semibold text-gray-800 text-sm truncate max-w-[180px]">{program.name}</h4>
                          </div>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${statusBadge.color} flex-shrink-0 ml-2`}>
                            {statusBadge.text}
                          </span>
                        </div>

                        <div className="space-y-1.5 mt-2">
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <FaTag className="text-gray-400 flex-shrink-0" size={10} />
                            <span className="truncate">{program.type} • {program.category}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <FaCalendar className="text-gray-400 flex-shrink-0" size={10} />
                            <span>{program.startDate?.split('T')[0]} - {program.endDate?.split('T')[0]}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <FaMapMarkerAlt className="text-gray-400 flex-shrink-0" size={10} />
                            <span className="truncate">{program.location}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Clock className="text-gray-400 flex-shrink-0" size={10} />
                            <span>Assigned: {readableDate(program.assignedDate)}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <FaUserGraduate className="text-gray-400 flex-shrink-0" size={10} />
                            <span className="truncate">Role: {program.assignedRoles?.join(', ') || 'N/A'}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-xl border border-gray-100">
                  <Briefcase className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-400 text-sm">No programs assigned</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Edit Button */}
        <div className="mt-10 pt-6 border-t border-gray-100 sm:hidden">
          <button
            onClick={handleEditProfile}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            <Edit className="w-4 h-4" />
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export const getRoleIcon = (role, size = 14) => {
  const iconProps = {
    size,
    className: 'transition-transform'
  };

  switch (role?.toUpperCase()) {
    case 'ADMIN':
      return <FaCrown {...iconProps} className="text-amber-600" />;
    case 'FACILITATOR':
      return <FaChalkboardTeacher {...iconProps} className="text-blue-600" />;
    case 'MENTOR':
      return <FaUserGraduate {...iconProps} className="text-purple-600" />;
    case 'INTERN':
      return <FaSeedling {...iconProps} className="text-emerald-600" />;
    case 'LEARNER':
      return <FaBookOpen {...iconProps} className="text-indigo-600" />;
    case 'ASSESSOR':
      return <FaClipboardCheck {...iconProps} className="text-amber-600" />;
    case 'MODERATOR':
      return <FaGavel {...iconProps} className="text-gray-600" />;
    default:
      return <FiUser {...iconProps} className="text-gray-400" />;
  }
};

export default UserProfilePage;