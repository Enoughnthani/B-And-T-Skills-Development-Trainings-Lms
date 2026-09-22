// AdminDashboard.jsx
import { apiFetch } from "@/api/api";
import LogoImage from "@/components/common/LogoImage";
import { useEffect, useState } from "react";
import {
  FaHome,
  FaUsers
} from "react-icons/fa";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";

export default function MentorProgramView() {
  const navigate = useNavigate();
  const location = useLocation()
  const programId = useParams();


  return (
    <div className="min-h-screen flex text-gray-800">

      <aside className="hidden md:block min-w-[16rem] bg-white shadow-md border !border-gray-200 py-6 px-1.5 ">
        <div className="flex mx-2 items-center gap-3 pb-4">
          <LogoImage />
        </div>

        <ul className="p-1">
          {[
            { icon: <FaHome size={20} />, label: "Home", path: '/user/mentor' },
            { icon: <FaUsers />, label: "Overview", path: `/user/mentor/program-view/${programId.programId}` },
            { icon: <FaUsers />, label: "Interns", path: `/user/mentor/program-view/${programId.programId}/interns` },
          ].map((item, idx) => {
            const isLogout = item.label === "Logout";
            return (
              <li
                onClick={() => { isLogout ? item.event() : navigate(item.path) }}
                key={idx}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${isLogout
                  ? "text-red-600 hover:bg-red-50 hover:text-red-700 mt-0 border-t border-gray-200"
                  : location.pathname === item.path
                    ? "bg-gradient-to-r from-blue-50 to-blue-50/50 text-blue-800 border-l-4 border-blue-800 font-semibold"
                    : "text-gray-600 hover:bg-blue-50/30 hover:text-blue-800"
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