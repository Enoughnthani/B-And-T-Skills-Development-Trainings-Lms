import { apiFetch } from '@/api/api';
import ResponseMessage from '@/components/common/ResponseMessage';
import { ENROLLMENT, PROGRAMS, USERS } from '@/utils/apiEndpoint';
import { useEffect, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { FaSearch, FaUsers } from 'react-icons/fa';
import { bulkRemoveEnrollment, enrollLearner } from '../service/EnrollmenetService';
import { useApiResponse } from '@/contexts/ApiResponseContext';

export default function EnrollmentModal({ show, setShow, program }) {
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [filteredLearners, setFilteredLearners] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState(new Set());
    const [searchTerm, setSearchTerm] = useState('');
    const [response, setResponse] = useState(null);
    const [selectAll, setSelectAll] = useState(false);
    const [enrollingId, setEnrollingId] = useState(null);
    const {showResponse} = useApiResponse()

    useEffect(() => {
        if (show) fetchLearners();
    }, [show]);

    useEffect(() => {
        filterLearners();
    }, [searchTerm, users]);

    const fetchLearners = async () => {
        setLoading(true);
        try {

            const result = await apiFetch(`${PROGRAMS}/${program.id}/candidates`);
            if (result?.payload) {
                setUsers(result.payload);
                setFilteredLearners(result.payload);
            }
        } catch {
            setResponse({ success: false, message: "Failed to fetch users" });
        } finally {
            setLoading(false);
        }
    };

    const filterLearners = () => {
        if (!searchTerm) return setFilteredLearners(users);

        const filtered = users.filter(user =>
            `${user.firstname} ${user.lastname}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.idNo?.toLowerCase().includes(searchTerm.toLowerCase())
        );

        setFilteredLearners(filtered);
    };

    const handleSelectLearner = (id) => {
        const newSet = new Set(selectedUsers);
        newSet.has(id) ? newSet.delete(id) : newSet.add(id);

        setSelectedUsers(newSet);
        setSelectAll(newSet.size === filteredLearners.length && filteredLearners.length > 0);
    };

    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedUsers(new Set());
        } else {
            setSelectedUsers(new Set(filteredLearners.map(user => user.id)));
        }
        setSelectAll(!selectAll);
    };

    const handleEnroll = async (learner) => {

        try {
            const result = await enrollLearner(learner, program.id);
            showResponse(result)
            setResponse(result);
            fetchLearners()
        } catch (e) {
            setResponse({ success: false, message: "Enroll failed " });
        }
    };

    const handleBulkEnroll = async () => {
        if (selectedUsers.size === 0) return;

        setLoading(true);
        try {
            const result = await apiFetch(`${ENROLLMENT}/bulk/enroll`, {
                method: 'POST',
                body: {
                    programId: program.id,
                    userIds: Array.from(selectedUsers)
                }
            });

            showResponse(result)
            setResponse(result);
            setSelectedUsers(new Set());
            setSelectAll(false);
            fetchLearners();
        } catch {
            setResponse({ success: false, message: "Bulk enroll failed" });
        } finally {
            setLoading(false);
        }
    };

    const handleBulkRemove = async () => {
        if (selectedUsers.size === 0) return;

        setLoading(true);
        try {
            const result = await bulkRemoveEnrollment(program.id, Array.from(selectedUsers));
            setResponse(result);
            showResponse(result)
            setSelectedUsers(new Set());
            setSelectAll(false);
            fetchLearners();
        } catch {
            setResponse({ success: false, message: "Bulk remove failed" });
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setShow(false);
        setSelectedUsers(new Set());
        setSearchTerm('');
        setResponse(null);
        setSelectAll(false);
    };

    return (
        <Modal show={show} onHide={handleClose} size="xl" centered backdrop="static">
            <Modal.Header closeButton className="border-b border-gray-200 px-6 py-4">
                <Modal.Title className="text-xl font-semibold text-gray-800">
                    Enroll {program?.category === 'INTERNSHIP' ? 'Interns' : 'Learners'}
                </Modal.Title>
            </Modal.Header>

            <Modal.Body className="px-6 py-4">
                {/* Search */}

                <div className='mb-6 flex items-center gap-3'>
                    <div className="flex-1 relative">
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                        <input
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50 hover:bg-white"
                            placeholder="Search by name, email or ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <Button
                        size='sm'
                        variant="outline-secondary"
                        onClick={() => setSearchTerm('')}
                        className="px-4 py-2"
                    >
                        Clear
                    </Button>
                </div>

                <ResponseMessage response={response} setResponse={setResponse} />

                {/* Table */}
                {loading ? (
                    <div className="text-center py-8">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <p className="mt-2 text-gray-500">Loading...</p>
                    </div>
                ) : filteredLearners.length > 0 ? (

                    <div className="overflow-y-auto max-h-[53vh] border border-gray-200 rounded-md">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50 sticky top-0">
                                <tr>
                                    <th className="px-4 py-3 text-left w-12">
                                        <Form.Check
                                            checked={selectAll}
                                            onChange={handleSelectAll}
                                            className="cursor-pointer"
                                        />
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredLearners.map(user => (
                                    <tr key={user.id} className="hover:bg-gray-200 transition">
                                        <td className="px-4 py-3">
                                            <Form.Check
                                                checked={selectedUsers.has(user.id)}
                                                onChange={() => handleSelectLearner(user.id)}
                                                className="cursor-pointer"
                                            />
                                        </td>

                                        <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                                            {user.firstname} {user.lastname}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-600">
                                            <div>
                                                <span className="block max-w-[150px] truncate text-sm text-gray-600">
                                                    {user.email}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-600">{user.idNo || '-'}</td>
                                        <td className="px-4 py-3 text-sm text-gray-600">{user?.role[0] || '-'}</td>
                                        <td className="px-4 py-3">
                                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-md bg-green-100 text-green-800">
                                                {user.status}
                                            </span>
                                        </td>

                                        <td className="px-4 py-3">
                                            <Button
                                                onClick={() => handleEnroll(user)}
                                                disabled={enrollingId === user.id}
                                                variant={user?.enrolled ? 'danger' : 'primary'}
                                                size='sm'
                                                className="w-full rounded-md"
                                            >
                                                {user?.enrolled ? 'Remove' : 'Enroll'}
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                ) : (
                    <div className="text-center py-12">
                        <FaUsers className="mx-auto text-gray-300 text-5xl mb-3" />
                        <p className="text-gray-500">No users found</p>
                    </div>
                )}
            </Modal.Body>

            <Modal.Footer className="border-t border-gray-200 px-6 py-4">
                <div className="w-full flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                        {selectedUsers.size} selected
                    </span>

                    <div className="flex gap-2">
                        <button
                            onClick={handleClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
                        >
                            Close
                        </button>

                        <button
                            onClick={handleBulkRemove}
                            disabled={selectedUsers.size === 0}
                            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                            {`Remove All (${selectedUsers?.size})`}
                        </button>

                        <button
                            onClick={handleBulkEnroll}
                            disabled={selectedUsers.size === 0}
                            className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                            Enroll Selected
                        </button>
                    </div>
                </div>
            </Modal.Footer>
        </Modal>
    );
}