import { Outlet } from "react-router-dom";
import AuthHeader from "./AuthHeader";
import Header from "../header/Header";
import AuthFooter from "./AuthFooter";

export default function AuthLayout() {
    return (
        <div className="min-h-screen bg-gradient-to-r from-slate-100 to-white">
            <AuthHeader />
            <Outlet />
            <AuthFooter />
        </div>
    );
}