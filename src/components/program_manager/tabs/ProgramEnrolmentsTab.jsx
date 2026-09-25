import ResponseMessage from '@/components/common/ResponseMessage';
import { Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { FaSearch, FaUserPlus, FaUsers } from 'react-icons/fa';
import {
  bulkRemoveEnrollment,
  enrollLearner,
} from '../service/EnrollmenetService';

export default function ProgramEnrolmentsTab({
  program,
  setProgram,
  openEnrollModal,
  formatDate,
}) {
  const [response, setResponse] = useState(null);
  const [enrolledUsers, setEnrolledUsers] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  const isInternship = program?.category === 'INTERNSHIP';
  const userLabel = isInternship ? 'Intern' : 'Learner';
  const userLabelPlural = isInternship ? 'Interns' : 'Learners';

  useEffect(() => {
    setEnrolledUsers(program?.enrollmentData || []);
  }, [program]);

  function handleSelectUser(id) {
    const next = new Set(selectedUsers);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedUsers(next);
    setSelectAll(next.size === enrolledUsers.length && enrolledUsers.length > 0);
  }

  function handleSelectAll() {
    if (selectAll) {
      setSelectedUsers(new Set());
    } else {
      setSelectedUsers(new Set(enrolledUsers.map((u) => u.id)));
    }
    setSelectAll(!selectAll);
  }

  async function handleRemove(learner) {
    try {
      const result = await enrollLearner(learner, program.id);
      setResponse(result);
      setProgram(result?.payload);
    } catch (e) {
      setResponse({ success: false, message: 'Failed to remove: ' + e.message });
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
      setResponse(result);
      setSelectedUsers(new Set());
      setSelectAll(false);
      setProgram(result?.payload);
    } catch (e) {
      setResponse({ success: false, message: 'Bulk remove failed: ' + e.message });
    } finally {
      setLoading(false);
    }
  }

  const filtered = enrolledUsers.filter((s) =>
    `${s.firstname} ${s.lastname}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8">

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
        <h3 className="text-base font-bold text-zinc-900">
          Enrolled {userLabelPlural}{' '}
          <span className="text-zinc-400 font-medium">({enrolledUsers.length})</span>
        </h3>

        <div className="relative w-full sm:w-72">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-3.5 h-3.5" />
          <input
            type="text"
            placeholder={`Search ${userLabelPlural.toLowerCase()}…`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-zinc-300 rounded-lg focus:border-[#E30613] outline-none transition-colors"
          />
        </div>
      </div>

      <ResponseMessage response={response} setResponse={setResponse} />

      {enrolledUsers.length > 0 ? (
        <>
          {selectedUsers.size > 0 && (
            <div className="flex items-center justify-between gap-3 mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <span className="text-sm font-bold text-[#E30613]">
                {selectedUsers.size} selected
              </span>
              <button
                onClick={handleBulkRemove}
                disabled={loading}
                className="inline-flex items-center gap-2 bg-[#E30613] hover:bg-[#c00511] disabled:opacity-60 text-white font-semibold text-xs px-3.5 py-2 rounded-lg transition-colors"
              >
                <Trash2 size={12} />
                {loading ? 'Removing…' : `Remove ${selectedUsers.size}`}
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
                  {[`${userLabel} name`, 'Email', 'Phone', 'Enrolled', ''].map((h) => (
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
                {filtered.map((user) => (
                  <tr key={user.id} className="hover:bg-red-50/30 transition-colors">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedUsers.has(user.id)}
                        onChange={() => handleSelectUser(user.id)}
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
                    <td className="px-4 py-3 text-zinc-600 whitespace-nowrap">
                      {user.contactNumber || '—'}
                    </td>
                    <td className="px-4 py-3 text-zinc-600 whitespace-nowrap">
                      {user.enrollmentDate ? formatDate(user.enrollmentDate) : '—'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleRemove(user)}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E30613] hover:bg-red-50 px-2.5 py-1.5 rounded-lg transition-colors"
                      >
                        <Trash2 size={12} />
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="md:hidden divide-y divide-zinc-100">
            {filtered.map((user) => (
              <div key={user.id} className="py-3">
                <div className="flex items-start gap-3 mb-2">
                  <input
                    type="checkbox"
                    checked={selectedUsers.has(user.id)}
                    onChange={() => handleSelectUser(user.id)}
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

                <div className="flex items-center justify-between gap-2 pl-12">
                  <span className="text-xs text-zinc-500">
                    {user.enrollmentDate ? formatDate(user.enrollmentDate) : '—'}
                  </span>
                  <button
                    onClick={() => handleRemove(user)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E30613] hover:bg-red-50 px-2.5 py-1.5 rounded-lg transition-colors"
                  >
                    <Trash2 size={12} />
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <div className="w-14 h-14 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaUsers className="text-zinc-400 text-xl" />
          </div>
          <h3 className="font-bold text-zinc-900 mb-1">
            No {userLabelPlural.toLowerCase()} enrolled yet
          </h3>
          <p className="text-sm text-zinc-500 mb-5">
            Start by enrolling the first {userLabel.toLowerCase()} on this programme.
          </p>
          <button
            onClick={openEnrollModal}
            className="inline-flex items-center gap-2 bg-[#E30613] hover:bg-[#c00511] text-white font-semibold text-sm px-5 py-2.5 rounded-lg transition-colors"
          >
            <FaUserPlus size={12} />
            Enrol first {userLabel}
          </button>
        </div>
      )}
    </div>
  );
}