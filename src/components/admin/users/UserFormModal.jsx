import { apiFetch } from '@/api/api';
import ResponseMessage from '@/components/common/ResponseMessage';
import { useApiResponse } from '@/contexts/ApiResponseContext';
import { USERS } from '@/utils/apiEndpoint';
import { PenSquareIcon, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  Alert,
  Button,
  Form,
  Spinner,
} from 'react-bootstrap';
import {
  FaArrowLeft,
  FaEnvelope,
  FaSave,
  FaUpload,
  FaUserPlus,
} from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTopLoader } from '../../../contexts/TopLoaderContext';

const ROLES = [
  'ADMIN',
  'PROGRAM_MANAGER',
  'FACILITATOR',
  'MENTOR',
  'INTERN',
  'LEARNER',
  'ASSESSOR',
  'MODERATOR',
];

const EMPTY_FORM = {
  firstname: '',
  lastname: '',
  contactNumber: '',
  email: '',
  password: '',
  confirmPassword: '',
  idNo: '',
  role: ['LEARNER'],
  status: 'ACTIVE',
};

export default function UserFormPage() {
  const [loading, setLoading] = useState(false);
  const [validated, setValidated] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [roleRequired, setRoleRequired] = useState(false);
  const [response, setResponse] = useState(null);
  const [userForm, setUserForm] = useState(EMPTY_FORM);

  const { start, complete } = useTopLoader();
  const { showResponse } = useApiResponse();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = location?.state || {};
  const editingUser = !!user;

  useEffect(() => {
    if (user) {
      setUserForm({ ...user, password: '', confirmPassword: '' });
    } else {
      setUserForm(EMPTY_FORM);
    }
    setRoleRequired(false);
    setValidated(false);
    setResponse(null);
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'contactNumber' && value !== '') {
      if (!/^\d*$/.test(value) || value.length > 10 || value[0] !== '0') return;
    }
    setUserForm((prev) => ({ ...prev, [name]: value }));
  };

  const toggleRole = (role, checked) => {
    setUserForm((prev) => ({
      ...prev,
      role: checked
        ? [...prev.role, role]
        : prev.role.filter((r) => r !== role),
    }));
    if (roleRequired) setRoleRequired(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    start();

    if (e.currentTarget.checkValidity() === false) {
      e.stopPropagation();
      setLoading(false);
      setValidated(true);
      setTimeout(() => complete(), 1500);
      return;
    }

    if (userForm.role.length === 0) {
      setResponse({ success: false, message: 'Please select at least one role.' });
      setRoleRequired(true);
      setLoading(false);
      complete();
      return;
    }

    try {
      const url = editingUser ? `${USERS}/${userForm.id}` : USERS;
      const method = editingUser ? 'PUT' : 'POST';

      const result = await apiFetch(url, { method, body: userForm });

      setResponse(result);
      showResponse(result);

      if (result?.success && editingUser) {
        navigate('/user/admin/users');
      }
    } catch (error) {
      setResponse({
        success: false,
        message: 'An error occurred. Please try again. ' + error.message,
      });
    } finally {
      complete();
      setLoading(false);
    }
  };

  const handleCancel = () => navigate(-1);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">

      {/* ---------- Back ---------- */}
      <button
        onClick={handleCancel}
        className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 text-sm font-medium text-zinc-600 bg-white border border-zinc-200 rounded-lg hover:border-zinc-300 hover:text-zinc-900 transition-colors"
      >
        <FaArrowLeft size={12} />
        Back
      </button>

      {/* ---------- Heading ---------- */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-zinc-100 rounded-xl flex items-center justify-center shrink-0">
            {editingUser ? (
              <PenSquareIcon size={20} className="text-zinc-700" />
            ) : (
              <FaUserPlus size={20} className="text-zinc-700" />
            )}
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-zinc-900">
              {editingUser ? 'Edit User' : 'Add New User'}
            </h1>
            <p className="text-sm text-zinc-500">
              {editingUser
                ? 'Update user details and roles.'
                : 'Create a new user account and assign roles.'}
            </p>
          </div>
        </div>

        {!editingUser && (
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={() => navigate('bulk')}
            className="flex items-center justify-center gap-2 shrink-0"
          >
            <FaUpload /> Bulk Upload
          </Button>
        )}
      </div>

      {/* ---------- Form Card ---------- */}
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden">
          <div className="p-4 sm:p-6">
            <ResponseMessage setResponse={setResponse} response={response} />

            {/* ---------- Fields Grid ---------- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <Form.Group>
                <Form.Label className="text-sm font-medium text-zinc-700">
                  First Name <span className="text-[#E30613]">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="firstname"
                  value={userForm.firstname}
                  onChange={handleInputChange}
                  placeholder="Enter first name"
                  required
                  className="text-sm"
                />
              </Form.Group>

              <Form.Group>
                <Form.Label className="text-sm font-medium text-zinc-700">
                  Last Name <span className="text-[#E30613]">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="lastname"
                  value={userForm.lastname}
                  onChange={handleInputChange}
                  placeholder="Enter last name"
                  required
                  className="text-sm"
                />
              </Form.Group>

              <Form.Group>
                <Form.Label className="text-sm font-medium text-zinc-700">
                  Email Address <span className="text-[#E30613]">*</span>
                </Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={userForm.email}
                  onChange={handleInputChange}
                  placeholder="user@example.com"
                  required
                  className="text-sm"
                />
              </Form.Group>

              <Form.Group>
                <Form.Label className="text-sm font-medium text-zinc-700">
                  Phone Number <span className="text-[#E30613]">*</span>
                </Form.Label>
                <Form.Control
                  type="tel"
                  name="contactNumber"
                  value={userForm.contactNumber}
                  onChange={handleInputChange}
                  placeholder="0XX XXX XXXX"
                  required
                  maxLength={10}
                  className="text-sm"
                />
              </Form.Group>

              <Form.Group>
                <Form.Label className="text-sm font-medium text-zinc-700">
                  Identification Number (RSA ID) <span className="text-[#E30613]">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="idNo"
                  value={userForm.idNo}
                  required
                  maxLength={13}
                  onChange={handleInputChange}
                  placeholder="13-digit ID number"
                  className="text-sm font-mono"
                />
              </Form.Group>

              <Form.Group>
                <Form.Label className="text-sm font-medium text-zinc-700">
                  Password {!editingUser && <span className="text-[#E30613]">*</span>}
                </Form.Label>
                <div className="relative">
                  <Form.Control
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={userForm.password}
                    onChange={handleInputChange}
                    required={!editingUser}
                    placeholder={editingUser ? 'Leave blank to keep current' : 'Set a password'}
                    className="text-sm pr-16"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 text-xs font-medium text-zinc-500 hover:text-zinc-800 rounded transition-colors"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </Form.Group>

              <Form.Group className="md:col-span-2">
                <Form.Label className="text-sm font-medium text-zinc-700">
                  Status <span className="text-[#E30613]">*</span>
                </Form.Label>
                <Form.Select
                  name="status"
                  value={userForm.status}
                  required
                  onChange={handleInputChange}
                  className="text-sm md:max-w-xs"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </Form.Select>
              </Form.Group>

              {/* ---------- Roles ---------- */}
              <Form.Group className="md:col-span-2">
                <Form.Label className="text-sm font-medium text-zinc-700">
                  Roles <span className="text-[#E30613]">*</span>
                </Form.Label>

                {userForm.role.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {userForm.role.map((role) => (
                      <span
                        key={role}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-zinc-100 text-zinc-800 rounded-full text-xs font-medium border border-zinc-200"
                      >
                        {role.replace(/_/g, ' ')}
                        <button
                          type="button"
                          onClick={() => toggleRole(role, false)}
                          className="ml-0.5 text-zinc-500 hover:text-zinc-900 transition-colors"
                          aria-label={`Remove ${role}`}
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                <div
                  className={`border rounded-lg p-3 sm:p-4 bg-white transition-colors ${
                    roleRequired ? 'border-[#E30613]' : 'border-zinc-200'
                  }`}
                >
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                    {ROLES.map((role) => (
                      <label
                        key={role}
                        htmlFor={`role-${role}`}
                        className="flex items-center gap-2 p-2 rounded-md hover:bg-zinc-50 cursor-pointer transition-colors min-w-0"
                      >
                        <Form.Check
                          type="checkbox"
                          id={`role-${role}`}
                          name="role"
                          value={role}
                          checked={userForm.role.includes(role)}
                          onChange={(e) => toggleRole(role, e.target.checked)}
                          className="cursor-pointer shrink-0"
                        />
                        <span className="text-xs sm:text-sm font-medium text-zinc-700 truncate select-none">
                          {role.replace(/_/g, ' ')}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {roleRequired && (
                  <p className="text-xs text-[#E30613] mt-1.5">
                    Please select at least one role.
                  </p>
                )}
              </Form.Group>
            </div>

            {/* ---------- Info Alert ---------- */}
            {!editingUser && (
              <Alert
                variant="light"
                className="!bg-zinc-50 !border-zinc-200 !text-zinc-700 flex items-start gap-2 mt-5 mb-0"
              >
                <FaEnvelope className="mt-0.5 shrink-0" />
                <span className="text-sm">
                  The user will receive an email with login instructions.
                </span>
              </Alert>
            )}
          </div>

          {/* ---------- Actions ---------- */}
          <div className="border-t border-zinc-100 bg-zinc-50 px-4 sm:px-6 py-4 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
            <Button
              variant="outline-secondary"
              onClick={handleCancel}
              disabled={loading}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              variant="dark"
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" />
                  {editingUser ? 'Updating…' : 'Creating…'}
                </>
              ) : (
                <>
                  <FaSave />
                  {editingUser ? 'Update User' : 'Create User'}
                </>
              )}
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
}