import ResponseMessage from "@/components/common/ResponseMessage";
import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { FaSearch, FaUserPlus, FaUsers } from "react-icons/fa";
import { bulkRemoveEnrollment, enrollLearner } from "../service/EnrollmenetService";


export default function EnrolledUsersTab({ program, setProgram, openEnrollModal, formatDate, fetchProgram }) {

    const [response, setResponse] = useState(null)
    const [enrolledUsers, setEnrolledUsers] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState(new Set());
    const [searchTerm, setSearchTerm] = useState('');
    const [loading,setLoading] = useState(false);


    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedUsers(new Set());
        } else {
            setSelectedUsers(new Set(enrolledUsers.map(user => user.id)));
        }
        setSelectAll(!selectAll);
    };

    const handleRemove = async (learner) => {
        try {
            const result = await enrollLearner(learner, program.id);
            setResponse(result);
            setProgram(result?.payload)
        } catch (e) {
            setResponse({ success: false, message: "Failed to remove " + e.message });
        }
    };

    const handleBulkRemove = async () => {
        if (selectedUsers.size === 0) return;

        setLoading(true);
        try {
            const result = await bulkRemoveEnrollment(program.id, Array.from(selectedUsers));
            setResponse(result);
            setSelectedUsers(new Set());
            setSelectAll(false);
            setProgram(result?.payload)
        } catch(e) {
            setResponse({ success: false, message: "Bulk remove failed "+e.message });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setEnrolledUsers(program?.enrollmentData)
    }, [program])

    return (<div className="p-6 lg:p-8">
        <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
                Enrolled {program.category === 'INTERNSHIP' ? 'Interns' : 'Learners'} ({enrolledUsers.length})
            </h3>
            <div className="flex gap-3 w-50">
                <div className="relative w-full">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Form.Control
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9"
                    />
                </div>
            </div>
        </div>

        <ResponseMessage response={response} setResponse={setResponse} />

        {enrolledUsers.length > 0 ? (
            <div className="overflow-x-auto">
                {selectedUsers?.size > 0 && (
                    <div className='flex justify-end px-4'>
                        <Button
                            onClick={handleBulkRemove}
                            size='sm'
                            className='px-3'
                            variant='danger'
                        >
                            {`Remove All (${selectedUsers?.size})`}
                        </Button>
                    </div>
                )}
                <table className="w-full">
                    <thead className="bg-white border-b border-gray-200">
                        <tr>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                                <Form.Check
                                    checked={selectAll}
                                    onChange={handleSelectAll}
                                />
                            </th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">user Name</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Email</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Phone</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 truncate">Enrollment Date</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {enrolledUsers.filter(s => (s.firstname + ' ' + s.lastname).toLowerCase().includes(searchTerm.toLowerCase())).map((user, idx) => (
                            <tr key={idx} className="border-0 hover:bg-gray-200 rounded-xl">
                                <td className="py-3 px-4 font-medium text-gray-900 truncate">
                                    <Form.Check
                                        checked={selectedUsers.has(user.id)}
                                        onChange={() => handleSelectUser(user.id)}
                                    />
                                </td>
                                <td className="py-3 px-4 font-medium text-gray-900 truncate">{user.firstname} {user.lastname}</td>
                                <td className="py-3 px-4">
                                    <span className="block w-[150px] truncate text-gray-600">
                                        {user.email}
                                    </span>
                                </td>
                                <td className="py-3 px-4 text-gray-600">{user.contactNumber || '-'}</td>
                                <td className="py-3 px-4 text-gray-600 truncate">{formatDate(user.enrollmentDate)}</td>
                                <td className="py-3 px-4">
                                    <div className="flex gap-2">
                                        <Button
                                            size='sm'
                                            variant='danger'
                                            onClick={() => handleRemove(user)}
                                            className="flex items-center gap-1 rounded">
                                            Remove
                                            <Trash2 size={20} />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        ) : (
            <div className="text-center py-12">
                <FaUsers className="text-gray-300 text-5xl mx-auto mb-4" />
                <p className="text-gray-500">No {program.category === 'INTERNSHIP' ? 'interns' : 'learners'} enrolled yet</p>
                <button
                    onClick={openEnrollModal}
                    className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                    <FaUserPlus /> Enroll First {program.category === 'INTERNSHIP' ? 'Intern' : 'Learner'}
                </button>
            </div>
        )}
    </div>
    )
}