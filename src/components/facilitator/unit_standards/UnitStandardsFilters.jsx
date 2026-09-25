import { FaSearch } from 'react-icons/fa';

const TYPES = [
  { value: 'ALL', label: 'All types' },
  { value: 'Fundamental', label: 'Fundamental' },
  { value: 'Core', label: 'Core' },
  { value: 'Elective', label: 'Elective' },
];

export default function UnitStandardsFilters({
  searchTerm,
  setSearchTerm,
  filterType,
  setFilterType,
}) {
  return (
    <div className="bg-white border border-zinc-200 rounded-xl p-3 sm:p-4 mb-5">
      <div className="flex flex-col lg:flex-row gap-3">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-3.5 h-3.5" />
          <input
            type="text"
            placeholder="Search by title…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-zinc-300 rounded-lg focus:border-[#E30613] outline-none transition-colors"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {TYPES.map((type) => (
            <button
              key={type.value}
              onClick={() => setFilterType(type.value)}
              className={`px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                filterType === type.value
                  ? 'bg-zinc-800 text-white'
                  : 'bg-white border border-zinc-300 text-zinc-700 hover:border-zinc-400'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}