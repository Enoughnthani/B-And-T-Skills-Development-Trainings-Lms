import { apiFetch } from '@/api/api';
import { useEffect, useMemo, useState } from 'react';
import {
  FaChevronRight,
  FaSearch,
  FaUsers,
} from 'react-icons/fa';
import { FiChevronLeft, FiChevronRight, FiFilter } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const STATUS_STYLES = {
  ACTIVE: 'bg-zinc-100 text-zinc-700',
  COMPLETED: 'bg-zinc-900 text-white',
  WITHDRAWN: 'bg-red-50 text-[#E30613]',
  ON_HOLD: 'bg-zinc-100 text-zinc-500',
};

export default function LearnersList() {
  const navigate = useNavigate();
  const [learners, setLearners] = useState([]);
  const [programmes, setProgrammes] = useState([]);
  const [cohorts, setCohorts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [programmeFilter, setProgrammeFilter] = useState('all');
  const [cohortFilter, setCohortFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 20;

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      const result = await apiFetch('/api/program-manager/learners');
      if (result?.success) {
        setLearners(result.payload?.learners || []);
        setProgrammes(result.payload?.programmes || []);
        setCohorts(result.payload?.cohorts || []);
      }
    } catch (error) {
      setLearners([]);
    } finally {
      setLoading(false);
    }
  }

  const filtered = useMemo(() => {
    const s = search.toLowerCase();
    return learners.filter((l) => {
      const matchesSearch =
        l.firstname?.toLowerCase().includes(s) ||
        l.lastname?.toLowerCase().includes(s) ||
        l.email?.toLowerCase().includes(s);
      const matchesProgramme = programmeFilter === 'all' || l.programmeId === programmeFilter;
      const matchesCohort = cohortFilter === 'all' || l.cohortId === cohortFilter;
      const matchesStatus = statusFilter === 'all' || l.status === statusFilter;
      return matchesSearch && matchesProgramme && matchesCohort && matchesStatus;
    });
  }, [learners, search, programmeFilter, cohortFilter, statusFilter]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const hasFilters =
    search ||
    programmeFilter !== 'all' ||
    cohortFilter !== 'all' ||
    statusFilter !== 'all';

  const resetFilters = () => {
    setSearch('');
    setProgrammeFilter('all');
    setCohortFilter('all');
    setStatusFilter('all');
    setCurrentPage(1);
  };

  const summary = {
    total: filtered.length,
    active: filtered.filter((l) => l.status === 'ACTIVE').length,
    completed: filtered.filter((l) => l.status === 'COMPLETED').length,
    withdrawn: filtered.filter((l) => l.status === 'WITHDRAWN').length,
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 w-full">

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-extrabold text-zinc-900 mb-1">
            Learners
          </h1>
          <p className="text-sm text-zinc-500">
            Learners enrolled on your programmes and cohorts.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div className="bg-white border border-zinc-200 rounded-xl p-3 sm:p-4">
          <div className="text-[10px] sm:text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">
            Total
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-zinc-900 tabular-nums">
            {summary.total}
          </div>
        </div>
        <div className="bg-white border border-zinc-200 rounded-xl p-3 sm:p-4">
          <div className="text-[10px] sm:text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">
            Active
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-zinc-900 tabular-nums">
            {summary.active}
          </div>
        </div>
        <div className="bg-white border border-zinc-200 rounded-xl p-3 sm:p-4">
          <div className="text-[10px] sm:text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">
            Completed
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-zinc-900 tabular-nums">
            {summary.completed}
          </div>
        </div>
        <div className="bg-white border border-zinc-200 rounded-xl p-3 sm:p-4">
          <div className="text-[10px] sm:text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">
            Withdrawn
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-[#E30613] tabular-nums">
            {summary.withdrawn}
          </div>
        </div>
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-3.5 h-3.5" />
            <input
              type="text"
              placeholder="Search name or email…"
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
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 text-sm bg-white border border-zinc-300 rounded-lg focus:border-[#E30613] outline-none cursor-pointer"
          >
            <option value="all">All statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="COMPLETED">Completed</option>
            <option value="ON_HOLD">On hold</option>
            <option value="WITHDRAWN">Withdrawn</option>
          </select>
        </div>
      </div>

      <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-zinc-500">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-14 h-14 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaUsers className="text-zinc-400 text-xl" />
            </div>
            <h3 className="font-bold text-zinc-900 mb-1">No learners found</h3>
            <p className="text-sm text-zinc-500">
              {hasFilters
                ? 'Try adjusting your filters.'
                : 'Learners will appear here once enrolled on your programmes.'}
            </p>
          </div>
        ) : (
          <>
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-zinc-50 border-b border-zinc-200">
                  <tr>
                    {['Learner', 'Programme', 'Cohort', 'Status', 'Progress', 'Last activity', ''].map((h) => (
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
                  {paginated.map((learner) => (
                    <tr
                      key={learner.id}
                      onClick={() => navigate(`${learner.id}`, { state: { learner } })}
                      className="cursor-pointer hover:bg-red-50/30 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-8 h-8 rounded-full bg-zinc-100 text-zinc-700 text-[10px] font-bold flex items-center justify-center shrink-0">
                            {(learner.firstname?.[0] || '') + (learner.lastname?.[0] || '')}
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold text-zinc-900 truncate">
                              {learner.firstname} {learner.lastname}
                            </div>
                            <div className="text-xs text-zinc-500 truncate">
                              {learner.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-zinc-700 whitespace-nowrap">
                        {learner.programme || '—'}
                      </td>
                      <td className="px-4 py-3 text-zinc-700 whitespace-nowrap">
                        {learner.cohort || '—'}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider whitespace-nowrap ${STATUS_STYLES[learner.status] || 'bg-zinc-100 text-zinc-600'}`}>
                          {(learner.status || '').replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 min-w-[100px]">
                          <div className="flex-1 h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#E30613] transition-all"
                              style={{ width: `${learner.progress || 0}%` }}
                            />
                          </div>
                          <span className="text-xs font-bold text-zinc-700 tabular-nums w-9 text-right">
                            {learner.progress || 0}%
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-zinc-500 whitespace-nowrap">
                        {learner.lastActivity
                          ? new Date(learner.lastActivity).toLocaleDateString('en-ZA', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })
                          : '—'}
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
              {paginated.map((learner) => (
                <div
                  key={learner.id}
                  onClick={() => navigate(`${learner.id}`, { state: { learner } })}
                  className="p-4 hover:bg-red-50/30 transition-colors cursor-pointer"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-zinc-100 text-zinc-700 text-xs font-bold flex items-center justify-center shrink-0">
                      {(learner.firstname?.[0] || '') + (learner.lastname?.[0] || '')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-zinc-900 truncate">
                        {learner.firstname} {learner.lastname}
                      </div>
                      <div className="text-xs text-zinc-500 truncate mt-0.5">
                        {learner.email}
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider whitespace-nowrap ${STATUS_STYLES[learner.status] || 'bg-zinc-100 text-zinc-600'}`}>
                      {(learner.status || '').replace(/_/g, ' ')}
                    </span>
                  </div>

                  <div className="text-xs text-zinc-600 mb-2">
                    {learner.programme}
                    {learner.cohort && ` · ${learner.cohort}`}
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#E30613] transition-all"
                        style={{ width: `${learner.progress || 0}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-zinc-700 tabular-nums">
                      {learner.progress || 0}%
                    </span>
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