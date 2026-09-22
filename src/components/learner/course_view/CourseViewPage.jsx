// AdminDashboard.jsx
import { apiFetch } from "@/api/api";
import { useAuth } from "@/contexts/AuthContext";
import { GETUSERS } from "@/utils/apiEndpoint";
import { Eye, Home, LogOut, Megaphone, Podcast, Radio, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import {
    FaBell,
    FaBook,
    FaChartLine,
    FaClipboardList,
    FaCog,
    FaComments,
    FaDatabase,
    FaHistory,
    FaHornbill,
    FaQuestionCircle,
    FaShieldAlt,
    FaUserPlus,
    FaUsers
} from "react-icons/fa";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useTopLoader } from "@/contexts/TopLoaderContext";
import LogoImage from "@/components/common/LogoImage";

export const CourseViewPage = () => {
    const [step, setStep] = useState(0);
    const [response, setResponse] = useState(null);
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const { start, complete, visible } = useTopLoader();
    const [users, setUsers] = useState(null);
    const location = useLocation()
    const { unitStandard } = location?.state || {}

    return (
        <div className="min-h-screen flex text-gray-800">

            <aside className="hidden md:block min-w-[16rem] bg-white shadow-md border !border-gray-200 py-6 px-1.5 ">
                <div className="flex mx-2 items-center gap-3 pb-4">
                    <LogoImage onClick={() => navigate('/user/learner')} />
                </div>

                <ul className="p-1">
                    {[
                        { icon: <Home />, label: "Home", path: '/user/learner' },
                        { icon: <Eye />, label: "Overview", path: '' },
                        { icon: <FaBook />, label: "Content", path: 'content' },
                        { icon: <FaClipboardList />, label: "Assessments", path: 'assessments' },
                    ].map((item, idx) => {
                        const isLogout = item.label === "Logout";
                        return (
                            <li
                                onClick={() => { isLogout ? item.event() : navigate(item.path, { state: { unitStandard } }) }}
                                key={idx}
                                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${isLogout
                                    ? "text-red-600 hover:bg-red-50 hover:text-red-700 mt-0 border-t border-gray-200"
                                    : location.pathname === item.path
                                        ? "bg-gradient-to-r from-green-50 to-green-50/50 text-green-800 border-l-4 border-green-800 font-semibold"
                                        : "text-gray-600 hover:bg-green-50/30 hover:text-green-800"
                                    }`}
                            >
                                <span className="text-lg">{item.icon}</span>
                                <span className="font-medium">{item.label}</span>
                            </li>
                        );
                    })}
                </ul>
            </aside>

            <Outlet />
        </div>
    );
}