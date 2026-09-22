import { apiFetch } from '@/api/api';
import { PROGRAMS } from '@/utils/apiEndpoint';
import { useState } from 'react';
import { Button, Modal, Spinner } from 'react-bootstrap';
import { FaTrash } from 'react-icons/fa';

export default function DeleteProgramModal({ show, onHide, program, setResponse,getPrograms }) {
    if (!program) return null;

    const [loading, setLoading] = useState(false);

    const onDelete = async () => {
        setLoading(true);

        try {
            const result = await apiFetch(`${PROGRAMS}/${program.id}`, { method: 'DELETE' });
            setResponse(result)
            getPrograms();
            onHide();
        } catch (error) {
            setResponse({ success: false, message: 'Failed to delete program. Please try again.' });
        }finally{
            setLoading(false);
        }
    }

    return (
        <Modal show={show} onHide={onHide} centered size="sm">
            <Modal.Header closeButton className="border-0">
                <Modal.Title className="text-lg font-bold text-gray-800">
                    Confirm Delete
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="text-center py-4">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaTrash className="text-red-600 text-2xl" />
                </div>
                <h5 className="font-bold text-gray-800 mb-2">Delete {program?.name}?</h5>
                <p className="text-gray-600">
                    This action cannot be undone. All data associated with this program will be permanently deleted.
                </p>
            </Modal.Body>
            <Modal.Footer className="border-t pt-4 justify-center">
                <Button
                    variant="outline-secondary"
                    onClick={onHide}
                    disabled={loading}
                    className="px-6"
                >
                    Cancel
                </Button>
                <Button
                    variant="outline-danger"
                    onClick={onDelete}
                    disabled={loading}
                    className="px-6 flex items-center gap-2"
                >
                    {loading ? (
                        <>
                            <Spinner animation="border" size="sm" />
                            Deleting...
                        </>
                    ) : (
                        <>
                            <FaTrash /> Delete
                        </>
                    )}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}