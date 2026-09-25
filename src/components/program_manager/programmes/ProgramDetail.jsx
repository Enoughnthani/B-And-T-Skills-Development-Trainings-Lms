import { apiFetch } from '@/api/api';
import { BASE_URL, PROGRAMS } from '@/utils/apiEndpoint';
import { useEffect, useState } from 'react';
import {
  FaArrowLeft,
  FaAward,
  FaBuilding,
  FaCalendarAlt,
  FaChalkboardTeacher,
  FaMapMarkerAlt,
  FaTimesCircle,
  FaTrash,
  FaUserPlus,
  FaUsers,
} from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import AddStaffModal from '../modals/AssignStaffModal';
import EnrollmentModal from '../modals/EnrollmentModal';
import AnalyticTab from '../tabs/ProgramAnalyticsTab';
import EnrolledUsersTab from '../tabs/ProgramEnrolmentsTab';
import ProgramDetailsTab from '../tabs/ProgramOverviewTab';
import ProgramStaffTab from '../tabs/ProgramStaffTab';

const STATUS_STYLES = {
  NOT_STARTED: 'bg-zinc-100 text-zinc-600',
  NOTSTARTED: 'bg-zinc-100 text-zinc-600',
  IN_PROGRESS: 'bg-red-50 text-[#E30613]',
  INPROGRESS: 'bg-red-50 text-[#E30613]',
  COMPLETED: 'bg-zinc-900 text-white',
  CANCELLED: 'bg-red-50 text-[#E30613]',
};

const STATUS_LABELS = {
  NOT_STARTED: 'Not started',
  NOTSTARTED: 'Not started',
  IN_PROGRESS: 'In progress',
  INPROGRESS: 'In progress',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
};

const CATEGORY_LABELS = {
  SHORT_COURSE: 'Short Course',
  LEARNERSHIP: 'Learnership',
  INTERNSHIP: 'Internship',
};

export default function ProgramDetail({ onEdit, onDelete }) {
  const navigate = useNavigate();
  const { id } = useParams();

  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [error, setError] = useState(null);

  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [showStaffModal, setShowStaffModal] = useState(false);

  useEffect(() => {
    fetchProgram();
  }, [id, showEnrollModal, showStaffModal]);

  async function fetchProgram() {
    setLoading(true);
    try {
      const result = await apiFetch(`${PROGRAMS}/${id}`);
      if (result?.payload) {
        setProgram(result.payload);
      } else {
        setError('Programme not found.');
      }
    } catch (err) {
      setError('Failed to load programme details.');
    } finally {
      setLoading(false);
    }
  }

  function formatDate(dateString) {
    if (!dateString) return 'TBD';
    return new Date(dateString).toLocaleDateString('en-ZA', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

  function getEnrollmentPercentage() {
    if (!program?.capacity) return 0;
    return Math.min(
      ((program.enrolledCount || 0) / program.capacity) * 100,
      100
    );
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-zinc-200 border-t-[#E30613]" />
          <p className="mt-3 text-sm text-zinc-500">Loading programme…</p>
        </div>
      </div>
    );
  }

  if (error || !program) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 w-full">
        <div className="bg-white border border-zinc-200 rounded-xl p-8 text-center max-w-lg mx-auto">
          <div className="w-14 h-14 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaTimesCircle className="text-[#E30613] text-xl" />
          </div>
          <h3 className="text-lg font-bold text-zinc-900 mb-1">
            {error || 'Programme not found'}
          </h3>
          <p className="text-sm text-zinc-500 mb-5">
            The programme you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => navigate('/user/program-manager/programmes')}
            className="inline-flex items-center gap-2 bg-[#E30613] hover:bg-[#c00511] text-white font-semibold text-sm px-5 py-2.5 rounded-lg transition-colors"
          >
            <FaArrowLeft size={12} />
            Back to programmes
          </button>
        </div>
      </div>
    );
  }

  const enrollmentPct = getEnrollmentPercentage();
  const isFullyBooked = enrollmentPct >= 100;
  const remainingSeats = (program.capacity || 0) - (program.enrolledCount || 0);
  const isInternship = program.category === 'INTERNSHIP';

  const tabs = [
    { key: 'overview', label: 'Overview' },
    { key: 'staff', label: isInternship ? 'Mentors' : 'Staff' },
    { key: 'participants', label: isInternship ? 'Interns' : 'Learners' },
    { key: 'analytics', label: 'Analytics' },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 w-full">

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-zinc-600 bg-white border border-zinc-200 rounded-lg hover:border-zinc-300 hover:text-zinc-900 transition-colors w-fit"
        >
          <FaArrowLeft size={12} />
          Back
        </button>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setShowEnrollModal(true)}
            className="inline-flex items-center justify-center gap-2 bg-[#E30613] hover:bg-[#c00511] text-white font-semibold text-sm px-5 py-2.5 rounded-lg transition-colors"
          >
            <FaUserPlus size={12} />
            Enrol {isInternship ? 'Intern' : 'Learner'}
          </button>

          <button
            onClick={() => setShowStaffModal(true)}
            className="inline-flex items-center justify-center gap-2 bg-white border border-zinc-300 hover:border-zinc-400 text-zinc-700 font-semibold text-sm px-5 py-2.5 rounded-lg transition-colors"
          >
            <FaChalkboardTeacher size={12} />
            {isInternship ? 'Add mentor' : 'Assign staff'}
          </button>
        </div>
      </div>

      <div className="relative rounded-2xl overflow-hidden bg-zinc-900 mb-6">
        {program.imageBase64 && (
          <img
            src={`${BASE_URL}${program.imageBase64}`}
            alt={program.name}
            className="absolute inset-0 w-full h-full object-cover opacity-40"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-900 via-zinc-900/80 to-zinc-900/40" />

        <div className="relative p-6 sm:p-8 lg:p-10">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">

            <div className="flex-1 space-y-4 min-w-0">
              <div className="flex flex-wrap gap-2">
                <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-white/10 text-white border border-white/20 backdrop-blur-sm">
                  {CATEGORY_LABELS[program.category] || program.category}
                </span>
                <span
                  className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                    STATUS_STYLES[program.status] || 'bg-zinc-100 text-zinc-600'
                  }`}
                >
                  {STATUS_LABELS[program.status] || program.status}
                </span>
                {program.featured && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-[#E30613] text-white">
                    <FaAward size={10} />
                    Featured
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight break-words">
                {program.name}
              </h1>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {program.location && (
                  <MetaItem icon={FaMapMarkerAlt} label="Location" value={program.location} />
                )}
                <MetaItem
                  icon={FaCalendarAlt}
                  label="Duration"
                  value={`${formatDate(program.startDate)} – ${formatDate(program.endDate)}`}
                />
                {program.type && (
                  <MetaItem icon={FaBuilding} label="Field" value={program.type} />
                )}
                <MetaItem
                  icon={FaUsers}
                  label="Enrolment"
                  value={`${program.enrolledCount || 0} of ${program.capacity || 0}`}
                />
              </div>
            </div>

            <div className="w-full lg:w-72 shrink-0">
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-5 border border-white/20">
                <div className="text-white/70 text-[10px] font-bold uppercase tracking-wider mb-2">
                  Enrolment status
                </div>

                <div
                  className={`inline-flex px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider mb-3 ${
                    isFullyBooked
                      ? 'bg-[#E30613] text-white'
                      : 'bg-white/20 text-white'
                  }`}
                >
                  {isFullyBooked ? 'Fully booked' : `${enrollmentPct.toFixed(0)}% filled`}
                </div>

                {!isFullyBooked && (
                  <div className="h-1.5 bg-white/20 rounded-full overflow-hidden mb-3">
                    <div
                      className="h-full bg-white transition-all duration-500"
                      style={{ width: `${enrollmentPct}%` }}
                    />
                  </div>
                )}

                <div className="text-white/70 text-xs flex items-center gap-1.5">
                  <FaUsers size={10} />
                  {remainingSeats > 0
                    ? `${remainingSeats} seat${remainingSeats === 1 ? '' : 's'} remaining`
                    : 'No seats remaining'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-b border-zinc-200 mb-5 overflow-x-auto">
        <nav className="flex gap-1 min-w-max">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`relative px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.key
                  ? 'text-[#E30613]'
                  : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              {tab.label}
              {activeTab === tab.key && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E30613] rounded-t-full" />
              )}
            </button>
          ))}
        </nav>
      </div>

      <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden">
        {activeTab === 'overview' && <ProgramDetailsTab program={program} />}

        {activeTab === 'staff' && (
          <ProgramStaffTab
            program={program}
            onAddStaff={() => setShowStaffModal(true)}
            setProgram={setProgram}
          />
        )}

        {activeTab === 'participants' && (
          <EnrolledUsersTab
            setProgram={setProgram}
            program={program}
            openEnrollModal={() => setShowEnrollModal(true)}
            formatDate={formatDate}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticTab
            getEnrollmentPercentage={getEnrollmentPercentage}
            program={program}
          />
        )}
      </div>

      <AddStaffModal
        show={showStaffModal}
        setShow={setShowStaffModal}
        program={program}
      />

      <EnrollmentModal
        show={showEnrollModal}
        setShow={setShowEnrollModal}
        program={program}
      />
    </div>
  );
}

function MetaItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-2.5 text-sm min-w-0">
      <Icon className="w-4 h-4 text-white/70 shrink-0 mt-0.5" />
      <div className="min-w-0">
        <div className="text-[10px] font-bold uppercase tracking-wider text-white/50">
          {label}
        </div>
        <div className="text-white/90 break-words">{value}</div>
      </div>
    </div>
  );
}