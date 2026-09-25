import { apiFetch } from '@/api/api';
import { ADMIN } from '@/utils/apiEndpoint';
import { useEffect, useState } from 'react';
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaBullhorn,
  FaSearch,
} from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

export default function AdminAnnouncementsList() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleting, setDeleting] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      const result = await apiFetch(`${ADMIN}/announcements`);
      if (result?.success) setAnnouncements(result?.payload || []);
    } catch (e) {
      // silently fail
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this announcement? This cannot be undone.')) return;
    setDeleting(id);
    try {
      const result = await apiFetch(`${ADMIN}/announcements/${id}`, {
        method: 'DELETE',
      });
      if (result?.success) {
        setAnnouncements((prev) => prev.filter((a) => a.id !== id));
      } else {
        alert(result?.message || 'Failed to delete');
      }
    } catch (e) {
      alert('Network error');
    } finally {
      setDeleting(null);
    }
  }

  const filtered = announcements.filter((a) =>
    a.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-1">
            Announcements
          </h1>
          <p className="text-sm text-slate-500">
            {announcements.length} total · {filtered.length} shown
          </p>
        </div>

        <button
          onClick={() => navigate('new')}
          className="inline-flex items-center justify-center gap-2 bg-[#E30613] hover:bg-[#c00511] text-white font-semibold text-sm px-5 py-2.5 rounded-lg transition-colors shrink-0"
        >
          <FaPlus size={12} />
          New Announcement
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Search announcements..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:border-slate-900 outline-none transition-colors"
        />
      </div>

      {/* List */}
      {loading ? (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-500">
          Loading...
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">
          <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaBullhorn className="text-slate-400 text-xl" />
          </div>
          <h3 className="font-bold text-slate-900 mb-1">No announcements yet</h3>
          <p className="text-sm text-slate-500 mb-4">
            Post your first announcement to get started.
          </p>
          <button
            onClick={() => navigate('new')}
            className="inline-flex items-center gap-2 bg-[#E30613] hover:bg-[#c00511] text-white font-semibold text-sm px-5 py-2.5 rounded-lg transition-colors"
          >
            <FaPlus size={12} />
            Create Announcement
          </button>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          {filtered.map((item, i) => (
            <div
              key={item.id}
              className={`flex items-start gap-4 p-4 sm:p-5 hover:bg-slate-50 transition-colors ${
                i !== filtered.length - 1 ? 'border-b border-slate-100' : ''
              }`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-[10px] font-bold bg-red-50 text-[#E30613] px-2 py-0.5 rounded uppercase tracking-wider">
                    {item.category || 'Notice'}
                  </span>
                  {item.published === false && (
                    <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded uppercase tracking-wider">
                      Draft
                    </span>
                  )}
                  {item.isNew && (
                    <span className="text-[10px] font-bold bg-slate-900 text-white px-2 py-0.5 rounded uppercase tracking-wider">
                      New
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-slate-900 mb-1 leading-snug">
                  {item.title}
                </h3>

                <p className="text-xs text-slate-500 line-clamp-1">
                  {new Date(item.createdAt || item.date).toLocaleDateString('en-ZA', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </p>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <Link
                  to={`${item.id}`}
                  className="w-9 h-9 flex items-center justify-center text-slate-500 hover:text-[#E30613] hover:bg-slate-100 rounded-lg transition-colors"
                  title="Edit"
                >
                  <FaEdit size={14} />
                </Link>
                <button
                  onClick={() => handleDelete(item.id)}
                  disabled={deleting === item.id}
                  className="w-9 h-9 flex items-center justify-center text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                  title="Delete"
                >
                  <FaTrash size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}