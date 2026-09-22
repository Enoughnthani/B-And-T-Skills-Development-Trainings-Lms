// AdminDashboard.jsx
import { apiFetch } from "@/api/api";
import LogoImage from "@/components/common/LogoImage";
import { useAuth } from "@/contexts/AuthContext";
import { Book, BookA, ChartArea, Clipboard, ClipboardList, File, Folder, Home, LogOut, TrendingUp, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "react-bootstrap";
import {
  FaBell,
  FaBook,
  FaCog,
  FaFolder,
  FaQuestionCircle,
  FaUsers
} from "react-icons/fa";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";

export default function FacilitatorProgramView() {
  const navigate = useNavigate();
  const location = useLocation()
  const [program, setProgram] = useState(location?.state?.program)
  const { programId } = useParams()
  const {user} = useAuth()
  const userType = user?.role[0]?.toLowerCase()

  useEffect(() => {
    const getProgram = async () => {
      const data = await apiFetch(`/api/programs/${programId}`)
      setProgram(data?.payload)
    }

    if (!program) {
      getProgram()
    }

  }, [location, programId])

  return (
    <div className="min-h-screen flex text-gray-800">

      <aside className="hidden md:block min-w-[16rem] bg-white shadow-md border !border-gray-200 py-6 px-1.5 ">
        <div className="flex mx-2 items-center gap-3 pb-4">
          <LogoImage onClick={() => navigate(`/user/${userType}`)} />
        </div>

        <div className="px-4">
          <Badge>
            {program?.category}
          </Badge>
        </div>

        <ul className="p-1">
          {[
            { icon: <Home size={20} className="text-zinc-500" />, label: "Home", path: `/user/${userType}` },
            { icon: <ChartArea size={20} className="text-amber-500" />, label: "Overview", path: `/user/${userType}/program-view/${program?.id}` },
            { icon: <FaBook size={20} className="text-green-400" />, label: "Unit Standards", path: 'unit-standards' },
            { icon: <Users size={20} className="text-blue-300" />, label: "Learners", path: 'learners' },

          ].map((item, idx) => {
            const isLogout = item.label === "Logout";
            return (
              <li
                onClick={() => { isLogout ? item.event() : navigate(item.path, { state: { program } }) }}
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