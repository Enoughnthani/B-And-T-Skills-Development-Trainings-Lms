import { apiFetch } from '@/api/api';
import ResponseMessage from '@/components/common/ResponseMessage';
import { useApiResponse } from '@/contexts/ApiResponseContext';
import { ENROLLMENT, PROGRAMS } from '@/utils/apiEndpoint';
import { useEffect, useState } from 'react';
import { FaSearch, FaUsers } from 'react-icons/fa';
import { enrollLearner, bulkRemoveEnrollment } from '../service/EnrollmenetService';

export default function EnrollLearnersModal({ show, setShow, program }) {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [filteredLearners, setFilteredLearners] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [response, setResponse] = useState(null);
  const [selectAll, setSelectAll] = useState(false);
  const [enrollingId, setEnrollingId] = useState(null);
  const { showResponse } = useApiResponse();

  const isInternship = program?.category === 'INTERNSHIP';
  const userLabel = isInternship ? 'Intern' : 'Learner';
  const userLabelPlural = isInternship ? 'Interns' : 'Learners';

  useEffect(() => {
    if (show) fetchLearners();
  }, [show]);

  useEffect(() => {
    filterLearners();
  }, [searchTerm, users]);

  async function fetchLearners() {
    setLoading(true);
    try {
      const result = await apiFetch(`${PROGRAMS}/${program.id}/candidates`);
      if (result?.payload) {
        setUsers(result.payload);
        setFilteredLearners(result.payload);
      }
    } catch {
      setResponse({ success: false, message: 'Failed to fetch users.' });
    } finally {
      setLoading(false);
    }
  }

  function filterLearners() {
    if (!searchTerm) return setFilteredLearners(users);
    const term = searchTerm.toLowerCase();
    setFilteredLearners(
      users.filter(
        (u) =>
          `${u.firstname} ${u.lastname}`.toLowerCase().includes(term) ||
          u.email?.toLowerCase().includes(term) ||
          u.idNo?.toLowerCase().includes(term)
      )
    );
  }

  function handleSelectLearner(id) {
    const next = new Set(selectedUsers);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedUsers(next);
    setSelectAll(next.size === filteredLearners.length && filteredLearners.length > 0);
  }

  function handleSelectAll() {
    if (selectAll) setSelectedUsers(new Set());
    else setSelectedUsers(new Set(filteredLearners.map((u) => u.id)));
    setSelectAll(!selectAll);
  }

  async function handleEnroll(learner) {
    setEnrollingId(learner.id);
    try {
      const result = await enrollLearner(learner, program.id);
      showResponse(result);
      setResponse(result);
      fetchLearners();
    } catch {
      setResponse({ success: false, message: 'Enrolment failed.' });
    } finally {
      setEnrollingId(null);
    }
  }

  async function handleBulkEnroll() {
    if (selectedUsers.size === 0) return;
    setLoading(true);
    try {
      const result = await apiFetch(`${ENROLLMENT}/bulk/enroll`, {
        method: 'POST',
        body: { programId: program.id, userIds: Array.from(selectedUsers) },
      });
      showResponse(result);
      setResponse(result);
      setSelectedUsers(new Set());
      setSelectAll(false);
      fetchLearners();
    } catch {
      setResponse({ success: false, message: 'Bulk enrolment failed.' });
    } finally {
      setLoading(false);
    }
  }

  async function handleBulkRemove() {
    if (selectedUsers.size === 0) return;
    setLoading(true);
    try {
      const result = await bulkRemoveEnrollment(
        program.id,
        Array.from(selectedUsers)
      );
      showResponse(result);
      setResponse(result);
      setSelectedUsers(new Set());
      setSelectAll(false);
      fetchLearners();
    } catch {
      setResponse({ success: false, message: 'Bulk remove failed.' });
    } finally {
      setLoading(false);
    }
  }

  function handleClose() {
    setShow(false);
    setSelectedUsers(new Set());
    setSearchTerm('');
    setResponse(null);
    setSelectAll(false);
  }

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col overflow-hidden">

        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-zinc-200 shrink-0">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-zinc-900">
              Enrol {userLabelPlural}
            </h2>
            {program?.name && (
              <p className="text-xs text-zinc-500 mt-0.5">{program.name}</p>
            )}
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors text-xl leading-none"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="px-4 sm:px-6 py-4 border-b border-zinc-100 shrink-0">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-3.5 h-3.5" />
              <input
                type="text"
                placeholder="Search by name, email or ID…"
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
          ) : filteredLearners.length > 0 ? (
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
                      {['Name', 'Email', 'ID', 'Role', 'Status', ''].map((h) => (
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
                    {filteredLearners.map((user) => {
                      const isEnrolled = user?.enrolled;
                      return (
                        <tr
                          key={user.id}
                          className="hover:bg-red-50/30 transition-colors"
                        >
                          <td className="px-4 py-3">
                            <input
                              type="checkbox"
                              checked={selectedUsers.has(user.id)}
                              onChange={() => handleSelectLearner(user.id)}
                              className="w-4 h-4 rounded border-zinc-300 text-[#E30613] focus:ring-[#E30613] cursor-pointer"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="w-8 h-8 rounded-full bg-zinc-100 text-zinc-700 text-[10px] font-bold flex items-center justify-center shrink-0">
                                {(user.firstname?.[0] || '') + (user.lastname?.[0] || '')}
                              </div>
                              <div className="font-bold text-zinc-900 truncate">
                                {user.firstname} {user.lastname}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-zinc-600 truncate max-w-[200px]">
                            {user.email}
                          </td>
                          <td className="px-4 py-3 text-zinc-600 whitespace-nowrap font-mono text-xs">
                            {user.idNo || '—'}
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-[10px] font-bold bg-zinc-100 text-zinc-600 px-2 py-1 rounded uppercase tracking-wider">
                              {user.role?.[0] || '—'}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-[10px] font-bold bg-zinc-100 text-zinc-700 px-2 py-1 rounded uppercase tracking-wider">
                              {user.status || 'ACTIVE'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button
                              onClick={() => handleEnroll(user)}
                              disabled={enrollingId === user.id}
                              className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                                isEnrolled
                                  ? 'text-[#E30613] bg-red-50 hover:bg-red-100'
                                  : 'text-white bg-[#E30613] hover:bg-[#c00511]'
                              } disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                              {enrollingId === user.id
                                ? '…'
                                : isEnrolled
                                ? 'Remove'
                                : 'Enrol'}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="md:hidden divide-y divide-zinc-100 border border-zinc-200 rounded-lg overflow-hidden">
                {filteredLearners.map((user) => {
                  const isEnrolled = user?.enrolled;
                  return (
                    <div key={user.id} className="p-3">
                      <div className="flex items-start gap-3 mb-3">
                        <input
                          type="checkbox"
                          checked={selectedUsers.has(user.id)}
                          onChange={() => handleSelectLearner(user.id)}
                          className="mt-1 w-4 h-4 rounded border-zinc-300 text-[#E30613] focus:ring-[#E30613] cursor-pointer shrink-0"
                        />
                        <div className="w-9 h-9 rounded-full bg-zinc-100 text-zinc-700 text-xs font-bold flex items-center justify-center shrink-0">
                          {(user.firstname?.[0] || '') + (user.lastname?.[0] || '')}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-zinc-900 truncate">
                            {user.firstname} {user.lastname}
                          </div>
                          <div className="text-xs text-zinc-500 truncate mt-0.5">
                            {user.email}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pl-12">
                        <span className="text-[10px] font-bold bg-zinc-100 text-zinc-600 px-2 py-1 rounded uppercase tracking-wider">
                          {user.status || 'ACTIVE'}
                        </span>
                        <button
                          onClick={() => handleEnroll(user)}
                          disabled={enrollingId === user.id}
                          className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${
                            isEnrolled
                              ? 'text-[#E30613] bg-red-50 hover:bg-red-100'
                              : 'text-white bg-[#E30613] hover:bg-[#c00511]'
                          } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          {enrollingId === user.id
                            ? '…'
                            : isEnrolled
                            ? 'Remove'
                            : 'Enrol'}
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
                No {userLabelPlural.toLowerCase()} available.
              </p>
            </div>
          )}
        </div>

        <div className="border-t border-zinc-200 bg-zinc-50 px-4 sm:px-6 py-4 shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <span className="text-xs sm:text-sm text-zinc-600 text-center sm:text-left">
              {selectedUsers.size > 0
                ? `${selectedUsers.size} selected`
                : 'Select to bulk action'}
            </span>

            <div className="flex flex-wrap gap-2 justify-center sm:justify-end">
              <button
                onClick={handleClose}
                className="px-4 py-2 text-sm font-medium text-zinc-700 bg-white border border-zinc-300 rounded-lg hover:border-zinc-400 transition-colors"
              >
                Close
              </button>

              {selectedUsers.size > 0 && (
                <>
                  <button
                    onClick={handleBulkRemove}
                    disabled={loading}
                    className="px-4 py-2 text-sm font-semibold text-[#E30613] bg-white border border-red-200 rounded-lg hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Remove ({selectedUsers.size})
                  </button>

                  <button
                    onClick={handleBulkEnroll}
                    disabled={loading}
                    className="px-4 py-2 text-sm font-semibold text-white bg-[#E30613] rounded-lg hover:bg-[#c00511] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Enrol selected
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