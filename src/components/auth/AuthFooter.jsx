import { Link } from 'react-router-dom';

export default function AuthFooter() {
  return (
    <footer className="border-t bg-zinc-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Copyright */}
          <p className="text-xs text-slate-400 text-center sm:text-left">
            © 2026 B and T Skills Development Trainings
          </p>

          {/* Links */}
          <div className="flex items-center gap-5 text-xs">
            <Link
              to="/popi"
              className="text-slate-400 hover:text-slate-700 transition-colors"
            >
              POPI Act
            </Link>
            <Link
              to="/privacy"
              className="text-slate-400 hover:text-slate-700 transition-colors"
            >
              Privacy
            </Link>
            <Link
              to="/terms"
              className="text-slate-400 hover:text-slate-700 transition-colors"
            >
              Terms
            </Link>
            <Link
              to="/contact"
              className="text-slate-400 hover:text-slate-700 transition-colors"
            >
              Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}