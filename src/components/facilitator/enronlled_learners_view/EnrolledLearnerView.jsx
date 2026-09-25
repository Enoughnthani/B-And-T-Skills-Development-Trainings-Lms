import { apiFetch } from '@/api/api';
import { useEffect, useState } from 'react';
import {
  FaEnvelope,
  FaFilter,
  FaPhone,
  FaSearch,
  FaSortAmountDown,
  FaSpinner,
  FaUserGraduate,
  FaUsers,
} from 'react-icons/fa';
import { FiChevronRight } from 'react-icons/fi';
import { useParams } from 'react-router-dom';

const GENDERS = ['ALL', 'Female', 'Male'];
const STATUSES = ['ALL', 'ACTIVE', 'INACTIVE'];

const STATUS_STYLES = {
  ACTIVE: 'bg-zinc-100 text-zinc-700',
  INACTIVE: 'bg-zinc-100 text-zinc-400',
};

export default function EnrolledLearnerView() {
  const { programId } = useParams();
  const [learners, setLearners] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGender, setFilterGender] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('name');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchEnrolledLearners();
  }, [programId]);

  async function fetchEnrolledLearners() {
    setLoading(true);
    try {
      const data = await apiFetch(`/api/programs/${programId}/enrollments`);
      setLearners(data?.payload || []);
    } catch {
      setLearners([]);
    } finally {
      setLoading(false);
    }
  }

  const filteredLearners = [...learners]
    .filter((learner) => {
      const term = searchTerm.toLowerCase();
      const matchesSearch =
        !term ||
        learner.firstname?.toLowerCase().includes(term) ||
        learner.lastname?.toLowerCase().includes(term) ||
        learner.email?.toLowerCase().includes(term);
      const matchesGender =
        filterGender === 'ALL' || learner.gender === filterGender;
      const matchesStatus =
        filterStatus === 'ALL' || learner.status === filterStatus;
      return matchesSearch && matchesGender && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'name') {
        return `${a.firstname} ${a.lastname}`.localeCompare(
          `${b.firstname} ${b.lastname}`
        );
      }
      if (sortBy === 'enrollment') {
        return new Date(b.enrollmentDate) - new Date(a.enrollmentDate);
      }
      return 0;
    });

  const stats = {
    total: learners.length,
    active: learners.filter((l) => l.status === 'ACTIVE').length,
    female: learners.filter((l) => l.gender === 'Female').length,
    male: learners.filter((l) => l.gender === 'Male').length,
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-zinc-200 border-t-[#E30613]" />
          <p className="mt-3 text-sm text-zinc-500">Loading learners…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 w-full">

      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-extrabold text-zinc-900 mb-1">
          Enrolled learners
        </h1>
        <p className="text-sm text-zinc-500">
          {learners.length}{' '}
          {learners.length === 1 ? 'learner' : 'learners'} enrolled in this
          programme.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard label="Total" value={stats.total} />
        <StatCard label="Active" value={stats.active} />
        <StatCard label="Female" value={stats.female} />
        <StatCard label="Male" value={stats.male} />
      </div>

      <div className="flex flex-col lg:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-3.5 h-3.5" />
          <input
            type="text"
            placeholder="Search by name or email…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 text-sm bg-white border border-zinc-300 rounded-lg focus:border-[#E30613] outline-none transition-colors"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
              showFilters
                ? 'bg-[#E30613] text-white'
                : 'bg-white border border-zinc-300 text-zinc-700 hover:border-zinc-400'
            }`}
          >
            <FaFilter size={12} />
            Filters
            {(filterGender !== 'ALL' || filterStatus !== 'ALL') && (
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  showFilters ? 'bg-white' : 'bg-[#E30613]'
                }`}
              />
            )}
          </button>

          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full pl-4 pr-9 py-2.5 text-sm bg-white border border-zinc-300 rounded-lg focus:border-[#E30613] outline-none cursor-pointer appearance-none"
            >
              <option value="name">Sort by name</option>
              <option value="enrollment">Sort by enrolment</option>
            </select>
            <FaSortAmountDown className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none text-xs" />
          </div>
        </div>
      </div>

      {showFilters && (
        <div className="bg-white border border-zinc-200 rounded-xl p-4 mb-5">
          <div className="flex flex-col sm:flex-row gap-5">
            <FilterGroup
              label="Gender"
              value={filterGender}
              onChange={setFilterGender}
              options={GENDERS}
              labels={{ ALL: 'All' }}
            />

            <FilterGroup
              label="Status"
              value={filterStatus}
              onChange={setFilterStatus}
              options={STATUSES}
              labels={{ ALL: 'All', ACTIVE: 'Active', INACTIVE: 'Inactive' }}
            />
          </div>
        </div>
      )}

      {filteredLearners.length === 0 ? (
        <EmptyState
          hasFilters={
            searchTerm || filterGender !== 'ALL' || filterStatus !== 'ALL'
          }
        />
      ) : (
        <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden">
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-zinc-50 border-b border-zinc-200">
                <tr>
                  {[
                    'Learner',
                    'Email',
                    'Phone',
                    'Gender',
                    'Status',
                    'Enrolled',
                    '',
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-left px-4 py-3 text-xs font-bold text-zinc-600 uppercase tracking-wider whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {filteredLearners.map((learner) => (
                  <tr
                    key={learner.id}
                    className="hover:bg-red-50/30 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-zinc-100 text-zinc-700 text-[10px] font-bold flex items-center justify-center shrink-0">
                          {(learner.firstname?.[0] || '') +
                            (learner.lastname?.[0] || '')}
                        </div>
                        <div className="font-bold text-zinc-900 truncate">
                          {learner.firstname} {learner.lastname}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 text-zinc-600 truncate max-w-[200px]">
                        <FaEnvelope size={10} className="text-zinc-400 shrink-0" />
                        <span className="truncate">{learner.email}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-zinc-600 whitespace-nowrap">
                      {learner.contactNumber || '—'}
                    </td>
                    <td className="px-4 py-3 text-zinc-600 whitespace-nowrap">
                      {learner.gender || '—'}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={learner.status} />
                    </td>
                    <td className="px-4 py-3 text-zinc-600 whitespace-nowrap text-xs">
                      {learner.enrollmentDate
                        ? new Date(learner.enrollmentDate).toLocaleDateString(
                            'en-ZA',
                            { day: 'numeric', month: 'short', year: 'numeric' }
                          )
                        : '—'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <FiChevronRight
                        size={12}
                        className="text-zinc-300 inline-block"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="md:hidden divide-y divide-zinc-100">
            {filteredLearners.map((learner) => (
              <div key={learner.id} className="p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-9 h-9 rounded-full bg-zinc-100 text-zinc-700 text-xs font-bold flex items-center justify-center shrink-0">
                    {(learner.firstname?.[0] || '') +
                      (learner.lastname?.[0] || '')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-zinc-900 truncate">
                      {learner.firstname} {learner.lastname}
                    </div>
                    <div className="text-xs text-zinc-500 truncate mt-0.5">
                      {learner.email}
                    </div>
                  </div>
                  <StatusBadge status={learner.status} />
                </div>

                <div className="flex items-center justify-between pl-12 text-xs text-zinc-500">
                  <span>
                    {learner.contactNumber || 'No phone'}
                  </span>
                  <span>
                    {learner.enrollmentDate
                      ? new Date(learner.enrollmentDate).toLocaleDateString(
                          'en-ZA',
                          { day: 'numeric', month: 'short', year: 'numeric' }
                        )
                      : '—'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {filteredLearners.length > 0 && (
        <div className="mt-4 text-center">
          <p className="text-xs text-zinc-400">
            Showing {filteredLearners.length} of {learners.length} learners
          </p>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="bg-white border border-zinc-200 rounded-xl p-3 sm:p-4">
      <p className="text-[10px] sm:text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">
        {label}
      </p>
      <p className="text-xl sm:text-2xl font-extrabold text-zinc-900 tabular-nums">
        {value}
      </p>
    </div>
  );
}

function FilterGroup({ label, value, onChange, options, labels = {} }) {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
        {label}:
      </span>
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
              value === opt
                ? 'bg-[#E30613] text-white'
                : 'bg-white border border-zinc-300 text-zinc-700 hover:border-zinc-400'
            }`}
          >
            {labels[opt] || opt}
          </button>
        ))}
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const isActive = status === 'ACTIVE';
  return (
    <span
      className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider whitespace-nowrap ${
        isActive ? 'bg-zinc-100 text-zinc-700' : 'bg-zinc-100 text-zinc-400'
      }`}
    >
      {isActive ? 'Active' : 'Inactive'}
    </span>
  );
}

function EmptyState({ hasFilters }) {
  return (
    <div className="bg-white border border-zinc-200 rounded-xl p-12 text-center">
      <div className="w-14 h-14 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <FaUserGraduate className="text-zinc-400 text-xl" />
      </div>
      <h3 className="font-bold text-zinc-900 mb-1">No learners found</h3>
      <p className="text-sm text-zinc-500">
        {hasFilters
          ? 'Try adjusting your search or filter criteria.'
          : 'No learners are enrolled in this programme yet.'}
      </p>
    </div>
  );
}