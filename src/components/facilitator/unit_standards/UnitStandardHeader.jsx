import { FaPlus } from 'react-icons/fa';

export default function UnitStandardsHeader({ onAdd }) {
  return (
    <div className="mb-6 sm:mb-8">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-extrabold text-zinc-900 mb-1">
            Unit Standards
          </h1>
          <p className="text-sm text-zinc-500">
            Manage learnership unit standards and outcomes.
          </p>
        </div>

        <button
          onClick={onAdd}
          className="inline-flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-900 text-white font-semibold text-sm px-5 py-2.5 rounded-lg transition-colors shrink-0 w-full sm:w-auto"
        >
          <FaPlus size={12} />
          Add Unit Standard
        </button>
      </div>
    </div>
  );
}