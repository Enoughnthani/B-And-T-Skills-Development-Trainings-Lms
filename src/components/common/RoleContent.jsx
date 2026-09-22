import { Dropdown } from "react-bootstrap";
import { FaBookOpen, FaChalkboardTeacher, FaClipboardCheck, FaCrown, FaGavel, FaSeedling, FaUserGraduate } from "react-icons/fa";
import { FiUser } from "react-icons/fi";

export default function RoleContent({ roles }) {

    return (

        <div className="flex items-center gap-1">
            {roles && roles.length > 0 ? (
                <>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-rose-50 text-rose-700 border border-rose-100 ring-1 ring-rose-100/50">
                        {getRoleIcon(roles[0])}
                        {roles[0]}
                    </span>
                    {roles.length > 1 && (
                        <Dropdown onClick={(e)=>e.stopPropagation()} align="end">
                            <Dropdown.Toggle
                                as="span"
                                className="cursor-pointer inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-white text-slate-600 hover:bg-white hover:text-slate-800 transition-colors border-0"
                            >
                                +{roles.length - 1}
                            </Dropdown.Toggle>
                            <Dropdown.Menu className="p-2 min-w-[160px] border border-slate-200 rounded-lg mt-1">
                                {roles.slice(1).map((r, idx) => (
                                    <Dropdown.Item
                                        key={idx}
                                        className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 rounded-md hover:bg-white transition-colors"
                                        disabled
                                    >
                                        {getRoleIcon(r)}
                                        <span>{r}</span>
                                    </Dropdown.Item>
                                ))}
                            </Dropdown.Menu>
                        </Dropdown>
                    )}
                </>
            ) : (
                <span className="text-slate-400 text-sm italic">No role assigned</span>
            )}
        </div>
    )
}

export const getRoleIcon = (role, size = 14) => {
    const iconProps = {
        size,
        className: 'transition-transform group-hover:scale-110'
    };
    switch (role?.toUpperCase()) {
        case 'ADMIN':
            return <FaCrown {...iconProps} className="text-amber-500" />;
        case 'FACILITATOR':
            return <FaChalkboardTeacher {...iconProps} className="text-blue-500" />;
        case 'MENTOR':
            return <FaUserGraduate {...iconProps} className="text-purple-500" />;
        case 'INTERN':
            return <FaSeedling {...iconProps} className="text-green-500" />;
        case 'LEARNER':
            return <FaBookOpen {...iconProps} className="text-indigo-500" />;
        case 'ASSESSOR':
            return <FaClipboardCheck {...iconProps} className="text-orange-500" />;
        case 'MODERATOR':
            return <FaGavel {...iconProps} className="text-red-500" />;
        default:
            return <FiUser {...iconProps} className="text-gray-400" />;
    }
};