import { apiFetch } from "@/api/api";
import { USERS } from "@/utils/apiEndpoint";
import { useState } from "react";
import { Button, Modal, Spinner } from "react-bootstrap";
import { FaTrash } from "react-icons/fa";
import { useTopLoader } from '../../../contexts/TopLoaderContext';

export default function BulkDeleteModal({ show, setShow, bulkSelection, setBulkSelection, getUsers, setResponse }) {

    const [loading, setLoading] = useState(false);
    const { start, complete } = useTopLoader();

    const handleBulkDelete = async () => {
        if (!bulkSelection || bulkSelection.length === 0) {
            setResponse({ success: false, message: "No users selected for deletion." });
            return;
        }

        setLoading(true);
        start();

        try {
            const result = await apiFetch(`${USERS}/bulk-delete`, {
                method: "POST",
                body: JSON.stringify({ userIds: bulkSelection })
            });

            setResponse(result);
            setBulkSelection([]);
            setShow(false);
            await getUsers();

        } catch (error) {
        setResponse({ success: false, message: 'Bulk delete failed: ' + error.message });
    } finally {
        setLoading(false);
        complete();
    }
};

return (
    <Modal
        show={show}
        onHide={() => setShow(false)}
        centered
        backdrop="static"
        keyboard={false}
        className="text-gray-800"
    >
        <Modal.Header closeButton className="border-b border-gray-200 pb-4">
            <Modal.Title className="text-xl font-semibold text-gray-900">
                Bulk Delete Users
            </Modal.Title>
        </Modal.Header>

        <Modal.Body className="py-6">
            <div className="text-center">
                <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaTrash className="text-red-500 text-xl" />
                </div>

                <p className="text-gray-700 text-center">
                    Are you sure you want to delete <strong className="font-semibold text-gray-900">{bulkSelection?.length || 0}</strong> user{bulkSelection?.length !== 1 ? 's' : ''}?
                </p>

                <p className="mt-3 text-sm text-red-600 bg-red-50 p-3 rounded-md">
                    ⚠️ This action cannot be undone. All user data will be permanently removed.
                </p>

                {bulkSelection?.length > 0 && (
                    <div className="mt-4 text-left bg-gray-50 p-3 rounded-md max-h-32 overflow-y-auto">
                        <p className="text-xs text-gray-500 mb-2">Selected users:</p>
                        <p className="text-sm text-gray-700">
                            {bulkSelection.length} user{bulkSelection.length !== 1 ? 's' : ''} selected for deletion
                        </p>
                    </div>
                )}
            </div>
        </Modal.Body>

        <Modal.Footer className="border-t border-gray-200 pt-4 gap-3">
            <Button
                variant="outline-secondary"
                onClick={() => setShow(false)}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium"
            >
                Cancel
            </Button>
            <Button
                variant="danger"
                onClick={handleBulkDelete}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium d-flex align-items-center gap-2"
            >
                {loading ? (
                    <>
                        <Spinner animation="border" size="sm" />
                        Deleting...
                    </>
                ) : (
                    <>
                        <FaTrash size={14} />
                        Delete {bulkSelection?.length || 0} User{bulkSelection?.length !== 1 ? 's' : ''}
                    </>
                )}
            </Button>
        </Modal.Footer>
    </Modal>
);
}