import { FaBook, FaClock, FaMapMarkerAlt, FaPlus, FaUsers } from 'react-icons/fa';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

export default function ProgramGrid({
  programs,
  currentPage,
  itemsPerPage,
  totalPages,
  onPageChange,
  onProgramClick,
  onAddProgram,
  getCategoryIcon,
  getStatusBadge,
  getActions,
}) {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentPrograms = programs.slice(startIndex, startIndex + itemsPerPage);

  if (programs.length === 0) {
    return <EmptyState onAddProgram={onAddProgram} />;
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {currentPrograms.map((program) => (
          <div
            key={program.id}
            onClick={() => onProgramClick(program)}
            className="group bg-white border border-zinc-200 rounded-xl p-5 hover:border-[#E30613] hover:shadow-sm transition-all cursor-pointer flex flex-col"
          >
            {/* Icon */}
            <div className="w-10 h-10 bg-zinc-100 rounded-lg flex items-center justify-center mb-4 text-zinc-600 group-hover:bg-red-50 group-hover:text-[#E30613] transition-colors">
              {getCategoryIcon(program.category)}
            </div>

            {/* Title */}
            <h3 className="font-bold text-zinc-900 mb-1 group-hover:text-[#E30613] transition-colors leading-snug line-clamp-2">
              {program.name}
            </h3>
            <p className="text-xs text-zinc-500 mb-4 truncate">
              {program.facilitator || '—'}
            </p>

            {/* Info rows */}
            <div className="space-y-3 mb-4 flex-1">
              {/* Enrolment */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-zinc-500 flex items-center gap-1.5">
                    <FaUsers size={10} />
                    {program.category === 'INTERNSHIP' ? 'Interns' : 'Learners'}
                  </span>
                  <span className="font-bold text-zinc-900 tabular-nums">
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

              {/* Duration */}
              {program.duration && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-500 flex items-center gap-1.5">
                    <FaClock size={10} />
                    Duration
                  </span>
                  <span className="font-medium text-zinc-700">
                    {program.duration}
                  </span>
                </div>
              )}

              {/* Location */}
              {program.location && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-500 flex items-center gap-1.5">
                    <FaMapMarkerAlt size={10} />
                    Location
                  </span>
                  <span className="font-medium text-zinc-700 truncate max-w-[100px] text-right">
                    {program.location}
                  </span>
                </div>
              )}

              {/* Status */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-500">Status</span>
                {renderStatusBadge(getStatusBadge(program.status))}
              </div>
            </div>

            {/* Actions */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="pt-4 border-t border-zinc-100"
            >
              {getActions(program)}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-6 pt-4 border-t border-zinc-200">
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
    </>
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