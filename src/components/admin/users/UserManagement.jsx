import { apiFetch } from '@/api/api';
import ResponseMessage from '@/components/common/ResponseMessage';
import RoleContent, { getRoleIcon } from '@/components/common/RoleContent';
import { useApiResponse } from '@/contexts/ApiResponseContext';
import { USERS } from '@/utils/apiEndpoint';
import { AlertCircle, CheckCircle, Menu } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  Badge,
  Button,
  Card,
  Dropdown,
  Form,
  InputGroup,
  Pagination,
  Table,
} from 'react-bootstrap';
import {
  FaChalkboardTeacher,
  FaClipboardCheck,
  FaDownload,
  FaGraduationCap,
  FaHistory,
  FaKey,
  FaSearch,
  FaShieldAlt,
  FaTrash,
  FaUpload,
  FaUserCog,
  FaUserGraduate,
  FaUserPlus,
  FaUsers,
  FaUserTie,
} from 'react-icons/fa';
import { FiMail, FiUser } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useTopLoader } from '../../../contexts/TopLoaderContext';
import BulkDeleteModal from './BulkDeleteModal';
import DeleteUserModal from './DeleteUserModal';

export default function UserManagement() {
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState(sessionStorage.getItem('selectedRole') || 'all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [bulkSelection, setBulkSelection] = useState([]);
  const [response, setResponse] = useState(null);
  const [showActionsMobile, setShowActionsMobile] = useState(null);
  const { start, complete } = useTopLoader();
  const itemsPerPage = 80;
  const [users, setUsers] = useState(null);
  const [showModal, setShowModal] = useState(null);
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
  const { showResponse } = useApiResponse();
  const navigate = useNavigate();

  const [userForm, setUserForm] = useState({
    firstname: '',
    lastname: '',
    contactNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
    idNo: '',
    role: ['LEARNER'],
    status: 'ACTIVE',
  });

  const roles = [
    'ADMIN',
    'PROGRAM_MANAGER',
    'FACILITATOR',
    'MENTOR',
    'INTERN',
    'LEARNER',
    'ASSESSOR',
    'MODERATOR',
  ];

  async function getUsers() {
    try {
      start();
      const result = await apiFetch(USERS);
      setUsers(result?.payload || []);
    } catch (e) {
      setResponse({ success: false, message: 'An error has occurred.' });
    } finally {
      complete();
    }
  }

  useEffect(() => {
    getUsers();
  }, []);

  useEffect(() => {
    sessionStorage.setItem('selectedRole', selectedRole);
    setSelectedRole(sessionStorage.getItem('selectedRole'));
  }, [selectedRole]);

  useEffect(() => {
    let result = users;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result?.filter(
        (user) =>
          user?.firstname?.toLowerCase().includes(term) ||
          user?.lastname?.toLowerCase().includes(term) ||
          user?.idNo?.toLowerCase().includes(term) ||
          user?.email?.toLowerCase().includes(term)
      );
    }

    if (selectedRole !== 'all') {
      result = result?.filter((user) => user?.role?.some((r) => r === selectedRole));
    }

    result?.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    setFilteredUsers(result);
    setCurrentPage(1);
  }, [users, searchTerm, selectedRole, selectedStatus, sortConfig]);

  const totalPages = Math.ceil(filteredUsers?.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentUsers = filteredUsers?.slice(startIndex, startIndex + itemsPerPage);

  const handleEditUser = (user) => {
    navigate(`${user?.id}/edit`, { state: { user } });
  };

  const handleBulkRoleAssign = async (role) => {
    start();
    try {
      const result = await apiFetch(`${USERS}/bulk-role`, {
        method: 'POST',
        body: JSON.stringify({ userIds: bulkSelection, role }),
      });
      setResponse(result);
      showResponse(result);
      if (result?.success) {
        setBulkSelection([]);
        getUsers();
      }
    } catch (error) {
      setResponse({ success: false, message: 'Bulk role assignment failed' });
    } finally {
      complete();
    }
  };

  const handleBulkStatusUpdate = async (status) => {
    start();
    try {
      const result = await apiFetch(`${USERS}/bulk-status`, {
        method: 'POST',
        body: JSON.stringify({ userIds: bulkSelection, status }),
      });
      setResponse(result);
      showResponse(result);
      if (result?.success) {
        setBulkSelection([]);
        getUsers();
      }
    } catch (error) {
      setResponse({ success: false, message: 'Bulk status update failed' });
    } finally {
      complete();
    }
  };

  const handleBulkExport = () => {
    const selectedUsers = users?.filter((u) => bulkSelection.includes(u.id)) || [];
    const csv = convertToCSV(selectedUsers);
    downloadCSV(csv, 'users_export.csv');
    setResponse({ message: `${bulkSelection.length} users exported`, success: true });
  };

  const handleSelectAll = () => {
    if (bulkSelection.length === currentUsers?.length) {
      setBulkSelection([]);
    } else {
      setBulkSelection(currentUsers?.map((user) => user.id) || []);
    }
  };

  const handleBulkSelect = (userId) => {
    setBulkSelection((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const convertToCSV = (data) => {
    const headers = ['firstname', 'lastname', 'email', 'contactNumber', 'idNumber', 'roles', 'status'];
    const rows = data.map((u) => [
      u.firstname,
      u.lastname,
      u.email,
      u.contactNumber,
      u.idNo,
      u.role?.join(';'),
      u.status,
    ]);
    return [headers, ...rows].map((row) => row.join(',')).join('\n');
  };

  const downloadCSV = (csv, filename) => {
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  async function deactivateUser(userId) {
    try {
      const result = await apiFetch(`${USERS}/${userId}/deactivate`, { method: 'POST' });
      setResponse(result);
      showResponse(result);
      getUsers();
    } catch (error) {
      setResponse({ success: false, message: 'An error occurred while deactivating the user.' });
    }
  }

  async function activateUser(userId) {
    try {
      const result = await apiFetch(`${USERS}/${userId}/activate`, { method: 'POST' });
      setResponse(result);
      showResponse(result);
      getUsers();
    } catch (error) {
      setResponse({ success: false, message: 'An error occurred while activating the user.' });
    }
  }

  const statsCards = [
    { label: 'Total Users', role: 'all', value: users?.length, icon: <FaUsers />, color: 'from-blue-500 to-blue-600' },
    { label: 'Admins', role: 'ADMIN', value: users?.filter((u) => u.role?.includes('ADMIN')).length, icon: <FaKey />, color: 'from-red-500 to-red-600' },
    { label: 'Managers', role: 'PROGRAM_MANAGER', value: users?.filter((u) => u.role?.includes('PROGRAM_MANAGER')).length, icon: <FaGraduationCap />, color: 'from-green-500 to-green-600' },
    { label: 'Learners', role: 'LEARNER', value: users?.filter((u) => u.role?.includes('LEARNER')).length, icon: <FaGraduationCap />, color: 'from-emerald-500 to-emerald-600' },
    { label: 'Facilitators', role: 'FACILITATOR', value: users?.filter((u) => u.role?.includes('FACILITATOR')).length, icon: <FaChalkboardTeacher />, color: 'from-purple-500 to-purple-600' },
    { label: 'Mentors', role: 'MENTOR', value: users?.filter((u) => u.role?.includes('MENTOR')).length, icon: <FaUserTie />, color: 'from-indigo-500 to-indigo-600' },
    { label: 'Interns', role: 'INTERN', value: users?.filter((u) => u.role?.includes('INTERN')).length, icon: <FaUserGraduate />, color: 'from-yellow-500 to-yellow-600' },
    { label: 'Assessors', role: 'ASSESSOR', value: users?.filter((u) => u.role?.includes('ASSESSOR')).length, icon: <FaClipboardCheck />, color: 'from-teal-500 to-teal-600' },
    { label: 'Moderators', role: 'MODERATOR', value: users?.filter((u) => u.role?.includes('MODERATOR')).length, icon: <FaShieldAlt />, color: 'from-slate-600 to-slate-700' },
  ];

  const userActions = (user) => [
    { label: 'Role Manager', event: () => navigate(`${user.id}/role-manager`) },
    { label: 'Deactivate', event: () => deactivateUser(user.id) },
    { label: 'Activate', event: () => activateUser(user.id) },
    { label: 'Delete', event: () => { setShowDeleteModal(true); setUserForm(user); } },
    { label: 'Edit', event: () => handleEditUser(user) },
    { label: 'View', event: () => navigate(`${user?.id}`, { state: { user } }) },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">

      {/* ============================================================
          HEADER
          ============================================================ */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2">
              <FaUsers className="text-[#E30613]" />
              User Management
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Manage all users, roles and permissions.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 shrink-0">
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={() => navigate('new/bulk')}
              className="flex items-center justify-center gap-2"
            >
              <FaUpload /> Bulk Upload
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => navigate('new')}
              className="flex items-center justify-center gap-2"
            >
              <FaUserPlus /> Add New User
            </Button>
          </div>
        </div>

        {/* ---------- Stats Cards ---------- */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-9 gap-2 sm:gap-3 mb-6">
          {statsCards.map((stat, idx) => (
            <Card
              key={idx}
              onClick={() => setSelectedRole(stat.role)}
              className={`border-0 cursor-pointer transition-all duration-200 hover:scale-105 ${
                selectedRole === stat.role ? 'border-3 border-bottom !border-red-600' : ''
              }`}
            >
              <Card.Body className="p-3">
                <div className="flex flex-col items-center text-center">
                  <div
                    className={`w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center text-white text-base sm:text-lg mb-2`}
                  >
                    {stat.icon}
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-800 leading-tight">
                    {stat.value || 0}
                  </h3>
                  <p className="text-[10px] sm:text-xs text-slate-500 font-medium uppercase tracking-wider">
                    {stat.label}
                  </p>
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>
      </div>

      <ResponseMessage setResponse={setResponse} response={response} />

      {/* ============================================================
          BULK ACTIONS BAR
          ============================================================ */}
      {bulkSelection.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 sm:p-4 mb-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <Badge bg="danger" className="px-3 py-1">
                {bulkSelection.length} selected
              </Badge>
              <span className="text-sm text-slate-700 hidden sm:inline">Bulk actions:</span>
            </div>

            <div className="flex flex-wrap gap-2">
              <Dropdown>
                <Dropdown.Toggle variant="outline-primary" size="sm" className="flex items-center gap-2">
                  <FaUserCog /> <span className="hidden sm:inline">Assign</span> Role
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {roles.map((role) => (
                    <Dropdown.Item key={role} onClick={() => handleBulkRoleAssign(role)} className="flex items-center gap-2">
                      {getRoleIcon(role)} {role}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>

              <Dropdown>
                <Dropdown.Toggle variant="outline-warning" size="sm" className="flex items-center gap-2">
                  <FaHistory /> Status
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => handleBulkStatusUpdate('ACTIVE')}>
                    <CheckCircle className="text-green-500 me-2" size={14} /> Activate
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => handleBulkStatusUpdate('INACTIVE')}>
                    <AlertCircle className="text-red-500 me-2" size={14} /> Deactivate
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>

              <Button variant="outline-success" size="sm" onClick={handleBulkExport} className="flex items-center gap-2">
                <FaDownload /> <span className="hidden sm:inline">Export</span>
              </Button>

              <Button variant="outline-danger" size="sm" onClick={() => setShowBulkDeleteModal(true)} className="flex items-center gap-2">
                <FaTrash /> <span className="hidden sm:inline">Delete</span>
              </Button>

              <Button variant="link" size="sm" onClick={() => setBulkSelection([])} className="text-slate-600">
                Clear
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================
          FILTERS
          ============================================================ */}
      <Card className="border-0 mb-5 shadow-sm">
        <Card.Body className="p-3 sm:p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2">
              <InputGroup>
                <InputGroup.Text className="bg-white border-r-0">
                  <FaSearch className="text-slate-400" />
                </InputGroup.Text>
                <Form.Control
                  placeholder="Search users by name, email or ID number"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border-l-0 text-sm"
                />
              </InputGroup>
            </div>

            <Form.Select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="border-slate-300 text-sm"
            >
              <option value="all">All Roles</option>
              {roles.map((role) => (
                <option key={role} value={role}>
                  {role.replace(/_/g, ' ')}
                </option>
              ))}
            </Form.Select>
          </div>
        </Card.Body>
      </Card>

      {/* ============================================================
          USERS — DESKTOP TABLE
          ============================================================ */}
      <Card className="border-0 shadow-sm hidden md:block">
        <Card.Body className="p-0">
          <Table hover className="mb-0 align-middle">
            <thead className="bg-slate-50">
              <tr>
                <th className="border-b border-slate-200 px-4 py-3 w-12">
                  <Form.Check
                    type="checkbox"
                    className="accent-rose-600"
                    checked={bulkSelection.length === currentUsers?.length && currentUsers?.length > 0}
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="border-b border-slate-200 px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  User
                </th>
                <th className="border-b border-slate-200 px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Email
                </th>
                <th className="border-b border-slate-200 px-4 py-3 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="border-b border-slate-200 px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Role
                </th>
                <th className="border-b border-slate-200 px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider w-32">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentUsers?.map((user, key) => (
                <tr
                  key={key}
                  onClick={() => navigate(`${user?.id}`, { state: { user } })}
                  className="cursor-pointer transition-colors hover:bg-rose-50/40"
                >
                  <td className="px-4 py-3">
                    <Form.Check
                      type="checkbox"
                      className="accent-rose-600"
                      checked={bulkSelection.includes(user.id)}
                      onChange={() => handleBulkSelect(user.id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-slate-900 text-sm truncate">
                      {user?.firstname} {user?.lastname}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 text-slate-600">
                      <FiMail className="text-slate-400" size={14} />
                      <span className="text-sm truncate">{user.email}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`text-[10px] font-bold px-2 py-1 rounded text-white ${
                        user?.active ? 'bg-green-600' : 'bg-red-600'
                      }`}
                    >
                      {user?.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <RoleContent roles={user.role} />
                  </td>
                  <td className="px-4 py-3">
                    <Dropdown onClick={(e) => e.stopPropagation()}>
                      <Dropdown.Toggle size="sm" variant="danger" className="text-xs">
                        ACTION
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        {userActions(user).map((action, idx) => (
                          <Dropdown.Item key={idx} onClick={action.event}>
                            {action.label}
                          </Dropdown.Item>
                        ))}
                      </Dropdown.Menu>
                    </Dropdown>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {filteredUsers?.length === 0 && <EmptyState onAdd={() => { setEditingUser(null); setShowModal(true); }} />}
        </Card.Body>

        <Card.Footer className="border-t border-slate-200 bg-white">
          {filteredUsers?.length > 0 && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-2 py-2">
              <div className="text-sm text-slate-600 text-center sm:text-left">
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredUsers?.length)} of{' '}
                {filteredUsers?.length} users
              </div>
              <Pagination className="mb-0 flex-wrap justify-center">
                <Pagination.Prev
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                />
                {[...Array(totalPages)].map((_, idx) => (
                  <Pagination.Item
                    key={idx + 1}
                    active={idx + 1 === currentPage}
                    onClick={() => setCurrentPage(idx + 1)}
                  >
                    {idx + 1}
                  </Pagination.Item>
                ))}
                <Pagination.Next
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                />
              </Pagination>
            </div>
          )}
        </Card.Footer>
      </Card>

      {/* ============================================================
          USERS — MOBILE CARD LIST
          ============================================================ */}
      <div className="md:hidden space-y-3">
        {currentUsers?.map((user) => (
          <div
            key={user.id}
            className="bg-white border border-slate-200 rounded-xl p-4"
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="min-w-0 flex-1">
                <div className="font-bold text-slate-900 truncate">
                  {user?.firstname} {user?.lastname}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1 truncate">
                  <FiMail size={12} />
                  <span className="truncate">{user.email}</span>
                </div>
              </div>

              <Form.Check
                type="checkbox"
                className="accent-rose-600 mt-1"
                checked={bulkSelection.includes(user.id)}
                onChange={() => handleBulkSelect(user.id)}
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span
                className={`text-[10px] font-bold px-2 py-1 rounded text-white ${
                  user?.active ? 'bg-green-600' : 'bg-red-600'
                }`}
              >
                {user?.status}
              </span>
              <RoleContent roles={user.role} />
            </div>

            <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
              <Button
                size="sm"
                variant="outline-secondary"
                onClick={() => handleEditUser(user)}
                className="flex-1 text-xs"
              >
                Edit
              </Button>
              <Button
                size="sm"
                variant="outline-primary"
                onClick={() => navigate(`${user?.id}`, { state: { user } })}
                className="flex-1 text-xs"
              >
                View
              </Button>
              <Dropdown align="end">
                <Dropdown.Toggle size="sm" variant="danger" className="text-xs">
                  <Menu size={14} />
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {userActions(user).map((action, idx) => (
                    <Dropdown.Item key={idx} onClick={action.event}>
                      {action.label}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
        ))}

        {filteredUsers?.length === 0 && (
          <div className="bg-white border border-slate-200 rounded-xl">
            <EmptyState onAdd={() => { setEditingUser(null); setShowModal(true); }} />
          </div>
        )}

        {filteredUsers?.length > 0 && (
          <div className="flex flex-col items-center gap-2 pt-3">
            <div className="text-xs text-slate-500 text-center">
              Showing {startIndex + 1}–{Math.min(startIndex + itemsPerPage, filteredUsers?.length)} of{' '}
              {filteredUsers?.length}
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline-secondary"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              >
                Prev
              </Button>
              <span className="text-xs text-slate-600">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                size="sm"
                variant="outline-secondary"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* ============================================================
          MODALS
          ============================================================ */}
      <DeleteUserModal
        show={showDeleteModal}
        setShow={setShowDeleteModal}
        userForm={userForm}
        getRoleIcon={getRoleIcon}
        loading={loading}
        setResponse={setResponse}
        getUsers={getUsers}
      />

      <BulkDeleteModal
        setShow={setShowBulkDeleteModal}
        show={showBulkDeleteModal}
        bulkSelection={bulkSelection}
        setBulkSelection={setBulkSelection}
        getUsers={getUsers}
        setResponse={setResponse}
      />
    </div>
  );
}

function EmptyState({ onAdd }) {
  return (
    <div className="text-center py-12 px-4">
      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <FiUser className="text-slate-400 text-2xl" />
      </div>
      <h4 className="text-slate-700 font-bold mb-2">No users found</h4>
      <p className="text-slate-500 text-sm mb-4">
        Try adjusting your filters or add a new user.
      </p>
      <Button variant="danger" className="inline-flex items-center gap-2" onClick={onAdd}>
        <FaUserPlus /> Add User
      </Button>
    </div>
  );
}