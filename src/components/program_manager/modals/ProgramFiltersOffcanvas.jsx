import { FaFilter, FaTimes } from 'react-icons/fa';
import { categories, statuses, programTypes } from '../utils/constants';

export default function ProgramFiltersDrawer({
  show,
  onHide,
  selectedCategory,
  setSelectedCategory,
  selectedStatus,
  setSelectedStatus,
  selectedType,
  setSelectedType,
  onApply,
  onReset,
}) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div
        className="flex-1 bg-black/50 backdrop-blur-sm"
        onClick={onHide}
        aria-hidden="true"
      />

      <aside className="w-full max-w-sm bg-white shadow-2xl flex flex-col h-full animate-slide-in-right">
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-200 shrink-0">
          <div className="flex items-center gap-2">
            <FaFilter className="text-[#E30613] text-sm" />
            <h2 className="font-bold text-zinc-900">Filters</h2>
          </div>
          <button
            onClick={onHide}
            className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors"
            aria-label="Close filters"
          >
            <FaTimes size={12} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          <FilterGroup
            title="Category"
            name="category"
            value={selectedCategory}
            onChange={setSelectedCategory}
            options={[
              { value: 'all', label: 'All categories' },
              ...categories.map((c) => ({ value: c.id, label: c.label })),
            ]}
          />

          <FilterGroup
            title="Status"
            name="status"
            value={selectedStatus}
            onChange={setSelectedStatus}
            options={[
              { value: 'all', label: 'All statuses' },
              ...statuses.map((s) => ({ value: s.id, label: s.label })),
            ]}
          />

          <FilterGroup
            title="Type"
            name="type"
            value={selectedType}
            onChange={setSelectedType}
            options={[
              { value: 'all', label: 'All types' },
              ...programTypes.map((t) => ({ value: t, label: t })),
            ]}
          />
        </div>

        <div className="border-t border-zinc-200 p-4 flex gap-2 shrink-0">
          <button
            onClick={onReset}
            className="flex-1 px-4 py-2.5 text-sm font-semibold text-zinc-700 bg-white border border-zinc-300 rounded-lg hover:border-zinc-400 transition-colors"
          >
            Reset
          </button>
          <button
            onClick={onApply}
            className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-[#E30613] rounded-lg hover:bg-[#c00511] transition-colors"
          >
            Apply
          </button>
        </div>
      </aside>
    </div>
  );
}

function FilterGroup({ title, name, value, onChange, options }) {
  return (
    <div>
      <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">
        {title}
      </h3>
      <div className="space-y-1.5">
        {options.map((opt) => (
          <label
            key={opt.value}
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer hover:bg-zinc-50 transition-colors"
          >
            <input
              type="radio"
              name={name}
              value={opt.value}
              checked={value === opt.value}
              onChange={(e) => onChange(e.target.value)}
              className="w-4 h-4 text-[#E30613] focus:ring-[#E30613] cursor-pointer"
            />
            <span className="text-sm text-zinc-700">{opt.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}