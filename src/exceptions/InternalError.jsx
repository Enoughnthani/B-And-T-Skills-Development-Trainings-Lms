export default function InternalError() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-50  to-slate-40 p-4 text-center">
            {/* Big error code */}
            <h1 className="text-8xl md:text-[12rem] font-extrabold text-red-600">
                500
            </h1>

            {/* Error message */}
            <p className="mt-4 text-xl md:text-2xl text-gray-700 max-w-lg">
                Something went wrong on our end. Please try again later.
            </p>

            {/* Optional home button */}
            <button
                onClick={() => window.location.href = "/"}
                className="mt-8 px-6 py-3 bg-red-600 text-white rounded-lg  hover:bg-red-700 transition-all duration-300"
            >
                Go Home
            </button>

            <div className="mt-10 text-xs text-gray-400">Error code: 403</div>
        </div>
    );
}
