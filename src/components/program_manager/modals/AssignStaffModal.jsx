import { apiFetch } from '@/api/api';
import ResponseMessage from '@/components/common/ResponseMessage';
import { useApiResponse } from '@/contexts/ApiResponseContext';
import { PROGRAMSTAFF, USERS } from '@/utils/apiEndpoint';
import { useEffect, useState } from 'react';
import { FaChalkboardTeacher, FaSearch, FaUserTie, FaUsers } from 'react-icons/fa';
import { X } from 'lucide-react';
import {
  bulkRemove,
  handleStaffOperation,
  isAssigned,
} from '../service/ProgramStaffService';

const ROLE_OPTIONS = ['Facilitator', 'Assessor', 'Moderator'];

export default function AssignStaffModal({ show, setShow, program }) {
  const [loading, setLoading] = useState(false);
  const [staff, setStaff] = useState([]);
  const [filteredStaff, setFilteredStaff] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [response, setResponse] = useState(null);
  const [selectAll, setSelectAll] = useState(false);
  const [addingId, setAddingId] = useState(null);
  const { showResponse } = useApiResponse();

  const isInternship = program?.category === 'INTERNSHIP';
  const [selectedRole, setSelectedRole] = useState(
    isInternship ? 'Mentor' : 'Facilitator'
  );

  const staffLabel = isInternship ? 'Mentors' : 'Staff';

  useEffect(() => {
    if (show) fetchStaff();
  }, [show]);

  useEffect(() => {
    filterStaff();
  }, [searchTerm, staff, selectedRole]);

  async function fetchStaff() {
    setLoading(true);
    try {
      const endpoint = isInternship ? '/mentors' : '/staff';
      const result = await apiFetch(`${USERS}${endpoint}`);
      if (result?.payload) {
        setStaff(result.payload);
        setFilteredStaff(result.payload);
      }
    } catch {
      setResponse({ success: false, message: `Failed to fetch ${staffLabel.toLowerCase()}.` });
    } finally {
      setLoading(false);
    }
  }

  function filterStaff() {
    const role = selectedRole.toLowerCase();
    const term = searchTerm.toLowerCase();
    setFilteredStaff(
      staff.filter((person) => {
        const matchesRole = isInternship
          ? person.roles?.some((r) => r.toLowerCase().includes('mentor'))
          : person.roles?.some((r) => r.toLowerCase().includes(role));

        const matchesSearch =
          !term ||
          `${person.firstname} ${person.lastname}`.toLowerCase().includes(term) ||
          person.email?.toLowerCase().includes(term) ||
          person.phone?.toLowerCase().includes(term);

        return matchesRole && matchesSearch;
      })
    );
  }

  function handleSelectStaff(id) {
    const next = new Set(selectedStaff);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedStaff(next);
    setSelectAll(next.size === filteredStaff.length && filteredStaff.length > 0);
  }

  function handleSelectAll() {
    if (selectAll) setSelectedStaff(new Set());
    else setSelectedStaff(new Set(filteredStaff.map((p) => p.id)));
    setSelectAll(!selectAll);
  }

  async function handleAddStaff(person) {
    setAddingId(person.id);
    try {
      const result = await handleStaffOperation(PROGRAMSTAFF, {
        programId: program.id,
        userId: person.id,
        role: selectedRole?.toUpperCase(),
        isAssigned: isAssigned(person, program, selectedRole),
      });
      showResponse(result);
      setResponse(result);
      await fetchStaff();
    } catch (e) {
      setResponse({
        success: false,
        message: 'Failed to assign: ' + e.message,
      });
    } finally {
      setAddingId(null);
    }
  }

  async function handleBulkAdd() {
    if (selectedStaff.size === 0) return;
    setLoading(true);
    try {
      const result = await apiFetch(`${PROGRAMSTAFF}/bulk-assign`, {
        method: 'POST',
        body: {
          programId: program.id,
          userIds: Array.from(selectedStaff),
          role: selectedRole?.toUpperCase(),
        },
      });
      showResponse(result);
      setResponse(result);
      setSelectedStaff(new Set());
      setSelectAll(false);
      fetchStaff();
    } catch {
      setResponse({ success: false, message: 'Bulk assign failed.' });
    } finally {
      setLoading(false);
    }
  }

  async function handleBulkRemove() {
    if (selectedStaff.size === 0) return;
    setLoading(true);
    try {
      const result = await bulkRemove(PROGRAMSTAFF, {
        programId: program.id,
        userIds: Array.from(selectedStaff),
        role: selectedRole?.toUpperCase(),
      });
      showResponse(result);
      setResponse(result);
      setSelectedStaff(new Set());
      setSelectAll(false);
      fetchStaff();
    } catch {
      setResponse({ success: false, message: 'Bulk remove failed.' });
    } finally {
      setLoading(false);
    }
  }

  function handleClose() {
    setShow(false);
    setSelectedStaff(new Set());
    setSearchTerm('');
    setResponse(null);
    setSelectAll(false);
  }

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col overflow-hidden">

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 sm:px-6 py-4 border-b border-zinc-200 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 bg-zinc-100 rounded-lg flex items-center justify-center shrink-0">
              {isInternship ? (
                <FaUserTie className="text-zinc-700" />
              ) : (
                <FaChalkboardTeacher className="text-zinc-700" />
              )}
            </div>
            <div className="min-w-0">
              <h2 className="font-bold text-zinc-900 truncate">
                Assign {isInternship ? 'mentor' : 'staff'}
              </h2>
              {program?.name && (
                <p className="text-xs text-zinc-500 truncate">{program.name}</p>
              )}
            </div>
          </div>

          {!isInternship && (
            <div className="flex flex-wrap gap-1.5">
              {ROLE_OPTIONS.map((role) => (
                <button
                  key={role}
                  onClick={() => setSelectedRole(role)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                    selectedRole === role
                      ? 'bg-[#E30613] text-white'
                      : 'bg-white border border-zinc-300 text-zinc-700 hover:border-zinc-400'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          )}

          <button
            onClick={handleClose}
            className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors shrink-0 self-end sm:self-auto"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        <div className="px-4 sm:px-6 py-4 border-b border-zinc-100 shrink-0">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-3.5 h-3.5" />
              <input
                type="text"
                placeholder={`Search ${staffLabel.toLowerCase()} by name, email or phone…`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-zinc-300 rounded-lg focus:border-[#E30613] outline-none transition-colors"
              />
            </div>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="px-4 py-2 text-sm font-medium text-zinc-600 bg-white border border-zinc-300 rounded-lg hover:border-zinc-400 transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4">
          <ResponseMessage response={response} setResponse={setResponse} />

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-7 w-7 border-2 border-zinc-200 border-t-[#E30613]" />
              <p className="mt-3 text-sm text-zinc-500">Loading…</p>
            </div>
          ) : filteredStaff.length > 0 ? (
            <>
              <div className="hidden md:block overflow-x-auto border border-zinc-200 rounded-lg">
                <table className="w-full text-sm">
                  <thead className="bg-zinc-50 sticky top-0 z-10 border-b border-zinc-200">
                    <tr>
                      <th className="text-left px-4 py-3 w-10">
                        <input
                          type="checkbox"
                          checked={selectAll}
                          onChange={handleSelectAll}
                          className="w-4 h-4 rounded border-zinc-300 text-[#E30613] focus:ring-[#E30613] cursor-pointer"
                        />
                      </th>
                      {['Name', 'Email', 'Phone', 'Role', 'Status', ''].map((h) => (
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
                    {filteredStaff.map((person) => {
                      const assigned = isAssigned(person, program, selectedRole);
                      return (
                        <tr
                          key={person.id}
                          className="hover:bg-red-50/30 transition-colors"
                        >
                          <td className="px-4 py-3">
                            <input
                              type="checkbox"
                              checked={selectedStaff.has(person.id)}
                              onChange={() => handleSelectStaff(person.id)}
                              className="w-4 h-4 rounded border-zinc-300 text-[#E30613] focus:ring-[#E30613] cursor-pointer"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="w-8 h-8 rounded-full bg-zinc-100 text-zinc-700 text-[10px] font-bold flex items-center justify-center shrink-0">
                                {(person.firstname?.[0] || '') + (person.lastname?.[0] || '')}
                              </div>
                              <div className="font-bold text-zinc-900 truncate">
                                {person.firstname} {person.lastname}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-zinc-600 truncate max-w-[200px]">
                            {person.email}
                          </td>
                          <td className="px-4 py-3 text-zinc-600 whitespace-nowrap">
                            {person.contactNumber || '—'}
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-[10px] font-bold bg-zinc-100 text-zinc-600 px-2 py-1 rounded uppercase tracking-wider">
                              {person.roles?.find(
                                (r) =>
                                  r.toLowerCase() === selectedRole.toLowerCase()
                              ) || '—'}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-[10px] font-bold bg-zinc-100 text-zinc-700 px-2 py-1 rounded uppercase tracking-wider">
                              {person.status || 'ACTIVE'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button
                              onClick={() => handleAddStaff(person)}
                              disabled={!person?.active || addingId === person.id}
                              className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                                assigned
                                  ? 'text-[#E30613] bg-red-50 hover:bg-red-100'
                                  : 'text-white bg-[#E30613] hover:bg-[#c00511]'
                              } disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                              {addingId === person.id
                                ? '…'
                                : assigned
                                ? 'Remove'
                                : `Assign ${selectedRole}`}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="md:hidden divide-y divide-zinc-100 border border-zinc-200 rounded-lg overflow-hidden">
                {filteredStaff.map((person) => {
                  const assigned = isAssigned(person, program, selectedRole);
                  return (
                    <div key={person.id} className="p-3">
                      <div className="flex items-start gap-3 mb-3">
                        <input
                          type="checkbox"
                          checked={selectedStaff.has(person.id)}
                          onChange={() => handleSelectStaff(person.id)}
                          className="mt-1 w-4 h-4 rounded border-zinc-300 text-[#E30613] focus:ring-[#E30613] cursor-pointer shrink-0"
                        />
                        <div className="w-9 h-9 rounded-full bg-zinc-100 text-zinc-700 text-xs font-bold flex items-center justify-center shrink-0">
                          {(person.firstname?.[0] || '') + (person.lastname?.[0] || '')}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-zinc-900 truncate">
                            {person.firstname} {person.lastname}
                          </div>
                          <div className="text-xs text-zinc-500 truncate mt-0.5">
                            {person.email}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pl-12">
                        <span className="text-[10px] font-bold bg-zinc-100 text-zinc-600 px-2 py-1 rounded uppercase tracking-wider">
                          {person.status || 'ACTIVE'}
                        </span>
                        <button
                          onClick={() => handleAddStaff(person)}
                          disabled={!person?.active || addingId === person.id}
                          className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${
                            assigned
                              ? 'text-[#E30613] bg-red-50'
                              : 'text-white bg-[#E30613]'
                          } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          {addingId === person.id
                            ? '…'
                            : assigned
                            ? 'Remove'
                            : `Assign ${selectedRole}`}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <div className="w-14 h-14 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaUsers className="text-zinc-400 text-xl" />
              </div>
              <p className="text-sm text-zinc-500">
                No {staffLabel.toLowerCase()} available.
              </p>
            </div>
          )}
        </div>

        <div className="border-t border-zinc-200 bg-zinc-50 px-4 sm:px-6 py-4 shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <span className="text-xs sm:text-sm text-zinc-600 text-center sm:text-left">
              {selectedStaff.size > 0
                ? `${selectedStaff.size} selected`
                : 'Select to bulk action'}
            </span>

            <div className="flex flex-wrap gap-2 justify-center sm:justify-end">
              <button
                onClick={handleClose}
                className="px-4 py-2 text-sm font-medium text-zinc-700 bg-white border border-zinc-300 rounded-lg hover:border-zinc-400 transition-colors"
              >
                Close
              </button>

              {selectedStaff.size > 0 && (
                <>
                  <button
                    onClick={handleBulkRemove}
                    disabled={loading}
                    className="px-4 py-2 text-sm font-semibold text-[#E30613] bg-white border border-red-200 rounded-lg hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Remove ({selectedStaff.size})
                  </button>

                  <button
                    onClick={handleBulkAdd}
                    disabled={loading}
                    className="px-4 py-2 text-sm font-semibold text-white bg-[#E30613] rounded-lg hover:bg-[#c00511] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Assign selected
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}