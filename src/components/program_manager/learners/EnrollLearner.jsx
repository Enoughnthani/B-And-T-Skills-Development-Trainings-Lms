import { apiFetch } from '@/api/api';
import { ArrowLeft, Save, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { FaSearch, FaUserPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function EnrollLearner() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    userId: '',
    programmeId: '',
    cohortId: '',
  });

  const [availableUsers, setAvailableUsers] = useState([]);
  const [programmes, setProgrammes] = useState([]);
  const [cohorts, setCohorts] = useState([]);
  const [userSearch, setUserSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadOptions();
  }, []);

  async function loadOptions() {
    setLoading(true);
    try {
      const result = await apiFetch('/api/program-manager/learners/enroll-options');
      if (result?.success) {
        setAvailableUsers(result.payload?.users || []);
        setProgrammes(result.payload?.programmes || []);
        setCohorts(result.payload?.cohorts || []);
      }
    } catch (error) {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (error) setError('');
  }

  const filteredUsers = availableUsers.filter((u) => {
    const s = userSearch.toLowerCase();
    return (
      u.firstname?.toLowerCase().includes(s) ||
      u.lastname?.toLowerCase().includes(s) ||
      u.email?.toLowerCase().includes(s)
    );
  });

  const selectedUser = availableUsers.find((u) => u.id === form.userId);
  const selectedProgramme = programmes.find((p) => p.id === form.programmeId);

  const availableCohorts = cohorts.filter(
    (c) => !form.programmeId || c.programmeId === form.programmeId
  );

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.userId) return setError('Please select a learner.');
    if (!form.programmeId) return setError('Please select a programme.');
    if (!form.cohortId) return setError('Please select a cohort.');

    setSaving(true);
    setError('');

    try {
      const result = await apiFetch('/api/program-manager/learners/enroll', {
        method: 'POST',
        body: JSON.stringify(form),
      });

      if (result?.success) {
        navigate('/user/program-manager/learners');
      } else {
        setError(result?.message || 'Failed to enrol learner.');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="p-8 text-center text-zinc-500">Loading enrolment options…</div>
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
          <FaUserPlus className="text-zinc-700" />
        </div>
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-extrabold text-zinc-900">
            Enrol Learner
          </h1>
          <p className="text-sm text-zinc-500">
            Assign a learner to one of your programmes and cohorts.
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
            Learner <span className="text-[#E30613]">*</span>
          </label>

          <div className="relative mb-2">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-3.5 h-3.5" />
            <input
              type="text"
              placeholder="Search users by name or email…"
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 text-sm bg-white border border-zinc-300 rounded-lg focus:border-[#E30613] outline-none"
            />
          </div>

          <select
            value={form.userId}
            onChange={(e) => update('userId', e.target.value)}
            className="w-full px-3.5 py-2.5 text-sm bg-white border border-zinc-300 rounded-lg focus:border-[#E30613] outline-none cursor-pointer"
            size={Math.min(filteredUsers.length + 1, 6)}
          >
            <option value="">Select a user…</option>
            {filteredUsers.map((u) => (
              <option key={u.id} value={u.id}>
                {u.firstname} {u.lastname} — {u.email}
              </option>
            ))}
          </select>

          {selectedUser && (
            <p className="text-[11px] text-zinc-500 mt-1">
              Selected: {selectedUser.firstname} {selectedUser.lastname} ({selectedUser.email})
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1.5">
              Programme <span className="text-[#E30613]">*</span>
            </label>
            <select
              value={form.programmeId}
              onChange={(e) => {
                update('programmeId', e.target.value);
                update('cohortId', '');
              }}
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-zinc-300 rounded-lg focus:border-[#E30613] outline-none cursor-pointer"
            >
              <option value="">Select a programme</option>
              {programmes.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
            {selectedProgramme?.capacity && (
              <p className="text-[11px] text-zinc-500 mt-1">
                Capacity: {selectedProgramme.enrolledCount || 0} / {selectedProgramme.capacity}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1.5">
              Cohort <span className="text-[#E30613]">*</span>
            </label>
            <select
              value={form.cohortId}
              onChange={(e) => update('cohortId', e.target.value)}
              disabled={!form.programmeId}
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-zinc-300 rounded-lg focus:border-[#E30613] outline-none cursor-pointer disabled:bg-zinc-50 disabled:cursor-not-allowed"
            >
              <option value="">
                {form.programmeId ? 'Select a cohort' : 'Choose a programme first'}
              </option>
              {availableCohorts.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-zinc-100">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 bg-[#E30613] hover:bg-[#c00511] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-sm px-6 py-3 rounded-lg transition-colors w-full sm:w-auto"
          >
            <Save size={14} />
            {saving ? 'Enrolling…' : 'Enrol Learner'}
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