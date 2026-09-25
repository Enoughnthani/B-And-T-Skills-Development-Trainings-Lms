import { apiFetch } from '@/api/api';
import { useEffect, useMemo, useState } from 'react';
import {
  FaChevronRight,
  FaClipboardCheck,
  FaPlus,
  FaSearch,
} from 'react-icons/fa';
import { FiChevronLeft, FiChevronRight, FiFilter } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';

const STATUS_STYLES = {
  DRAFT: 'bg-zinc-100 text-zinc-500',
  SCHEDULED: 'bg-zinc-100 text-zinc-700',
  OPEN: 'bg-red-50 text-[#E30613]',
  CLOSED: 'bg-zinc-100 text-zinc-700',
  FINALISED: 'bg-zinc-900 text-white',
};

export default function AssessmentsList() {
  const navigate = useNavigate();
  const [assessments, setAssessments] = useState([]);
  const [programmes, setProgrammes] = useState([]);
  const [cohorts, setCohorts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [programmeFilter, setProgrammeFilter] = useState('all');
  const [cohortFilter, setCohortFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 20;

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      const result = await apiFetch('/api/program-manager/assessments');
      if (result?.success) {
        setAssessments(result.payload?.assessments || []);
        setProgrammes(result.payload?.programmes || []);
        setCohorts(result.payload?.cohorts || []);
      }
    } catch (error) {
      setAssessments([]);
    } finally {
      setLoading(false);
    }
  }

  const filtered = useMemo(() => {
    const s = search.toLowerCase();
    return assessments.filter((a) => {
      const matchesSearch = a.name?.toLowerCase().includes(s);
      const matchesProgramme = programmeFilter === 'all' || a.programmeId === programmeFilter;
      const matchesCohort = cohortFilter === 'all' || a.cohortId === cohortFilter;
      const matchesType = typeFilter === 'all' || a.type === typeFilter;
      const matchesStatus = statusFilter === 'all' || a.status === statusFilter;
      return matchesSearch && matchesProgramme && matchesCohort && matchesType && matchesStatus;
    });
  }, [assessments, search, programmeFilter, cohortFilter, typeFilter, statusFilter]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const hasFilters =
    search ||
    programmeFilter !== 'all' ||
    cohortFilter !== 'all' ||
    typeFilter !== 'all' ||
    statusFilter !== 'all';

  const resetFilters = () => {
    setSearch('');
    setProgrammeFilter('all');
    setCohortFilter('all');
    setTypeFilter('all');
    setStatusFilter('all');
    setCurrentPage(1);
  };

  const summary = {
    total: filtered.length,
    open: filtered.filter((a) => a.status === 'OPEN').length,
    closed: filtered.filter((a) => a.status === 'CLOSED').length,
    finalised: filtered.filter((a) => a.status === 'FINALISED').length,
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 w-full">

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-extrabold text-zinc-900 mb-1">
            Assessments
          </h1>
          <p className="text-sm text-zinc-500">
            Create and track assessments across your programmes.
          </p>
        </div>

        <Link
          to="/user/program-manager/assessments/new"
          className="inline-flex items-center justify-center gap-2 bg-[#E30613] hover:bg-[#c00511] text-white font-semibold text-sm px-5 py-2.5 rounded-lg transition-colors shrink-0 no-underline"
        >
          <FaPlus size={12} />
          New Assessment
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard label="Total" value={summary.total} />
        <StatCard label="Open" value={summary.open} accent />
        <StatCard label="Closed" value={summary.closed} />
        <StatCard label="Finalised" value={summary.finalised} dark />
      </div>

      <div className="bg-white border border-zinc-200 rounded-xl p-3 sm:p-4 mb-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <FiFilter size={12} className="text-zinc-400" />
            <span className="text-xs font-bold text-zinc-600 uppercase tracking-wider">
              Filters
            </span>
          </div>
          {hasFilters && (
            <button
              onClick={resetFilters}
              className="text-xs font-medium text-[#E30613] hover:underline"
            >
              Clear all
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-3.5 h-3.5" />
            <input
              type="text"
              placeholder="Search assessments…"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-zinc-300 rounded-lg focus:border-[#E30613] outline-none transition-colors"
            />
          </div>

          <select
            value={programmeFilter}
            onChange={(e) => {
              setProgrammeFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 text-sm bg-white border border-zinc-300 rounded-lg focus:border-[#E30613] outline-none cursor-pointer"
          >
            <option value="all">All programmes</option>
            {programmes.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>

          <select
            value={cohortFilter}
            onChange={(e) => {
              setCohortFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 text-sm bg-white border border-zinc-300 rounded-lg focus:border-[#E30613] outline-none cursor-pointer"
          >
            <option value="all">All cohorts</option>
            {cohorts.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <select
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 text-sm bg-white border border-zinc-300 rounded-lg focus:border-[#E30613] outline-none cursor-pointer"
          >
            <option value="all">All types</option>
            <option value="FORMATIVE">Formative</option>
            <option value="SUMMATIVE">Summative</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 text-sm bg-white border border-zinc-300 rounded-lg focus:border-[#E30613] outline-none cursor-pointer"
          >
            <option value="all">All statuses</option>
            <option value="DRAFT">Draft</option>
            <option value="SCHEDULED">Scheduled</option>
            <option value="OPEN">Open</option>
            <option value="CLOSED">Closed</option>
            <option value="FINALISED">Finalised</option>
          </select>
        </div>
      </div>

      <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-zinc-500">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-14 h-14 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaClipboardCheck className="text-zinc-400 text-xl" />
            </div>
            <h3 className="font-bold text-zinc-900 mb-1">No assessments found</h3>
            <p className="text-sm text-zinc-500 mb-5">
              {hasFilters
                ? 'Try adjusting your filters.'
                : 'Create your first assessment to get started.'}
            </p>
            <Link
              to="/user/program-manager/assessments/new"
              className="inline-flex items-center gap-2 bg-[#E30613] hover:bg-[#c00511] text-white font-semibold text-sm px-5 py-2.5 rounded-lg transition-colors no-underline"
            >
              <FaPlus size={12} />
              Create Assessment
            </Link>
          </div>
        ) : (
          <>
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-zinc-50 border-b border-zinc-200">
                  <tr>
                    {['Assessment', 'Programme', 'Cohort', 'Type', 'Due', 'Submitted', 'Pass rate', 'Status', ''].map((h) => (
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
                  {paginated.map((item) => (
                    <tr
                      key={item.id}
                      onClick={() => navigate(`${item.id}`, { state: { assessment: item } })}
                      className="cursor-pointer hover:bg-red-50/30 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="font-bold text-zinc-900 truncate">
                          {item.name}
                        </div>
                        {item.module && (
                          <div className="text-xs text-zinc-500 truncate mt-0.5">
                            {item.module}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-zinc-700 whitespace-nowrap">
                        {item.programme || '—'}
                      </td>
                      <td className="px-4 py-3 text-zinc-700 whitespace-nowrap">
                        {item.cohort || '—'}
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-[10px] font-bold bg-zinc-100 text-zinc-600 px-2 py-1 rounded uppercase tracking-wider whitespace-nowrap">
                          {item.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-zinc-500 whitespace-nowrap">
                        {item.dueDate
                          ? new Date(item.dueDate).toLocaleDateString('en-ZA', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })
                          : '—'}
                      </td>
                      <td className="px-4 py-3 text-zinc-700 whitespace-nowrap tabular-nums">
                        <span className="font-bold text-zinc-900">
                          {item.submittedCount || 0}
                        </span>
                        <span className="text-zinc-400">
                          /{item.enrolledCount || 0}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-zinc-700 whitespace-nowrap tabular-nums">
                        {item.passRate != null ? `${item.passRate}%` : '—'}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider whitespace-nowrap ${
                            STATUS_STYLES[item.status] || 'bg-zinc-100 text-zinc-600'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <FaChevronRight className="text-zinc-300 inline-block" size={12} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="md:hidden divide-y divide-zinc-100">
              {paginated.map((item) => (
                <div
                  key={item.id}
                  onClick={() => navigate(`${item.id}`, { state: { assessment: item } })}
                  className="p-4 hover:bg-red-50/30 transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-bold text-zinc-900 truncate flex-1 min-w-0">
                      {item.name}
                    </h3>
                    <span
                      className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider whitespace-nowrap ${
                        STATUS_STYLES[item.status] || 'bg-zinc-100 text-zinc-600'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <div className="text-xs text-zinc-500 mb-3 truncate">
                    {item.programme}
                    {item.cohort && ` · ${item.cohort}`}
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <div className="text-zinc-400 uppercase tracking-wider text-[10px] font-bold">
                        Type
                      </div>
                      <div className="text-zinc-700 font-medium">{item.type}</div>
                    </div>
                    <div>
                      <div className="text-zinc-400 uppercase tracking-wider text-[10px] font-bold">
                        Submitted
                      </div>
                      <div className="text-zinc-700 font-medium tabular-nums">
                        {item.submittedCount || 0}/{item.enrolledCount || 0}
                      </div>
                    </div>
                    <div>
                      <div className="text-zinc-400 uppercase tracking-wider text-[10px] font-bold">
                        Pass
                      </div>
                      <div className="text-zinc-700 font-medium tabular-nums">
                        {item.passRate != null ? `${item.passRate}%` : '—'}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-4 border-t border-zinc-100">
                <div className="text-xs sm:text-sm text-zinc-500 text-center sm:text-left">
                  Showing{' '}
                  <span className="font-semibold text-zinc-900">
                    {(currentPage - 1) * itemsPerPage + 1}
                  </span>{' '}
                  to{' '}
                  <span className="font-semibold text-zinc-900">
                    {Math.min(currentPage * itemsPerPage, filtered.length)}
                  </span>{' '}
                  of{' '}
                  <span className="font-semibold text-zinc-900">
                    {filtered.length}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-2 border border-zinc-200 rounded-lg bg-white hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-zinc-600"
                  >
                    <FiChevronLeft size={14} />
                  </button>
                  <span className="text-xs text-zinc-600 px-2">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-2 border border-zinc-200 rounded-lg bg-white hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-zinc-600"
                  >
                    <FiChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, accent, dark }) {
  const valueClass = dark
    ? 'text-white'
    : accent
    ? 'text-[#E30613]'
    : 'text-zinc-900';

  const cardClass = dark ? 'bg-zinc-900 border-zinc-900' : 'bg-white border-zinc-200';
  const labelClass = dark ? 'text-zinc-400' : 'text-zinc-500';

  return (
    <div className={`border rounded-xl p-3 sm:p-4 ${cardClass}`}>
      <div className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-1 ${labelClass}`}>
        {label}
      </div>
      <div className={`text-xl sm:text-2xl font-extrabold tabular-nums ${valueClass}`}>
        {value}
      </div>
    </div>
  );
}