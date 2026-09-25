import { apiFetch } from '@/api/api';
import { ArrowLeft, Save, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { FaBullhorn, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import {
  AUDIENCE_OPTIONS,
  SCOPE_ENDPOINTS,
} from '../utils/audienceConfig';

const CATEGORIES = ['Notice', 'Assessment', 'Closure', 'Update', 'Maintenance'];

export default function AnnouncementForm({ scope = 'admin', basePath }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const endpoint = SCOPE_ENDPOINTS[scope];
  const audienceOptions = AUDIENCE_OPTIONS[scope] || [];

  const [form, setForm] = useState({
    title: '',
    category: 'Notice',
    audience: audienceOptions[0]?.value || 'ALL',
    audienceId: '',
    body: '',
    published: true,
    isNew: true,
  });

  const [programmes, setProgrammes] = useState([]);
  const [cohorts, setCohorts] = useState([]);
  const [classes, setClasses] = useState([]);

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadTargets();
    if (isEdit) loadAnnouncement();
  }, [id, scope]);

  async function loadTargets() {
    try {
      const targets = await apiFetch(`${endpoint}/targets`);
      if (targets?.success) {
        setProgrammes(targets.payload?.programmes || []);
        setCohorts(targets.payload?.cohorts || []);
        setClasses(targets.payload?.classes || []);
      }
    } catch (error) {
      // ignore
    }
  }

  async function loadAnnouncement() {
    setLoading(true);
    try {
      const result = await apiFetch(`${endpoint}/${id}`);
      if (result?.success && result.payload) {
        setForm({
          title: result.payload.title || '',
          category: result.payload.category || 'Notice',
          audience: result.payload.audience || audienceOptions[0]?.value,
          audienceId: result.payload.audienceId || '',
          body: result.payload.body || '',
          published: result.payload.published ?? true,
          isNew: result.payload.isNew ?? false,
        });
      }
    } catch (error) {
      setError('Failed to load announcement.');
    } finally {
      setLoading(false);
    }
  }

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (error) setError('');
  }

  const selectedAudience = audienceOptions.find((a) => a.value === form.audience);
  const requiresId = selectedAudience?.requiresId;

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.title.trim()) return setError('Title is required.');
    if (!form.body.trim()) return setError('Message body is required.');
    if (requiresId && !form.audienceId) {
      return setError('Please select a target for this audience.');
    }

    setSaving(true);
    setError('');

    try {
      const payload = {
        title: form.title,
        category: form.category,
        audience: form.audience,
        audienceId: requiresId ? form.audienceId : null,
        body: form.body,
        published: form.published,
        isNew: form.isNew,
      };

      const result = await apiFetch(
        isEdit ? `${endpoint}/${id}` : endpoint,
        {
          method: isEdit ? 'PUT' : 'POST',
          body: JSON.stringify(payload),
        }
      );

      if (result?.success) {
        navigate(basePath);
      } else {
        setError(result?.message || 'Failed to save announcement.');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="p-8 text-center text-zinc-500">Loading announcement…</div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 w-full">

      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 text-sm font-medium text-zinc-600 bg-white border border-zinc-200 rounded-lg hover:border-zinc-300 hover:text-zinc-900 transition-colors"
      >
        <ArrowLeft size={14} />
        Back
      </button>

      <div className="flex items-center gap-3 mb-6">
        <div className="w-11 h-11 bg-zinc-100 rounded-xl flex items-center justify-center shrink-0">
          <FaBullhorn className="text-zinc-700" />
        </div>
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-extrabold text-zinc-900">
            {isEdit ? 'Edit Announcement' : 'New Announcement'}
          </h1>
          <p className="text-sm text-zinc-500">
            Choose who should see this notice.
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-[#E30613] text-sm rounded-lg p-3 mb-5">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white border border-zinc-200 rounded-xl p-4 sm:p-6 space-y-5"
      >
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1.5">
            Title <span className="text-[#E30613]">*</span>
          </label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => update('title', e.target.value)}
            placeholder="e.g. Assessment schedule update"
            className="w-full px-3.5 py-2.5 text-sm bg-white border border-zinc-300 rounded-lg focus:border-[#E30613] outline-none transition-colors"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1.5">
              Category
            </label>
            <select
              value={form.category}
              onChange={(e) => update('category', e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-zinc-300 rounded-lg focus:border-[#E30613] outline-none cursor-pointer"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1.5">
              Audience
            </label>
            <select
              value={form.audience}
              onChange={(e) => {
                update('audience', e.target.value);
                update('audienceId', '');
              }}
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-zinc-300 rounded-lg focus:border-[#E30613] outline-none cursor-pointer"
            >
              {audienceOptions.map((a) => (
                <option key={a.value} value={a.value}>{a.label}</option>
              ))}
            </select>
            {selectedAudience?.description && (
              <p className="text-[11px] text-zinc-400 mt-1">
                {selectedAudience.description}
              </p>
            )}
          </div>
        </div>

        {requiresId === 'programme' && (
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1.5">
              Programme
            </label>
            <select
              value={form.audienceId}
              onChange={(e) => update('audienceId', e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-zinc-300 rounded-lg focus:border-[#E30613] outline-none cursor-pointer"
            >
              <option value="">Select a programme</option>
              {programmes.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
        )}

        {requiresId === 'cohort' && (
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1.5">
              Cohort
            </label>
            <select
              value={form.audienceId}
              onChange={(e) => update('audienceId', e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-zinc-300 rounded-lg focus:border-[#E30613] outline-none cursor-pointer"
            >
              <option value="">Select a cohort</option>
              {cohorts.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        )}

        {requiresId === 'class' && (
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1.5">
              Class
            </label>
            <select
              value={form.audienceId}
              onChange={(e) => update('audienceId', e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-zinc-300 rounded-lg focus:border-[#E30613] outline-none cursor-pointer"
            >
              <option value="">Select a class</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1.5">
            Message <span className="text-[#E30613]">*</span>
          </label>
          <textarea
            value={form.body}
            onChange={(e) => update('body', e.target.value)}
            rows={8}
            placeholder="Write the announcement here…"
            className="w-full px-3.5 py-2.5 text-sm bg-white border border-zinc-300 rounded-lg focus:border-[#E30613] outline-none resize-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => update('published', !form.published)}
            className={`text-left p-3.5 rounded-lg border transition-colors ${
              form.published
                ? 'bg-white border-[#E30613]'
                : 'bg-zinc-50 border-zinc-200 hover:border-zinc-400'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              {form.published ? (
                <FaEye size={12} className="text-[#E30613]" />
              ) : (
                <FaEyeSlash size={12} className="text-zinc-400" />
              )}
              <span className={`text-sm font-bold ${form.published ? 'text-zinc-900' : 'text-zinc-600'}`}>
                {form.published ? 'Published' : 'Draft'}
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 leading-snug">
              {form.published
                ? 'Visible to the selected audience immediately.'
                : 'Saved but not visible yet.'}
            </p>
          </button>

          <button
            type="button"
            onClick={() => update('isNew', !form.isNew)}
            className={`text-left p-3.5 rounded-lg border transition-colors ${
              form.isNew
                ? 'bg-white border-[#E30613]'
                : 'bg-zinc-50 border-zinc-200 hover:border-zinc-400'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <FaBullhorn size={12} className={form.isNew ? 'text-[#E30613]' : 'text-zinc-400'} />
              <span className={`text-sm font-bold ${form.isNew ? 'text-zinc-900' : 'text-zinc-600'}`}>
                {form.isNew ? 'Mark as new' : 'Regular notice'}
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 leading-snug">
              {form.isNew
                ? 'Shows a red "NEW" badge.'
                : 'No highlight badge.'}
            </p>
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-zinc-100">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 bg-[#E30613] hover:bg-[#c00511] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-sm px-6 py-3 rounded-lg transition-colors w-full sm:w-auto"
          >
            <Save size={14} />
            {saving ? 'Saving…' : isEdit ? 'Update' : 'Publish'}
          </button>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center justify-center gap-2 bg-white border border-zinc-300 hover:border-zinc-400 text-zinc-700 font-semibold text-sm px-6 py-3 rounded-lg transition-colors w-full sm:w-auto"
          >
            <X size={14} />
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}