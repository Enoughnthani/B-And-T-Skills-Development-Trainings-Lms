export default function PageNotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-slate-50 to-slate-45 text-center px-4">
            <h1 className="text-9xl font-extrabold text-red-600  mb-4">
                404
            </h1>
            <p className="text-2xl font-semibold text-gray-700 mb-6">
                Oops! The page you are looking for does not exist.
            </p>
            <p className="text-gray-500 mb-8">
                It might have been moved, renamed, or never existed in the first place.
            </p>
            <a
                href="/"
                className="inline-block bg-red-600 text-white px-6 py-3 rounded-lg "
            >
                Go Back Home
            </a>
            <div className="mt-10">
                {/* Optional: fun icon or illustration */}
                <svg
                    className="w-40 h-40 mx-auto text-purple-200"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13 16h-1v-4h-1m4-2h1m-6 0h1m-2 2h.01M12 12a9 9 0 100-18 9 9 0 000 18z"
                    />
                </svg>
            </div>
        </div>
    )
}
