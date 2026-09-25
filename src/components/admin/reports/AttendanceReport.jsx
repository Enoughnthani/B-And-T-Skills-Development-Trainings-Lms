import { apiFetch } from '@/api/api';
import { ADMIN } from '@/utils/apiEndpoint';
import { useEffect, useMemo, useState } from 'react';
import { FaCalendarCheck, FaSearch } from 'react-icons/fa';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import ReportLayout from './ReportLayout';

export default function AttendanceReport() {
  const [rows, setRows] = useState([]);
  const [programmes, setProgrammes] = useState([]);
  const [cohorts, setCohorts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [search, setSearch] = useState('');
  const [programmeFilter, setProgrammeFilter] = useState('all');
  const [cohortFilter, setCohortFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      const result = await apiFetch(`${ADMIN}/reports/attendance`);
      if (result?.success) {
        setRows(result.payload?.attendance || []);
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
    return rows.filter((r) => {
      const matchesSearch =
        r.learnerName?.toLowerCase().includes(s) ||
        r.sessionName?.toLowerCase().includes(s);
      const matchesProgramme = programmeFilter === 'all' || r.programmeId === programmeFilter;
      const matchesCohort = cohortFilter === 'all' || r.cohortId === cohortFilter;
      return matchesSearch && matchesProgramme && matchesCohort;
    });
  }, [rows, search, programmeFilter, cohortFilter]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const presentCount = filtered.filter((r) => r.status === 'PRESENT').length;
  const absentCount = filtered.filter((r) => r.status === 'ABSENT').length;
  const lateCount = filtered.filter((r) => r.status === 'LATE').length;
  const attendanceRate = filtered.length
    ? Math.round((presentCount / filtered.length) * 100)
    : 0;

  const summary = [
    { label: 'Records',       value: filtered.length,   color: 'text-zinc-900' },
    { label: 'Attendance',    value: `${attendanceRate}%`, color: 'text-emerald-600' },
    { label: 'Absent',        value: absentCount,        color: 'text-red-600' },
    { label: 'Late',          value: lateCount,          color: 'text-amber-600' },
  ];

  const hasFilters =
    search || programmeFilter !== 'all' || cohortFilter !== 'all';

  const resetFilters = () => {
    setSearch('');
    setProgrammeFilter('all');
    setCohortFilter('all');
    setCurrentPage(1);
  };

  async function handleExport() {
    setExporting(true);
    try {
      const params = new URLSearchParams();
      if (programmeFilter !== 'all') params.append('programme', programmeFilter);
      if (cohortFilter !== 'all') params.append('cohort', cohortFilter);
      if (search) params.append('search', search);

      const response = await fetch(`${ADMIN}/reports/attendance/export?${params}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `attendance_report_${Date.now()}.csv`;
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
      title="Attendance"
      description="Class attendance records across all programmes and cohorts."
      onExport={handleExport}
      exporting={exporting}
      exportDisabled={filtered.length === 0}
      hasFilters={hasFilters}
      onClearFilters={resetFilters}
      summary={summary}
      filters={
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-3.5 h-3.5" />
            <input
              type="text"
              placeholder="Search learner or session..."
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
            <FaCalendarCheck className="text-zinc-300 text-2xl mx-auto mb-3" />
            <h3 className="font-bold text-zinc-900 mb-1">No attendance records</h3>
            <p className="text-sm text-zinc-500">
              {hasFilters
                ? 'Try adjusting your filters.'
                : 'Once classes run and attendance is captured, records will appear here.'}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-zinc-50 border-b border-zinc-200">
                  <tr>
                    {['Learner', 'Session', 'Programme', 'Cohort', 'Date', 'Status', 'Notes'].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-bold text-zinc-600 uppercase tracking-wider whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((r, i) => (
                    <tr key={r.id || i} className="border-b border-zinc-100 last:border-0 hover:bg-zinc-50">
                      <td className="px-4 py-3 font-medium text-zinc-900 whitespace-nowrap">
                        {r.learnerName}
                      </td>
                      <td className="px-4 py-3 text-zinc-600 whitespace-nowrap">{r.sessionName}</td>
                      <td className="px-4 py-3 text-zinc-600 whitespace-nowrap">{r.programme || '—'}</td>
                      <td className="px-4 py-3 text-zinc-600 whitespace-nowrap">{r.cohort || '—'}</td>
                      <td className="px-4 py-3 text-zinc-600 whitespace-nowrap">
                        {r.date
                          ? new Date(r.date).toLocaleDateString('en-ZA', {
                              day: 'numeric', month: 'short', year: 'numeric',
                            })
                          : '—'}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider whitespace-nowrap ${
                          r.status === 'PRESENT' ? 'bg-emerald-100 text-emerald-700' :
                          r.status === 'ABSENT' ? 'bg-red-100 text-red-700' :
                          r.status === 'LATE' ? 'bg-amber-100 text-amber-700' :
                          'bg-zinc-100 text-zinc-600'
                        }`}>
                          {r.status || '—'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-zinc-500 whitespace-nowrap">
                        {r.notes || '—'}
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
        >
          <FiChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}