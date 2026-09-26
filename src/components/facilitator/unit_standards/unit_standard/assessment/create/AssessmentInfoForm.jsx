import { FaFileAlt, FaTimes } from 'react-icons/fa';

const TYPE_OPTIONS = [
  { value: 'LEARNER_WORKBOOK', label: 'Learner workbook' },
  { value: 'SUMMATIVE', label: 'Summative' },
  { value: 'TEST', label: 'Quiz' },
];

export default function AssessmentInfoForm({
  assessmentInfo,
  setAssessmentInfo,
  existingFile,
  setExistingFile,
  selectedFile,
  setSelectedFile,
}) {
  function update(field, value) {
    setAssessmentInfo((prev) => ({ ...prev, [field]: value }));
  }

  const showFileUpload = assessmentInfo?.type !== 'TEST';

  return (
    <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden mb-5">

      <div className="px-4 sm:px-6 py-4 border-b border-zinc-100">
        <h2 className="text-sm font-bold text-zinc-900">Assessment details</h2>
      </div>

      <div className="p-4 sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <Field label="Assessment type" required>
            <select
              value={assessmentInfo.type}
              onChange={(e) => update('type', e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-zinc-300 rounded-lg focus:border-[#E30613] outline-none cursor-pointer"
            >
              {TYPE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Title" required>
            <input
              type="text"
              value={assessmentInfo.title}
              onChange={(e) => update('title', e.target.value)}
              placeholder="Enter assessment title"
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-zinc-300 rounded-lg focus:border-[#E30613] outline-none transition-colors"
            />
          </Field>

          <Field label="Start date">
            <input
              type="datetime-local"
              value={assessmentInfo.startDate}
              onChange={(e) => update('startDate', e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-zinc-300 rounded-lg focus:border-[#E30613] outline-none transition-colors"
            />
          </Field>

          <Field label="Due date">
            <input
              type="datetime-local"
              value={assessmentInfo.dueDate}
              onChange={(e) => update('dueDate', e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-zinc-300 rounded-lg focus:border-[#E30613] outline-none transition-colors"
            />
          </Field>

          <Field label="Duration" hint="In minutes">
            <input
              type="number"
              value={assessmentInfo.duration}
              onChange={(e) => update('duration', parseInt(e.target.value, 10) || 0)}
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-zinc-300 rounded-lg focus:border-[#E30613] outline-none transition-colors"
            />
          </Field>

          <Field label="Total marks">
            <input
              type="number"
              value={assessmentInfo.totalMarks}
              onChange={(e) => update('totalMarks', parseInt(e.target.value, 10) || 0)}
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-zinc-300 rounded-lg focus:border-[#E30613] outline-none transition-colors"
            />
          </Field>

          <div className="md:col-span-2">
            <Field label="Description" hint="Instructions shown to learners.">
              <textarea
                value={assessmentInfo.description}
                onChange={(e) => update('description', e.target.value)}
                rows={3}
                placeholder="Instructions for learners…"
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-zinc-300 rounded-lg focus:border-[#E30613] outline-none transition-colors resize-none"
              />
            </Field>
          </div>

        </div>

        {showFileUpload && (
          <div className="mt-6">
            <label className="block text-sm font-medium text-zinc-700 mb-2">
              Assessment file{' '}
              <span className="text-zinc-400 font-normal">(optional)</span>
            </label>

            {existingFile && !selectedFile && (
              <div className="flex items-center justify-between gap-3 p-3 bg-zinc-50 border border-zinc-200 rounded-lg mb-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 bg-white border border-zinc-200 rounded-lg flex items-center justify-center shrink-0">
                    <FaFileAlt className="text-zinc-500" size={14} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-zinc-900 truncate">
                      {existingFile.name}
                    </p>
                    <p className="text-[11px] text-zinc-500">
                      Already uploaded
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setExistingFile(null)}
                  className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-[#E30613] hover:bg-red-50 rounded-lg transition-colors shrink-0"
                  aria-label="Remove file"
                >
                  <FaTimes size={12} />
                </button>
              </div>
            )}

            <div className="border-2 border-dashed border-zinc-200 rounded-xl p-6 text-center hover:border-zinc-400 transition-colors bg-zinc-50/40">
              <input
                type="file"
                accept=".pdf,.docx,.doc,.txt"
                onChange={(e) => setSelectedFile(e.target.files[0])}
                className="hidden"
                id="assessment-file"
              />
              <label
                htmlFor="assessment-file"
                className="cursor-pointer flex flex-col items-center gap-2"
              >
                <div className="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center">
                  <FaFileAlt className="text-zinc-400" size={18} />
                </div>
                <span className="text-sm font-medium text-zinc-700">
                  {selectedFile
                    ? selectedFile.name
                    : existingFile
                    ? 'Replace with new file'
                    : 'Click to upload assessment file'}
                </span>
                <span className="text-[11px] text-zinc-400">
                  PDF, DOCX or TXT · up to 10MB
                </span>
              </label>
            </div>
          </div>
        )}
      </div>
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