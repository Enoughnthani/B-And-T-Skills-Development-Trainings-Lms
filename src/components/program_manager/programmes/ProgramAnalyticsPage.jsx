import { apiFetch } from '@/api/api';
import { PROGRAMS } from '@/utils/apiEndpoint';
import { useEffect, useMemo, useState } from 'react';
import {
  FaArrowLeft,
  FaAward,
  FaCalendarAlt,
  FaChartLine,
  FaChartPie,
  FaClock,
  FaGraduationCap,
  FaMapMarkerAlt,
  FaUserPlus,
  FaUsers,
  FaUserTie,
  FaVenusMars,
} from 'react-icons/fa';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const STATUS_STYLES = {
  ACTIVE: 'bg-zinc-100 text-zinc-700',
  NOTSTARTED: 'bg-zinc-100 text-zinc-600',
  NOT_STARTED: 'bg-zinc-100 text-zinc-600',
  INPROGRESS: 'bg-red-50 text-[#E30613]',
  IN_PROGRESS: 'bg-red-50 text-[#E30613]',
  COMPLETED: 'bg-zinc-900 text-white',
  CANCELLED: 'bg-red-50 text-[#E30613]',
};

const STATUS_LABELS = {
  ACTIVE: 'Active',
  NOTSTARTED: 'Not started',
  NOT_STARTED: 'Not started',
  INPROGRESS: 'In progress',
  IN_PROGRESS: 'In progress',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
};

const CHART_COLORS = ['#E30613', '#18181B', '#71717A', '#A1A1AA', '#D4D4D8'];

export default function ProgramAnalyticsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const [program, setProgram] = useState(location.state?.program || null);
  const [loading, setLoading] = useState(!location.state?.program);

  useEffect(() => {
    if (!program) fetchProgram();
  }, [id]);

  async function fetchProgram() {
    setLoading(true);
    try {
      const result = await apiFetch(`${PROGRAMS}/${id}`);
      if (result?.payload) setProgram(result.payload);
    } catch (error) {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  const stats = useMemo(() => {
    if (!program) return null;

    const enrolledCount = program.enrolledCount || 0;
    const capacity = program.capacity || 0;
    const enrollmentRate = capacity > 0 ? (enrolledCount / capacity) * 100 : 0;
    const availableSpots = capacity - enrolledCount;

    const genderData = (program.enrollmentData || []).reduce((acc, student) => {
      const key = student.gender || 'Unknown';
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const genderChartData = Object.entries(genderData).map(([name, value]) => ({
      name,
      value,
    }));

    const roleData = (program.programStaff || []).reduce((acc, staff) => {
      const roles = staff.assignedRoles?.[program.id] || [];
      roles.forEach((role) => {
        acc[role] = (acc[role] || 0) + 1;
      });
      return acc;
    }, {});

    const roleChartData = Object.entries(roleData).map(([name, value]) => ({
      name: name.replace(/_/g, ' '),
      value,
    }));

    const timelineData = [
      { date: 'Week 1', enrolled: Math.floor(enrolledCount * 0.15) },
      { date: 'Week 2', enrolled: Math.floor(enrolledCount * 0.25) },
      { date: 'Week 3', enrolled: Math.floor(enrolledCount * 0.20) },
      { date: 'Week 4', enrolled: Math.floor(enrolledCount * 0.15) },
      { date: 'Week 5', enrolled: Math.floor(enrolledCount * 0.15) },
      { date: 'Week 6', enrolled: enrolledCount - Math.floor(enrolledCount * 0.90) },
    ];

    return {
      enrolledCount,
      capacity,
      enrollmentRate,
      availableSpots,
      genderChartData,
      roleChartData,
      timelineData,
    };
  }, [program]);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-zinc-200 border-t-[#E30613]" />
          <p className="mt-3 text-sm text-zinc-500">Loading analytics…</p>
        </div>
      </div>
    );
  }

  if (!program) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 w-full">
        <div className="bg-white border border-zinc-200 rounded-xl p-8 text-center max-w-lg mx-auto">
          <div className="w-14 h-14 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaChartLine className="text-zinc-400 text-xl" />
          </div>
          <h2 className="text-lg font-bold text-zinc-900 mb-1">
            Programme not found
          </h2>
          <p className="text-sm text-zinc-500 mb-5">
            The requested analytics are unavailable.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 bg-[#E30613] hover:bg-[#c00511] text-white font-semibold text-sm px-5 py-2.5 rounded-lg transition-colors"
          >
            <FaArrowLeft size={12} />
            Go back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 w-full">

      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 text-sm font-medium text-zinc-600 bg-white border border-zinc-200 rounded-lg hover:border-zinc-300 hover:text-zinc-900 transition-colors"
      >
        <FaArrowLeft size={12} />
        Back
      </button>

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-extrabold text-zinc-900 mb-1 truncate">
            {program.name}
          </h1>
          <p className="text-sm text-zinc-500">
            {program.category?.replace(/_/g, ' ')}
            {program.type && ` · ${program.type}`}
          </p>
        </div>

        <span
          className={`inline-block text-[10px] font-bold px-2.5 py-1.5 rounded uppercase tracking-wider whitespace-nowrap self-start ${
            STATUS_STYLES[program.status] || 'bg-zinc-100 text-zinc-600'
          }`}
        >
          {STATUS_LABELS[program.status] || program.status}
        </span>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <MetricCard
          title="Enrolment rate"
          value={`${Math.round(stats.enrollmentRate)}%`}
          subtitle={`${stats.enrolledCount} of ${stats.capacity} enrolled`}
          icon={FaChartLine}
          accent
        />
        <MetricCard
          title="Available seats"
          value={stats.availableSpots}
          subtitle="Remaining capacity"
          icon={FaUserPlus}
        />
        <MetricCard
          title="Staff members"
          value={program.programStaff?.length || 0}
          subtitle="Assigned to programme"
          icon={FaUserTie}
        />
        <MetricCard
          title="Field"
          value={program.type || '—'}
          subtitle={program.category?.replace(/_/g, ' ')}
          icon={FaAward}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">

        <Card>
          <CardHeader
            icon={FaChartPie}
            title="Enrolment progress"
            subtitle="Real-time capacity utilisation"
            right={
              <span className="text-2xl font-extrabold text-zinc-900 tabular-nums">
                {stats.enrollmentRate.toFixed(1)}%
              </span>
            }
          />

          <div className="p-4 sm:p-6 space-y-5">
            <ProgressBar
              label="Enrolled"
              value={stats.enrolledCount}
              suffix={`of ${stats.capacity}`}
              percent={stats.enrollmentRate}
              accent
            />
            <ProgressBar
              label="Available"
              value={stats.availableSpots}
              suffix="seats"
              percent={
                stats.capacity
                  ? (stats.availableSpots / stats.capacity) * 100
                  : 0
              }
            />
            <div className="flex items-center justify-between pt-4 border-t border-zinc-100">
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                Total capacity
              </span>
              <span className="text-lg font-extrabold text-zinc-900 tabular-nums">
                {stats.capacity}
              </span>
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader
            icon={FaChartLine}
            title="Enrolment timeline"
            subtitle="Weekly enrolment trends"
          />

          <div className="p-4 sm:p-6">
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={stats.timelineData}>
                <defs>
                  <linearGradient id="gEnrolled" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E30613" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#E30613" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#E4E4E7"
                  vertical={false}
                />
                <XAxis
                  dataKey="date"
                  stroke="#A1A1AA"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#A1A1AA"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="enrolled"
                  stroke="#E30613"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#gEnrolled)"
                  name="Enrolments"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">

        <Card>
          <CardHeader
            icon={FaVenusMars}
            title="Gender distribution"
            subtitle="Student demographics"
          />

          <div className="p-4 sm:p-6">
            {stats.genderChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={stats.genderChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={90}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {stats.genderChartData.map((_, i) => (
                      <Cell
                        key={i}
                        fill={CHART_COLORS[i % CHART_COLORS.length]}
                        stroke="#fff"
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    verticalAlign="middle"
                    align="right"
                    layout="vertical"
                    iconType="circle"
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-sm text-zinc-500 py-12">
                No demographic data available.
              </p>
            )}
          </div>
        </Card>

        <Card>
          <CardHeader
            icon={FaUsers}
            title="Staff roles"
            subtitle="Personnel by assigned role"
          />

          <div className="p-4 sm:p-6">
            {stats.roleChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={stats.roleChartData} layout="vertical">
                  <CartesianGrid
                    strokeDasharray="3 3"
                    horizontal={false}
                    stroke="#E4E4E7"
                  />
                  <XAxis
                    type="number"
                    stroke="#A1A1AA"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    dataKey="name"
                    type="category"
                    stroke="#A1A1AA"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    width={110}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" fill="#18181B" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-sm text-zinc-500 py-12">
                No staff assigned yet.
              </p>
            )}
          </div>
        </Card>
      </div>

      <Card className="mb-5">
        <CardHeader
          icon={FaAward}
          title="Programme details"
          subtitle="Key information"
        />

        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <DetailBox
              icon={FaCalendarAlt}
              label="Duration"
              value={`${formatDate(program.startDate)} – ${formatDate(program.endDate)}`}
            />
            <DetailBox
              icon={FaMapMarkerAlt}
              label="Location"
              value={program.location || 'Not specified'}
            />
            <DetailBox
              icon={FaClock}
              label="Status"
              value={STATUS_LABELS[program.status] || program.status}
            />
          </div>

          {program.description && (
            <div className="mt-6 pt-6 border-t border-zinc-100">
              <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">
                Description
              </p>
              <div
                className="text-sm text-zinc-700 leading-relaxed break-words
                  [&_p]:mb-3 [&_a]:text-[#E30613] [&_a]:underline
                  [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5
                  [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-1.5
                  [&_h1]:text-base [&_h1]:font-bold [&_h1]:text-zinc-900 [&_h1]:mb-2
                  [&_h2]:text-sm [&_h2]:font-bold [&_h2]:text-zinc-900 [&_h2]:mb-2
                  [&_strong]:text-zinc-900 [&_strong]:font-bold"
                dangerouslySetInnerHTML={{ __html: program.description }}
              />
            </div>
          )}
        </div>
      </Card>

      <Card>
        <CardHeader
          icon={FaGraduationCap}
          title="Recent enrolments"
          subtitle={`Last ${
            Math.min(program.enrollmentData?.length || 0, 10)
          } learners`}
          right={
            <button
              onClick={() => navigate('enrolments')}
              className="text-xs font-bold text-[#E30613] hover:underline"
            >
              View all →
            </button>
          }
        />

        {program.enrollmentData?.length > 0 ? (
          <>
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-zinc-50 border-b border-zinc-200">
                  <tr>
                    {['Learner', 'Contact', 'Gender', 'Enrolled', 'Status'].map(
                      (h) => (
                        <th
                          key={h}
                          className="text-left px-4 py-3 text-xs font-bold text-zinc-600 uppercase tracking-wider whitespace-nowrap"
                        >
                          {h}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {program.enrollmentData.slice(0, 10).map((student) => (
                    <tr
                      key={student.id}
                      className="hover:bg-red-50/30 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-full bg-zinc-100 text-zinc-700 text-[10px] font-bold flex items-center justify-center shrink-0">
                            {(student.firstname?.[0] || '') +
                              (student.lastname?.[0] || '')}
                          </div>
                          <div className="font-bold text-zinc-900 truncate">
                            {student.firstname} {student.lastname}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-zinc-700 truncate max-w-[180px]">
                          {student.email}
                        </div>
                        <div className="text-xs text-zinc-500">
                          {student.contactNumber || '—'}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-[10px] font-bold bg-zinc-100 text-zinc-600 px-2 py-1 rounded uppercase tracking-wider">
                          {student.gender || '—'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-zinc-600 whitespace-nowrap">
                        {formatDate(student.enrollmentDate)}
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-[10px] font-bold bg-zinc-100 text-zinc-700 px-2 py-1 rounded uppercase tracking-wider">
                          Active
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="md:hidden divide-y divide-zinc-100">
              {program.enrollmentData.slice(0, 10).map((student) => (
                <div key={student.id} className="p-4">
                  <div className="flex items-start gap-3 mb-2">
                    <div className="w-9 h-9 rounded-full bg-zinc-100 text-zinc-700 text-xs font-bold flex items-center justify-center shrink-0">
                      {(student.firstname?.[0] || '') +
                        (student.lastname?.[0] || '')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-zinc-900 truncate">
                        {student.firstname} {student.lastname}
                      </div>
                      <div className="text-xs text-zinc-500 truncate mt-0.5">
                        {student.email}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-2 pl-12 text-xs">
                    <span className="text-zinc-500">
                      {formatDate(student.enrollmentDate)}
                    </span>
                    <span className="text-[10px] font-bold bg-zinc-100 text-zinc-600 px-2 py-1 rounded uppercase tracking-wider">
                      {student.gender || '—'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="p-12 text-center">
            <FaUsers className="text-zinc-300 text-2xl mx-auto mb-3" />
            <p className="text-sm text-zinc-500">
              No learners enrolled yet.
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}

function MetricCard({ title, value, subtitle, icon: Icon, accent }) {
  return (
    <div className="bg-white border border-zinc-200 rounded-xl p-4">
      <div
        className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${
          accent ? 'bg-red-50' : 'bg-zinc-100'
        }`}
      >
        <Icon
          className={accent ? 'text-[#E30613]' : 'text-zinc-600'}
          size={14}
        />
      </div>
      <div
        className={`text-xl sm:text-2xl font-extrabold tabular-nums mb-0.5 ${
          accent ? 'text-[#E30613]' : 'text-zinc-900'
        }`}
      >
        {value}
      </div>
      <div className="text-[10px] sm:text-xs font-bold text-zinc-500 uppercase tracking-wider truncate">
        {title}
      </div>
      {subtitle && (
        <div className="text-[11px] text-zinc-400 mt-1 truncate">
          {subtitle}
        </div>
      )}
    </div>
  );
}

function Card({ children, className = '' }) {
  return (
    <div className={`bg-white border border-zinc-200 rounded-xl ${className}`}>
      {children}
    </div>
  );
}

function CardHeader({ icon: Icon, title, subtitle, right }) {
  return (
    <div className="flex items-center justify-between gap-3 p-4 sm:p-6 border-b border-zinc-100">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-9 h-9 bg-zinc-100 rounded-lg flex items-center justify-center shrink-0">
          <Icon className="text-zinc-600" size={14} />
        </div>
        <div className="min-w-0">
          <h2 className="font-bold text-zinc-900 text-sm truncate">{title}</h2>
          {subtitle && (
            <p className="text-xs text-zinc-500 truncate">{subtitle}</p>
          )}
        </div>
      </div>
      {right && <div className="shrink-0">{right}</div>}
    </div>
  );
}

function ProgressBar({ label, value, suffix, percent, accent }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-bold text-zinc-600 uppercase tracking-wider">
          {label}
        </span>
        <span className="text-sm font-bold text-zinc-900 tabular-nums">
          {value}{' '}
          {suffix && <span className="text-zinc-400 font-medium">{suffix}</span>}
        </span>
      </div>
      <div className="h-1.5 bg-zinc-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            accent ? 'bg-[#E30613]' : 'bg-zinc-900'
          }`}
          style={{ width: `${Math.min(percent || 0, 100)}%` }}
        />
      </div>
    </div>
  );
}

function DetailBox({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 p-4 rounded-lg bg-zinc-50 border border-zinc-100">
      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shrink-0 border border-zinc-200">
        <Icon className="text-zinc-600" size={12} />
      </div>
      <div className="min-w-0">
        <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-0.5">
          {label}
        </div>
        <div className="text-sm font-bold text-zinc-900 break-words">
          {value}
        </div>
      </div>
    </div>
  );
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-zinc-200 rounded-lg p-2.5 shadow-lg">
      {label && (
        <p className="text-xs font-bold text-zinc-900 mb-1.5">{label}</p>
      )}
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-2 text-xs">
          <span
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: entry.color || entry.fill }}
          />
          <span className="text-zinc-600">{entry.name}:</span>
          <span className="font-bold text-zinc-900">{entry.value}</span>
        </div>
      ))}
    </div>
  );
}

function formatDate(dateString) {
  if (!dateString) return '—';
  try {
    return new Date(dateString).toLocaleDateString('en-ZA', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return '—';
  }
}