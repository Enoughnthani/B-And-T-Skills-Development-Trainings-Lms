import { apiFetch } from '@/api/api';
import ResponseMessage from '@/components/common/ResponseMessage';
import RoleContent from '@/components/common/RoleContent';
import { PROGRAMS, PROGRAMSTAFF, USERS } from '@/utils/apiEndpoint';
import { useState, useEffect } from 'react';
import { Modal, Button, Form, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'react-bootstrap';
import { FaSearch, FaUserPlus, FaUsers, FaChalkboardTeacher, FaUserTie, FaUserGraduate, FaGavel } from 'react-icons/fa';
import { bulkRemove, handleStaffOperation } from '../service/ProgramStaffService';
import { isAssigned } from "../service/ProgramStaffService"
import { useApiResponse } from '@/contexts/ApiResponseContext';

export default function AddStaffModal({ show, setShow, program, onSuccess }) {
    const [loading, setLoading] = useState(false);
    const [staff, setStaff] = useState([]);
    const [filteredStaff, setFilteredStaff] = useState([]);
    const [selectedStaff, setSelectedStaff] = useState(new Set());
    const [searchTerm, setSearchTerm] = useState('');
    const [response, setResponse] = useState(null);
    const [selectAll, setSelectAll] = useState(false);
    const [addingId, setAddingId] = useState(null);
    const [selectedRole, setSelectedRole] = useState(program?.category === 'INTERNSHIP' ? "Mentor" : "Facilitator")
    const { showResponse } = useApiResponse()

    // Staff type based on program category
    const getStaffType = () => {
        if (program?.category === 'INTERNSHIP') {
            return {
                title: 'Mentors',
                endpoint: '/mentors',
                icon: <FaUserTie className="mr-2" />
            };
        } else {
            return {
                title: 'Facilitators, Assessors And Moderators',
                endpoint: '/staff',
                icon: <FaChalkboardTeacher className="mr-2" />
            };
        }
    };

    const staffType = getStaffType();

    useEffect(() => {
        if (show) fetchStaff();
    }, [show]);

    useEffect(() => {
        filterStaff();
    }, [searchTerm, staff]);

    const fetchStaff = async () => {
        setLoading(true);
        try {
            const result = await apiFetch(`${USERS}${staffType.endpoint}`);
            if (result?.payload) {
                setStaff(result.payload);
                setFilteredStaff(result.payload);
            }
        } catch {
            setResponse({ success: false, message: `Failed to fetch ${staffType.title.toLowerCase()}` });
        } finally {
            setLoading(false);
        }
    };

    const filterStaff = (role = selectedRole, term = searchTerm) => {
        const filtered = staff.filter(person => {
            const matchesRole = person.roles?.some(r =>
                r.toLowerCase().includes(role.toLowerCase())
            );

            const matchesSearch =
                !term ||
                `${person.firstname} ${person.lastname}`.toLowerCase().includes(term.toLowerCase()) ||
                person.email?.toLowerCase().includes(term.toLowerCase()) ||
                person.phone?.toLowerCase().includes(term.toLowerCase());

            return matchesRole && matchesSearch;
        });

        setFilteredStaff(filtered);
    };

    const handleRoleChange = (role) => {
        setSelectedRole(role);
        filterStaff(role);
    };

    const handleSelectStaff = (id) => {
        const newSet = new Set(selectedStaff);
        newSet.has(id) ? newSet.delete(id) : newSet.add(id);

        setSelectedStaff(newSet);
        setSelectAll(newSet.size === filteredStaff.length && filteredStaff.length > 0);
    };

    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedStaff(new Set());
        } else {
            setSelectedStaff(new Set(filteredStaff.map(person => person.id)));
        }
        setSelectAll(!selectAll);
    };

    const handleAddStaff = async (person) => {
        setAddingId(person.id);

        try {
            const result = await handleStaffOperation(PROGRAMSTAFF, {
                programId: program.id,
                userId: person.id,
                role: selectedRole?.toLocaleUpperCase(),
                isAssigned: isAssigned(person, program, selectedRole)
            });

            showResponse(result)
            setResponse(result);
            await fetchStaff();

            if (onSuccess) onSuccess();
        } catch (e) {
            setResponse({
                success: false,
                message: `Failed to add ${person?.name}: ` + e.message
            });
        } finally {
            setAddingId(null);
        }
    };

    const handleBulkAdd = async () => {
        if (selectedStaff.size === 0) return;

        setLoading(true);
        try {
            const result = await apiFetch(`${PROGRAMSTAFF}/bulk-assign`, {
                method: 'POST',
                body: {
                    programId: program.id,
                    userIds: Array.from(selectedStaff),
                    role: selectedRole?.toLocaleUpperCase()
                }
            });

            showResponse(result)
            setResponse(result);
            setSelectedStaff(new Set());
            setSelectAll(false);
            fetchStaff();

            if (onSuccess) onSuccess();
        } catch {
            setResponse({ success: false, message: `Bulk add ${staffType.title.toLowerCase()} failed` });
        } finally {
            setLoading(false);
        }
    };

    const handleBulkRemove = async () => {
        if (selectedStaff.size === 0) return;

        setLoading(true);
        try {
            const result = await bulkRemove(PROGRAMSTAFF, {
                programId: program.id,
                userIds: Array.from(selectedStaff),
                role: selectedRole?.toUpperCase()
            });

            showResponse(result)
            setResponse(result);
            setSelectedStaff(new Set());
            setSelectAll(false);
            fetchStaff();

            if (onSuccess) onSuccess();
        } catch {
            setResponse({ success: false, message: `Bulk remove failed` });
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setShow(false);
        setSelectedStaff(new Set());
        setSearchTerm('');
        setResponse(null);
        setSelectAll(false);
    };

    // Get status badge color
    const getStatusBadge = (status) => {
        const colors = {
            'ACTIVE': 'bg-green-100 text-green-800',
            'INACTIVE': 'bg-gray-100 text-gray-800',
            'PENDING': 'bg-yellow-100 text-yellow-800',
            'SUSPENDED': 'bg-red-100 text-red-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };




    return (
        <Modal show={show} onHide={handleClose} size="xl" centered backdrop="static">
            <Modal.Header closeButton className="border-b border-gray-200 px-6 py-4 bg-gradient-to-r from-gray-50 to-white">
                <Modal.Title className="text-xl font-semibold text-gray-800 flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${program?.category === 'INTERNSHIP' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'
                        }`}>
                        {staffType.icon}
                    </div>
                    <div>

                        <div>
                            {program?.category === 'INTERNSHIP' ? ' Add Mentor' : (
                                <Dropdown>
                                    <DropdownToggle variant='outline-primary' disabled={selectedRole === 'Mentor'} size='sm'>
                                        {`Add ${selectedRole}`}
                                    </DropdownToggle>

                                    <DropdownMenu>
                                        {['Facilitator', 'Assessor', 'Moderator'].map((role, key) => (
                                            <DropdownItem key={key} onClick={() => handleRoleChange(role)}>
                                                {`Add ${role}`}
                                            </DropdownItem>
                                        ))}
                                    </DropdownMenu>
                                </Dropdown>
                            )}
                        </div>

                        {program?.name && (
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-sm font-normal text-gray-500">to</span>
                                <span className="text-sm font-medium text-gray-700 px-2 py-0.5 bg-gray-100 rounded-md">
                                    {program.name}
                                </span>
                            </div>
                        )}
                    </div>
                </Modal.Title>
            </Modal.Header>

            <Modal.Body className="px-6 py-4">
                {/* Search */}
                <div className='mb-6 flex items-center gap-3'>
                    <div className="flex-1 relative">
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                        <input
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50 hover:bg-white"
                            placeholder={`Search ${staffType.title.toLowerCase()} by name, email or phone...`}
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
                ) : filteredStaff.length > 0 ? (
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
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredStaff.map(person => (
                                    <tr key={person.id} className="hover:bg-gray-300 transition">
                                        <td className="px-4 py-3">
                                            <Form.Check
                                                checked={selectedStaff.has(person.id)}
                                                onChange={() => handleSelectStaff(person.id)}
                                                className="cursor-pointer"
                                            />
                                        </td>
                                        <td className="px-4 py-3">
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">
                                                    {person.firstname} {person.lastname}
                                                </div>
                                                {person.idNumber && (
                                                    <div className="text-xs text-gray-500">ID: {person.idNumber}</div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div>
                                                <span className="block max-w-[100px] truncate text-sm text-gray-600">
                                                    {person.email}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-600">
                                            {person.contactNumber || '-'}
                                        </td>

                                        <td className="px-4 py-3 text-sm text-gray-600">

                                            <span>
                                                {person.roles?.find(r => r.toLowerCase() === selectedRole.toLowerCase()) || '-'}
                                            </span>

                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-md ${getStatusBadge(person.status)}`}>
                                                {person.status || 'ACTIVE'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <Button
                                                onClick={() => handleAddStaff(person)}
                                                disabled={!person?.active}
                                                variant={isAssigned(person, program, selectedRole) ? 'danger' : 'success'}
                                                size='sm'
                                                className="w-full rounded-md hover:text-white text-white font-medium"
                                            >
                                                {isAssigned(person, program, selectedRole) ? 'Remove' : `ADD ${person?.roles.find(r => r.toLowerCase().includes(selectedRole.toLowerCase()))}`}
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
                        <p className="text-gray-500">No {staffType.title.toLowerCase()} found</p>
                        <p className="text-gray-400 text-sm mt-1">
                            No {staffType.title.toLowerCase()} are available to add to this program
                        </p>
                    </div>
                )}
            </Modal.Body>

            <Modal.Footer className="border-t border-gray-200 px-6 py-4">
                <div className="w-full flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                        {selectedStaff.size} selected
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
                            disabled={selectedStaff.size === 0}
                            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                            Remove All ({selectedStaff.size})
                        </button>

                        <button
                            onClick={handleBulkAdd}
                            disabled={selectedStaff.size === 0}
                            className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                            Add Selected
                        </button>
                    </div>
                </div>
            </Modal.Footer>
        </Modal>
    );
}