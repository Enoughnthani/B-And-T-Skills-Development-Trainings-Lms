import { apiFetch } from "@/api/api"
import { useAuth } from "@/contexts/AuthContext"
import { BASE_URL, ME } from "@/utils/apiEndpoint"
import {
    ArrowRight,
    Bell,
    BookOpen,
    Calendar,
    CheckCircle2,
    ChevronDown,
    ClipboardCheck,
    Clock,
    FileText,
    GraduationCap,
    LayoutDashboard,
    LogOut,
    MapPin,
    Search,
    Settings,
    User2,
    UserCheck,
    Users
} from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { Badge, Button, Card, Dropdown, Spinner } from "react-bootstrap"
import { useLocation, useNavigate } from "react-router-dom"
import LogoImage from "../common/LogoImage"

// Role configuration object
const ROLE_CONFIG = {
    MODERATOR: {
        title: "Moderator Dashboard",
        icon: LayoutDashboard,
        roleFilter: "MODERATOR",
        stats: [
            { key: 'totalPrograms', label: 'Total Programs', icon: LayoutDashboard, color: 'indigo' },
            { key: 'activePrograms', label: 'Active Now', icon: Calendar, color: 'teal' },
            { key: 'totalEnrolled', label: 'Total Enrolled', icon: Users, color: 'violet' }
        ],
        getStats: (programs) => ({
            totalPrograms: programs.length,
            activePrograms: programs.filter(p => p.status === 'ACTIVE').length,
            totalEnrolled: programs.reduce((acc, p) => acc + (p.enrolledCount || 0), 0)
        }),
        getCardBadge: (program) => program.enrolledCount > 0 ? { text: `${program.enrolledCount}/${program.capacity} enrolled`, color: 'bg-slate-800/80' } : null,
        getFooterValue: (program) => ({ count: program.enrolledCount || 0, label: 'enrolled', icon: Users }),
        navigateTo: (programId) => `/user/moderator/program-view/${programId}`,
        emptyMessage: "You currently don't have any programs assigned to you as a moderator."
    },
    ASSESSOR: {
        title: "Assessor Dashboard",
        icon: ClipboardCheck,
        roleFilter: "ASSESSOR",
        stats: [
            { key: 'totalPrograms', label: 'Total Programs', icon: LayoutDashboard, color: 'indigo' },
            { key: 'pendingReview', label: 'Pending Review', icon: Clock, color: 'amber' },
            { key: 'totalSubmissions', label: 'Total Submissions', icon: CheckCircle2, color: 'teal' }
        ],
        getStats: (programs, user) => {
            const getPending = (p) => p.submissions?.filter(s => s.status === 'PENDING' && s.assessorId === user?.id).length || 0
            const getTotal = (p) => p.submissions?.filter(s => s.assessorId === user?.id).length || 0
            return {
                totalPrograms: programs.length,
                pendingReview: programs.reduce((acc, p) => acc + getPending(p), 0),
                totalSubmissions: programs.reduce((acc, p) => acc + getTotal(p), 0)
            }
        },
        getCardBadge: (program, user) => {
            const pending = program.submissions?.filter(s => s.status === 'PENDING' && s.assessorId === user?.id).length || 0
            return pending > 0 ? { text: `${pending} pending`, color: 'bg-rose-500' } : null
        },
        getFooterValue: (program, user) => {
            const total = program.submissions?.filter(s => s.assessorId === user?.id).length || 0
            return { count: total, label: 'submissions', icon: Users }
        },
        navigateTo: (programId) => `/user/assessor/program-view/${programId}`,
        emptyMessage: "You currently don't have any programs assigned to you as an assessor."
    },
    FACILITATOR: {
        title: "Facilitator Dashboard",
        icon: Users,
        roleFilter: "FACILITATOR",
        stats: [
            { key: 'totalPrograms', label: 'Total Programs', icon: LayoutDashboard, color: 'indigo' },
            { key: 'activeLearners', label: 'Active Learners', icon: UserCheck, color: 'teal' },
            { key: 'upcomingSessions', label: 'Upcoming Sessions', icon: Clock, color: 'amber' }
        ],
        getStats: (programs) => {
            const getUpcoming = (p) => p.sessions?.filter(s => new Date(s.date) > new Date()).length || 0
            return {
                totalPrograms: programs.length,
                activeLearners: programs.reduce((acc, p) => acc + (p.enrolledCount || 0), 0),
                upcomingSessions: programs.reduce((acc, p) => acc + getUpcoming(p), 0)
            }
        },
        getCardBadge: (program) => program.enrolledCount > 0 ? { text: `${program.enrolledCount} learners`, color: 'bg-teal-500' } : null,
        getFooterValue: (program) => {
            const upcoming = program.sessions?.filter(s => new Date(s.date) > new Date()).length || 0
            return { count: upcoming, label: 'sessions', icon: BookOpen }
        },
        navigateTo: (programId) => `/user/facilitator/program-view/${programId}`,
        emptyMessage: "You currently don't have any programs assigned to you as a facilitator."
    }
}

const COLOR_MAP = {
    indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-200' },
    teal: { bg: 'bg-teal-50', text: 'text-teal-600', border: 'border-teal-200' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200' },
    violet: { bg: 'bg-violet-50', text: 'text-violet-600', border: 'border-violet-200' }
}

export default function StaffDashboard() {
    const { user, setUser, logout } = useAuth()
    const [programs, setPrograms] = useState([])
    const [loading, setLoading] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const navigate = useNavigate()
    const location = useLocation()

    // Determine current role from URL path
    const currentRole = useMemo(() => {
        const path = location.pathname.toLowerCase()
        if (path.includes('moderator')) return 'MODERATOR'
        if (path.includes('assessor')) return 'ASSESSOR'
        if (path.includes('facilitator')) return 'FACILITATOR'
        return 'MODERATOR' // default
    }, [location.pathname])

    const config = ROLE_CONFIG[currentRole]
    const stats = config.getStats(programs, user)

    useEffect(() => {
        setPrograms(
            user?.assignedPrograms?.filter(program =>
                program.assignedRoles?.includes(config.roleFilter)
            ) || []
        )
    }, [currentRole, user, config.roleFilter])


    function handleSwitchRole(role) {
        switch (role) {
            case 'MODERATOR': navigate('/user/moderator'); break
            case 'ASSESSOR': navigate('/user/assessor'); break
            case 'FACILITATOR': navigate('/user/facilitator'); break
            default: navigate('/user/facilitator')
        }
    }

    const getUserRoles = () => user?.role || []

    const filteredPrograms = programs.filter(program =>
        program.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        program.description.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const getStatusColor = (status) => {
        const colors = {
            'IN_PROGRESS': '!bg-teal-50 text-slate-600 border-teal-200',
            'PENDING': '!bg-amber-50 text-slate-50 border-amber-200',
            'COMPLETED': '!bg-slate-100 text-slate-700 border-slate-200',
            'NOT_STARTED': '!bg-amber-500 text-slate-50 border-rose-200'
        }
        return colors[status] || 'bg-slate-50 text-slate-50 border-slate-200'
    }

    const HeaderIcon = config.icon

    if (loading && !user) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center space-y-4">
                    <Spinner animation="border" className="w-12 h-12 text-indigo-600" />
                    <p className="text-slate-600 font-medium">Loading your dashboard...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
                <div className="mx-auto">
                    <div className="flex mx-4 justify-between items-center h-16">
                        <div className="flex items-center  gap-3">
                            <LogoImage />
                        </div>

                        {/* Right: Actions */}
                        <div className="flex items-center gap-3">
                            {/* Search Bar */}
                            <div className="hidden md:flex items-center bg-slate-100 rounded-lg px-3 py-2 border border-slate-200 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all">
                                <Search className="w-4 h-4 text-slate-400 mr-2" />
                                <input
                                    type="text"
                                    placeholder="Search programs..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="bg-transparent border-none outline-none text-sm w-48 placeholder:text-slate-400 text-slate-700"
                                />
                            </div>

                            {/* Notifications */}
                            <button className="relative p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors">
                                <Bell className="w-5 h-5" />
                                <Badge
                                    pill
                                    bg="primary"
                                    className="absolute top-1 right-1 text-[10px] px-1.5 py-0.5 min-w-[18px]"
                                >
                                    0
                                </Badge>
                            </button>

                            <div>
                                <div
                                    onClick={() => navigate('profile')}
                                    className="flex items-center justify-center border relative rounded-pill p-1 cursor-pointer">
                                    <User2 />
                                    <Settings size={13} className="absolute bottom-0 -right-1" />
                                </div>
                            </div>

                            {/* Role Switcher */}
                            {getUserRoles().length > 1 &&
                                <Dropdown>
                                    <Dropdown.Toggle
                                        variant="light"
                                        className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-300 rounded-lg hover:border-indigo-400 hover:text-indigo-600 transition-all font-medium text-slate-700 text-sm"
                                    >
                                        <span className="w-1.5 h-1.5 rounded-sm bg-teal-500"></span>
                                        {currentRole}
                                        <ChevronDown className="w-4 h-4 text-slate-400" />
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu className="mt-2 p-1.5 border border-slate-200 shadow-lg rounded-lg bg-white min-w-[180px]">
                                        <div className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                            Switch Role
                                        </div>
                                        {getUserRoles().map((role) => (
                                            <Dropdown.Item
                                                key={role}
                                                eventKey={role}
                                                onClick={() => handleSwitchRole(role)}
                                                className={`rounded-md px-3 py-2 flex items-center gap-3 transition-colors text-sm ${currentRole === role
                                                    ? "bg-indigo-50 text-indigo-700 font-semibold"
                                                    : "text-slate-700 hover:bg-slate-50"
                                                    }`}
                                            >
                                                <div className={`w-1.5 h-1.5 rounded-sm ${currentRole === role ? 'bg-indigo-500' : 'bg-slate-300'}`} />
                                                {role}
                                                {currentRole === role && <span className="ml-auto text-[10px] bg-indigo-100 px-2 py-0.5 rounded text-indigo-700">Active</span>}
                                            </Dropdown.Item>
                                        ))}
                                    </Dropdown.Menu>
                                </Dropdown>
                            }

                            {/* Logout */}
                            <Button
                                variant="outline-danger"
                                onClick={logout}
                                className="flex items-center gap-2 rounded-lg px-3 py-2 border-slate-300 text-slate-600 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-all font-medium text-sm"
                            >
                                <LogOut size={16} />
                                <span className="hidden sm:inline">Logout</span>
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                <div className="mb-4 bg-red-600 rounded p-2 bg-white border">
                    <h1 className="text-lg p-0 m-0 font-bold text-slate-900 leading-tight">
                        {config.title}
                    </h1>
                    <p className="text-xs p-0 m-0 text-slate-500">
                        Welcome back, <span className="text-indigo-600 font-medium">{user?.firstname} {user?.lastname}</span>
                    </p>
                </div>


                <div className="grid grid-cols-3 gap-3 mb-6">
                    {config.stats.map((stat) => {
                        const colors = COLOR_MAP[stat.color]
                        const Icon = stat.icon
                        return (
                            <div key={stat.key} className="bg-white rounded-lg p-3 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-medium text-slate-500">{stat.label}</p>
                                        <p className="text-lg font-bold text-slate-900 mt-0.5">{stats[stat.key]}</p>
                                    </div>
                                    <div className={`w-8 h-8 ${colors.bg} rounded-md flex items-center justify-center`}>
                                        <Icon className={`w-4 h-4 ${colors.text}`} />
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Section Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">Assigned Programs</h2>
                        <p className="text-sm text-slate-500 mt-0.5">
                            {currentRole === 'MODERATOR' && "Manage and oversee your learning programs"}
                            {currentRole === 'ASSESSOR' && "Select a program to view and assess submissions"}
                            {currentRole === 'FACILITATOR' && "Select a program to manage sessions and learners"}
                        </p>
                    </div>

                    {/* Mobile Search */}
                    <div className="md:hidden relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search programs..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all text-sm"
                        />
                    </div>
                </div>

                {/* Programs Grid */}
                {filteredPrograms.length === 0 ? (
                    <div className="bg-white rounded-xl p-12 text-center border border-slate-200 shadow-sm">
                        <div className="w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                            <HeaderIcon className="w-8 h-8 text-slate-300" />
                        </div>
                        <h3 className="text-base font-semibold text-slate-900 mb-1">
                            {searchQuery ? 'No programs found' : 'No programs assigned yet'}
                        </h3>
                        <p className="text-sm text-slate-500 max-w-md mx-auto">
                            {searchQuery
                                ? 'Try adjusting your search terms to find what you\'re looking for.'
                                : config.emptyMessage}
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                        {filteredPrograms.map((program) => {
                            const cardBadge = config.getCardBadge(program, user)
                            const footerValue = config.getFooterValue(program, user)
                            const FooterIcon = footerValue.icon

                            return (
                                <Card
                                    key={program.id}
                                    onClick={() => navigate(config.navigateTo(program.id), {
                                        state: { program: program }
                                    })}
                                    className="group cursor-pointer border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 bg-white rounded-xl overflow-hidden hover:-translate-y-0.5"
                                >
                                    <div className="relative h-48 overflow-hidden">
                                        <Card.Img
                                            src={BASE_URL + program.imageUrl}
                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            onError={(e) => {
                                                e.target.src = '/fallback-image.jpg';
                                            }}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/20 to-transparent opacity-60 group-hover:opacity-50 transition-opacity" />

                                        {/* Status Badge */}
                                        <div className="absolute top-3 left-3">
                                            <Badge className={`${getStatusColor(program.status)} px-2.5 py-1 rounded-md text-xs font-semibold border`}>
                                                {program.status?.replace('_', ' ')}
                                            </Badge>
                                        </div>

                                        {/* Dynamic Card Badge */}
                                        {cardBadge && (
                                            <div className="absolute top-3 right-3">
                                                <Badge className={`${cardBadge.color} text-white px-2.5 py-1 rounded-md text-xs font-bold border-0`}>
                                                    {cardBadge.text}
                                                </Badge>
                                            </div>
                                        )}

                                        {/* Quick Action */}
                                        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
                                            <div className="bg-white/95 p-2 rounded-lg shadow-lg">
                                                <ArrowRight className="w-4 h-4 text-slate-700" />
                                            </div>
                                        </div>
                                    </div>

                                    <Card.Body className="p-5">
                                        {/* Title & Type */}
                                        <div className="mb-3">
                                            <h3 className="text-base font-bold text-slate-900 mb-2 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                                                {program.name}
                                            </h3>
                                            <div className="flex flex-wrap gap-2">
                                                <span className="inline-flex items-center gap-1.5 px-2 py-1 text-xs font-medium rounded bg-indigo-50 text-indigo-700">
                                                    <FileText className="w-3 h-3" />
                                                    {program.type}
                                                </span>
                                                <span className="inline-flex items-center gap-1.5 px-2 py-1 text-xs font-medium rounded bg-teal-50 text-teal-700">
                                                    <GraduationCap className="w-3 h-3" />
                                                    {program.category}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Description */}
                                        <p
                                            className="text-sm text-slate-600 line-clamp-2 mb-4 leading-relaxed"
                                            dangerouslySetInnerHTML={{
                                                __html: program.description.replace(/<[^>]*>/g, ' ').substring(0, 120) + '...'
                                            }}
                                        />


                                        <div className="space-y-2 mb-4">
                                            <div className="flex items-center gap-3 text-sm text-slate-600">
                                                <div className="w-7 h-7 rounded bg-slate-100 flex items-center justify-center">
                                                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                                                </div>
                                                <span className="font-medium text-slate-700">
                                                    {new Date(program.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(program.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-3 text-sm text-slate-600">
                                                <div className="w-7 h-7 rounded bg-slate-100 flex items-center justify-center">
                                                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                                                </div>
                                                <span className="truncate font-medium text-slate-700">{program.location}</span>
                                            </div>
                                        </div>
                                    </Card.Body>
                                </Card>
                            )
                        })}
                    </div>
                )}
            </main>
        </div>
    )
}