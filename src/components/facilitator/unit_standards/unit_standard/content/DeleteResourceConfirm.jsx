import { Modal, Button } from 'react-bootstrap';
import { FaTrash, FaExclamationTriangle } from 'react-icons/fa';

export default function DeleteResourceConfirm({ show, onHide, item, onConfirm }) {
  if (!item) return null;

  const isFolder = item.type === 'FOLDER';
  const hasChildren = item.childrenCount > 0;

  const handleConfirm = () => {
    onConfirm(item.id);
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title className="flex items-center gap-2 text-danger">
          <FaTrash /> Delete {isFolder ? 'Folder' : 'Resource'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="text-center py-2">
          <FaExclamationTriangle size={48} className="text-warning mb-3" />
          <p className="mb-2">
            Are you sure you want to delete <strong className="break-all">{item.name}</strong>?
          </p>
          {isFolder && hasChildren && (
            <p className="text-sm text-danger mt-2">
              ⚠️ This folder contains {item.childrenCount} item(s). All contents will be deleted!
            </p>
          )}
          <p className="text-xs text-gray-400 mt-3">This action cannot be undone.</p>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="danger" onClick={handleConfirm}>
          Delete Permanently
        </Button>
      </Modal.Footer>
    </Modal>
  );
}