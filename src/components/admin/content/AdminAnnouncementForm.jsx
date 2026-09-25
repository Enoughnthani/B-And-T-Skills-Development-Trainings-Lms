import { apiFetch } from '@/api/api';
import { ADMIN } from '@/utils/apiEndpoint';
import { ArrowLeft, Save, Eye, EyeOff } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const CATEGORIES = ['Intake', 'Assessment', 'Notice', 'Closure', 'Update'];

export default function AdminAnnouncementForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [form, setForm] = useState({
    title: '',
    category: 'Notice',
    excerpt: '',
    content: '',
    imageUrl: '',
    published: true,
    isNew: false,
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEdit) loadAnnouncement();
  }, [id]);

  async function loadAnnouncement() {
    setLoading(true);
    try {
      const result = await apiFetch(`${ADMIN}/announcements/${id}`);
      if (result?.success) {
        setForm({
          title: result.payload.title || '',
          category: result.payload.category || 'Notice',
          excerpt: result.payload.excerpt || '',
          content: result.payload.content || '',
          imageUrl: result.payload.imageUrl || '',
          published: result.payload.published ?? true,
          isNew: result.payload.isNew ?? false,
        });
      }
    } catch (e) {
      setError('Failed to load announcement.');
    } finally {
      setLoading(false);
    }
  }

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (error) setError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim()) {
      setError('Title is required.');
      return;
    }
    if (!form.content.trim()) {
      setError('Content is required.');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const result = await apiFetch(
        isEdit
          ? `${ADMIN}/announcements/${id}`
          : `${ADMIN}/announcements`,
        {
          method: isEdit ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        }
      );

      if (result?.success) {
        navigate('/user/admin/content/announcements');
      } else {
        setError(result?.message || 'Failed to save.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-500">Loading...</div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 mx-auto w-full">

      {/* Header */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 px-3 py-1.5 mb-4 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:border-slate-300 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft size={14} />
        Back
      </button>

      <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-1">
        {isEdit ? 'Edit Announcement' : 'New Announcement'}
      </h1>
      <p className="text-sm text-slate-500 mb-6">
        {isEdit
          ? 'Update the announcement and publish changes.'
          : 'Post a notice that appears on the public website.'}
      </p>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 text-sm rounded-lg p-3 mb-5">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 space-y-5">

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Title <span className="text-[#E30613]">*</span>
          </label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => update('title', e.target.value)}
            placeholder="e.g. New Learnership Intake — Gauteng"
            className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:border-slate-900 outline-none transition-colors"
          />
        </div>

        {/* Category + Published */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Category
            </label>
            <select
              value={form.category}
              onChange={(e) => update('category', e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:border-slate-900 outline-none transition-colors cursor-pointer"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Status
            </label>
            <div className="flex items-center gap-2 h-[42px]">
              <button
                type="button"
                onClick={() => update('published', !form.published)}
                className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
                  form.published
                    ? 'bg-green-50 border-green-200 text-green-700'
                    : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                {form.published ? <Eye size={14} /> : <EyeOff size={14} />}
                {form.published ? 'Published' : 'Draft'}
              </button>
            </div>
          </div>
        </div>

        {/* Excerpt */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Short summary
          </label>
          <textarea
            value={form.excerpt}
            onChange={(e) => update('excerpt', e.target.value)}
            rows={2}
            placeholder="One or two sentences that preview the announcement"
            className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:border-slate-900 outline-none transition-colors resize-none"
          />
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Full content <span className="text-[#E30613]">*</span>
          </label>
          <textarea
            value={form.content}
            onChange={(e) => update('content', e.target.value)}
            rows={10}
            placeholder="Write the full announcement here..."
            className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:border-slate-900 outline-none transition-colors resize-none font-mono"
          />
          <p className="text-xs text-slate-400 mt-1.5">
            Plain text. Use blank lines to separate paragraphs.
          </p>
        </div>

        {/* Image URL */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Featured image URL
          </label>
          <input
            type="url"
            value={form.imageUrl}
            onChange={(e) => update('imageUrl', e.target.value)}
            placeholder="https://..."
            className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:border-slate-900 outline-none transition-colors"
          />
        </div>

        {/* Mark as new */}
        <label className="flex items-center gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={form.isNew}
            onChange={(e) => update('isNew', e.target.checked)}
            className="w-4 h-4 rounded border-slate-300 text-[#E30613] focus:ring-[#E30613]"
          />
          <span className="text-sm text-slate-700">
            Highlight with a <strong className="text-[#E30613]">NEW</strong> badge on the public site
          </span>
        </label>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-slate-100">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 bg-[#E30613] hover:bg-[#c00511] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-sm px-6 py-3 rounded-lg transition-colors"
          >
            <Save size={16} />
            {saving ? 'Saving…' : isEdit ? 'Update' : 'Publish'}
          </button>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center justify-center gap-2 bg-white border border-slate-300 hover:border-slate-400 text-slate-700 font-semibold text-sm px-6 py-3 rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}