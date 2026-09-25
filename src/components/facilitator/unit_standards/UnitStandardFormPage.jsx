import { apiFetch } from '@/api/api';
import { useApiResponse } from '@/contexts/ApiResponseContext';
import { ArrowLeft, Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import { FaCode } from 'react-icons/fa';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

const NQF_LEVELS = [
  'NQF Level 1',
  'NQF Level 2',
  'NQF Level 3',
  'NQF Level 4',
  'NQF Level 5',
];

const TYPES = ['Fundamental', 'Core', 'Elective'];

const EMPTY_FORM = {
  unitStandardId: '',
  title: '',
  description: '',
  credits: '',
  nqfLevel: 'NQF Level 4',
  type: 'Core',
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
        unitStandardId: unitStandard.unitStandardId || '',
        title: unitStandard.title || '',
        description: unitStandard.description || '',
        credits: unitStandard.credits || '',
        nqfLevel: unitStandard.nqfLevel || 'NQF Level 4',
        type: unitStandard.type || 'Core',
      });
    }
  }, [isEditing, unitStandard]);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError(null);
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
        credits: parseInt(formData.credits, 10) || 0,
        nqfLevel: formData.nqfLevel,
        type: formData.type.toUpperCase(),
        programId,
      };

      const endpoint = isEditing
        ? `/api/unit-standards/${formData.unitStandardId}`
        : '/api/unit-standards';

      const data = await apiFetch(endpoint, {
        method: isEditing ? 'PUT' : 'POST',
        body: submitData,
      });

      if (data?.success) resetForm();
      showResponse(data);
    } catch {
      setError('Failed to save unit standard.');
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
            {isEditing ? 'Edit Unit Standard' : 'Create Unit Standard'}
          </h1>
          <p className="text-sm text-zinc-500">
            {isEditing
              ? 'Update unit standard details.'
              : 'Add a new unit standard to the learnership.'}
          </p>
        </div>
      </div>

      <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden">
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-5">

          {error && (
            <div className="bg-red-50 border border-red-200 text-[#E30613] text-sm rounded-lg p-3">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                SAQA ID <span className="text-[#E30613]">*</span>
              </label>
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
              <p className="text-[11px] text-zinc-400 mt-1">
                Unique identifier for this unit standard.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                Credits
              </label>
              <input
                type="number"
                name="credits"
                placeholder="e.g. 5"
                value={formData.credits}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-zinc-300 rounded-lg focus:border-[#E30613] outline-none transition-colors"
              />
              <p className="text-[11px] text-zinc-400 mt-1">
                Number of credits for this unit.
              </p>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                Unit standard title <span className="text-[#E30613]">*</span>
              </label>
              <input
                type="text"
                name="title"
                placeholder="Enter the full title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-zinc-300 rounded-lg focus:border-[#E30613] outline-none transition-colors"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                Description
              </label>
              <textarea
                name="description"
                rows={4}
                placeholder="Enter a detailed description of the unit standard…"
                value={formData.description}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-zinc-300 rounded-lg focus:border-[#E30613] outline-none transition-colors resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                NQF Level
              </label>
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
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                Type
              </label>
              <div className="flex flex-wrap gap-2">
                {TYPES.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, type }))
                    }
                    className={`px-3.5 py-2 text-sm font-medium rounded-lg transition-colors ${
                      formData.type === type
                        ? 'bg-[#E30613] text-white'
                        : 'bg-white border border-zinc-300 text-zinc-700 hover:border-zinc-400'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-5 mt-5 border-t border-zinc-100">
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
    </div>
  );
}