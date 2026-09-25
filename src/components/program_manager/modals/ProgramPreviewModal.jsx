import { apiFetch } from '@/api/api';
import { PROGRAMS } from '@/utils/apiEndpoint';
import { useState } from 'react';
import { FaTrash } from 'react-icons/fa';

export default function DeleteProgramModal({
  show,
  onHide,
  program,
  setResponse,
  getPrograms,
}) {
  const [loading, setLoading] = useState(false);

  if (!show || !program) return null;

  async function handleDelete() {
    setLoading(true);
    try {
      const result = await apiFetch(`${PROGRAMS}/${program.id}`, {
        method: 'DELETE',
      });
      setResponse?.(result);
      getPrograms?.();
      onHide();
    } catch {
      setResponse?.({
        success: false,
        message: 'Failed to delete programme.',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden">

        <div className="p-6 text-center">
          <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaTrash className="text-[#E30613] text-xl" />
          </div>

          <h2 className="text-lg font-bold text-zinc-900 mb-1">
            Delete programme?
          </h2>
          <p className="text-sm text-zinc-500 mb-1">You're about to delete</p>
          <p className="text-sm font-bold text-zinc-900 mb-4 break-words">
            {program.name}
          </p>
          <p className="text-xs text-zinc-500 leading-relaxed">
            This action cannot be undone. All programme data, enrolments and
            assignments will be permanently removed.
          </p>
        </div>

        <div className="border-t border-zinc-200 bg-zinc-50 px-4 py-3 flex flex-col-reverse sm:flex-row gap-2">
          <button
            onClick={onHide}
            disabled={loading}
            className="flex-1 px-4 py-2.5 text-sm font-semibold text-zinc-700 bg-white border border-zinc-300 rounded-lg hover:border-zinc-400 disabled:opacity-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-[#E30613] rounded-lg hover:bg-[#c00511] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Deleting…
              </>
            ) : (
              <>
                <FaTrash size={12} />
                Delete
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}