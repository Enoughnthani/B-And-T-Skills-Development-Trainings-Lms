import { apiFetch } from '@/api/api';
import { useEffect, useState } from 'react';
import { Badge, Button } from 'react-bootstrap';
import {
    FaBook,
    FaCalendarAlt,
    FaClipboardList,
    FaEdit,
    FaFileAlt,
    FaGraduationCap,
    FaLink,
    FaStar,
    FaTrash,
    FaVideo
} from 'react-icons/fa';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

export default function UnitStandardOverview() {
    const { programId, unitStandardId } = useParams();
    const navigate = useNavigate();
    const location = useLocation()
    const [unitStandard, setUnitStandard] = useState(location?.state?.unitStandard || {});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(false)

        const getStats = async () => {
            const data = await apiFetch(`/api/unit-standards/${unitStandard?.unitStandardId}`)
            setUnitStandard(data)
        }

        getStats()

    }, [location])

    const getTypeBadge = (type) => {
        const styles = {
            FUNDAMENTAL: { bg: '!bg-blue-50', text: 'text-blue-700' },
            CORE: { bg: '!bg-green-50', text: 'text-green-700' },
            ELECTIVE: { bg: '!bg-purple-50', text: 'text-purple-700' }
        };
        const style = styles[type] || styles.CORE;
        return <Badge className={`${style.bg} ${style.text} px-2 py-1 text-xs`}>{type}</Badge>;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-50">
                <div className="text-center">
                    <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-800 rounded-full animate-spin mx-auto mb-3"></div>
                    <p className="text-gray-500 text-sm">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full bg-gray-50 overflow-y-auto h-screen">
            <div className="px-6 py-6">

                {/* Header Card */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 shadow-sm">
                    <div className="flex justify-between items-start flex-wrap gap-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                                <span className="font-mono text-sm font-bold text-gray-800 bg-gray-100 px-2 py-1 rounded">
                                    ID: {unitStandard.unitStandardId}
                                </span>
                                {getTypeBadge(unitStandard.type)}
                                <span className="text-xs text-gray-400">
                                    Program: {unitStandard.programName}
                                </span>
                            </div>
                            <h1 className="text-xl font-bold text-gray-800 mb-2">{unitStandard.title}</h1>
                            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                                <span className="flex items-center gap-1">
                                    <FaStar className="text-amber-400" size={14} />
                                    {unitStandard.credits} credits
                                </span>
                                <span className="flex items-center gap-1">
                                    <FaGraduationCap size={14} />
                                    {unitStandard.nqfLevel}
                                </span>
                                <span className="flex items-center gap-1">
                                    <FaCalendarAlt size={14} />
                                    Updated: {new Date(unitStandard.updatedAt).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Cards - Only stats, no actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Content Stats */}
                    <div className="bg-white rounded-xl border border-gray-200 p-5">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                                <FaBook className="text-blue-500 text-lg" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 uppercase">Total Contents</p>
                                <p className="text-2xl font-bold text-gray-800">{unitStandard.contentCount || 0}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-500 pt-2 border-t border-gray-100">
                            <span className="flex items-center gap-1">
                                <FaFileAlt size={10} /> Files
                            </span>
                            <span className="flex items-center gap-1">
                                <FaVideo size={10} /> Videos
                            </span>
                            <span className="flex items-center gap-1">
                                <FaLink size={10} /> Links
                            </span>
                        </div>
                    </div>

                    {/* Assessment Stats */}
                    <div className="bg-white rounded-xl border border-gray-200 p-5">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
                                <FaClipboardList className="text-purple-500 text-lg" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 uppercase">Total Assessments</p>
                                <p className="text-2xl font-bold text-gray-800">{unitStandard.assessmentCount || 0}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-500 pt-2 border-t border-gray-100">
                            <span className="flex items-center gap-1">
                                <FaClipboardList size={10} /> Quizzes
                            </span>
                            <span className="flex items-center gap-1">
                                <FaClipboardList size={10} /> Assignments
                            </span>
                            <span className="flex items-center gap-1">
                                <FaClipboardList size={10} /> Exams
                            </span>
                        </div>
                    </div>

                    
                    <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-xl p-5 shadow-md">
                        <div className="flex items-center justify-between mb-3">
                            <div>
                                <p className="text-xs text-gray-300 uppercase">Total Learning Hours</p>
                                <p className="text-2xl font-bold text-white">
                                    {unitStandard.credits * 10 || 0}
                                </p>
                            </div>
                            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                                <FaCalendarAlt className="text-white text-lg" />
                            </div>
                        </div>
                        <div className="text-xs text-gray-300 pt-2 border-t border-gray-600">
                            Based on {unitStandard.credits} credits (10 hours per credit)
                        </div>
                    </div>
                </div>

                <div className='shadow-sm bg-white rounded p-2 my-4'>
                    <h4>Description</h4>

                    {unitStandard.description && (
                        <p className="text-gray-600 text-sm mt-4 leading-relaxed">{unitStandard.description}</p>
                    )}
                </div>
            </div>
        </div>
    );
}