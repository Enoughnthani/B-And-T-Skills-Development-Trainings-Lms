import { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { FaEdit } from 'react-icons/fa';

export default function RenameResourceModal({ show, onHide, item, onSave }) {
  const [newName, setNewName] = useState('');

  useEffect(() => {
    if (item && item.name) {
      setNewName(item.name);
    }
  }, [item]);

  const handleSave = () => {
    if (newName && newName.trim() && newName.trim() !== item?.name) {
      onSave(item.id, newName.trim());
      onHide();
    }
  };

  if (!item) return null;

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title className="flex items-center gap-2">
          <FaEdit className="text-blue-500" /> Rename {item.type === 'FOLDER' ? 'Folder' : 'Resource'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group>
          <Form.Label>New Name</Form.Label>
          <Form.Control
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            autoFocus
            onKeyPress={(e) => e.key === 'Enter' && handleSave()}
          />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSave} disabled={!newName || !newName.trim() || newName === item.name}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
}