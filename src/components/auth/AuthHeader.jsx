import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import logo from "@/resources/logo.png"

export default function AuthHeader() {
  return (
    <header className="border-b border-slate-200 bg-zinc-50">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="B&T LMS" className="h-9 w-auto" />
          </Link>

          {/* Home button */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 hover:border-slate-400 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft size={14} />
            Home
          </Link>
        </div>
      </div>
    </header>
  );
}