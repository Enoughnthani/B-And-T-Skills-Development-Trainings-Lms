import { FaChartLine, FaGraduationCap, FaUsers } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function AnalyticTab({ getEnrollmentPercentage,program}) {
    const navigate = useNavigate()

    return (<div className="p-6 lg:p-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Program Analytics</h3>
        <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 text-center">
                <FaChartLine className="text-blue-600 text-3xl mx-auto mb-3" />
                <div className="text-2xl font-bold text-gray-900">{getEnrollmentPercentage().toFixed(0)}%</div>
                <p className="text-sm text-gray-600 mt-1">Enrollment Rate</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 text-center">
                <FaUsers className="text-green-600 text-3xl mx-auto mb-3" />
                <div className="text-2xl font-bold text-gray-900">{program.enrolledCount}/{program.capacity}</div>
                <p className="text-sm text-gray-600 mt-1">Total Enrolled</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 text-center">
                <FaGraduationCap className="text-purple-600 text-3xl mx-auto mb-3" />
                <div className="text-2xl font-bold text-gray-900">0</div>
                <p className="text-sm text-gray-600 mt-1">Completed</p>
            </div>
        </div>
        <div className="text-center pt-4">
            <button onClick={()=>navigate(`/user/program-manager/program/analytics/${program.id}`)} className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                <FaChartLine /> View Detailed Analytics Report
            </button>
        </div>
    </div>
    )
}