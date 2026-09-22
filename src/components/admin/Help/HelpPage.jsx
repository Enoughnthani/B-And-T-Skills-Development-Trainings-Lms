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
  FaCheckCircle
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function HelpPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedSection, setExpandedSection] = useState(null);

  const helpTopics = [
    {
      title: "Adding Users (Single)",
      icon: FaUserPlus,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      steps: [
        "Click on 'Users' in the sidebar menu",
        "Click the 'Add New User' button at the top right",
        "Fill in the user details (First name, Last name, Email, Phone, ID number)",
        "Select a role (Learner, Facilitator, Assessor, etc.)",
        "Click 'Save' to create the user account"
      ],
      tip: "The system will automatically generate a temporary password sent to the user's email"
    },
    {
      title: "Bulk User Upload",
      icon: FaUpload,
      color: "text-green-600",
      bgColor: "bg-green-50",
      steps: [
        "Go to Users → Bulk Upload",
        "Download the CSV template",
        "Fill in user data in the template (First name, Last name, Email, Role)",
        "Upload the completed CSV file",
        "Review the validation results",
        "Confirm to create all users at once"
      ],
      tip: "Maximum 500 users per bulk upload. Check the template format carefully"
    },
    {
      title: "Editing Users",
      icon: FaEdit,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      steps: [
        "Navigate to Users section",
        "Search for the user using name, email, or ID number",
        "Click the 'Edit' button next to the user",
        "Update the required information",
        "Click 'Save Changes' to update"
      ],
      tip: "You can update roles, reset passwords, or deactivate accounts here"
    },
    {
      title: "Deleting Users (Single)",
      icon: FaTrash,
      color: "text-red-600",
      bgColor: "bg-red-50",
      steps: [
        "Find the user in the Users list",
        "Click the 'Delete' button (trash icon)",
        "Confirm the deletion in the popup dialog",
        "The user will be permanently removed"
      ],
      tip: "You cannot delete users with active enrollments or assessments. Deactivate them instead"
    },
    {
      title: "Bulk Delete Users",
      icon: FaUsers,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      steps: [
        "Go to Users section",
        "Select multiple users using checkboxes",
        "Click 'Bulk Actions' → 'Delete Selected'",
        "Confirm bulk deletion",
        "All selected users will be removed"
      ],
      tip: "Bulk delete is useful for removing test accounts or inactive users"
    },
    {
      title: "Activity Overview",
      icon: FaChartLine,
      color: "text-teal-600",
      bgColor: "bg-teal-50",
      steps: [
        "Click on 'Activities' in the sidebar",
        "View all admin actions (user creation, updates, deletions)",
        "Filter by action type (Created, Updated, Deleted, Role Assign)",
        "Search by user name or action description",
        "Example: 'Created 14 users' or 'Deleted Sibonelo Sambo'"
      ],
      tip: "Activities are automatically logged and cannot be edited"
    }
  ];

  const filteredTopics = helpTopics.filter(topic =>
    topic.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleSection = (index) => {
    setExpandedSection(expandedSection === index ? null : index);
  };

  return (
    <div className="p-8 w-full h-screen overflow-y-auto">
    
      <div className="mb-8">
        <button 
          onClick={() => navigate(-1)} 
          className="flex bg-white items-center gap-2 text-gray-500 hover:text-gray-700 mb-6"
        >
          <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-gray-200">
            <FaArrowLeft className="w-3.5 h-3.5" />
          </div>
          <span className="text-sm font-medium">Back</span>
        </button>
        
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Help Guide</h1>
          <p className="text-gray-500 mt-1">Learn how to manage users and track activities</p>
        </div>
      </div>

    
      <div className="mb-8">
        <div className="relative">
          <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search help topics..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <FaUserPlus className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Single User Creation</p>
              <p className="text-sm font-medium text-gray-900">Click "Add New User" button</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <FaUpload className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Bulk Operations</p>
              <p className="text-sm font-medium text-gray-900">Upload CSV or bulk delete</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-50 rounded-lg">
              <FaChartLine className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Activity Log</p>
              <p className="text-sm font-medium text-gray-900">Track all admin actions</p>
            </div>
          </div>
        </div>
      </div>

      {/* Help Topics */}
      <div className="space-y-4">
        {filteredTopics.map((topic, index) => (
          <div key={index} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection(index)}
              className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${topic.bgColor}`}>
                  <topic.icon className={`w-5 h-5 ${topic.color}`} />
                </div>
                <span className="font-semibold text-gray-900">{topic.title}</span>
              </div>
              {expandedSection === index ? (
                <FaChevronDown className="w-4 h-4 text-gray-400" />
              ) : (
                <FaChevronRight className="w-4 h-4 text-gray-400" />
              )}
            </button>
            
            {expandedSection === index && (
              <div className="px-6 pb-5 pt-2 border-t border-gray-100">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Steps:</h4>
                    <ul className="space-y-2">
                      {topic.steps.map((step, stepIndex) => (
                        <li key={stepIndex} className="flex items-start gap-2 text-sm text-gray-600">
                          <FaCheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  {topic.tip && (
                    <div className="bg-blue-50 rounded-lg p-3">
                      <p className="text-xs text-blue-800">
                        <span className="font-semibold">💡 Tip:</span> {topic.tip}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Example Activity Log */}
      <div className="mt-8 bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">📋 Example Activities You'll See</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-gray-600">Created 14 new users via bulk upload</span>
            <span className="text-xs text-gray-400 ml-auto">Today, 10:30 AM</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span className="text-gray-600">Deleted user: Sibonelo Sambo</span>
            <span className="text-xs text-gray-400 ml-auto">Yesterday, 2:15 PM</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-gray-600">Updated role for Tonny Nthani to ASSESSOR</span>
            <span className="text-xs text-gray-400 ml-auto">Jun 10, 2026</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <span className="text-gray-600">Assigned PROGRAM_MANAGER role to Spesihle Khoza</span>
            <span className="text-xs text-gray-400 ml-auto">Jun 9, 2026</span>
          </div>
        </div>
      </div>

      {/* Need More Help */}
      <div className="mt-8 text-center py-6">
        <p className="text-sm text-gray-500">
          Need more help? Contact support at <span className="text-blue-600">admin@bantl.co.za</span>
        </p>
      </div>
    </div>
  );
}