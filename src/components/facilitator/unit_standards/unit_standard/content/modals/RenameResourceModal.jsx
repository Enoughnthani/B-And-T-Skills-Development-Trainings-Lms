import { useEffect, useState } from 'react';
import { FaEdit } from 'react-icons/fa';

export default function RenameResourceModal({ show, onHide, item, onSave }) {
  const [newName, setNewName] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (show && item?.name) {
      setNewName(item.name);
      setError(null);
    }
  }, [show, item]);

  if (!show || !item) return null;

  const isFolder = item.type === 'FOLDER';
  const trimmed = newName.trim();
  const unchanged = trimmed === (item.name || '').trim();
  const canSave = trimmed.length > 0 && !unchanged;

  function handleSave() {
    if (!trimmed) {
      setError('Name is required.');
      return;
    }
    if (unchanged) {
      setError('Please enter a different name.');
      return;
    }
    onSave(item.id, trimmed);
    setError(null);
    onHide();
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">

        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-200">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 bg-zinc-100 rounded-lg flex items-center justify-center shrink-0">
              <FaEdit className="text-zinc-700" size={14} />
            </div>
            <h2 className="font-bold text-zinc-900 truncate">
              Rename {isFolder ? 'folder' : 'file'}
            </h2>
          </div>

          <button
            onClick={onHide}
            className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors text-xl leading-none shrink-0"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="p-5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-[#E30613] text-sm rounded-lg p-3 mb-4">
              {error}
            </div>
          )}

          <label className="block text-sm font-medium text-zinc-700 mb-1.5">
            New name
          </label>
          <input
            type="text"
            value={newName}
            onChange={(e) => {
              setNewName(e.target.value);
              if (error) setError(null);
            }}
            onKeyDown={handleKeyDown}
            autoFocus
            className="w-full px-3.5 py-2.5 text-sm bg-white border border-zinc-300 rounded-lg focus:border-[#E30613] outline-none transition-colors"
          />
          {item.name && (
            <p className="text-[11px] text-zinc-400 mt-1.5">
              Currently: <span className="font-mono">{item.name}</span>
            </p>
          )}
        </div>

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 px-5 py-4 border-t border-zinc-200 bg-zinc-50">
          <button
            type="button"
            onClick={onHide}
            className="inline-flex items-center justify-center w-full sm:w-auto px-4 py-2.5 text-sm font-semibold text-zinc-700 bg-white border border-zinc-300 rounded-lg hover:border-zinc-400 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!canSave}
            className="inline-flex items-center justify-center w-full sm:w-auto px-5 py-2.5 text-sm font-semibold text-white bg-[#E30613] rounded-lg hover:bg-[#c00511] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}