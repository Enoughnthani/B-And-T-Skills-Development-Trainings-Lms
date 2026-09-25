import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-zinc-900 text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-[#E30613] text-white font-bold text-sm px-2 py-1 rounded-sm">
                B&T
              </div>
              <span className="font-bold text-sm">Skills Development Trainings</span>
            </div>
            <p className="text-sm text-zinc-400 max-w-md leading-relaxed">
              Developing People. Strengthening Businesses. Creating Opportunities.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li>
                <Link to="/programmes" className="hover:text-[#E30613] transition-colors">
                  Programmes
                </Link>
              </li>
              <li>
                <Link to="/announcements" className="hover:text-[#E30613] transition-colors">
                  Announcements
                </Link>
              </li>
              <li>
                <Link to="/resources" className="hover:text-[#E30613] transition-colors">
                  Resources
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#E30613] transition-colors">
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-bold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li>
                <Link to="/popi" className="hover:text-[#E30613] transition-colors">
                  POPI Act
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-[#E30613] transition-colors">
                  Terms
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-[#E30613] transition-colors">
                  Privacy
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#E30613] transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-zinc-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-zinc-500">
          <p>© 2026 B and T Skills Development Trainings. All Rights Reserved.</p>
          <p className="italic">Skills Today. Opportunities Tomorrow.</p>
        </div>
      </div>
    </footer>
  );
}