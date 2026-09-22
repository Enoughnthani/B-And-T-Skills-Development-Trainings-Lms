import { Outlet } from "react-router-dom";

export default function AuthLayout() {
    return (
        <div className="min-h-screen bg-gradient-to-r from-slate-100 to-white">
            <Outlet />
        </div>
    );
}