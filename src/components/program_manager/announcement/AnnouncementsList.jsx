import { apiFetch } from '@/api/api';
import { useEffect, useState } from 'react';
import {
  FaBullhorn,
  FaEdit,
  FaPlus,
  FaSearch,
  FaTrash,
} from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import {
  SCOPE_DESCRIPTIONS,
  SCOPE_ENDPOINTS,
  SCOPE_TITLES,
} from '../utils/audienceConfig';

export default function AnnouncementsList({ scope = 'admin', basePath }) {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleting, setDeleting] = useState(null);
  const navigate = useNavigate();

  const endpoint = SCOPE_ENDPOINTS[scope];
  const title = SCOPE_TITLES[scope];
  const description = SCOPE_DESCRIPTIONS[scope];

  useEffect(() => {
    load();
  }, [scope]);

  async function load() {
    setLoading(true);
    try {
      const result = await apiFetch(endpoint);
      if (result?.success) setAnnouncements(result.payload || []);
    } catch (error) {
      setAnnouncements([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this announcement? This cannot be undone.')) return;
    setDeleting(id);
    try {
      const result = await apiFetch(`${endpoint}/${id}`, { method: 'DELETE' });
      if (result?.success) {
        setAnnouncements((prev) => prev.filter((a) => a.id !== id));
      }
    } catch (error) {
      // ignore
    } finally {
      setDeleting(null);
    }
  }

  const filtered = announcements.filter((a) =>
    a.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 w-full">

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-extrabold text-zinc-900 mb-1">
            {title}
          </h1>
          <p className="text-sm text-zinc-500">{description}</p>
        </div>

        <Link
          to={`${basePath}/new`}
          className="inline-flex items-center justify-center gap-2 bg-[#E30613] hover:bg-[#c00511] text-white font-semibold text-sm px-5 py-2.5 rounded-lg transition-colors shrink-0 no-underline"
        >
          <FaPlus size={12} />
          New Announcement
        </Link>
      </div>

      <div className="relative mb-5">
        <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 w-3.5 h-3.5" />
        <input
          type="text"
          placeholder="Search announcements…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-3 py-2.5 text-sm bg-white border border-zinc-300 rounded-lg focus:border-[#E30613] outline-none transition-colors"
        />
      </div>

      <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-zinc-500">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-14 h-14 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaBullhorn className="text-zinc-400 text-xl" />
            </div>
            <h3 className="font-bold text-zinc-900 mb-1">No announcements yet</h3>
            <p className="text-sm text-zinc-500 mb-5">
              Post your first announcement to notify your audience.
            </p>
            <Link
              to={`${basePath}/new`}
              className="inline-flex items-center gap-2 bg-[#E30613] hover:bg-[#c00511] text-white font-semibold text-sm px-5 py-2.5 rounded-lg transition-colors no-underline"
            >
              <FaPlus size={12} />
              Create Announcement
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-zinc-100">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-3 p-4 hover:bg-red-50/30 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className="text-[10px] font-bold bg-zinc-100 text-zinc-700 px-2 py-0.5 rounded uppercase tracking-wider">
                      {item.category || 'Notice'}
                    </span>
                    {item.audienceLabel && (
                      <span className="text-[10px] font-bold bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded uppercase tracking-wider">
                        {item.audienceLabel}
                      </span>
                    )}
                    {item.published === false && (
                      <span className="text-[10px] font-bold bg-zinc-900 text-white px-2 py-0.5 rounded uppercase tracking-wider">
                        Draft
                      </span>
                    )}
                    {item.isNew && (
                      <span className="text-[10px] font-bold bg-[#E30613] text-white px-2 py-0.5 rounded uppercase tracking-wider">
                        New
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-zinc-900 text-sm leading-snug mb-1">
                    {item.title}
                  </h3>

                  <p className="text-xs text-zinc-500 line-clamp-1">
                    {item.body}
                  </p>

                  <p className="text-[11px] text-zinc-400 mt-1.5">
                    {new Date(item.createdAt).toLocaleDateString('en-ZA', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <Link
                    to={`${basePath}/${item.id}`}
                    className="w-9 h-9 flex items-center justify-center text-zinc-500 hover:text-[#E30613] hover:bg-red-50 rounded-lg transition-colors no-underline"
                    title="Edit"
                  >
                    <FaEdit size={12} />
                  </Link>
                  <button
                    onClick={() => handleDelete(item.id)}
                    disabled={deleting === item.id}
                    className="w-9 h-9 flex items-center justify-center text-zinc-500 hover:text-[#E30613] hover:bg-red-50 rounded-lg transition-colors disabled:opacity-40"
                    title="Delete"
                  >
                    <FaTrash size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}