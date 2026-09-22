import { apiFetch } from '@/api/api';
import { useEffect, useState } from 'react';
import { Badge, Button, ProgressBar, Spinner } from 'react-bootstrap';
import {
    FaArrowLeft,
    FaBook,
    FaCalendarAlt,
    FaChevronRight,
    FaClipboardList, FaFileAlt,
    FaGraduationCap,
    FaLink,
    FaStar,
    FaVideo
} from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';

export default function LearnerUnitStandardOverview() {
    const navigate = useNavigate();
    const { unitStandardId } = useParams();
    const [unitStandard, setUnitStandard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState({
        contentCompleted: 0,
        contentTotal: 0,
        assessmentCompleted: 0,
        assessmentTotal: 0
    });

    useEffect(() => {
        fetchUnitStandard();
    }, [unitStandardId]);

    const fetchUnitStandard = async () => {
        try {
            setLoading(true);
            const response = await apiFetch(`/api/unit-standards/${unitStandardId}`);
            const data = response?.payload || response;
            setUnitStandard(data);


        } catch (error) {
            console.error('Error fetching unit standard:', error);
        } finally {
            setLoading(false);
        }
    };

    const getTypeBadge = (type) => {
        const styles = {
            FUNDAMENTAL: { bg: '!bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
            CORE: { bg: '!bg-green-50', text: 'text-green-700', border: 'border-green-200' },
            ELECTIVE: { bg: '!bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' }
        };
        const style = styles[type] || styles.CORE;
        return <Badge className={`${style.bg} ${style.text} px-2 py-1 text-xs border`}>{type}</Badge>;
    };

    

    if (loading) {
        return (
            <div className="flex w-full items-center justify-center h-screen bg-gray-50">
                <div className="text-center">
                    <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-800 rounded-full animate-spin mx-auto mb-3"></div>
                    <Spinner className='text-gray-600'/>
                </div>
            </div>
        );
    }

    if (!unitStandard) {
        return (
            <div className="w-full flex items-center justify-center h-screen bg-gray-50">
                <div className="text-center">
                    <FaBook className="text-gray-300 text-5xl mx-auto mb-3" />
                    <p className="text-gray-500">Unit Standard not found</p>
                    <Button variant="primary" size="sm" onClick={() => navigate(-1)} className="mt-3 ">
                        Go Back
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full overflow-y-auto h-screen bg-gray-50">
            <div className="px-6 py-6">

                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex bg-transparent items-center gap-2 text-gray-500 hover:text-gray-700 mb-4 text-sm transition"
                >
                    <FaArrowLeft size={14} /> Back
                </button>

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
                                    {unitStandard.programName}
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
                        <div className="flex gap-2">
                            <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={() => navigate('content', { state: { unitStandard } })}
                                className="flex items-center gap-1"
                            >
                                <FaBook size={12} /> View Content
                            </Button>
                            <Button
                                variant="outline-secondary"
                                size="sm"
                                onClick={() => navigate('assessments', { state: { unitStandard } })}
                                className="flex items-center gap-1"
                            >
                                <FaClipboardList size={12} /> Assessments
                            </Button>
                        </div>
                    </div>
                </div>



                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Content Stats */}
                    <div
                        className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition cursor-pointer"
                        onClick={() => navigate('content', { state: { unitStandard } })}
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                                    <FaBook className="text-blue-500 text-lg" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase">Learning Content</p>
                                    <p className="text-2xl font-bold text-gray-800">{unitStandard.contentCount || 0}</p>
                                </div>
                            </div>
                            <FaChevronRight className="text-gray-300" />
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-500 pt-2 border-t border-gray-100">
                            <span className="flex items-center gap-1">
                                <FaFileAlt size={10} /> Documents
                            </span>
                            <span className="flex items-center gap-1">
                                <FaVideo size={10} /> Videos
                            </span>
                            <span className="flex items-center gap-1">
                                <FaLink size={10} /> Links
                            </span>
                        </div>
                        {progress.contentTotal > 0 && (
                            <div className="mt-3">
                                <div className="flex justify-between text-xs text-gray-500 mb-1">
                                    <span>Your progress</span>
                                    <span>{progress.contentCompleted}/{progress.contentTotal}</span>
                                </div>
                                <ProgressBar
                                    now={(progress.contentCompleted / progress.contentTotal) * 100}
                                    className="h-1"
                                    variant="info"
                                />
                            </div>
                        )}
                    </div>

                    {/* Assessment Stats */}
                    <div
                        className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition cursor-pointer"
                        onClick={() => navigate('assessments', { state: { unitStandard } })}
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
                                    <FaClipboardList className="text-purple-500 text-lg" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase">Assessments</p>
                                    <p className="text-2xl font-bold text-gray-800">{unitStandard.assessmentCount || 0}</p>
                                </div>
                            </div>
                            <FaChevronRight className="text-gray-300" />
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-500 pt-2 border-t border-gray-100">
                            <span className="flex items-center gap-1">
                                <FaClipboardList size={10} /> Workbooks
                            </span>
                            <span className="flex items-center gap-1">
                                <FaClipboardList size={10} /> Summative
                            </span>
                            <span className="flex items-center gap-1">
                                <FaClipboardList size={10} /> Exams
                            </span>
                        </div>
                        {progress.assessmentTotal > 0 && (
                            <div className="mt-3">
                                <div className="flex justify-between text-xs text-gray-500 mb-1">
                                    <span>Your progress</span>
                                    <span>{progress.assessmentCompleted}/{progress.assessmentTotal}</span>
                                </div>
                                <ProgressBar
                                    now={(progress.assessmentCompleted / progress.assessmentTotal) * 100}
                                    className="h-1"
                                    variant="success"
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Description*/}
                <div className="bg-white rounded-xl border border-gray-200 p-5 mt-4 shadow-sm">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        Unit Standard Description
                    </h4>
                    <div>
                        {unitStandard.description && (
                            <p className="text-gray-600 text-sm mt-4 leading-relaxed">{unitStandard.description}</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}