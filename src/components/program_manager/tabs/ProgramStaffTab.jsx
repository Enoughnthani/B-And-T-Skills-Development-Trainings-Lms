

import { useEffect, useState } from "react";
import { Form, Button, Dropdown } from "react-bootstrap";
import { FaSearch, FaPlus, FaUsers, FaUserPlus, FaChalkboardTeacher } from "react-icons/fa";
import { Trash2 } from "lucide-react";
import ResponseMessage from "@/components/common/ResponseMessage";
import { BsThreeDots } from "react-icons/bs";
import RoleContent from "@/components/common/RoleContent";
import { PROGRAMSTAFF } from "@/utils/apiEndpoint";
import { bulkRemove, handleStaffOperation } from "../service/ProgramStaffService";
import { useTopLoader } from "@/contexts/TopLoaderContext";
import { isAssigned } from "../service/ProgramStaffService"


export default function ProgramStaffTab({
    program,
    setProgram,
    onAddStaff
}) {
    const [response, setResponse] = useState(null);
    const [selectAll, setSelectAll] = useState(false);
    const [assignedStaff, setAssignedStaff] = useState(program?.programStaff)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedStaff, setSelectedStaff] = useState(new Set());
    const [selectedRoles, setSelectedRoles] = useState([]);
    const { start, complete } = useTopLoader()


    useEffect(() => {
        setAssignedStaff(program?.programStaff)
    }, [program])


    const handleSelectStaff = (staff) => {
        const newSelected = new Set(selectedStaff);
        const staffId = staff.id;
        if (newSelected.has(staffId)) {
            newSelected.delete(staffId);
        } else {
            newSelected.add(staffId);
        }
        setSelectedRoles(role)
        setSelectedStaff(newSelected);
        setSelectAll(newSelected.size === assignedStaff.length);
    };

    // Handle select all
    const handleSelectAllStaff = () => {
        if (selectAll) {
            setSelectedStaff(new Set());
        } else {
            setSelectedStaff(new Set(assignedStaff.map(s => s.id)));
        }
        setSelectAll(!selectAll);
    };



    const handleBulkRemove = async () => {
        if (selectedStaff.size === 0) return;

        start()
        try {
            const result = await bulkRemove(PROGRAMSTAFF, {
                programId: program.id,
                userIds: Array.from(selectedStaff),
            });

            setResponse(result);
            setSelectedStaff(new Set());
            setSelectAll(false);
            setProgram(result?.payload)

        } catch (e) {
            setResponse({ success: false, message: `Bulk remove failed ` + e.message });
        } finally {
            complete()
        }
    };

    const unAssignRole = async (person, role) => {
        try {

            const result = await handleStaffOperation(PROGRAMSTAFF, {
                programId: program.id,
                userId: person.id,
                role: role?.toUpperCase() ?? null,
                isAssigned: role ? isAssigned(person, program, role) : true
            });

            setResponse(result);

            if (result?.success) {
                setProgram(result?.payload)
            }

        } catch (e) {
            setResponse({
                success: false,
                message: `Failed to unassign role ${person?.name}: ` + e.message
            });
        } finally {
        }
    };


    // Format date helper
    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString();
    };

    const getDropdownItemStyle = (role) => {
        switch (role?.toUpperCase()) {
            case "FACILITATOR":
                return "text-blue-600 hover:bg-blue-600 hover:text-white";

            case "ASSESSOR":
                return "text-emerald-600 hover:bg-emerald-600 hover:text-white";

            case "MODERATOR":
                return "text-amber-600 hover:bg-amber-600 hover:text-white";

            default:
                return "text-gray-600 hover:bg-gray-600 hover:text-white";
        }
    };

    return (
        <div className="p-6 lg:p-8">
            <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                    Program {program.category === 'INTERNSHIP' ? 'Mentors' : 'Staff'} ({assignedStaff.length})
                </h3>
                <div className="flex gap-3 w-50">
                    <div className="relative w-full">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Form.Control
                            type="text"
                            placeholder="Search staff..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                </div>
            </div>

            <ResponseMessage response={response} setResponse={setResponse} />

            {assignedStaff.length > 0 ? (
                <div >
                    {selectedStaff?.size > 0 && (
                        <div className='flex justify-end px-4 mb-3'>
                            <Button
                                size='sm'
                                className='px-3'
                                variant='danger'
                                onClick={handleBulkRemove}
                            >
                                {`${program.category === "INTERNSHIP" ? 'Unassign' : 'Remove'} All (${selectedStaff?.size})`}
                            </Button>
                        </div>
                    )}
                    <table className="w-full">
                        <thead className="bg-white border-b border-gray-200">
                            <tr>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                                    <Form.Check
                                        checked={selectAll}
                                        onChange={handleSelectAllStaff}
                                    />
                                </th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Staff Name</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Email</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Roles</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 truncate">Assigned Date</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {assignedStaff
                                .filter(staff =>
                                    (staff.firstname + ' ' + staff.lastname).toLowerCase().includes(searchTerm.toLowerCase())
                                )
                                .map((staff) => {
                                    const assignedRoles = staff.assignedRoles[program.id]
                                    return (
                                        <tr key={staff.id} className="border-0 hover:bg-gray-200 rounded-xl">
                                            <td className="py-3 px-4">
                                                <Form.Check
                                                    checked={selectedStaff?.has(staff.id)}
                                                    onChange={() => handleSelectStaff(staff)}
                                                />
                                            </td>
                                            <td className="py-3 px-4 font-medium text-gray-900">
                                                <div className="flex items-center gap-2">
                                                    <span className="truncate w-[150px]">{staff.firstname} {staff.lastname}</span>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className="block w-[150px] truncate text-gray-600">
                                                    {staff.email}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4">
                                                <RoleContent roles={assignedRoles} />
                                            </td>

                                            <td className="py-3 px-4 text-gray-600">
                                                {staff.asiggnedDate ? formatDate(staff.asiggnedDate) : '-'}
                                            </td>
                                            <td className="py-3 px-4">
                                                <Dropdown>
                                                    <Dropdown.Toggle variant="primary" size="sm">
                                                        Actions
                                                    </Dropdown.Toggle>

                                                    <Dropdown.Menu className="shadow-lg border-0 rounded-lg p-2">

                                                        {assignedRoles?.length > 1 && (
                                                            <>
                                                                {assignedRoles.map((role) => (
                                                                    <Dropdown.Item
                                                                        key={role}
                                                                        onClick={() => unAssignRole(staff, role)}
                                                                        className={getDropdownItemStyle(role) + " text-lowercase text-sm mb-1 rounded-md font-medium"}
                                                                    >
                                                                        Unassign {role} role
                                                                    </Dropdown.Item>
                                                                ))}
                                                                <Dropdown.Divider />
                                                            </>
                                                        )}

                                                        <Dropdown.Item
                                                            onClick={() => unAssignRole(staff, null)}
                                                            className="text-red-700 text-lowercase hover:bg-red-700 font-semibold hover:text-white rounded-md"
                                                        >
                                                            Unassign {staff.firstname}
                                                        </Dropdown.Item>

                                                    </Dropdown.Menu>
                                                </Dropdown>
                                            </td>
                                        </tr>

                                    )
                                })}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="text-center py-12">
                    <FaChalkboardTeacher className="text-gray-300 text-5xl mx-auto mb-4" />
                    <p className="text-gray-500">No {program.category === 'INTERNSHIP' ? 'mentors' : 'staff'} assigned yet</p>
                    <button
                        onClick={onAddStaff}
                        className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        <FaPlus /> Add First {program.category === 'INTERNSHIP' ? 'Mentor' : 'Staff Member'}
                    </button>
                </div>
            )}
        </div>
    );
}