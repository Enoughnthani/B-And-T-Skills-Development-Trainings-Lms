import { FaBook, FaPlus } from 'react-icons/fa';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

export default function ProgramList({
  programs,
  currentPage,
  itemsPerPage,
  totalPages,
  sortConfig,
  onSort,
  onPageChange,
  onProgramClick,
  onAddProgram,
  getCategoryIcon,
  getStatusBadge,
  getActions,
}) {
  const navigate = useNavigate();
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentPrograms = programs.slice(startIndex, startIndex + itemsPerPage);

  const columns = [
    { key: 'name',     label: 'Programme' },
    { key: 'category', label: 'Category' },
    { key: 'type',     label: 'Type' },
    { key: 'status',   label: 'Status' },
    { key: 'learners', label: 'Learners' },
  ];

  if (currentPrograms.length === 0) {
    return <EmptyState onAddProgram={onAddProgram} />;
  }

  return (
    <div className="bg-white border rounded-lg ">
      <div className="hidden md:block">
        <table className="w-full">
          <thead className="border-b border-zinc-200">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => onSort(col.key)}
                  className="text-left px-4 py-3 text-xs font-bold text-zinc-600 uppercase tracking-wider cursor-pointer hover:text-zinc-900 transition-colors whitespace-nowrap"
                >
                  <span className="inline-flex items-center gap-1">
                    {col.label}
                    {sortConfig.key === col.key && (
                      <span className="text-[#E30613]">
                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </span>
                </th>
              ))}
              <th className="text-left px-4 py-3 text-xs font-bold text-zinc-600 uppercase tracking-wider w-24">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {currentPrograms.map((program) => (
              <tr
                key={program.id}
                onClick={() => onProgramClick(program)}
                className="cursor-pointer hover:bg-red-50/30 transition-colors"
              >
                {/* Programme */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 bg-zinc-100 rounded-lg flex items-center justify-center shrink-0 text-zinc-600 text-sm">
                      {getCategoryIcon(program.category)}
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-zinc-900 truncate">
                        {program.name}
                      </div>
                      <div className="text-xs text-zinc-500 truncate">
                        {program.facilitator || '—'}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Category */}
                <td className="px-4 py-3">
                  <span className="text-[10px] font-bold bg-zinc-100 text-zinc-700 px-2 py-1 rounded uppercase tracking-wider whitespace-nowrap">
                    {program.category === 'SHORT_COURSE'
                      ? 'Short Course'
                      : program.category === 'LEARNERSHIP'
                      ? 'Learnership'
                      : 'Internship'}
                  </span>
                </td>

                {/* Type */}
                <td className="px-4 py-3">
                  {renderTypeBadge(program.type)}
                </td>

                {/* Status */}
                <td className="px-4 py-3">
                  {renderStatusBadge(getStatusBadge(program.status))}
                </td>

                {/* Learners */}
                <td className="px-4 py-3">
                  <div className="min-w-[100px]">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-zinc-700 tabular-nums">
                        {program.enrolledCount || 0}/{program.capacity || 0}
                      </span>
                    </div>
                    <div className="h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#E30613] transition-all"
                        style={{
                          width: `${Math.min(
                            ((program.enrolledCount || 0) / (program.capacity || 1)) * 100,
                            100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                </td>

                {/* Actions */}
                <td
                  onClick={(e) => e.stopPropagation()}
                  className="px-4 py-3 z-50"
                >
                  {getActions(program)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

   
      <div className="md:hidden divide-y divide-zinc-100">
        {currentPrograms.map((program) => (
          <div
            key={program.id}
            onClick={() => onProgramClick(program)}
            className="p-4 hover:bg-red-50/30 transition-colors cursor-pointer"
          >
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 bg-zinc-100 rounded-lg flex items-center justify-center shrink-0 text-zinc-600">
                {getCategoryIcon(program.category)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-zinc-900 truncate">
                  {program.name}
                </div>
                <div className="text-xs text-zinc-500 truncate mt-0.5">
                  {program.facilitator || '—'}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="text-[10px] font-bold bg-zinc-100 text-zinc-700 px-2 py-1 rounded uppercase tracking-wider">
                {program.category === 'SHORT_COURSE'
                  ? 'Short Course'
                  : program.category === 'LEARNERSHIP'
                  ? 'Learnership'
                  : 'Internship'}
              </span>
              {renderStatusBadge(getStatusBadge(program.status))}
            </div>

            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs text-zinc-500">Enrolment</span>
              <div className="flex-1 h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#E30613] transition-all"
                  style={{
                    width: `${Math.min(
                      ((program.enrolledCount || 0) / (program.capacity || 1)) * 100,
                      100
                    )}%`,
                  }}
                />
              </div>
              <span className="text-xs font-bold text-zinc-700 tabular-nums">
                {program.enrolledCount || 0}/{program.capacity || 0}
              </span>
            </div>

            <div
              onClick={(e) => e.stopPropagation()}
              className="pt-3 border-t border-zinc-100"
            >
              {getActions(program)}
            </div>
          </div>
        ))}
      </div>

      {/* ============================================================
          PAGINATION
          ============================================================ */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-4 border-t border-zinc-100">
          <div className="text-xs sm:text-sm text-zinc-500 text-center sm:text-left">
            Showing{' '}
            <span className="font-semibold text-zinc-900">{startIndex + 1}</span> to{' '}
            <span className="font-semibold text-zinc-900">
              {Math.min(startIndex + itemsPerPage, programs.length)}
            </span>{' '}
            of{' '}
            <span className="font-semibold text-zinc-900">{programs.length}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 border border-zinc-200 rounded-lg bg-white hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-zinc-600"
              aria-label="Previous page"
            >
              <FiChevronLeft size={14} />
            </button>

            <span className="text-xs text-zinc-600 px-2">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 border border-zinc-200 rounded-lg bg-white hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-zinc-600"
              aria-label="Next page"
            >
              <FiChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function renderStatusBadge(badge) {
  if (!badge) return null;
  if (typeof badge === 'object' && badge.label) {
    const statusStyles = {
      NOT_STARTED: 'bg-zinc-100 text-zinc-600',
      IN_PROGRESS: 'bg-red-50 text-[#E30613]',
      COMPLETED:   'bg-zinc-900 text-white',
    };
    return (
      <span
        className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider whitespace-nowrap ${
          statusStyles[badge.label?.toUpperCase()] || 'bg-zinc-100 text-zinc-600'
        }`}
      >
        {badge.label}
      </span>
    );
  }
  return badge;
}

function renderTypeBadge(type) {
  return (
    <span className="text-[10px] font-bold bg-zinc-100 text-zinc-600 px-2 py-1 rounded uppercase tracking-wider whitespace-nowrap">
      {type || '—'}
    </span>
  );
}

function EmptyState({ onAddProgram }) {
  return (
    <div className="bg-white border border-zinc-200 rounded-xl p-12 text-center">
      <div className="w-14 h-14 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <FaBook className="text-zinc-400 text-xl" />
      </div>
      <h3 className="font-bold text-zinc-900 mb-1">No programmes found</h3>
      <p className="text-sm text-zinc-500 mb-5">
        Try adjusting your filters or add a new programme.
      </p>
      <button
        onClick={onAddProgram}
        className="inline-flex items-center gap-2 bg-[#E30613] hover:bg-[#c00511] text-white font-semibold text-sm px-5 py-2.5 rounded-lg transition-colors"
      >
        <FaPlus size={12} />
        Add First Programme
      </button>
    </div>
  );
}