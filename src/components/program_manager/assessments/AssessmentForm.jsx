import { apiFetch } from '@/api/api';
import { ArrowLeft, Save, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { FaClipboardCheck } from 'react-icons/fa';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

const EMPTY_FORM = {
  name: '',
  type: 'FORMATIVE',
  programmeId: '',
  cohortId: '',
  module: '',
  description: '',
  dueDate: '',
  passMark: 50,
  weight: 20,
  assessorId: '',
  status: 'DRAFT',
};

export default function AssessmentForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isEdit = !!id;

  const [form, setForm] = useState(location?.state?.assessment ? {
    name: location.state.assessment.name || '',
    type: location.state.assessment.type || 'FORMATIVE',
    programmeId: location.state.assessment.programmeId || '',
    cohortId: location.state.assessment.cohortId || '',
    module: location.state.assessment.module || '',
    description: location.state.assessment.description || '',
    dueDate: location.state.assessment.dueDate?.split('T')[0] || '',
    passMark: location.state.assessment.passMark || 50,
    weight: location.state.assessment.weight || 20,
    assessorId: location.state.assessment.assessorId || '',
    status: location.state.assessment.status || 'DRAFT',
  } : EMPTY_FORM);

  const [programmes, setProgrammes] = useState([]);
  const [cohorts, setCohorts] = useState([]);
  const [assessors, setAssessors] = useState([]);
  const [loading, setLoading] = useState(!location?.state?.assessment);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadOptions();
    if (isEdit && !location?.state?.assessment) loadAssessment();
  }, [id]);

  async function loadOptions() {
    try {
      const result = await apiFetch('/api/program-manager/assessments/form-options');
      if (result?.success) {
        setProgrammes(result.payload?.programmes || []);
        setCohorts(result.payload?.cohorts || []);
        setAssessors(result.payload?.assessors || []);
      }
    } catch (error) {
      // ignore
    }
  }

  async function loadAssessment() {
    setLoading(true);
    try {
      const result = await apiFetch(`/api/program-manager/assessments/${id}`);
      if (result?.success && result.payload?.assessment) {
        const a = result.payload.assessment;
        setForm({
          name: a.name || '',
          type: a.type || 'FORMATIVE',
          programmeId: a.programmeId || '',
          cohortId: a.cohortId || '',
          module: a.module || '',
          description: a.description || '',
          dueDate: a.dueDate?.split('T')[0] || '',
          passMark: a.passMark || 50,
          weight: a.weight || 20,
          assessorId: a.assessorId || '',
          status: a.status || 'DRAFT',
        });
      }
    } catch (error) {
      setError('Failed to load assessment.');
    } finally {
      setLoading(false);
    }
  }

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (error) setError('');
  }

  const availableCohorts = cohorts.filter(
    (c) => !form.programmeId || c.programmeId === form.programmeId
  );

  const availableAssessors = assessors.filter(
    (a) => !form.programmeId || a.programmeIds?.includes(form.programmeId)
  );

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.name.trim()) return setError('Name is required.');
    if (!form.programmeId) return setError('Please select a programme.');
    if (!form.cohortId) return setError('Please select a cohort.');
    if (!form.dueDate) return setError('Please set a due date.');

    setSaving(true);
    setError('');

    try {
      const payload = {
        ...form,
        passMark: Number(form.passMark),
        weight: Number(form.weight),
      };

      const result = await apiFetch(
        isEdit
          ? `/api/program-manager/assessments/${id}`
          : '/api/program-manager/assessments',
        {
          method: isEdit ? 'PUT' : 'POST',
          body: JSON.stringify(payload),
        }
      );

      if (result?.success) {
        navigate('/user/program-manager/assessments');
      } else {
        setError(result?.message || 'Failed to save.');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="p-8 text-center text-zinc-500">Loading…</div>;
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
          <FaClipboardCheck className="text-zinc-700" />
        </div>
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-extrabold text-zinc-900">
            {isEdit ? 'Edit Assessment' : 'New Assessment'}
          </h1>
          <p className="text-sm text-zinc-500">
            Set up an assessment for one of your programmes.
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
            Name <span className="text-[#E30613]">*</span>
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
            placeholder="e.g. Formative Assessment 3"
            className="w-full px-3.5 py-2.5 text-sm bg-white border border-zinc-300 rounded-lg focus:border-[#E30613] outline-none transition-colors"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1.5">
              Type <span className="text-[#E30613]">*</span>
            </label>
            <select
              value={form.type}
              onChange={(e) => update('type', e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-zinc-300 rounded-lg focus:border-[#E30613] outline-none cursor-pointer"
            >
              <option value="FORMATIVE">Formative</option>
              <option value="SUMMATIVE">Summative</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1.5">
              Status
            </label>
            <select
              value={form.status}
              onChange={(e) => update('status', e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-zinc-300 rounded-lg focus:border-[#E30613] outline-none cursor-pointer"
            >
              <option value="DRAFT">Draft</option>
              <option value="SCHEDULED">Scheduled</option>
              <option value="OPEN">Open</option>
            </select>
          </div>
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
                update('assessorId', '');
              }}
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-zinc-300 rounded-lg focus:border-[#E30613] outline-none cursor-pointer"
            >
              <option value="">Select a programme</option>
              {programmes.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
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

        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1.5">
            Module or unit standard
          </label>
          <input
            type="text"
            value={form.module}
            onChange={(e) => update('module', e.target.value)}
            placeholder="e.g. Module 3: Business Communication"
            className="w-full px-3.5 py-2.5 text-sm bg-white border border-zinc-300 rounded-lg focus:border-[#E30613] outline-none transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1.5">
            Description or instructions
          </label>
          <textarea
            value={form.description}
            onChange={(e) => update('description', e.target.value)}
            rows={5}
            placeholder="What learners need to do for this assessment…"
            className="w-full px-3.5 py-2.5 text-sm bg-white border border-zinc-300 rounded-lg focus:border-[#E30613] outline-none resize-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1.5">
              Due date <span className="text-[#E30613]">*</span>
            </label>
            <input
              type="date"
              value={form.dueDate}
              onChange={(e) => update('dueDate', e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-zinc-300 rounded-lg focus:border-[#E30613] outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1.5">
              Pass mark (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={form.passMark}
              onChange={(e) => update('passMark', e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-zinc-300 rounded-lg focus:border-[#E30613] outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1.5">
              Weight (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={form.weight}
              onChange={(e) => update('weight', e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-zinc-300 rounded-lg focus:border-[#E30613] outline-none transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1.5">
            Assigned assessor
          </label>
          <select
            value={form.assessorId}
            onChange={(e) => update('assessorId', e.target.value)}
            disabled={!form.programmeId}
            className="w-full px-3.5 py-2.5 text-sm bg-white border border-zinc-300 rounded-lg focus:border-[#E30613] outline-none cursor-pointer disabled:bg-zinc-50 disabled:cursor-not-allowed"
          >
            <option value="">
              {form.programmeId ? 'Select an assessor' : 'Choose a programme first'}
            </option>
            {availableAssessors.map((a) => (
              <option key={a.id} value={a.id}>{a.firstname} {a.lastname}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-zinc-100">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 bg-[#E30613] hover:bg-[#c00511] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-sm px-6 py-3 rounded-lg transition-colors w-full sm:w-auto"
          >
            <Save size={14} />
            {saving ? 'Saving…' : isEdit ? 'Update Assessment' : 'Create Assessment'}
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