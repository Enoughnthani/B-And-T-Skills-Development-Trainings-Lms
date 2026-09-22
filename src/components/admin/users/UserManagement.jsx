import { apiFetch } from '@/api/api';
import ResponseMessage from '@/components/common/ResponseMessage';
import RoleContent, { getRoleIcon } from '@/components/common/RoleContent';
import { useApiResponse } from '@/contexts/ApiResponseContext';
import { USERS } from '@/utils/apiEndpoint';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  Badge,
  Button,
  Card,
  Dropdown,
  Form,
  InputGroup,
  Pagination,
  Table
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
  FaUserTie
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
  const [selectedRole, setSelectedRole] = useState(sessionStorage.getItem("selectedRole") || 'all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [bulkSelection, setBulkSelection] = useState([]);
  const [response, setResponse] = useState(null);
  const { start, complete } = useTopLoader();
  const itemsPerPage = 80;
  const [users, setUsers] = useState(null);
  const [showModal, setShowModal] = useState(null);
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false)
  const { showResponse } = useApiResponse()
  const navigate = useNavigate()


  const [userForm, setUserForm] = useState({
    firstname: "",
    lastname: "",
    contactNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
    idNo: '',
    role: ["LEARNER"],
    status: "ACTIVE"
  });

  const roles = ['ADMIN', 'PROGRAM_MANAGER', 'FACILITATOR', 'MENTOR', 'INTERN', 'LEARNER', 'ASSESSOR', 'MODERATOR'];

  async function getUsers() {
    try {
      start();
      const result = await apiFetch(USERS);
      setUsers(result?.payload || []);
    } catch (e) {
      setResponse({ success: false, message: "An error has occurred." });
    } finally {
      complete();
    }
  }

  useEffect(() => {
    getUsers();
  }, []);

  useEffect(() => {
    sessionStorage.setItem("selectedRole", selectedRole)
    setSelectedRole(sessionStorage.getItem("selectedRole"))
  }, [selectedRole]);

  useEffect(() => {
    let result = users;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result?.filter(user =>
        user?.firstname?.toLowerCase().includes(term) ||
        user?.lastname?.toLowerCase().includes(term) ||
        user?.idNo?.toLowerCase().includes(term) ||
        user?.email?.toLowerCase().includes(term)
      );
    }

    if (selectedRole !== 'all') {
      result = result?.filter(user => user?.role?.some(r => r === selectedRole));
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

  // ========== PAGINATION ==========
  const totalPages = Math.ceil(filteredUsers?.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentUsers = filteredUsers?.slice(startIndex, startIndex + itemsPerPage);


  const handleEditUser = (user) => {
    navigate(`${user?.id}/edit`, { state: { user } })
  };


  const handleBulkRoleAssign = async (role) => {
    start();
    try {
      const result = await apiFetch(`${USERS}/bulk-role`, {
        method: "POST",
        body: JSON.stringify({
          userIds: bulkSelection,
          role: role
        })
      });

      setResponse(result);
      showResponse(result)

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
        method: "POST",
        body: JSON.stringify({
          userIds: bulkSelection,
          status: status
        })
      });
      setResponse(result)
      showResponse(result)

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

  // Bulk Export
  const handleBulkExport = () => {
    const selectedUsers = users?.filter(u => bulkSelection.includes(u.id)) || [];
    const csv = convertToCSV(selectedUsers);
    downloadCSV(csv, 'users_export.csv');
    setResponse({ message: `${bulkSelection.length} users exported`, success: true });
  };


  const handleSelectAll = () => {
    if (bulkSelection.length === currentUsers?.length) {
      setBulkSelection([]);
    } else {
      setBulkSelection(currentUsers?.map(user => user.id) || []);
    }
  };

  const handleBulkSelect = (userId) => {
    setBulkSelection(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };


  const convertToCSV = (data) => {
    const headers = ['firstname', 'lastname', 'email', 'contactNumber', 'idNumber', 'roles', 'status'];
    const rows = data.map(u => [
      u.firstname,
      u.lastname,
      u.email,
      u.contactNumber,
      u.idNo,
      u.role?.join(';'),
      u.status
    ]);

    return [headers, ...rows]
      .map(row => row.join(','))
      .join('\n');
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
      const result = await apiFetch(`${USERS}/${userId}/deactivate`, {
        method: "POST"
      })

      setResponse(result);
      showResponse(result)

      getUsers();

    } catch (error) {
      setResponse({ success: false, message: "An error occurred while deactivating the user." });
    }
  }


  async function activateUser(userId) {
    try {
      const result = await apiFetch(`${USERS}/${userId}/activate`, {
        method: "POST"
      })

      setResponse(result);
      showResponse(result)

      getUsers();

    } catch (error) {
      setResponse({ success: false, message: "An error occurred while activating the user." });
    }
  }



  return (
    <div className="h-screen w-full overflow-y-auto  p-6 flex flex-col">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <FaUsers className="text-red-600" />
              User Management
            </h1>
            <p className="text-gray-600">Manage all users, roles, and permissions</p>
          </div>
          <div className="grid md:grid-cols-2 gap-2">
            <Button
              variant="outline-info"
              size='sm'
              onClick={() => navigate('new/bulk')}
              className="flex items-center gap-2 px-4 py-2"
            >
              <FaUpload /> Bulk Upload
            </Button>
            <Button
              variant="outline-primary"
              size='sm'
              onClick={() => navigate('new')}
              className="flex items-center gap-2 px-4 py-2"
            >
              <FaUserPlus /> Add New User
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="hidden md:grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-9 gap-3 mb-6">
          {[
            { label: 'Total Users', role: "all", value: users?.length, icon: <FaUsers />, color: 'bg-gradient-to-br from-blue-500 to-blue-600' },
            { label: 'Admins', role: "ADMIN", value: users?.filter(u => u.role?.some(r => r === 'ADMIN')).length, icon: <FaKey />, color: 'bg-gradient-to-br from-red-500 to-red-600' },
            { label: 'program manager', role: "PROGRAM_MANAGER", value: users?.filter(u => u.role?.some(r => r === 'PROGRAM_MANAGER')).length, icon: <FaGraduationCap />, color: 'bg-gradient-to-br from-green-500 to-green-600' },
            { label: 'Learners', role: "LEARNER", value: users?.filter(u => u.role?.some(r => r === 'LEARNER')).length, icon: <FaGraduationCap />, color: 'bg-gradient-to-br from-green-500 to-green-600' },
            { label: 'Facilitators', role: "FACILITATOR", value: users?.filter(u => u.role?.some(r => r === 'FACILITATOR')).length, icon: <FaChalkboardTeacher />, color: 'bg-gradient-to-br from-purple-500 to-purple-600' },
            { label: 'Mentors', role: "MENTOR", value: users?.filter(u => u.role?.some(r => r === 'MENTOR')).length, icon: <FaUserTie />, color: 'bg-gradient-to-br from-indigo-500 to-indigo-600' },
            { label: 'Interns', role: "INTERN", value: users?.filter(u => u.role?.some(r => r === 'INTERN')).length, icon: <FaUserGraduate />, color: 'bg-gradient-to-br from-yellow-500 to-yellow-600' },
            { label: 'Assessors', role: "ASSESSOR", value: users?.filter(u => u.role?.some(r => r === 'ASSESSOR')).length, icon: <FaClipboardCheck />, color: 'bg-gradient-to-br from-teal-500 to-teal-600' },
            { label: 'Moderators', role: "MODERATOR", value: users?.filter(u => u.role?.some(r => r === 'MODERATOR')).length, icon: <FaShieldAlt />, color: 'bg-gradient-to-br from-slate-600 to-slate-700' },
          ].map((stat, idx) => (
            <Card
              onClick={() => setSelectedRole(stat.role)}
              key={idx}
              className="border-0 cursor-pointer transition-all duration-200 hover:scale-105 group"
            >
              <Card.Body className="p-3">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center text-white text-lg mb-2 group-hover:shadow-md transition-all`}>
                    {stat.icon}
                  </div>
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-gray-800 leading-tight">{stat.value || 0}</h3>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{stat.label}</p>
                  </div>
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>
      </div>

      <ResponseMessage setResponse={setResponse} response={response} />


      {/* Bulk Actions Bar */}
      {bulkSelection.length > 0 && (
        <div className="bg-gradient-to-r from-red-50 to-red-50/50 p-4 rounded-lg border border-red-200 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Badge bg="danger" className="px-3 py-1">
                {bulkSelection.length} selected
              </Badge>
              <span className="text-gray-700">Bulk actions:</span>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Dropdown>
                <Dropdown.Toggle variant="outline-primary" size="sm" className="flex items-center gap-2">
                  <FaUserCog /> Assign Role
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {roles.map(role => (
                    <Dropdown.Item
                      key={role}
                      onClick={() => handleBulkRoleAssign(role)}
                      className="flex items-center gap-2"
                    >
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

              <Button
                variant="outline-success"
                size="sm"
                onClick={handleBulkExport}
                className="flex items-center gap-2"
              >
                <FaDownload /> Export
              </Button>

              <Button
                variant="outline-danger"
                size="sm"
                onClick={() => setShowBulkDeleteModal(true)}
                className="flex items-center gap-2"
              >
                <FaTrash /> Delete
              </Button>

              <Button
                variant="link"
                size="sm"
                onClick={() => setBulkSelection([])}
                className="text-gray-600"
              >
                Clear
              </Button>
            </div>
          </div>


        </div>
      )}

      {/* Filters and Search */}
      <Card className="border-0 mb-6">
        <Card.Body className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <InputGroup>
                <InputGroup.Text className="bg-white border-r-0">
                  <FaSearch className="text-gray-500" />
                </InputGroup.Text>
                <Form.Control
                  placeholder="Search users by name, email, or ID number"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border-l-0"
                />
              </InputGroup>
            </div>

            <Form.Select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="border-gray-300"
            >
              <option value="all">All Roles</option>
              {roles.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </Form.Select>
          </div>
        </Card.Body>
      </Card>

      {/* Users Table */}
      <Card className="border-0 flex-1">
        <Card.Body>
          <div className="">
            <Table hover className="mb-0 border-separate border-spacing-0">
              <thead className="bg-white/80 backdrop-blur-sm ">
                <tr>
                  <th className="border-b border-slate-200 px-4 py-3.5 w-12">
                    <Form.Check
                      type="checkbox"
                      className="accent-rose-600"
                      checked={bulkSelection.length === currentUsers?.length && currentUsers?.length > 0}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th className="border-b border-slate-200 px-4 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">User</th>
                  <th className="border-b border-slate-200 px-4 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Email</th>
                  <th className="border-b border-slate-200 px-4 py-3.5 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                  <th className="border-b border-slate-200 px-4 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Role</th>
                  <th className="border-b border-slate-200 px-4 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider w-40">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {currentUsers?.map((user, key) => (
                  <tr
                    onClick={() => navigate(`${user?.id}`, { state: { user } })}
                    key={key}
                    className="group cursor-pointer transition-colors duration-200 hover:bg-rose-50/40"
                  >
                    <td className="px-4 py-4 align-middle">
                      <Form.Check
                        type="checkbox"
                        className="accent-rose-600"
                        checked={bulkSelection.includes(user.id)}
                        onChange={() => handleBulkSelect(user.id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </td>
                    <td className="px-4 py-4 align-middle">
                      <div className="flex items-center gap-3">
                        <div>
                          <div className="font-medium text-slate-900 truncate">
                            {user?.firstname} {user?.lastname}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 align-middle">
                      <div className="flex items-center gap-2 text-slate-600">
                        <FiMail className="text-slate-400" size={16} />
                        <span className="text-sm">{user.email}</span>
                      </div>
                    </td>
                    <td className='text-xs text-center  align-middle'>
                      <span className={(user?.active ? 'bg-green-600' : 'bg-red-600') + ' p-2 rounded text-white font-semibold'}>{user?.status}</span>
                    </td>
                    <td className='text-xs text-center  align-middle'>
                      <RoleContent roles={user.role} />
                    </td>
                    <td className="px-4 py-4 align-middle">
                      <Dropdown onClick={(e) => e.stopPropagation()} className=" inline-block">
                        <Dropdown.Toggle
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-2 py-1 rounded inline-flex items-center focus:outline-none"
                        >
                          ACTION
                        </Dropdown.Toggle>

                        <Dropdown.Menu className="px-auto min-w-[140px] bg-slate-50 border border-gray-200 rounded-md shadow-lg">
                          {[
                            {
                              label: "ROLE MANAGER",
                              event: () => navigate(`${user.id}/role-manager`),
                              style: "text-gray-800 hover:bg-gray-700",
                            },
                            {
                              label: "DEACTIVATE",
                              style: "text-yellow-800 hover:bg-yellow-700",
                              event: () => deactivateUser(user.id)
                            },
                            {
                              label: "ACTIVATE",
                              style: "text-green-800 hover:bg-green-700",
                              event: () => activateUser(user.id)
                            },
                            {
                              label: "DELETE",
                              event: () => { setShowDeleteModal(true); setUserForm(user) },
                              style: "text-red-700 hover:bg-red-700",
                            },
                            {
                              label: "EDIT",
                              event: () => handleEditUser(user),
                              style: "text-blue-800 hover:bg-blue-700",
                            },
                            {
                              label: "VIEW",
                              event: () => navigate(`${user?.id}`, { state: { user } }),
                              style: "text-yellow-600 hover:bg-yellow-600",
                            },
                          ].map((action, idx) => (
                            <Dropdown.Item
                              key={idx}
                              onClick={action?.event}
                              className={action?.style + ' font-semibold hover:text-slate-50 rounded-md mx-1 '}
                            >
                              {action?.label}
                            </Dropdown.Item>
                          ))}
                        </Dropdown.Menu>
                      </Dropdown>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>

          {/* Empty State */}
          {filteredUsers?.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiUser className="text-gray-400 text-2xl" />
              </div>
              <h4 className="text-gray-700 font-medium mb-2">No users found</h4>
              <p className="text-gray-500 mb-4">Try adjusting your filters or add a new user</p>
              <Button variant="outline-success" className='flex mx-auto items-center'
                onClick={() => {
                  setEditingUser(null);
                  setShowModal(true);
                }}>
                <FaUserPlus className="me-2" /> Add User
              </Button>
            </div>
          )}
        </Card.Body>

        <Card.Footer className='border-t border-gray-200 bg-white'>
          {filteredUsers?.length > 0 && (
            <div className="flex items-center justify-between px-4 py-3">
              <div className="text-sm text-gray-600">
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredUsers?.length)} of {filteredUsers?.length} users
              </div>
              <Pagination className="mb-0">
                <Pagination.Prev
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
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
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                />
              </Pagination>
            </div>
          )}
        </Card.Footer>
      </Card>


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
        setResponse={setResponse} />

    </div >
  );
}