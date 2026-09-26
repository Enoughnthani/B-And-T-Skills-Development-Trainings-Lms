import { FaSearch } from 'react-icons/fa';

const TYPES = [
  { value: 'ALL', label: 'All types' },
  { value: 'KNOWLEDGE', label: 'Knowledge' },
  { value: 'PRACTICAL', label: 'Practical skills' },
  { value: 'WORK_EXPERIENCE', label: 'Work experience' },
  { value: 'FUNDAMENTAL', label: 'Fundamental' },
  { value: 'CORE', label: 'Core' },
  { value: 'ELECTIVE', label: 'Elective' },
];

export default function UnitStandardsFilters({
  searchTerm,
  setSearchTerm,
  filterType,
  setFilterType,
  typeOptions,
}) {
  const options = typeOptions || TYPES;

  return (
    <div className="bg-white border border-zinc-200 rounded-xl p-3 sm:p-4 mb-5">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-3.5 h-3.5" />
          <input
            type="text"
            placeholder="Search by title…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 text-sm bg-white border border-zinc-300 rounded-lg focus:border-[#E30613] outline-none transition-colors"
          />
        </div>

        <div className="sm:w-56">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full px-3.5 py-2.5 text-sm bg-white border border-zinc-300 rounded-lg focus:border-[#E30613] outline-none cursor-pointer"
          >
            {options.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}