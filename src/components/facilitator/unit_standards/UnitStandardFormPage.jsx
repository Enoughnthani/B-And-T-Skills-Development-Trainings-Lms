import { apiFetch } from '@/api/api';
import { useApiResponse } from '@/contexts/ApiResponseContext';
import { ArrowLeft, Plus, Save, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { FaCode } from 'react-icons/fa';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

const NQF_LEVELS = [
  'NQF Level 1',
  'NQF Level 2',
  'NQF Level 3',
  'NQF Level 4',
  'NQF Level 5',
  'NQF Level 6',
  'NQF Level 7',
  'NQF Level 8',
];

const TYPES = [
  { value: 'KNOWLEDGE', label: 'Knowledge' },
  { value: 'PRACTICAL', label: 'Practical skills' },
  { value: 'WORK_EXPERIENCE', label: 'Work experience' },
];

const STATUS_OPTIONS = [
  { value: 'ACTIVE', label: 'Active' },
  { value: 'PHASED_OUT', label: 'Phased out' },
  { value: 'PENDING', label: 'Pending registration' },
];

const EMPTY_FORM = {
  unitStandardId: '',
  title: '',
  description: '',
  purpose: '',
  learningAssumed: '',
  credits: '',
  notionalHours: '',
  nqfLevel: 'NQF Level 4',
  type: 'KNOWLEDGE',
  status: 'ACTIVE',
  moderationBody: '',
  specificOutcomes: [''],
  assessmentCriteria: [''],
  criticalCrossFieldOutcomes: [''],
  rangeStatement: '',
};

export default function UnitStandardFormPage() {
  const navigate = useNavigate();
  const { id, programId } = useParams();
  const isEditing = !!id;
  const location = useLocation();
  const { unitStandard } = location?.state || {};
  const { showResponse } = useApiResponse();

  const [formData, setFormData] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isEditing && unitStandard) {
      setFormData({
        unitStandardId: unitStandard.unitStandardId || unitStandard.code || '',
        title: unitStandard.title || '',
        description: unitStandard.description || '',
        purpose: unitStandard.purpose || '',
        learningAssumed: unitStandard.learningAssumed || '',
        credits: unitStandard.credits || '',
        notionalHours: unitStandard.notionalHours || '',
        nqfLevel: unitStandard.nqfLevel || 'NQF Level 4',
        type: unitStandard.type?.toUpperCase() || 'KNOWLEDGE',
        status: unitStandard.status?.toUpperCase() || 'ACTIVE',
        moderationBody: unitStandard.moderationBody || '',
        specificOutcomes: unitStandard.specificOutcomes?.length
          ? unitStandard.specificOutcomes
          : [''],
        assessmentCriteria: unitStandard.assessmentCriteria?.length
          ? unitStandard.assessmentCriteria
          : [''],
        criticalCrossFieldOutcomes:
          unitStandard.criticalCrossFieldOutcomes?.length
            ? unitStandard.criticalCrossFieldOutcomes
            : [''],
        rangeStatement: unitStandard.rangeStatement || '',
      });
    }
  }, [isEditing, unitStandard]);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError(null);
  }

  function handleListChange(field, index, value) {
    setFormData((prev) => {
      const list = [...prev[field]];
      list[index] = value;
      return { ...prev, [field]: list };
    });
  }

  function addListItem(field) {
    setFormData((prev) => ({ ...prev, [field]: [...prev[field], ''] }));
  }

  function removeListItem(field, index) {
    setFormData((prev) => {
      const list = prev[field].filter((_, i) => i !== index);
      return { ...prev, [field]: list.length ? list : [''] };
    });
  }

  function resetForm() {
    setFormData(EMPTY_FORM);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const submitData = {
        unitStandardId: formData.unitStandardId,
        title: formData.title,
        description: formData.description,
        purpose: formData.purpose,
        learningAssumed: formData.learningAssumed,
        credits: parseInt(formData.credits, 10) || 0,
        notionalHours: parseInt(formData.notionalHours, 10) || 0,
        nqfLevel: formData.nqfLevel,
        type: formData.type,
        status: formData.status,
        moderationBody: formData.moderationBody,
        specificOutcomes: formData.specificOutcomes.filter(Boolean),
        assessmentCriteria: formData.assessmentCriteria.filter(Boolean),
        criticalCrossFieldOutcomes:
          formData.criticalCrossFieldOutcomes.filter(Boolean),
        rangeStatement: formData.rangeStatement,
        programId,
      };

      const endpoint = isEditing
        ? `/api/unit-standards/${formData.unitStandardId}`
        : '/api/unit-standards';

      const data = await apiFetch(endpoint, {
        method: isEditing ? 'PUT' : 'POST',
        body: submitData,
      });

      showResponse(data);

      if (data?.success) {
        navigate(-1);
      }
    } catch {
      setError('Failed to save. Please try again.');
    } finally {
      setLoading(false);
    }
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

      <div className="flex items-start gap-3 mb-6">
        <div className="w-11 h-11 bg-zinc-100 rounded-xl flex items-center justify-center shrink-0">
          <FaCode className="text-zinc-700 text-base" />
        </div>
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-extrabold text-zinc-900">
            {isEditing ? 'Edit module' : 'Create module'}
          </h1>
          <p className="text-sm text-zinc-500">
            {isEditing
              ? 'Update the module details.'
              : 'Add a new module to this programme.'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">

        {error && (
          <div className="bg-red-50 border border-red-200 text-[#E30613] text-sm rounded-lg p-3">
            {error}
          </div>
        )}

        <FormSection title="Basic information">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <Field
              label="Module code"
              required
              hint="Unique identifier from the QCTO curriculum."
            >
              <input
                type="text"
                name="unitStandardId"
                placeholder="e.g. 14933"
                value={formData.unitStandardId}
                onChange={handleChange}
                disabled={isEditing}
                required
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-zinc-300 rounded-lg focus:border-[#E30613] outline-none transition-colors disabled:bg-zinc-50 disabled:cursor-not-allowed"
              />
            </Field>

            <Field label="Credits" hint="NQF credits assigned to this module.">
              <input
                type="number"
                name="credits"
                placeholder="e.g. 5"
                value={formData.credits}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-zinc-300 rounded-lg focus:border-[#E30613] outline-none transition-colors"
              />
            </Field>

            <div className="md:col-span-2">
              <Field label="Title" required>
                <input
                  type="text"
                  name="title"
                  placeholder="Enter the full title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-zinc-300 rounded-lg focus:border-[#E30613] outline-none transition-colors"
                />
              </Field>
            </div>

            <Field label="NQF Level">
              <select
                name="nqfLevel"
                value={formData.nqfLevel}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-zinc-300 rounded-lg focus:border-[#E30613] outline-none cursor-pointer"
              >
                {NQF_LEVELS.map((level) => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </Field>

            <Field label="Notional hours" hint="Total learning hours expected.">
              <input
                type="number"
                name="notionalHours"
                placeholder="e.g. 50"
                value={formData.notionalHours}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-zinc-300 rounded-lg focus:border-[#E30613] outline-none transition-colors"
              />
            </Field>

            <div className="md:col-span-2">
              <Field label="Type" required>
                <div className="flex flex-wrap gap-2">
                  {TYPES.map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, type: type.value }))
                      }
                      className={`px-3.5 py-2 text-sm font-medium rounded-lg transition-colors ${
                        formData.type === type.value
                          ? 'bg-[#E30613] text-white'
                          : 'bg-white border border-zinc-300 text-zinc-700 hover:border-zinc-400'
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </Field>
            </div>

            <Field label="Status">
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-zinc-300 rounded-lg focus:border-[#E30613] outline-none cursor-pointer"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </Field>

            <Field label="Moderation body" hint="SETA, QCTO or professional body.">
              <input
                type="text"
                name="moderationBody"
                placeholder="e.g. QCTO"
                value={formData.moderationBody}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-zinc-300 rounded-lg focus:border-[#E30613] outline-none transition-colors"
              />
            </Field>

          </div>
        </FormSection>

        <FormSection title="Purpose & context">
          <div className="space-y-4">
            <Field
              label="Purpose"
              hint="A short paragraph explaining why this module exists."
            >
              <textarea
                name="purpose"
                rows={3}
                placeholder="Learners credited with this module are able to…"
                value={formData.purpose}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-zinc-300 rounded-lg focus:border-[#E30613] outline-none transition-colors resize-none"
              />
            </Field>

            <Field
              label="Description"
              hint="Longer overview of the module content."
            >
              <textarea
                name="description"
                rows={4}
                placeholder="Detailed description of the module…"
                value={formData.description}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-zinc-300 rounded-lg focus:border-[#E30613] outline-none transition-colors resize-none"
              />
            </Field>

            <Field
              label="Learning assumed to be in place"
              hint="What learners should already know before starting."
            >
              <textarea
                name="learningAssumed"
                rows={2}
                placeholder="e.g. Communication at NQF Level 3 or equivalent."
                value={formData.learningAssumed}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-zinc-300 rounded-lg focus:border-[#E30613] outline-none transition-colors resize-none"
              />
            </Field>

            <Field
              label="Range statement"
              hint="Any scope limitations or context for this module."
            >
              <textarea
                name="rangeStatement"
                rows={2}
                placeholder="e.g. This module applies to all business administration contexts."
                value={formData.rangeStatement}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-zinc-300 rounded-lg focus:border-[#E30613] outline-none transition-colors resize-none"
              />
            </Field>
          </div>
        </FormSection>

        <FormSection title="Outcomes & assessment">
          <div className="space-y-6">
            <ListField
              label="Specific outcomes"
              hint="What the learner will be able to do."
              items={formData.specificOutcomes}
              onChange={(i, v) => handleListChange('specificOutcomes', i, v)}
              onAdd={() => addListItem('specificOutcomes')}
              onRemove={(i) => removeListItem('specificOutcomes', i)}
              placeholder="e.g. Explain the principles of business communication."
            />

            <ListField
              label="Assessment criteria"
              hint="How competence will be judged."
              items={formData.assessmentCriteria}
              onChange={(i, v) => handleListChange('assessmentCriteria', i, v)}
              onAdd={() => addListItem('assessmentCriteria')}
              onRemove={(i) => removeListItem('assessmentCriteria', i)}
              placeholder="e.g. Explaining is done in line with company policy."
            />

            <ListField
              label="Critical cross-field outcomes"
              hint="Broader skills developed through this module."
              items={formData.criticalCrossFieldOutcomes}
              onChange={(i, v) =>
                handleListChange('criticalCrossFieldOutcomes', i, v)
              }
              onAdd={() => addListItem('criticalCrossFieldOutcomes')}
              onRemove={(i) => removeListItem('criticalCrossFieldOutcomes', i)}
              placeholder="e.g. Identify and solve problems."
            />
          </div>
        </FormSection>

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-2.5 text-sm font-semibold text-zinc-700 bg-white border border-zinc-300 rounded-lg hover:border-zinc-400 disabled:opacity-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-2.5 text-sm font-semibold text-white bg-[#E30613] rounded-lg hover:bg-[#c00511] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Saving…
              </>
            ) : (
              <>
                <Save size={14} />
                {isEditing ? 'Update' : 'Create'}
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}

function FormSection({ title, children }) {
  return (
    <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden">
      <div className="px-4 sm:px-6 py-4 border-b border-zinc-100">
        <h2 className="text-sm font-bold text-zinc-900">{title}</h2>
      </div>
      <div className="p-4 sm:p-6">{children}</div>
    </div>
  );
}

function Field({ label, required, hint, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-zinc-700 mb-1.5">
        {label}
        {required && <span className="text-[#E30613] ml-0.5">*</span>}
      </label>
      {children}
      {hint && <p className="text-[11px] text-zinc-400 mt-1">{hint}</p>}
    </div>
  );
}

function ListField({
  label,
  hint,
  items,
  onChange,
  onAdd,
  onRemove,
  placeholder,
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div>
          <label className="block text-sm font-medium text-zinc-700">
            {label}
          </label>
          {hint && <p className="text-[11px] text-zinc-400">{hint}</p>}
        </div>
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#E30613] hover:bg-red-50 px-2.5 py-1.5 rounded-lg transition-colors"
        >
          <Plus size={12} />
          Add
        </button>
      </div>

      <div className="space-y-2">
        {items.map((value, i) => (
          <div key={i} className="flex gap-2">
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(i, e.target.value)}
              placeholder={placeholder}
              className="flex-1 min-w-0 px-3.5 py-2.5 text-sm bg-white border border-zinc-300 rounded-lg focus:border-[#E30613] outline-none transition-colors"
            />
            {items.length > 1 && (
              <button
                type="button"
                onClick={() => onRemove(i)}
                className="w-10 h-10 flex items-center justify-center text-zinc-400 hover:text-[#E30613] hover:bg-red-50 rounded-lg transition-colors shrink-0"
                aria-label="Remove"
              >
                <X size={14} />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}