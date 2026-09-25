import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LogIn,
  Menu,
  X,
  Home as HomeIcon,
  BookOpen,
  Bell,
  FileText,
  Users,
  MessageCircle,
} from 'lucide-react';

import logo from '@/resources/logo.png';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { label: 'Home', path: '/', icon: HomeIcon },
    { label: 'Programmes', path: '/programmes', icon: BookOpen },
    { label: 'Announcements', path: '/announcements', icon: Bell },
    { label: 'Resources', path: '/resources', icon: FileText },
    { label: 'About', path: '/about', icon: Users },
    { label: 'Contact', path: '/contact', icon: MessageCircle },
  ];

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className="bg-white border-b border-zinc-200 sticky top-0 z-50">
      <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <img src={logo} alt="B&T LMS" className="h-9 w-auto" />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.path}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive(link.path)
                    ? 'text-[#E30613]'
                    : 'text-zinc-600 hover:text-[#E30613]'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop actions */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Login */}
            <Link
              to="/login"
              className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-[#E30613] hover:bg-[#c00511] rounded-md transition-colors"
            >
              <LogIn size={16} />
              Log In
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden flex items-center justify-center w-10 h-10 text-zinc-700 hover:text-[#E30613] hover:bg-zinc-100 rounded-md transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-zinc-200">
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">
            {/* Nav links */}
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.path}
                className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-md transition-colors ${
                  isActive(link.path)
                    ? 'text-[#E30613] bg-red-50'
                    : 'text-zinc-700 hover:bg-zinc-50'
                }`}
              >
                <link.icon size={18} />
                {link.label}
              </Link>
            ))}

            {/* Login button */}
            <Link
              to="/login"
              className="flex items-center justify-center gap-2 w-full mt-3 px-4 py-2.5 text-sm font-bold text-white bg-[#E30613] hover:bg-[#c00511] rounded-md transition-colors"
            >
              <LogIn size={16} />
              Log In
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}