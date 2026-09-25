import CopyButton from '@/hooks/Clipboard';
import { formatLastLogin } from '@/utils/formatLastLogin';
import { readableDate } from '@/utils/readableDate';
import {
  Activity,
  Award,
  Briefcase,
  Calendar,
  Clock,
  CreditCard,
  Edit,
  Mail,
  Phone,
  Shield,
  User,
} from 'lucide-react';
import {
  FaArrowLeft,
  FaBookOpen,
  FaBuilding,
  FaCalendar,
  FaChalkboardTeacher,
  FaClipboardCheck,
  FaCrown,
  FaGavel,
  FaMapMarkerAlt,
  FaSeedling,
  FaTag,
  FaUserGraduate,
} from 'react-icons/fa';
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

  const handleBack = () => navigate(-1);

  const handleEditProfile = () => {
    if (onEditProfile) onEditProfile();
    else navigate(`edit`, { state: { user } });
  };

  const stats = [
    { icon: Activity,  label: 'Status',       value: user?.status || 'ACTIVE' },
    { icon: Calendar,  label: 'Member since', value: readableDate(user?.createdAt) },
    { icon: Clock,     label: 'Last active',  value: formatLastLogin(user?.lastLogin) || 'Never' },
    { icon: Award,     label: 'Roles',        value: user?.role?.length || 0 },
    { icon: Briefcase, label: 'Programs',     value: user?.assignedPrograms?.length || 0 },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">

      <button
        onClick={handleBack}
        className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 text-sm font-medium text-zinc-600 bg-white border border-zinc-200 rounded-lg hover:border-zinc-300 hover:text-zinc-900 transition-colors"
      >
        <FaArrowLeft size={12} />
        Back
      </button>

      <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6 mb-8">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-zinc-900 flex items-center justify-center text-white text-xl sm:text-2xl font-bold shrink-0 shadow-sm">
          {getInitials()}
        </div>

        <div className="flex-1 min-w-0">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-zinc-900 mb-2 truncate">
            {getFullName()}
          </h1>

          <div className="flex items-center gap-2 flex-wrap">
            {user?.role?.slice(0, 2).map((role, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-zinc-50 text-zinc-700 text-xs font-medium border border-zinc-100"
              >
                {getRoleIcon(role, 12)}
                {role.replace(/_/g, ' ')}
              </span>
            ))}
            {user?.role?.length > 2 && (
              <span className="inline-flex items-center px-3 py-1 rounded-lg bg-zinc-50 text-zinc-600 text-xs font-medium border border-zinc-100">
                +{user.role.length - 2} more
              </span>
            )}
          </div>
        </div>

        <button
          onClick={() => navigate('edit', { state: { user } })}
          className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-zinc-200 text-zinc-700 text-sm font-medium hover:border-zinc-300 hover:text-zinc-900 transition-colors shrink-0"
        >
          <Edit className="w-4 h-4" />
          Edit
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-zinc-900 rounded-xl p-4">
              <div className="flex items-center gap-2 text-zinc-400 mb-1">
                <Icon className="w-3.5 h-3.5" />
                <span className="text-[10px] uppercase tracking-wider font-bold">
                  {stat.label}
                </span>
              </div>
              <p className="text-sm font-bold text-white truncate">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <section>
          <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-4">
            Personal Information
          </h2>
          <div className="space-y-1">
            <InfoRow icon={User}     label="Full Name"     value={getFullName()} />
            <InfoRow icon={Calendar} label="Date of Birth" value={readableDate(user?.dob) || '—'} />
            <InfoRow icon={Shield}   label="Gender"        value={user?.gender || '—'} />
          </div>
        </section>

        <section>
          <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-4">
            Contact Information
          </h2>
          <div className="space-y-1">
            <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-zinc-50 transition-colors">
              <Mail className="w-4 h-4 text-zinc-400 mt-1 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-zinc-400 uppercase tracking-wider font-bold mb-0.5">
                  Email
                </p>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-zinc-900 truncate">{user?.email || '—'}</p>
                  {user?.email && <CopyButton text={user.email} />}
                </div>
              </div>
            </div>

            <InfoRow icon={Phone}      label="Phone"     value={user?.contactNumber || '—'} />
            <InfoRow icon={CreditCard} label="ID Number" value={user?.idNo || '—'} mono />
          </div>
        </section>

        <section>
          <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-4">
            All Roles &amp; Permissions
          </h2>
          {user?.role?.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {user.role.map((role, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 p-3 rounded-lg bg-zinc-50 border border-zinc-100"
                >
                  {getRoleIcon(role, 16)}
                  <span className="text-xs font-medium text-zinc-700 truncate">
                    {role.replace(/_/g, ' ')}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-zinc-400 italic text-center py-6 bg-zinc-50 rounded-lg border border-zinc-100">
              No roles assigned
            </p>
          )}
        </section>

        <section>
          <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Briefcase className="w-3.5 h-3.5" />
            Assigned Programmes
          </h2>

          {user?.assignedPrograms?.length > 0 ? (
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
              {user.assignedPrograms.map((program, idx) => (
                <ProgrammeCard key={idx} program={program} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-zinc-50 rounded-xl border border-zinc-100">
              <Briefcase className="w-8 h-8 text-zinc-300 mx-auto mb-2" />
              <p className="text-zinc-400 text-sm">No programmes assigned</p>
            </div>
          )}
        </section>
      </div>

      <div className="sm:hidden pt-6 border-t border-zinc-200">
        <button
          onClick={handleEditProfile}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-zinc-900 text-white text-sm font-bold hover:bg-zinc-800 transition-colors"
        >
          <Edit className="w-4 h-4" />
          Edit Profile
        </button>
      </div>
    </div>
  );
};

function InfoRow({ icon: Icon, label, value, mono = false }) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-zinc-50 transition-colors">
      <Icon className="w-4 h-4 text-zinc-400 mt-1 shrink-0" />
      <div className="min-w-0">
        <p className="text-[10px] text-zinc-400 uppercase tracking-wider font-bold mb-0.5">
          {label}
        </p>
        <p className={`text-sm text-zinc-900 break-words ${mono ? 'font-mono' : ''}`}>
          {value}
        </p>
      </div>
    </div>
  );
}

function ProgrammeCard({ program }) {
  const statusMap = {
    NOT_STARTED: 'bg-zinc-100 text-zinc-600',
    IN_PROGRESS: 'bg-zinc-200 text-zinc-800',
    COMPLETED:   'bg-zinc-900 text-white',
  };
  const statusClass = statusMap[program.status] || 'bg-zinc-100 text-zinc-600';

  return (
    <div className="border border-zinc-100 rounded-xl p-3 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 bg-zinc-100 rounded-lg flex items-center justify-center shrink-0">
            <FaBuilding className="text-zinc-600 text-xs" />
          </div>
          <h3 className="font-bold text-zinc-900 text-sm truncate">
            {program.name}
          </h3>
        </div>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 uppercase tracking-wider ${statusClass}`}>
          {(program.status || '').replace(/_/g, ' ')}
        </span>
      </div>

      <div className="space-y-1.5 text-xs text-zinc-500">
        <ProgrammeRow icon={FaTag}          value={`${program.type || ''} • ${program.category || ''}`} />
        <ProgrammeRow icon={FaCalendar}     value={`${program.startDate?.split('T')[0] || ''} – ${program.endDate?.split('T')[0] || ''}`} />
        <ProgrammeRow icon={FaMapMarkerAlt} value={program.location || '—'} />
        <ProgrammeRow icon={Clock}          value={`Assigned: ${readableDate(program.assignedDate)}`} />
        <ProgrammeRow icon={FaUserGraduate} value={`Role: ${program.assignedRoles?.join(', ') || 'N/A'}`} />
      </div>
    </div>
  );
}

function ProgrammeRow({ icon: Icon, value }) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="text-zinc-400 shrink-0 text-[10px]" />
      <span className="truncate">{value}</span>
    </div>
  );
}

export const getRoleIcon = (role, size = 14) => {
  const props = { size, className: 'transition-transform' };

  switch (role?.toUpperCase()) {
    case 'ADMIN':
      return <FaCrown {...props} className="text-amber-600" />;
    case 'FACILITATOR':
      return <FaChalkboardTeacher {...props} className="text-zinc-700" />;
    case 'MENTOR':
      return <FaUserGraduate {...props} className="text-violet-600" />;
    case 'INTERN':
      return <FaSeedling {...props} className="text-emerald-600" />;
    case 'LEARNER':
      return <FaBookOpen {...props} className="text-zinc-700" />;
    case 'ASSESSOR':
      return <FaClipboardCheck {...props} className="text-amber-600" />;
    case 'MODERATOR':
      return <FaGavel {...props} className="text-zinc-700" />;
    default:
      return <FiUser {...props} className="text-zinc-400" />;
  }
};

export default UserProfilePage;