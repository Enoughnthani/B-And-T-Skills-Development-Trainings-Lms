import { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { FaFolder } from 'react-icons/fa';

export default function CreateFolderModal({ show, onHide, onSave }) {
  const [folderName, setFolderName] = useState('');

  const handleSave = () => {
    if (folderName.trim()) {
      onSave(folderName.trim());
      setFolderName('');
      onHide();
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title className="flex items-center gap-2">
          <FaFolder className="text-amber-400" /> Create New Folder
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group>
          <Form.Label>Folder Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter folder name"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            autoFocus
            onKeyPress={(e) => e.key === 'Enter' && handleSave()}
          />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSave} disabled={!folderName.trim()}>
          Create
        </Button>
      </Modal.Footer>
    </Modal>
  );
}