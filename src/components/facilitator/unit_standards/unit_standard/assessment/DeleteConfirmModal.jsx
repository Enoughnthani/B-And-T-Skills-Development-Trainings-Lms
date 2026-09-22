import { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { FaTrash, FaExclamationTriangle, FaTimes } from 'react-icons/fa';
import { assessmentService } from './services/AssessmentService';

export default function DeleteConfirmModal({ show, onHide, item, onRefresh }) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!item) return;
    setDeleting(true);
    try {
      await assessmentService.deleteAssessment(item.id);
      onRefresh();
      onHide();
    } catch (error) {
      console.error('Error deleting assessment:', error);
      alert('Failed to delete assessment');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header className="border-0 pb-0">
        <Modal.Title className="flex items-center gap-2 text-red-600">
          <FaTrash /> Delete Assessment
        </Modal.Title>
        <button onClick={onHide} className="text-gray-400 hover:text-gray-600">
          <FaTimes />
        </button>
      </Modal.Header>

      <Modal.Body>
        <div className="text-center py-2">
          <FaExclamationTriangle size={48} className="text-yellow-500 mx-auto mb-3" />
          <p className="mb-2">
            Are you sure you want to delete <strong>{item?.title}</strong>?
          </p>
          <p className="text-xs text-gray-400">This action cannot be undone.</p>
        </div>
      </Modal.Body>

      <Modal.Footer className="border-0 pt-0">
        <Button variant="secondary" onClick={onHide}>Cancel</Button>
        <Button variant="danger" onClick={handleDelete} disabled={deleting}>
          {deleting ? 'Deleting...' : 'Delete'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}