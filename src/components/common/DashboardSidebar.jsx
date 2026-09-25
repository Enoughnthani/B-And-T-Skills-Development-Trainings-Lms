import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut } from 'lucide-react';
import LogoImage from '@/components/common/LogoImage';

export default function DashboardSidebar({
  menuItems = [],
  roleLabel = 'User',
  homePath = '/',
  user,
  onLogout,
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => {
    if (path === homePath) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  const handleNavClick = (item) => {
    if (item.event) item.event();
    else navigate(item.path);
    setMobileOpen(false);
  };

  const handleLogout = () => {
    onLogout?.();
    setMobileOpen(false);
  };

  return (
    <>
  
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-slate-50 shadow-sm">
        <div className="flex items-center justify-between h-14 px-2">
          <LogoImage />
          <button
            onClick={() => setMobileOpen(true)}
            className="w-10 h-10 flex items-center justify-center text-zinc-700 hover:bg-zinc-100 rounded-md transition-colors"
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
        </div>
      </div>

    
      <aside className="hidden md:flex md:flex-col md:w-64 md:shrink-0 bg-white border-r border-zinc-200 h-screen">
        <SidebarHeader user={user} roleLabel={roleLabel} />

        <nav className="flex-1 overflow-y-auto px-3 py-2">
          <SidebarNav
            items={menuItems}
            isActive={isActive}
            onNavClick={handleNavClick}
          />
        </nav>

        <SidebarLogout onLogout={handleLogout} />
      </aside>

      {mobileOpen && (
        <>
          <div
            className="md:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />

          <aside className="md:hidden fixed top-0 left-0 bottom-0 z-50 w-72 bg-white shadow-2xl flex flex-col animate-slide-in">
            <div className="flex items-center justify-between p-4 border-b border-zinc-100 shrink-0">
              <LogoImage />
              <button
                onClick={() => setMobileOpen(false)}
                className="w-10 h-10 flex items-center justify-center text-zinc-500 hover:bg-zinc-100 rounded-md transition-colors"
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>

            <UserBadge user={user} roleLabel={roleLabel} className="mx-3 mt-3 shrink-0" />

            <nav className="flex-1 overflow-y-auto p-3">
              <SidebarNav
                items={menuItems}
                isActive={isActive}
                onNavClick={handleNavClick}
                variant="mobile"
              />
            </nav>

            <SidebarLogout onLogout={handleLogout} />
          </aside>
        </>
      )}
    </>
  );
}



function SidebarHeader({ user, roleLabel }) {
  return (
    <div className="shrink-0 py-6 px-2">
      <div className="flex mx-2 items-center gap-3 pb-4">
        <LogoImage />
      </div>
      {user && <UserBadge user={user} roleLabel={roleLabel} className="mx-2" />}
    </div>
  );
}

function UserBadge({ user, roleLabel, className = '' }) {
  if (!user) return null;
  return (
    <div className={`px-3 py-2 rounded-lg ${className}`}>
      <div className="text-[11px] font-bold text-zinx-800 uppercase">
        {roleLabel}
      </div>
      <div className="text-xs text-zinc-400 truncate">
        {user.firstname} {user.lastname}
      </div>
    </div>
  );
}

function SidebarNav({ items, isActive, onNavClick }) {
  const activeClass = 'bg-zinc-100 text-black border-l-4 border-[#E30613] font-semibold';
  const inactiveClass = 'text-zinc-600 hover:bg-zinc-50 hover:text-black';

  return (
    <ul className="space-y-1 p-0">
      {items.map((item, idx) => (
        <li
          key={idx}
          onClick={() => onNavClick(item)}
          className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
            isActive(item.path) ? activeClass : inactiveClass
          }`}
        >
          <span className="text-lg shrink-0">{item.icon}</span>
          <span className="font-medium truncate">{item.label}</span>
        </li>
      ))}
    </ul>
  );
}

function SidebarLogout({ onLogout }) {
  return (
    <div className="shrink-0 border-t border-zinc-100 p-3">
      <button
        onClick={onLogout}
        className="w-full flex items-center gap-3 p-3 rounded-lg text-[#E30613] bg-transparent hover:!bg-red-50 hover:text-[#c00511] transition-all"
      >
        <LogOut size={18} />
        <span className="font-medium">Logout</span>
      </button>
    </div>
  );
}