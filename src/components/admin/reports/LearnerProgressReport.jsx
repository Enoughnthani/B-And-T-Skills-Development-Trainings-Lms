import { apiFetch } from '@/api/api';
import { ADMIN } from '@/utils/apiEndpoint';
import { useEffect, useMemo, useState } from 'react';
import { FaSearch, FaUsers } from 'react-icons/fa';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import ReportLayout from './ReportLayout';

const STATUSES = ['all', 'ACTIVE', 'COMPLETED', 'WITHDRAWN', 'ON_HOLD'];

const STATUS_STYLES = {
  ACTIVE:    'bg-emerald-100 text-emerald-700',
  COMPLETED: 'bg-blue-100 text-blue-700',
  WITHDRAWN: 'bg-red-100 text-red-700',
  ON_HOLD:   'bg-amber-100 text-amber-700',
};

export default function LearnerProgressReport() {
  const [learners, setLearners] = useState([]);
  const [programmes, setProgrammes] = useState([]);
  const [cohorts, setCohorts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  const [search, setSearch] = useState('');
  const [programmeFilter, setProgrammeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [cohortFilter, setCohortFilter] = useState('all');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      const result = await apiFetch(`${ADMIN}/reports/learner-progress`);
      if (result?.success) {
        setLearners(result.payload?.learners || []);
        setProgrammes(result.payload?.programmes || []);
        setCohorts(result.payload?.cohorts || []);
      }
    } catch (e) {
      // silently fail
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
      const matchesStatus = statusFilter === 'all' || l.status === statusFilter;
      const matchesCohort = cohortFilter === 'all' || l.cohortId === cohortFilter;
      return matchesSearch && matchesProgramme && matchesStatus && matchesCohort;
    });
  }, [learners, search, programmeFilter, statusFilter, cohortFilter]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const summary = [
    { label: 'Total',     value: filtered.length,     color: 'text-zinc-900' },
    { label: 'Active',    value: filtered.filter((l) => l.status === 'ACTIVE').length,       color: 'text-emerald-600' },
    { label: 'Completed', value: filtered.filter((l) => l.status === 'COMPLETED').length,    color: 'text-blue-600' },
    { label: 'Withdrawn', value: filtered.filter((l) => l.status === 'WITHDRAWN').length,    color: 'text-red-600' },
  ];

  const hasFilters =
    search || programmeFilter !== 'all' || statusFilter !== 'all' || cohortFilter !== 'all';

  const resetFilters = () => {
    setSearch('');
    setProgrammeFilter('all');
    setStatusFilter('all');
    setCohortFilter('all');
    setCurrentPage(1);
  };

  async function handleExport() {
    setExporting(true);
    try {
      const params = new URLSearchParams();
      if (programmeFilter !== 'all') params.append('programme', programmeFilter);
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (cohortFilter !== 'all') params.append('cohort', cohortFilter);
      if (search) params.append('search', search);

      const response = await fetch(
        `${ADMIN}/reports/learner-progress/export?${params}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `learner_progress_${Date.now()}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      alert('Export failed');
    } finally {
      setExporting(false);
    }
  }

  return (
    <ReportLayout
      title="Learner Progress"
      description="Track progress, assessments and PoE status across all learners."
      onExport={handleExport}
      exporting={exporting}
      exportDisabled={filtered.length === 0}
      hasFilters={hasFilters}
      onClearFilters={resetFilters}
      summary={summary}
      filters={
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-3.5 h-3.5" />
            <input
              type="text"
              placeholder="Search name or email..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-zinc-300 rounded-lg focus:border-zinc-900 outline-none"
            />
          </div>

          <select
            value={programmeFilter}
            onChange={(e) => { setProgrammeFilter(e.target.value); setCurrentPage(1); }}
            className="px-3 py-2 text-sm bg-white border border-zinc-300 rounded-lg focus:border-zinc-900 outline-none cursor-pointer"
          >
            <option value="all">All programmes</option>
            {programmes.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            className="px-3 py-2 text-sm bg-white border border-zinc-300 rounded-lg focus:border-zinc-900 outline-none cursor-pointer"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s === 'all' ? 'All statuses' : s.replace(/_/g, ' ')}
              </option>
            ))}
          </select>

          <select
            value={cohortFilter}
            onChange={(e) => { setCohortFilter(e.target.value); setCurrentPage(1); }}
            className="px-3 py-2 text-sm bg-white border border-zinc-300 rounded-lg focus:border-zinc-900 outline-none cursor-pointer"
          >
            <option value="all">All cohorts</option>
            {cohorts.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      }
    >
      <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-zinc-500">Loading report…</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <FaUsers className="text-zinc-300 text-2xl mx-auto mb-3" />
            <h3 className="font-bold text-zinc-900 mb-1">No learners found</h3>
            <p className="text-sm text-zinc-500">
              {hasFilters
                ? 'Try adjusting your filters or clearing the search.'
                : 'Once learners are enrolled, they will appear here.'}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-zinc-50 border-b border-zinc-200">
                  <tr>
                    {['Learner', 'Programme', 'Cohort', 'Status', 'Progress', 'Assessments', 'PoE', 'Last activity'].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-bold text-zinc-600 uppercase tracking-wider whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((l, i) => (
                    <tr key={l.id || i} className="border-b border-zinc-100 last:border-0 hover:bg-zinc-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-8 h-8 rounded-full bg-zinc-900 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                            {(l.firstname?.[0] || '') + (l.lastname?.[0] || '')}
                          </div>
                          <div className="min-w-0">
                            <div className="font-medium text-zinc-900 truncate">
                              {l.firstname} {l.lastname}
                            </div>
                            <div className="text-xs text-zinc-500 truncate">{l.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-zinc-600 whitespace-nowrap">{l.programme || '—'}</td>
                      <td className="px-4 py-3 text-zinc-600 whitespace-nowrap">{l.cohort || '—'}</td>
                      <td className="px-4 py-3">
                        <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider whitespace-nowrap ${STATUS_STYLES[l.status] || 'bg-zinc-100 text-zinc-600'}`}>
                          {(l.status || '').replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 min-w-[100px]">
                          <div className="flex-1 h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full transition-all ${
                                (l.progress || 0) >= 80 ? 'bg-emerald-500' :
                                (l.progress || 0) >= 40 ? 'bg-amber-500' : 'bg-[#E30613]'
                              }`}
                              style={{ width: `${l.progress || 0}%` }}
                            />
                          </div>
                          <span className="text-xs font-bold text-zinc-700 tabular-nums w-9 text-right">
                            {l.progress || 0}%
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-zinc-600 whitespace-nowrap tabular-nums">
                        <span className="font-bold text-zinc-900">{l.assessmentsPassed || 0}</span>
                        <span className="text-zinc-400"> / {l.assessmentsTotal || 0}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider whitespace-nowrap ${
                          l.poeStatus === 'COMPLETE' ? 'bg-emerald-100 text-emerald-700' :
                          l.poeStatus === 'SUBMITTED' ? 'bg-blue-100 text-blue-700' :
                          'bg-zinc-100 text-zinc-600'
                        }`}>
                          {l.poeStatus || 'PENDING'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-zinc-500 whitespace-nowrap">
                        {l.lastActivity
                          ? new Date(l.lastActivity).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })
                          : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPrev={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              onNext={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              showingFrom={(currentPage - 1) * itemsPerPage + 1}
              showingTo={Math.min(currentPage * itemsPerPage, filtered.length)}
              total={filtered.length}
            />
          </>
        )}
      </div>
    </ReportLayout>
  );
}

function Pagination({ currentPage, totalPages, onPrev, onNext, showingFrom, showingTo, total }) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 py-3 border-t border-zinc-100">
      <div className="text-xs sm:text-sm text-zinc-500 text-center sm:text-left">
        Showing <span className="font-semibold text-zinc-900">{showingFrom}</span> to{' '}
        <span className="font-semibold text-zinc-900">{showingTo}</span> of{' '}
        <span className="font-semibold text-zinc-900">{total}</span>
      </div>
      <div className="flex items-center justify-center gap-1">
        <button
          onClick={onPrev}
          disabled={currentPage === 1}
          className="p-2 border border-zinc-200 rounded-lg bg-white hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-zinc-600"
          aria-label="Previous page"
        >
          <FiChevronLeft size={14} />
        </button>
        <span className="text-xs text-zinc-600 px-3">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={onNext}
          disabled={currentPage === totalPages}
          className="p-2 border border-zinc-200 rounded-lg bg-white hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-zinc-600"
          aria-label="Next page"
        >
          <FiChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}