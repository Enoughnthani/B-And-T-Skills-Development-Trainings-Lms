import { apiFetch } from '@/api/api';
import ResponseMessage from '@/components/common/ResponseMessage';
import { USERS } from '@/utils/apiEndpoint';
import { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { 
  ArrowLeft, Clock, Plus, Search, Shield, Trash2, Users, X,
  Save, UserCheck
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const roles = [
  { id: 'ADMIN', label: 'Admin', desc: 'Full system access & control' },
  { id: 'PROGRAM_MANAGER', label: 'Program Manager', desc: 'Manage programs and curriculum' },
  { id: 'FACILITATOR', label: 'Facilitator', desc: 'Lead sessions and workshops' },
  { id: 'MENTOR', label: 'Mentor', desc: 'Guide and support learners' },
  { id: 'INTERN', label: 'Intern', desc: 'Participate in learning activities' },
  { id: 'LEARNER', label: 'Learner', desc: 'Access learning materials' },
  { id: 'ASSESSOR', label: 'Assessor', desc: 'Evaluate and grade submissions' },
  { id: 'MODERATOR', label: 'Moderator', desc: 'Moderate content and discussions' }
];

export default function RoleManagerPage() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [currentRoles, setCurrentRoles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser();
  }, [userId]);

  const fetchUser = async () => {
    try {
      const data = await apiFetch(`${USERS}/${userId}`);
      setUser(data?.payload || data);
      setCurrentRoles(data?.payload?.role || data?.role || []);
    } catch (error) {
      setResponse({ success: false, message: 'Failed to load user data' });
    } finally {
      setLoading(false);
    }
  };

  const availableRoles = roles.filter(role =>
    !currentRoles.includes(role.id) &&
    (role.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.id.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const assignRole = (roleId) => {
    if (!currentRoles.includes(roleId)) {
      setCurrentRoles([...currentRoles, roleId]);
    }
  };

  const removeRole = (roleId) => {
    setCurrentRoles(currentRoles.filter(r => r !== roleId));
  };

  const getRoleLabel = (roleId) => roles.find(r => r.id === roleId)?.label || roleId;

  const getUserDisplayName = () => {
    if (!user) return 'User';
    return `${user.firstname || ''} ${user.lastname || ''}`.trim() || user.email || 'User';
  };

  const handleSubmit = async () => {
    try {
      const result = await apiFetch(`${USERS}/roles`, {
        method: 'PUT',
        body: { roles: currentRoles, userId: user?.id }
      });
      setResponse(result);
      
      if (result?.success) {
        setTimeout(() => {
          navigate(-1);
        }, 1500);
      }
    } catch (error) {
      setResponse({ success: false, message: 'Failed to update roles. Please try again.' });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full overflow-y-auto h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-800 rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-500 text-sm">Loading user data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full overflow-y-auto h-screen bg-gray-50 py-8">
      <div className="px-6">
        
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="bg-transparent flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-4 text-sm transition"
          >
            <ArrowLeft size={16} /> Back
          </button>
          
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
              <Users className="w-6 h-6 text-gray-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Manage User Roles</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm font-medium text-gray-700">
                  {getUserDisplayName()}
                </span>
                {user?.email && (
                  <span className="text-xs text-gray-400">{user.email}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Response Message */}
        <ResponseMessage response={response} setResponse={setResponse} />

        {/* Current Roles Section */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <label className="text-sm font-semibold text-gray-800 flex items-center gap-2">
              Current Roles
              <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full font-medium">
                {currentRoles.length}
              </span>
            </label>
            {currentRoles.length > 0 && (
              <button
                onClick={() => setCurrentRoles([])}
                className="text-xs text-gray-500 hover:text-red-500 font-medium flex items-center gap-1 px-2 py-1 rounded-md hover:bg-red-50 transition"
              >
                <Trash2 className="w-3 h-3" />
                Clear all
              </button>
            )}
          </div>

          {currentRoles.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {currentRoles.map((roleId, index) => (
                <div
                  key={index}
                  className="group flex items-center gap-2 pl-3 pr-2 py-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md hover:border-gray-300 transition"
                >
                  <Shield className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">
                    {getRoleLabel(roleId)}
                  </span>
                  <button
                    onClick={() => removeRole(roleId)}
                    className="p-1 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition ml-1"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
              <Shield className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No roles assigned</p>
            </div>
          )}
        </div>

        {/* Available Roles Section */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <label className="text-sm font-semibold text-gray-800 mb-4 block">
            Available Roles
          </label>

          {/* Search Input */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search roles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-400 transition"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>

          {/* Roles List */}
          {availableRoles.length > 0 ? (
            <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
              {availableRoles.map((role, index) => (
                <div
                  key={index}
                  className="group flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100 hover:border-gray-300 hover:shadow-sm transition cursor-pointer"
                  onClick={() => assignRole(role.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-gray-200 transition">
                      <Shield className="w-5 h-5 text-gray-500" />
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-gray-800 block">
                        {role.label}
                      </span>
                      <span className="text-xs text-gray-500">
                        {role.desc}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      assignRole(role.id);
                    }}
                    className="w-8 h-8 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-800 hover:text-white flex items-center justify-center transition"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-200">
              <Search className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No available roles found</p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="text-sm text-gray-600 hover:text-gray-800 mt-2 font-medium"
                >
                  Clear search
                </button>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between mt-6 pt-4">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Clock className="w-3 h-3" />
            <span>Changes apply immediately</span>
          </div>
          <div className="flex gap-3">
            <Button
              variant="light"
              onClick={() => navigate(-1)}
              className="px-5 py-2 rounded-lg font-medium text-gray-700 hover:bg-gray-100 border-0"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className="px-5 py-2 rounded-lg font-medium bg-gray-800 hover:bg-gray-700 text-white border-0 shadow-sm hover:shadow transition flex items-center gap-2"
            >
              <Save size={16} />
              Save Changes
            </Button>
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { 
          width: 4px; 
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}</style>
    </div>
  );
}