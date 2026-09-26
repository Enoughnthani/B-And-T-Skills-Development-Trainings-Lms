import { useEffect, useRef, useState } from 'react';
import { FaFolder } from 'react-icons/fa';

export default function CreateFolderModal({ show, onHide, onSave }) {
  const [folderName, setFolderName] = useState('');
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (show) {
      setFolderName('');
      setError(null);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [show]);

  function handleSave() {
    const trimmed = folderName.trim();
    if (!trimmed) {
      setError('Folder name is required.');
      inputRef.current?.focus();
      return;
    }
    onSave(trimmed);
    setFolderName('');
    setError(null);
    onHide();
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    }
  }

  if (!show) return null;

  const canSave = folderName.trim().length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden">

        <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-zinc-200">
          <h2 className="font-bold text-zinc-900 text-sm truncate">
            New folder
          </h2>

          <button
            onClick={onHide}
            className="w-7 h-7 flex items-center justify-center text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-md transition-colors text-lg leading-none shrink-0"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="p-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-[#E30613] text-xs rounded-lg p-2.5 mb-3">
              {error}
            </div>
          )}

          <input
            ref={inputRef}
            type="text"
            placeholder="Folder name"
            value={folderName}
            onChange={(e) => {
              setFolderName(e.target.value);
              if (error) setError(null);
            }}
            onKeyDown={handleKeyDown}
            className="w-full px-3 py-2 text-sm bg-white border border-zinc-300 rounded-lg focus:border-[#E30613] outline-none transition-colors"
          />
        </div>

        <div className="flex justify-end gap-2 px-4 py-3 border-t border-zinc-200 bg-zinc-50">
          <button
            type="button"
            onClick={onHide}
            className="px-3.5 py-2 text-xs font-semibold text-zinc-700 bg-white border border-zinc-300 rounded-lg hover:border-zinc-400 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!canSave}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#E30613] rounded-lg hover:bg-[#c00511] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}