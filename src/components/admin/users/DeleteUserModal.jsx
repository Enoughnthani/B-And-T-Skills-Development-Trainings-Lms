import { Button, Modal, Spinner } from 'react-bootstrap';
import { FaTrash } from 'react-icons/fa';
import { X } from 'lucide-react';
import { useTopLoader } from '@/contexts/TopLoaderContext';
import { apiFetch } from '@/api/api';
import { USERS } from '@/utils/apiEndpoint';

export default function DeleteUserModal({
    show,
    setShow,
    userForm,
    getRoleIcon,
    setResponse,
    loading,
    getUsers
}) {

    const { start, complete } = useTopLoader()

    async function handleDeleteUser() {
        start();
        try {
            let result = await apiFetch(`${USERS}/${userForm.id}`, {
                method: "DELETE"
            });
            setResponse(result);
            getUsers();
        } catch (error) {
            setResponse({ success: false, message: "An error occurred while deleting a user. " + error.message });
        } finally {
            complete();
            setShow(false);
        }
    }
    return (
        <Modal
            show={show}
            onHide={() => setShow(false)}
            centered
            size="sm"
            backdrop="static"
            keyboard={false}
        >
            <Modal.Header className="border-0 pb-0 flex justify-between">
                <Modal.Title className="text-lg font-semibold text-gray-800">
                    Confirm Delete
                </Modal.Title>
                <X
                    onClick={() => setShow(false)}
                    className='text-red-600 cursor-pointer hover:text-red-700 transition-colors'
                    size={20}
                />
            </Modal.Header>

            <Modal.Body className="text-center pt-2 pb-4">
                <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-3">
                    <FaTrash className="text-red-500 text-xl" />
                </div>

                <h5 className="font-semibold text-gray-800 mb-1">
                    Delete {userForm?.firstname} {userForm?.lastname}?
                </h5>

                <p className="text-gray-500 text-sm mb-3">
                    This action cannot be undone.
                </p>

                {userForm?.role?.length > 0 && (
                    <div className="flex justify-center gap-1 flex-wrap mb-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-100">
                            {getRoleIcon?.(userForm.role[0])}
                            {userForm.role[0]}
                        </span>
                        {userForm.role.length > 1 && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                +{userForm.role.length - 1}
                            </span>
                        )}
                    </div>
                )}
            </Modal.Body>

            <Modal.Footer className="border-0 pt-0 justify-content-center gap-2">
                <Button
                    variant="outline-secondary"
                    onClick={() => setShow(false)}
                    disabled={loading}
                    className="px-4"
                >
                    Cancel
                </Button>
                <Button
                    variant="outline-danger"
                    onClick={handleDeleteUser}
                    disabled={loading}
                    className="px-4 d-flex align-items-center gap-2"
                >
                    {loading ? (
                        <>
                            <Spinner animation="border" size="sm" />
                            Deleting...
                        </>
                    ) : (
                        <>
                            <FaTrash size={14} /> Delete
                        </>
                    )}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}