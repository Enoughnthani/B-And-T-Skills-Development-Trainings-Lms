// layouts/MainLayout.jsx
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { FaTachometerAlt, FaGraduationCap, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '@/contexts/AuthContext';
import LogoImage from '@/components/common/LogoImage';

export default function MainLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: <FaTachometerAlt />, label: "Overview", path: '/user/program-manager' },
    { icon: <FaGraduationCap />, label: "Programs", path: '/user/program-manager/programs' },
    { icon: <FaUser />, label: "Profile", path: '/user/program-manager/profile' },
  ];

  return (
    <div className="min-h-screen flex text-gray-800">
      {/* Sidebar */}
      <aside className="hidden md:block min-w-[16rem] bg-white shadow-md border !border-gray-200 py-6 px-1.5">
        <div className="flex mx-2 items-center gap-3 pb-4">
          <LogoImage />
        </div>

        <ul className="p-1">
          {menuItems.map((item, idx) => {
            const isActive = location.pathname === item.path || 
              (item.path === '/programs' && location.pathname.startsWith('/programs'));
            return (
              <li
                onClick={() => navigate(item.path)}
                key={idx}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-green-50 to-green-50/50 text-green-800 border-l-4 border-green-800 font-semibold"
                    : "text-gray-600 hover:bg-green-50/30 hover:text-green-800"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </li>
            );
          })}
          
          {/* Logout Button */}
          <li
            onClick={logout}
            className="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all text-red-600 hover:bg-red-50 hover:text-red-700 mt-0 border-t border-gray-200"
          >
            <span className="text-lg"><FaSignOutAlt /></span>
            <span className="font-medium">Logout</span>
          </li>
        </ul>

        {/* User Info */}
        {user && (
          <div className="mt-auto pt-4 mt-4 border-t border-gray-200 px-2">
            <p className="text-xs text-gray-500">Logged in as</p>
            <p className="text-sm font-medium text-gray-700 truncate">
              {user?.firstname} {user?.lastname}
            </p>
          </div>
        )}
      </aside>


      <main className="flex-1 overflow-y-auto bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
}