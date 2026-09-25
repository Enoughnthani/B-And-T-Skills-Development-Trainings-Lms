import ResponseMessage from '@/components/common/ResponseMessage';
import RoleContent from '@/components/common/RoleContent';
import { useTopLoader } from '@/contexts/TopLoaderContext';
import { PROGRAMSTAFF } from '@/utils/apiEndpoint';
import { Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import {
  FaChalkboardTeacher,
  FaPlus,
  FaSearch,
} from 'react-icons/fa';
import {
  bulkRemove,
  handleStaffOperation,
  isAssigned,
} from '../service/ProgramStaffService';

export default function ProgramStaffTab({ program, setProgram, onAddStaff }) {
  const [response, setResponse] = useState(null);
  const [selectAll, setSelectAll] = useState(false);
  const [assignedStaff, setAssignedStaff] = useState(program?.programStaff || []);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStaff, setSelectedStaff] = useState(new Set());
  const { start, complete } = useTopLoader();

  const isInternship = program?.category === 'INTERNSHIP';
  const staffLabel = isInternship ? 'Mentor' : 'Staff member';
  const staffLabelPlural = isInternship ? 'Mentors' : 'Staff';

  useEffect(() => {
    setAssignedStaff(program?.programStaff || []);
  }, [program]);

  function handleSelectStaff(staff) {
    const next = new Set(selectedStaff);
    if (next.has(staff.id)) next.delete(staff.id);
    else next.add(staff.id);
    setSelectedStaff(next);
    setSelectAll(next.size === assignedStaff.length && assignedStaff.length > 0);
  }

  function handleSelectAll() {
    if (selectAll) {
      setSelectedStaff(new Set());
    } else {
      setSelectedStaff(new Set(assignedStaff.map((s) => s.id)));
    }
    setSelectAll(!selectAll);
  }

  async function handleBulkRemove() {
    if (selectedStaff.size === 0) return;
    start();
    try {
      const result = await bulkRemove(PROGRAMSTAFF, {
        programId: program.id,
        userIds: Array.from(selectedStaff),
      });
      setResponse(result);
      setSelectedStaff(new Set());
      setSelectAll(false);
      setProgram(result?.payload);
    } catch (e) {
      setResponse({ success: false, message: 'Bulk remove failed: ' + e.message });
    } finally {
      complete();
    }
  }

  async function unAssignRole(person, role) {
    try {
      const result = await handleStaffOperation(PROGRAMSTAFF, {
        programId: program.id,
        userId: person.id,
        role: role?.toUpperCase() ?? null,
        isAssigned: role ? isAssigned(person, program, role) : true,
      });
      setResponse(result);
      if (result?.success) setProgram(result?.payload);
    } catch (e) {
      setResponse({
        success: false,
        message: `Failed to unassign: ${e.message}`,
      });
    }
  }

  function formatDate(dateString) {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('en-ZA', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }

  const filtered = assignedStaff.filter((staff) =>
    `${staff.firstname} ${staff.lastname}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8">

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
        <h3 className="text-base font-bold text-zinc-900">
          {staffLabelPlural}{' '}
          <span className="text-zinc-400 font-medium">({assignedStaff.length})</span>
        </h3>

        <div className="relative w-full sm:w-72">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-3.5 h-3.5" />
          <input
            type="text"
            placeholder={`Search ${staffLabelPlural.toLowerCase()}…`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-zinc-300 rounded-lg focus:border-[#E30613] outline-none transition-colors"
          />
        </div>
      </div>

      <ResponseMessage response={response} setResponse={setResponse} />

      {assignedStaff.length > 0 ? (
        <>
          {selectedStaff.size > 0 && (
            <div className="flex items-center justify-between gap-3 mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <span className="text-sm font-bold text-[#E30613]">
                {selectedStaff.size} selected
              </span>
              <button
                onClick={handleBulkRemove}
                className="inline-flex items-center gap-2 bg-[#E30613] hover:bg-[#c00511] text-white font-semibold text-xs px-3.5 py-2 rounded-lg transition-colors"
              >
                <Trash2 size={12} />
                {isInternship ? 'Unassign' : 'Remove'} {selectedStaff.size}
              </button>
            </div>
          )}

          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-zinc-50 border-b border-zinc-200">
                <tr>
                  <th className="text-left px-4 py-3 w-10">
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={handleSelectAll}
                      className="w-4 h-4 rounded border-zinc-300 text-[#E30613] focus:ring-[#E30613] cursor-pointer"
                    />
                  </th>
                  {['Name', 'Email', 'Roles', 'Assigned', ''].map((h) => (
                    <th
                      key={h}
                      className="text-left px-4 py-3 text-xs font-bold text-zinc-600 uppercase tracking-wider whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {filtered.map((staff) => {
                  const assignedRoles = staff.assignedRoles?.[program.id] || [];
                  return (
                    <tr
                      key={staff.id}
                      className="hover:bg-red-50/30 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedStaff.has(staff.id)}
                          onChange={() => handleSelectStaff(staff)}
                          className="w-4 h-4 rounded border-zinc-300 text-[#E30613] focus:ring-[#E30613] cursor-pointer"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-full bg-zinc-100 text-zinc-700 text-[10px] font-bold flex items-center justify-center shrink-0">
                            {(staff.firstname?.[0] || '') + (staff.lastname?.[0] || '')}
                          </div>
                          <div className="font-bold text-zinc-900 truncate">
                            {staff.firstname} {staff.lastname}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-zinc-600 truncate max-w-[200px]">
                        {staff.email}
                      </td>
                      <td className="px-4 py-3">
                        <RoleContent roles={assignedRoles} />
                      </td>
                      <td className="px-4 py-3 text-zinc-600 whitespace-nowrap">
                        {staff.assignedDate ? formatDate(staff.assignedDate) : '—'}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Dropdown align="end">
                          <Dropdown.Toggle
                            size="sm"
                            className="!bg-white !border !border-zinc-300 !text-zinc-700 hover:!border-zinc-400 hover:!bg-zinc-50 !text-xs !font-medium !px-3 !py-1.5 !rounded-lg !shadow-none"
                          >
                            Actions
                          </Dropdown.Toggle>
                          <Dropdown.Menu className="min-w-[200px] border border-zinc-200 rounded-lg shadow-lg py-1">
                            {assignedRoles.length > 1 &&
                              assignedRoles.map((role) => (
                                <Dropdown.Item
                                  key={role}
                                  onClick={() => unAssignRole(staff, role)}
                                  className="text-sm text-zinc-700 hover:!bg-zinc-50 py-2 px-3 rounded-md mx-1"
                                >
                                  Unassign {role.toLowerCase()} role
                                </Dropdown.Item>
                              ))}

                            {assignedRoles.length > 1 && <Dropdown.Divider />}

                            <Dropdown.Item
                              onClick={() => unAssignRole(staff, null)}
                              className="text-sm font-medium text-[#E30613] hover:!bg-red-50 py-2 px-3 rounded-md mx-1"
                            >
                              Unassign from programme
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="md:hidden divide-y divide-zinc-100">
            {filtered.map((staff) => {
              const assignedRoles = staff.assignedRoles?.[program.id] || [];
              return (
                <div key={staff.id} className="py-3">
                  <div className="flex items-start gap-3 mb-2">
                    <input
                      type="checkbox"
                      checked={selectedStaff.has(staff.id)}
                      onChange={() => handleSelectStaff(staff)}
                      className="mt-1 w-4 h-4 rounded border-zinc-300 text-[#E30613] focus:ring-[#E30613] cursor-pointer shrink-0"
                    />
                    <div className="w-9 h-9 rounded-full bg-zinc-100 text-zinc-700 text-xs font-bold flex items-center justify-center shrink-0">
                      {(staff.firstname?.[0] || '') + (staff.lastname?.[0] || '')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-zinc-900 truncate">
                        {staff.firstname} {staff.lastname}
                      </div>
                      <div className="text-xs text-zinc-500 truncate mt-0.5">
                        {staff.email}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 pl-12">
                    <RoleContent roles={assignedRoles} />
                    <Dropdown align="end">
                      <Dropdown.Toggle
                        size="sm"
                        className="!bg-white !border !border-zinc-300 !text-zinc-700 hover:!border-zinc-400 !text-xs !font-medium !px-3 !py-1.5 !rounded-lg !shadow-none"
                      >
                        Actions
                      </Dropdown.Toggle>
                      <Dropdown.Menu className="min-w-[200px] border border-zinc-200 rounded-lg shadow-lg py-1">
                        {assignedRoles.length > 1 &&
                          assignedRoles.map((role) => (
                            <Dropdown.Item
                              key={role}
                              onClick={() => unAssignRole(staff, role)}
                              className="text-sm text-zinc-700 hover:!bg-zinc-50 py-2 px-3 rounded-md mx-1"
                            >
                              Unassign {role.toLowerCase()} role
                            </Dropdown.Item>
                          ))}
                        {assignedRoles.length > 1 && <Dropdown.Divider />}
                        <Dropdown.Item
                          onClick={() => unAssignRole(staff, null)}
                          className="text-sm font-medium text-[#E30613] hover:!bg-red-50 py-2 px-3 rounded-md mx-1"
                        >
                          Unassign from programme
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <div className="w-14 h-14 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaChalkboardTeacher className="text-zinc-400 text-xl" />
          </div>
          <h3 className="font-bold text-zinc-900 mb-1">
            No {staffLabelPlural.toLowerCase()} assigned yet
          </h3>
          <p className="text-sm text-zinc-500 mb-5">
            Assign your first {staffLabel.toLowerCase()} to this programme.
          </p>
          <button
            onClick={onAddStaff}
            className="inline-flex items-center gap-2 bg-[#E30613] hover:bg-[#c00511] text-white font-semibold text-sm px-5 py-2.5 rounded-lg transition-colors"
          >
            <FaPlus size={12} />
            Add first {staffLabel}
          </button>
        </div>
      )}
    </div>
  );
}