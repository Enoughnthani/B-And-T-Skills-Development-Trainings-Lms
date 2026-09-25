import React, { useState } from 'react';
import {
  FaArrowLeft,
  FaSearch,
  FaChevronDown,
  FaChevronRight,
  FaUserPlus,
  FaUpload,
  FaTrash,
  FaEdit,
  FaChartLine,
  FaUsers,
  FaCheckCircle,
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const HELP_TOPICS = [
  {
    title: 'Adding Users (Single)',
    icon: FaUserPlus,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    steps: [
      "Click on 'Users' in the sidebar menu",
      "Click the 'Add New User' button at the top right",
      'Fill in the user details (First name, Last name, Email, Phone, ID number)',
      'Select a role (Learner, Facilitator, Assessor, etc.)',
      "Click 'Save' to create the user account",
    ],
    tip: "The system will automatically generate a temporary password sent to the user's email",
  },
  {
    title: 'Bulk User Upload',
    icon: FaUpload,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    steps: [
      'Go to Users → Bulk Upload',
      'Download the CSV template',
      'Fill in user data in the template (First name, Last name, Email, Role)',
      'Upload the completed CSV file',
      'Review the validation results',
      'Confirm to create all users at once',
    ],
    tip: 'Maximum 500 users per bulk upload. Check the template format carefully',
  },
  {
    title: 'Editing Users',
    icon: FaEdit,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    steps: [
      'Navigate to Users section',
      'Search for the user using name, email, or ID number',
      "Click the 'Edit' button next to the user",
      'Update the required information',
      "Click 'Save Changes' to update",
    ],
    tip: 'You can update roles, reset passwords, or deactivate accounts here',
  },
  {
    title: 'Deleting Users (Single)',
    icon: FaTrash,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    steps: [
      'Find the user in the Users list',
      "Click the 'Delete' button (trash icon)",
      'Confirm the deletion in the popup dialog',
      'The user will be permanently removed',
    ],
    tip: 'You cannot delete users with active enrollments or assessments. Deactivate them instead',
  },
  {
    title: 'Bulk Delete Users',
    icon: FaUsers,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    steps: [
      'Go to Users section',
      'Select multiple users using checkboxes',
      "Click 'Bulk Actions' → 'Delete Selected'",
      'Confirm bulk deletion',
      'All selected users will be removed',
    ],
    tip: 'Bulk delete is useful for removing test accounts or inactive users',
  },
  {
    title: 'Activity Overview',
    icon: FaChartLine,
    color: 'text-teal-600',
    bgColor: 'bg-teal-50',
    steps: [
      "Click on 'Activities' in the sidebar",
      'View all admin actions (user creation, updates, deletions)',
      'Filter by action type (Created, Updated, Deleted, Role Assign)',
      'Search by user name or action description',
      "Example: 'Created 14 users' or 'Deleted Sibonelo Sambo'",
    ],
    tip: 'Activities are automatically logged and cannot be edited',
  },
];

const QUICK_STATS = [
  {
    icon: FaUserPlus,
    iconColor: 'text-blue-600',
    bgColor: 'bg-blue-50',
    label: 'Single User Creation',
    value: 'Click "Add New User" button',
  },
  {
    icon: FaUpload,
    iconColor: 'text-green-600',
    bgColor: 'bg-green-50',
    label: 'Bulk Operations',
    value: 'Upload CSV or bulk delete',
  },
  {
    icon: FaChartLine,
    iconColor: 'text-purple-600',
    bgColor: 'bg-purple-50',
    label: 'Activity Log',
    value: 'Track all admin actions',
  },
];

const EXAMPLE_ACTIVITIES = [
  { color: 'bg-green-500', text: 'Created 14 new users via bulk upload', time: 'Today, 10:30 AM' },
  { color: 'bg-red-500', text: 'Deleted user: Sibonelo Sambo', time: 'Yesterday, 2:15 PM' },
  { color: 'bg-blue-500', text: 'Updated role for Tonny Nthani to ASSESSOR', time: 'Jun 10, 2026' },
  { color: 'bg-purple-500', text: 'Assigned PROGRAM_MANAGER role to Spesihle Khoza', time: 'Jun 9, 2026' },
];

export default function HelpPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedSection, setExpandedSection] = useState(null);

  const filteredTopics = HELP_TOPICS.filter((topic) =>
    topic.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleSection = (index) => {
    setExpandedSection(expandedSection === index ? null : index);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">

      {/* ============================================================
          HEADER
          ============================================================ */}
      <div className="mb-6 sm:mb-8">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-3 py-1.5 mb-4 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:border-slate-300 hover:text-slate-900 transition-colors"
        >
          <FaArrowLeft className="w-3.5 h-3.5" />
          Back
        </button>

        <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 mb-1">
          Admin Help Guide
        </h1>
        <p className="text-sm text-slate-500">
          Learn how to manage users and track activities.
        </p>
      </div>

      {/* ============================================================
          SEARCH
          ============================================================ */}
      <div className="mb-6 sm:mb-8">
        <div className="relative">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search help topics..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 sm:py-3 text-sm bg-white border border-slate-300 rounded-lg focus:border-slate-900 outline-none transition-colors"
          />
        </div>
      </div>

      {/* ============================================================
          QUICK STATS
          ============================================================ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
        {QUICK_STATS.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className="bg-white border border-slate-200 rounded-xl p-4 flex items-start gap-3"
            >
              <div className={`p-2 ${stat.bgColor} rounded-lg shrink-0`}>
                <Icon className={`w-5 h-5 ${stat.iconColor}`} />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider mb-0.5">
                  {stat.label}
                </p>
                <p className="text-sm font-medium text-slate-900">
                  {stat.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ============================================================
          HELP TOPICS
          ============================================================ */}
      <div className="space-y-3">
        {filteredTopics.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-10 text-center">
            <p className="text-sm text-slate-500">
              No help topics match "{searchTerm}".
            </p>
          </div>
        ) : (
          filteredTopics.map((topic, index) => {
            const Icon = topic.icon;
            const isOpen = expandedSection === index;

            return (
              <div
                key={index}
                className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-slate-300 transition-colors"
              >
                <button
                  onClick={() => toggleSection(index)}
                  className="w-full px-4 sm:px-6 py-4 flex items-center justify-between gap-3 text-left hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`p-2 rounded-lg ${topic.bgColor} shrink-0`}>
                      <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${topic.color}`} />
                    </div>
                    <span className="font-semibold text-slate-900 text-sm sm:text-base truncate">
                      {topic.title}
                    </span>
                  </div>
                  <div className="shrink-0 text-slate-400">
                    {isOpen ? (
                      <FaChevronDown className="w-3.5 h-3.5" />
                    ) : (
                      <FaChevronRight className="w-3.5 h-3.5" />
                    )}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-4 sm:px-6 pb-5 pt-2 border-t border-slate-100">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                          Steps
                        </h4>
                        <ul className="space-y-2">
                          {topic.steps.map((step, stepIndex) => (
                            <li
                              key={stepIndex}
                              className="flex items-start gap-2 text-sm text-slate-600"
                            >
                              <FaCheckCircle className="w-3.5 h-3.5 text-green-500 mt-0.5 shrink-0" />
                              <span>{step}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {topic.tip && (
                        <div className="bg-amber-50 border border-amber-100 rounded-lg p-3">
                          <p className="text-xs text-amber-900 leading-relaxed">
                            <span className="font-bold">Tip:</span> {topic.tip}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* ============================================================
          EXAMPLE ACTIVITIES
          ============================================================ */}
      <div className="mt-8 bg-white border border-slate-200 rounded-xl p-4 sm:p-6">
        <h3 className="text-sm font-bold text-slate-900 mb-3">
          Example activities you'll see
        </h3>
        <div className="space-y-2.5">
          {EXAMPLE_ACTIVITIES.map((activity, i) => (
            <div
              key={i}
              className="flex items-start gap-2 text-sm"
            >
              <div className={`w-2 h-2 ${activity.color} rounded-full mt-1.5 shrink-0`} />
              <span className="text-slate-600 flex-1 min-w-0">
                {activity.text}
              </span>
              <span className="text-[11px] text-slate-400 shrink-0 hidden sm:inline">
                {activity.time}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ============================================================
          NEED MORE HELP
          ============================================================ */}
      <div className="mt-8 text-center py-6 border-t border-slate-200">
        <p className="text-sm text-slate-500">
          Need more help? Contact support at{' '}
          <a
            href="mailto:admin@bantl.co.za"
            className="font-medium text-[#E30613] hover:underline"
          >
            admin@bantl.co.za
          </a>
        </p>
      </div>
    </div>
  );
}