import { apiFetch } from '@/api/api';
import { ADMIN } from '@/utils/apiEndpoint';
import { useEffect, useState } from 'react';
import {
  FaArrowRight,
  FaCheckCircle,
  FaEnvelope,
  FaEnvelopeOpen,
  FaInbox,
  FaPhone,
  FaSearch,
  FaTrash,
} from 'react-icons/fa';
import { FiChevronLeft, FiChevronRight, FiClock } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const STATUSES = [
  { key: 'all', label: 'All' },
  { key: 'NEW', label: 'New' },
  { key: 'READ', label: 'Read' },
  { key: 'RESPONDED', label: 'Responded' },
  { key: 'ARCHIVED', label: 'Archived' },
];

const STATUS_STYLES = {
  NEW:        'bg-[#E30613] text-white',
  READ:       'bg-zinc-200 text-zinc-700',
  RESPONDED:  'bg-emerald-100 text-emerald-700',
  ARCHIVED:   'bg-zinc-100 text-zinc-500',
};

export default function EnquiriesList() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [deleting, setDeleting] = useState(null);
  const navigate = useNavigate();
  const itemsPerPage = 15;

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      const result = await apiFetch(`${ADMIN}/enquiries`);
      if (result?.success) setEnquiries(result?.payload || []);
    } catch (e) {
      // silently fail
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this enquiry? This cannot be undone.')) return;
    setDeleting(id);
    try {
      const result = await apiFetch(`${ADMIN}/enquiries/${id}`, {
        method: 'DELETE',
      });
      if (result?.success) {
        setEnquiries((prev) => prev.filter((e) => e.id !== id));
      } else {
        alert(result?.message || 'Failed to delete');
      }
    } catch (e) {
      alert('Network error');
    } finally {
      setDeleting(null);
    }
  }

  const filtered = enquiries.filter((e) => {
    const s = search.toLowerCase();
    const matchesSearch =
      e.name?.toLowerCase().includes(s) ||
      e.email?.toLowerCase().includes(s) ||
      e.subject?.toLowerCase().includes(s) ||
      e.message?.toLowerCase().includes(s);
    const matchesStatus = statusFilter === 'all' || e.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const stats = {
    total: enquiries.length,
    new: enquiries.filter((e) => e.status === 'NEW').length,
    responded: enquiries.filter((e) => e.status === 'RESPONDED').length,
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-extrabold text-zinc-900 mb-1">
          Enquiries
        </h1>
        <p className="text-sm text-zinc-500">
          Submissions from the contact form on the public website.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-white border border-zinc-200 rounded-xl p-3 sm:p-4">
          <p className="text-[10px] sm:text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">
            Total
          </p>
          <p className="text-xl sm:text-2xl font-extrabold text-zinc-900 tabular-nums">
            {stats.total}
          </p>
        </div>
        <div className="bg-white border border-zinc-200 rounded-xl p-3 sm:p-4">
          <p className="text-[10px] sm:text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">
            New
          </p>
          <p className="text-xl sm:text-2xl font-extrabold text-[#E30613] tabular-nums">
            {stats.new}
          </p>
        </div>
        <div className="bg-white border border-zinc-200 rounded-xl p-3 sm:p-4">
          <p className="text-[10px] sm:text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">
            Responded
          </p>
          <p className="text-xl sm:text-2xl font-extrabold text-emerald-600 tabular-nums">
            {stats.responded}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by name, email or subject..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-zinc-300 rounded-lg focus:border-zinc-900 outline-none transition-colors"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {STATUSES.map((s) => (
            <button
              key={s.key}
              onClick={() => {
                setStatusFilter(s.key);
                setCurrentPage(1);
              }}
              className={`px-3.5 py-2 text-sm font-medium rounded-lg transition-colors ${
                statusFilter === s.key
                  ? 'bg-zinc-900 text-white'
                  : 'bg-white border border-zinc-300 text-zinc-700 hover:border-zinc-400'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="bg-white border border-zinc-200 rounded-xl p-12 text-center text-zinc-500">
          Loading…
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-zinc-200 rounded-xl p-12 text-center">
          <div className="w-14 h-14 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaInbox className="text-zinc-400 text-xl" />
          </div>
          <h3 className="font-bold text-zinc-900 mb-1">No enquiries yet</h3>
          <p className="text-sm text-zinc-500">
            {search || statusFilter !== 'all'
              ? 'Try adjusting your filters.'
              : 'Enquiries from the contact form will appear here.'}
          </p>
        </div>
      ) : (
        <>
          <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden">
            {paginated.map((item, i) => (
              <div
                key={item.id}
                onClick={() => navigate(`${item.id}`, { state: { enquiry: item } })}
                className={`group flex items-start gap-3 sm:gap-4 p-4 cursor-pointer hover:bg-zinc-50 transition-colors ${
                  i !== paginated.length - 1 ? 'border-b border-zinc-100' : ''
                }`}
              >
                {/* Status indicator */}
                <div className="shrink-0 mt-0.5">
                  {item.status === 'NEW' ? (
                    <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
                      <FaEnvelope className="text-[#E30613] text-sm" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center">
                      <FaEnvelopeOpen className="text-zinc-500 text-sm" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                        STATUS_STYLES[item.status] || STATUS_STYLES.NEW
                      }`}
                    >
                      {item.status || 'NEW'}
                    </span>
                    {item.subject && (
                      <span className="text-[10px] font-semibold bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded uppercase tracking-wider">
                        {item.subject}
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-zinc-900 text-sm leading-snug mb-0.5 truncate">
                    {item.name || 'Unknown sender'}
                  </h3>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-500">
                    {item.email && (
                      <span className="flex items-center gap-1 truncate">
                        <FaEnvelope size={10} />
                        {item.email}
                      </span>
                    )}
                    {item.phone && (
                      <span className="hidden sm:flex items-center gap-1 truncate">
                        <FaPhone size={10} />
                        {item.phone}
                      </span>
                    )}
                  </div>

                  {item.message && (
                    <p className="text-xs text-zinc-500 mt-1.5 line-clamp-1">
                      {item.message}
                    </p>
                  )}
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0">
                  <span className="text-[10px] text-zinc-400 flex items-center gap-1 whitespace-nowrap">
                    <FiClock size={10} />
                    {new Date(item.createdAt).toLocaleDateString('en-ZA', {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(item.id);
                      }}
                      disabled={deleting === item.id}
                      className="w-7 h-7 flex items-center justify-center rounded-md text-zinc-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-40"
                      title="Delete"
                    >
                      <FaTrash size={12} />
                    </button>
                    <FaArrowRight
                      size={12}
                      className="text-zinc-300 group-hover:text-[#E30613] group-hover:translate-x-0.5 transition-all"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-5 pt-4 border-t border-zinc-200">
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
                <span className="font-semibold text-zinc-900">{filtered.length}</span>
              </div>

              <div className="flex items-center justify-center gap-1">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 border border-zinc-200 rounded-lg bg-white hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-zinc-600"
                  aria-label="Previous page"
                >
                  <FiChevronLeft size={16} />
                </button>

                <span className="text-xs text-zinc-600 px-3">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-2 border border-zinc-200 rounded-lg bg-white hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-zinc-600"
                  aria-label="Next page"
                >
                  <FiChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}