import { FaPlus, FaFolder, FaUpload, FaTrash, FaCheckSquare, FaSquare, FaTimes } from 'react-icons/fa';
import { Button } from 'react-bootstrap';

export default function ResourcesHeader({ 
  onNewFolder, 
  onUpload, 
  onBulkDelete,
  selectionMode,
  selectedCount,
  onSelectAll,
  onCancelSelection,
  onConfirmBulkDelete
}) {
  if (selectionMode) {
    return (
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={onSelectAll}
              className="bg-transparent flex items-center gap-2 text-gray-600 hover:text-gray-800"
            >
              {selectedCount > 0 ? <FaCheckSquare size={18} /> : <FaSquare size={18} />}
              <span className="text-sm">Select All</span>
            </button>
            <span className="text-sm text-gray-500">
              {selectedCount} item{selectedCount !== 1 ? 's' : ''} selected
            </span>
          </div>
          <div className="flex gap-3">
            {selectedCount > 0 && (
              <Button 
                onClick={onConfirmBulkDelete}
                variant="danger"
                size="sm"
                className="flex items-center gap-2"
              >
                <FaTrash size={14} /> Delete Selected
              </Button>
            )}
            <Button 
              onClick={onCancelSelection}
              variant="outline-secondary"
              size="sm"
              className="flex items-center gap-2"
            >
              <FaTimes size={14} /> Cancel
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Program Content</h2>
          <p className="text-sm text-gray-500 mt-0.5">Manage folders and learning materials</p>
        </div>
        <div className="flex gap-3">
          <Button 
            onClick={onBulkDelete}
            variant="outline-danger"
            className="flex items-center gap-2"
          >
            <FaTrash size={14} /> Bulk Delete
          </Button>
          <Button 
            onClick={onNewFolder}
            variant="outline-primary"
            className="flex items-center gap-2"
          >
            <FaFolder size={14} /> New Folder
          </Button>
          <Button 
            onClick={onUpload}
            variant="primary"
            className="flex items-center gap-2"
          >
            <FaUpload size={14} /> Upload Files
          </Button>
        </div>
      </div>
    </div>
  );
}