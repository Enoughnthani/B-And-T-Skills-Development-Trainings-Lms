import { FaArrowLeft, FaChevronRight, FaFolder } from 'react-icons/fa';

export default function ResourcesBreadcrumb({
  currentPath = [],
  onNavigate,
  onBack,
  canGoBack,
}) {
  return (
    <div className="flex items-center gap-1 sm:gap-2 bg-white border border-zinc-200 rounded-xl px-2 sm:px-3 py-2 mb-4 overflow-x-auto">

      <button
        onClick={onBack}
        disabled={!canGoBack}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors shrink-0 ${
          canGoBack
            ? 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
            : 'text-zinc-300 cursor-not-allowed'
        }`}
      >
        <FaArrowLeft size={12} />
        <span>Back</span>
      </button>

      <span className="text-zinc-200 shrink-0">|</span>

      <div className="flex items-center gap-0.5 min-w-0">

        <button
          onClick={() => onNavigate(-1)}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 transition-colors shrink-0"
        >
          <FaFolder size={12} />
          <span>Content</span>
        </button>

        {currentPath.map((folder, index) => (
          <div key={index} className="flex items-center gap-0.5 min-w-0">
            <FaChevronRight size={10} className="text-zinc-300 shrink-0" />
            <button
              onClick={() => onNavigate(index)}
              className="px-2.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 transition-colors truncate max-w-[140px] sm:max-w-[200px]"
              title={folder.name}
            >
              {folder.name}
            </button>
          </div>
        ))}

      </div>
    </div>
  );
}