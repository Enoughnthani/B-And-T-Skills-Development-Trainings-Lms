import { FaArrowLeft, FaDownload, FaFilter } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function ReportLayout({
  title,
  description,
  onExport,
  exporting,
  exportDisabled,
  hasFilters,
  onClearFilters,
  filters,
  summary,
  children,
}) {
  const navigate = useNavigate();

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">

      <button
        onClick={() => navigate('/user/admin/reports')}
        className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 text-sm font-medium text-zinc-600 bg-white border border-zinc-200 rounded-lg hover:border-zinc-300 hover:text-zinc-900 transition-colors"
      >
        <FaArrowLeft size={12} />
        Back to reports
      </button>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-zinc-900 mb-1">
            {title}
          </h1>
          {description && (
            <p className="text-sm text-zinc-500">{description}</p>
          )}
        </div>

        {onExport && (
          <button
            onClick={onExport}
            disabled={exporting || exportDisabled}
            className="inline-flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm px-5 py-2.5 rounded-lg transition-colors shrink-0"
          >
            <FaDownload size={12} />
            {exporting ? 'Exporting…' : 'Export CSV'}
          </button>
        )}
      </div>

      {summary && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {summary.map((s, i) => (
            <div key={i} className="bg-white border border-zinc-200 rounded-xl p-3 sm:p-4">
              <p className="text-[10px] sm:text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">
                {s.label}
              </p>
              <p className={`text-xl sm:text-2xl font-extrabold tabular-nums ${s.color || 'text-zinc-900'}`}>
                {s.value}
              </p>
            </div>
          ))}
        </div>
      )}

      {filters && (
        <div className="bg-white border border-zinc-200 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <FaFilter size={12} className="text-zinc-400" />
              <span className="text-xs font-bold text-zinc-600 uppercase tracking-wider">
                Filters
              </span>
            </div>
            {hasFilters && onClearFilters && (
              <button
                onClick={onClearFilters}
                className="text-xs font-medium text-[#E30613] hover:underline"
              >
                Clear all
              </button>
            )}
          </div>
          {filters}
        </div>
      )}

      {children}
    </div>
  );
}