import { useEffect, useState } from 'react';
import { FaExclamationTriangle, FaTrash } from 'react-icons/fa';
import { assessmentService } from './services/AssessmentService';

export default function DeleteConfirmModal({ show, onHide, item, onRefresh }) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (show) {
      setDeleting(false);
      setError(null);
    }
  }, [show]);

  if (!show || !item) return null;

  async function handleDelete() {
    setDeleting(true);
    setError(null);

    try {
      await assessmentService.deleteAssessment(item.id);
      onRefresh?.();
      onHide();
    } catch {
      setError('Failed to delete assessment. Please try again.');
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden">

        <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-zinc-200">
          <div className="flex items-center gap-2 min-w-0">
            <FaTrash className="text-[#E30613] shrink-0" size={12} />
            <h2 className="font-bold text-zinc-900 text-sm truncate">
              Delete assessment
            </h2>
          </div>

          <button
            onClick={onHide}
            disabled={deleting}
            className="w-7 h-7 flex items-center justify-center text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-md transition-colors text-lg leading-none shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="p-4 text-center">

          <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-3">
            <FaExclamationTriangle className="text-[#E30613]" size={20} />
          </div>

          <p className="text-sm text-zinc-700 mb-1">
            Delete this assessment?
          </p>
          <p className="text-sm font-bold text-zinc-900 break-words mb-4">
            {item.title}
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-[#E30613] text-xs rounded-lg p-2.5 mb-4 text-left">
              {error}
            </div>
          )}

          <p className="text-[11px] text-zinc-400">
            This action cannot be undone.
          </p>
        </div>

        <div className="flex justify-end gap-2 px-4 py-3 border-t border-zinc-200 bg-zinc-50">
          <button
            type="button"
            onClick={onHide}
            disabled={deleting}
            className="px-3.5 py-2 text-xs font-semibold text-zinc-700 bg-white border border-zinc-300 rounded-lg hover:border-zinc-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#E30613] rounded-lg hover:bg-[#c00511] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            {deleting ? (
              <>
                <span className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Deleting…
              </>
            ) : (
              <>
                <FaTrash size={10} />
                Delete
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}