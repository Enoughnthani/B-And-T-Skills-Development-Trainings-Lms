import { useAuth } from "@/contexts/AuthContext";
import { LogOut } from "lucide-react";
import {
  FaBell,
  FaChartLine,
  FaCog,
  FaQuestionCircle,
  FaUsers
} from "react-icons/fa";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import LogoImage from "../common/LogoImage";

export default function InternPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex text-gray-800">

      <aside className="hidden md:block min-w-[16rem] bg-white shadow-md border !border-gray-200 py-6 px-1.5 ">
        <div className="flex mx-2 items-center gap-3 pb-4">
         <LogoImage/>
        </div>

        <ul className="p-1">
          {[
            { icon: <FaChartLine />, label: "Overview", path: '/user/intern' },
            { icon: <FaUsers />, label: "Reports", path: '/user/intern/reports' },
            { icon: <FaCog />, label: "Profile", path: '/user/intern/profile' },
            { icon: <LogOut />, label: "Logout", event: logout },
          ].map((item, idx) => {
            const isLogout = item.label === "Logout";
            return (
              <li
                onClick={() => { isLogout ? item.event() : navigate(item.path) }}
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