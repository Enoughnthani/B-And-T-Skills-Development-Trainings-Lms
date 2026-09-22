import { Modal, Button } from 'react-bootstrap';
import { FaTrash, FaExclamationTriangle } from 'react-icons/fa';

export default function DeleteUnitStandardModal({ show, onHide, item, onConfirm }) {
  if (!item) return null;

  const handleConfirm = () => {
    onConfirm(item.unitStandardId);
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title className="flex items-center gap-2 text-red-600">
          <FaTrash /> Delete Unit Standard
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="text-center py-2">
          <FaExclamationTriangle size={48} className="text-yellow-500 mb-3 mx-auto" />
          <p className="mb-2">
            Are you sure you want to delete <strong>{item.title}</strong>?
          </p>
          <div className="bg-red-50 rounded-lg p-3 mt-3 border border-red-100">
            <p className="text-sm text-red-600 mb-0 flex items-center justify-center gap-2">
              <span>⚠️</span> This action cannot be undone.
            </p>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Cancel</Button>
        <Button variant="danger" onClick={handleConfirm}>Delete</Button>
      </Modal.Footer>
    </Modal>
  );
}