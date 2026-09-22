import { Lock } from "lucide-react";

export default function ForbiddenPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-slate-50 to-slate-40 p-4">
      <div className="relative bg-white rounded-3xl shadow-2xl p-12 max-w-2xl w-full text-center overflow-hidden">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <Lock className="w-16 h-16 text-red-600" />
        </div>

        {/* Headings */}
        <h1 className="text-7xl font-extrabold text-red-600 mb-4">403</h1>
        <h2 className="text-3xl font-semibold mb-4 text-gray-800">Forbidden</h2>
        <p className="text-gray-600 mb-8">
          Oops! You do not have permission to access this page.
        </p>

        {/* Buttons */}
        <div className="flex justify-center gap-4">
          <a
            href="/"
            className="px-6 py-3 bg-red-600 text-white font-medium rounded-lg shadow-md hover:bg-red-700 transition-all transform hover:-translate-y-1"
          >
            Go Home
          </a>
        </div>

        {/* Footer Accent */}
        <div className="mt-10 text-xs text-gray-400">Error code: 403</div>
      </div>
    </div>
  );
}
