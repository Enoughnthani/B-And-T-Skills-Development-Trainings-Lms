import {
  FaCheckSquare,
  FaFolder,
  FaPlus,
  FaSquare,
  FaTrash,
  FaUpload,
  FaTimes,
} from 'react-icons/fa';

export default function ResourcesHeader({
  onNewFolder,
  onUpload,
  onBulkDelete,
  selectionMode,
  selectedCount,
  onSelectAll,
  onCancelSelection,
  onConfirmBulkDelete,
}) {
  if (selectionMode) {
    return (
      <div className="bg-white border border-zinc-200 rounded-xl p-3 sm:p-4 mb-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={onSelectAll}
              className="inline-flex items-center gap-2 text-sm font-medium text-zinc-700 hover:text-zinc-900 transition-colors"
            >
              {selectedCount > 0 ? (
                <FaCheckSquare size={16} className="text-[#E30613]" />
              ) : (
                <FaSquare size={16} className="text-zinc-400" />
              )}
              Select all
            </button>

            <span className="text-xs sm:text-sm text-zinc-500">
              {selectedCount} {selectedCount === 1 ? 'item' : 'items'} selected
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {selectedCount > 0 && (
              <button
                onClick={onConfirmBulkDelete}
                className="inline-flex items-center justify-center gap-2 bg-[#E30613] hover:bg-[#c00511] text-white font-semibold text-sm px-4 py-2 rounded-lg transition-colors"
              >
                <FaTrash size={12} />
                Delete selected
              </button>
            )}

            <button
              onClick={onCancelSelection}
              className="inline-flex items-center justify-center gap-2 bg-white border border-zinc-300 hover:border-zinc-400 text-zinc-700 font-semibold text-sm px-4 py-2 rounded-lg transition-colors"
            >
              <FaTimes size={12} />
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-5">
      <div className="min-w-0">
        <h2 className="text-xl sm:text-2xl font-extrabold text-zinc-900 mb-1">
          Programme content
        </h2>
        <p className="text-sm text-zinc-500">
          Manage folders and learning materials.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 shrink-0">
        <button
          onClick={onBulkDelete}
          className="inline-flex items-center justify-center gap-2 bg-white border border-red-200 hover:bg-red-50 text-[#E30613] font-semibold text-sm px-4 py-2.5 rounded-lg transition-colors"
        >
          <FaTrash size={12} />
          Bulk delete
        </button>

        <button
          onClick={onNewFolder}
          className="inline-flex items-center justify-center gap-2 bg-white border border-zinc-300 hover:border-zinc-400 text-zinc-700 font-semibold text-sm px-4 py-2.5 rounded-lg transition-colors"
        >
          <FaFolder size={12} />
          New folder
        </button>

        <button
          onClick={onUpload}
          className="inline-flex items-center justify-center gap-2 bg-[#E30613] hover:bg-[#c00511] text-white font-semibold text-sm px-4 py-2.5 rounded-lg transition-colors"
        >
          <FaUpload size={12} />
          Upload files
        </button>
      </div>
    </div>
  );
}