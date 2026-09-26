import { useEffect, useState } from 'react';
import { FaExclamationTriangle, FaTrash } from 'react-icons/fa';

export default function DeleteResourceConfirm({ show, onHide, item, onConfirm }) {
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (show) setDeleting(false);
  }, [show]);

  if (!show || !item) return null;

  const isBulk = item.type === 'BULK';
  const isFolder = item.type === 'FOLDER';
  const hasChildren = item.childrenCount > 0;

  const title = isBulk
    ? 'Delete items'
    : isFolder
    ? 'Delete folder'
    : 'Delete file';

  const description = isBulk
    ? `Delete ${item.name}?`
    : `Delete "${item.name}"?`;

  async function handleConfirm() {
    setDeleting(true);
    try {
      await onConfirm(item.id);
      onHide();
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
              {title}
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

          <p className="text-sm text-zinc-700 mb-2 break-words">
            {description}
          </p>

          {isFolder && hasChildren && (
            <div className="bg-red-50 border border-red-200 text-[#E30613] text-xs rounded-lg p-2.5 mt-3">
              This folder contains <strong>{item.childrenCount}</strong>{' '}
              {item.childrenCount === 1 ? 'item' : 'items'}. Everything inside will be deleted.
            </div>
          )}

          {isBulk && (
            <div className="bg-red-50 border border-red-200 text-[#E30613] text-xs rounded-lg p-2.5 mt-3">
              This will permanently remove all selected items.
            </div>
          )}

          <p className="text-[11px] text-zinc-400 mt-4">
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
            onClick={handleConfirm}
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
                {isBulk ? 'Delete all' : 'Delete'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}