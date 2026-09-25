// src/App.jsx
import { Navigate, Route, Routes } from "react-router-dom";

import AdminDashboard from "@/components/admin/AdminDashboard";
import UserManagement from "@/components/admin/users/UserManagement";
import ProtectedRoute from "@/components/common/ProtectedRoute.jsx";
import HomePage from "@/components/home/HomePage";
import PublicLayout from "@/components/layout/PublicLayout.jsx";
import { LearnerDashboard } from "@/components/learner/LearnerDashboard.jsx";
import ForbiddenPage from "@/exceptions/ForbiddenPage.jsx";
import InternalError from "@/exceptions/InternalError.jsx";
import PageNotFound from "@/exceptions/PageNotFound.jsx";
import { ROUTES } from "@/utils/routes";
import { Container } from "react-bootstrap";
import AdminActivities from "./components/admin/activities/AdminActivities";
import AdminAnnouncementForm from "./components/admin/content/AdminAnnouncementForm";
import AdminAnnouncementsList from "./components/admin/content/AdminAnnouncementsList";
import EnquiriesList from "./components/admin/enquiries/EnquiriesList";
import EnquiryDetail from "./components/admin/enquiries/EnquiryDetail";
import HelpPage from "./components/admin/Help/HelpPage";
import NotificationPage from "./components/admin/notifications/NotificationPage";
import AdminDashboardOverview from "./components/admin/overview/AdminDashboardOverview";
import AssessmentReport from "./components/admin/reports/AssessmentReport";
import AttendanceReport from "./components/admin/reports/AttendanceReport";
import CompletionReport from "./components/admin/reports/CompletionReport";
import LearnerProgressReport from "./components/admin/reports/LearnerProgressReport";
import ReportsHub from "./components/admin/reports/ReportsHub";
import BulkUploadPage from "./components/admin/users/BulkUploadModal";
import RoleManagerPage from "./components/admin/users/RoleManagerModal";
import UserFormPage from "./components/admin/users/UserFormModal";
import UserProfilePage from "./components/admin/users/UserProfilePage";
import AuthLayout from "./components/auth/AuthLayout";
import ForgotPassword from "./components/auth/ForgotPassword";
import Login from "./components/auth/Login";
import ResetPassword from "./components/auth/ResetPassword";
import VerifyOTP from "./components/auth/VerifyOTP";
import About from "./components/common/About";
import Announcements from "./components/common/Announcements";
import Contact from "./components/common/Contact";
import Help from "./components/common/Help";
import Layout from "./components/common/Layout";
import Policy from "./components/common/Policy";
import Privacy from "./components/common/Privacy";
import ProfilePage from "./components/common/ProfilePage";
import Programmes from "./components/common/Programmes";
import Resources from "./components/common/Resources";
import EnrolledLearnerView from "./components/facilitator/enronlled_learners_view/EnrolledLearnerView";
import FacilitatorProgramOverview from "./components/facilitator/overview/FacilitatorProgramOverview";
import AssessmentPage from "./components/facilitator/unit_standards/unit_standard/assessment/AssessmentPage";
import AssessmentViewPage from "./components/facilitator/unit_standards/unit_standard/assessment/AssessmentViewPage";
import AssessmentFormPage from "./components/facilitator/unit_standards/unit_standard/assessment/create/AssessmentFormPage";
import UnitStandardResources from "./components/facilitator/unit_standards/unit_standard/content/UnitStandardResources";
import UnitStandardOverview from "./components/facilitator/unit_standards/unit_standard/overview/UnitStandardOverview";
import UnitStandardLayout from "./components/facilitator/unit_standards/unit_standard/UnitStandardLayout";
import UnitStandardFormPage from "./components/facilitator/unit_standards/UnitStandardFormPage";
import UnitStandardsPage from "./components/facilitator/unit_standards/UnitStandardsPage";
import FacilitatorProgramView from "./components/facilitator/view/FacilitatorProgramLayout";
import InternPage from "./components/intern/InternPage";
import InternOverview from "./components/intern/overview/InternOverview";
import InternReportPage from "./components/intern/reports/InternReportPage";
import DocumentAssessment from "./components/learner/assessment/DocumentAssessment";
import LearnerAssessmentPage from "./components/learner/assessment/LearnerAssessmentPage";
import TestComplete from "./components/learner/assessment/write/TestComplete";
import TestResults from "./components/learner/assessment/write/TestResults";
import TestStart from "./components/learner/assessment/write/TestStart";
import TestTaking from "./components/learner/assessment/write/TestTaking";
import ContentPage from "./components/learner/content/LearnerContentPage";
import { CourseViewPage } from "./components/learner/course_view/CourseViewPage";
import LearnerUnitStandardOverview from "./components/learner/overview/LearnerUnitStandardOverview";
import MentorPage from "./components/mentor/MentorPage";
import ProgramOverview from "./components/mentor/overview/ProgramOverview";
import InternReports from "./components/mentor/view/InternReports";
import InternsList from "./components/mentor/view/InternsList";
import MentorProgramView from "./components/mentor/view/MentorProgramView";
import ModeratorLearnerView from "./components/moderator/view/ModeratorLearnerView";
import ModeratorProgramView from "./components/moderator/view/ModeratorProgramView";
import ProgramAnalyticsPage from "./components/program_manager/programmes/ProgramAnalyticsPage";
import ProgramLayout from "./components/program_manager/layout/ProgramLayout";
import ProgramManagementOverview from "./components/program_manager/overview/ProgramManagementOverview";
import ProgramForm from "./components/program_manager/programmes/ProgramForm";
import ProgramManagement from "./components/program_manager/ProgramManagement";
import ProgramView from "./components/program_manager/programmes/ProgramDetail";
import AssessorGradePage from "./components/staff/grade_subission/AssessorGradePage";
import ModeratorReviewPage from "./components/staff/grade_subission/ModeratorReviewPage";
import StaffDashboard from "./components/staff/StaffDashboard";
import PopiAct from "./pages/PopiAct";
import Terms from "./pages/Terms";
import AnnouncementsList from "./components/program_manager/announcement/AnnouncementsList";
import AnnouncementForm from "./components/program_manager/announcement/AnnouncementForm";
import LearnersList from "./components/program_manager/learners/LearnersList";
import EnrollLearner from "./components/program_manager/learners/EnrollLearner";
import LearnerDetail from "./components/program_manager/learners/LearnerDetail";
import AssessmentsList from "./components/program_manager/assessments/AssessmentsList";
import AssessmentForm from "./components/program_manager/assessments/AssessmentForm";
import AssessmentDetail from "./components/program_manager/assessments/AssessmentDetail";

export default function App() {
  return (
    <Container fluid className="p-0">
      <Routes>
        {/* ADMIN ROUTES */}
        <Route element={<ProtectedRoute role="ADMIN" />}>
          <Route path={ROUTES.ADMIN} element={<AdminDashboard />}>

            <Route index element={<AdminDashboardOverview />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="users/new" element={<UserFormPage />} />
            <Route path="users/new/bulk" element={<BulkUploadPage />} />
            <Route path="users/:id/edit" element={<UserFormPage />} />
            <Route path="users/:userId/role-manager" element={<RoleManagerPage />} />
            <Route path="users/:id" element={<UserProfilePage />} />


            <Route path="announcements" element={<AdminAnnouncementsList />} />
            <Route path="announcements/new" element={<AdminAnnouncementForm />} />
            <Route path="announcements/:id" element={<AdminAnnouncementForm />} />

            <Route path="enquiries" element={<EnquiriesList />} />
            <Route path="enquiries/:id" element={<EnquiryDetail />} />

            <Route path="reports" element={<ReportsHub />} />
            <Route path="reports/learner-progress" element={<LearnerProgressReport />} />
            <Route path="reports/completion" element={<CompletionReport />} />
            <Route path="reports/assessments" element={<AssessmentReport />} />
            <Route path="reports/attendance" element={<AttendanceReport />} />

            <Route path="settings" element={<ProfilePage />} />
            <Route path="activities" element={<AdminActivities />} />
            <Route path="notifications" element={<NotificationPage />} />
            <Route path="help" element={<HelpPage />} />
          </Route>
        </Route>

        {/* PROGRAM MANAGER ROUTES */}
        <Route element={<ProtectedRoute role="PROGRAM_MANAGER" />}>
          <Route path={ROUTES.PROGRAM_MANGER} element={<ProgramLayout />}>
            <Route index element={<ProgramManagementOverview />} />
            <Route path="programmes" element={<ProgramManagement />} />
            <Route path="programmes/:id" element={<ProgramView />} />
            <Route path="programmes/analytics/:id" element={<ProgramAnalyticsPage />} />
            <Route path="programmes/new" element={<ProgramForm />} />
            <Route path="programmes/:id/edit" element={<ProgramForm />} />

            <Route path="profile" element={<ProfilePage />} />

            <Route path="announcements" element={<AnnouncementsList scope="program-manager" basePath="/user/program-manager/announcements" />} />
            <Route path="announcements/new" element={<AnnouncementForm scope="program-manager" basePath="/user/program-manager/announcements" />} />
            <Route path="announcements/:id" element={<AnnouncementForm scope="program-manager" basePath="/user/program-manager/announcements" />} />

            <Route path="learners" element={<LearnersList />} />
            <Route path="learners/enroll" element={<EnrollLearner />} />
            <Route path="learners/:id" element={<LearnerDetail />} />

            <Route path="assessments" element={<AssessmentsList />} />
            <Route path="assessments/new" element={<AssessmentForm />} />
            <Route path="assessments/:id" element={<AssessmentDetail />} />
            <Route path="assessments/:id/edit" element={<AssessmentForm />} />
          </Route>
        </Route>

        {/* MODERATOR ROUTES */}
        <Route element={<ProtectedRoute role="MODERATOR" />}>
          <Route path={ROUTES.MODERATOR} element={<Layout />}>
            <Route index element={<StaffDashboard />} />
            <Route path="program-view/:id" element={<ModeratorProgramView />} />
            <Route path="learner/:learnerId" element={<ModeratorLearnerView />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="program-view/:programId" element={<FacilitatorProgramView />}>
              <Route index element={<FacilitatorProgramOverview />} />
              <Route path="unit-standards" element={<UnitStandardsPage />} />
              <Route path="unit-standards/new" element={<UnitStandardFormPage />} />
              <Route path="unit-standards/:id/edit" element={<UnitStandardFormPage />} />
              <Route path="learners" element={<EnrolledLearnerView />} />
            </Route>
            <Route path="program-view/:programId/unit-standards/:unitStandardId" element={<UnitStandardLayout />}>
              <Route index element={<UnitStandardOverview />} />
              <Route path="content" element={<UnitStandardResources />} />
              <Route path="assessments" element={<AssessmentPage />} />
              <Route path="assessments/:assessmentId" element={<AssessmentViewPage />} />
              <Route path="assessments/:assessmentId/moderate" element={<ModeratorReviewPage />} />
              <Route path="assessments/new" element={<AssessmentFormPage />} />
              <Route path="assessments/:assessmentId/edit" element={<AssessmentFormPage />} />
            </Route>
          </Route>
        </Route>

        {/* ASSESSOR ROUTES */}
        <Route element={<ProtectedRoute role="ASSESSOR" />}>
          <Route path={ROUTES.ACCESSOR} element={<Layout />}>
            <Route index element={<StaffDashboard />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="program-view/:programId" element={<FacilitatorProgramView />}>
              <Route index element={<FacilitatorProgramOverview />} />
              <Route path="unit-standards" element={<UnitStandardsPage />} />
              <Route path="unit-standards/new" element={<UnitStandardFormPage />} />
              <Route path="unit-standards/:id/edit" element={<UnitStandardFormPage />} />
              <Route path="learners" element={<EnrolledLearnerView />} />
            </Route>
            <Route path="program-view/:programId/unit-standards/:unitStandardId" element={<UnitStandardLayout />}>
              <Route index element={<UnitStandardOverview />} />
              <Route path="content" element={<UnitStandardResources />} />
              <Route path="assessments" element={<AssessmentPage />} />
              <Route path="assessments/:assessmentId" element={<AssessmentViewPage />} />
              <Route path="assessments/:assessmentId/grade" element={<AssessorGradePage />} />
              <Route path="assessments/new" element={<AssessmentFormPage />} />
              <Route path="assessments/:assessmentId/edit" element={<AssessmentFormPage />} />
            </Route>
          </Route>
        </Route>

        {/* FACILITATOR ROUTES */}
        <Route element={<ProtectedRoute role="FACILITATOR" />}>
          <Route path={ROUTES.FACILITATOR} element={<Layout />}>
            <Route index element={<StaffDashboard />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="program-view/:programId" element={<FacilitatorProgramView />}>
              <Route index element={<FacilitatorProgramOverview />} />
              <Route path="unit-standards" element={<UnitStandardsPage />} />
              <Route path="unit-standards/new" element={<UnitStandardFormPage />} />
              <Route path="unit-standards/:id/edit" element={<UnitStandardFormPage />} />
              <Route path="learners" element={<EnrolledLearnerView />} />
            </Route>
            <Route path="program-view/:programId/unit-standards/:unitStandardId" element={<UnitStandardLayout />}>
              <Route index element={<UnitStandardOverview />} />
              <Route path="content" element={<UnitStandardResources />} />
              <Route path="assessments" element={<AssessmentPage />} />
              <Route path="assessments/:assessmentId" element={<AssessmentViewPage />} />
              <Route path="assessments/new" element={<AssessmentFormPage />} />
              <Route path="assessments/:assessmentId/edit" element={<AssessmentFormPage />} />
            </Route>
          </Route>
        </Route>

        {/* MENTOR ROUTES */}
        <Route element={<ProtectedRoute role="MENTOR" />}>
          <Route path={ROUTES.MENTOR} element={<Layout />}>
            <Route index element={<MentorPage />} />
            <Route path="program-view/:programId" element={<MentorProgramView />}>
              <Route index element={<ProgramOverview />} />
              <Route path="interns" element={<InternsList />} />
              <Route path="interns/:internId" element={<InternReports />} />
            </Route>
            <Route path="profile" element={<ProfilePage />} />
          </Route>
        </Route>

        {/* INTERN ROUTES */}
        <Route element={<ProtectedRoute role="INTERN" />}>
          <Route path={ROUTES.INTERN} element={<InternPage />}>
            <Route index element={<InternOverview />} />
            <Route path="reports" element={<InternReportPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>
        </Route>

        {/* LEARNER ROUTES */}
        <Route element={<ProtectedRoute role="LEARNER" />}>
          <Route path={ROUTES.LEARNER} element={<Layout />}>
            <Route index element={<LearnerDashboard />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="unit-standard/:unitStandardId" element={<CourseViewPage />}>
              <Route index element={<LearnerUnitStandardOverview />} />
              <Route path="content" element={<ContentPage />} />
              <Route path="assessments" element={<LearnerAssessmentPage />} />
              <Route path="assessments/:id" element={<DocumentAssessment />} />
              <Route path="assessments/:id/start" element={<TestStart />} />
              <Route path="assessments/:id/write" element={<TestTaking />} />
              <Route path="assessments/:id/completed" element={<TestComplete />} />
              <Route path="assessments/:id/results" element={<TestResults />} />
            </Route>
          </Route>
        </Route>

        {/* PUBLIC ROUTES */}
        <Route element={<PublicLayout />}>
          <Route index element={<HomePage />} />

          <Route path="/privacy" element={<Privacy />} />
          <Route path="/policy" element={<Policy />} />
          <Route path="/help" element={<Help />} />
          <Route path="/popi" element={<PopiAct />} />
          <Route path="/terms" element={<Terms />} />

          <Route path="/programmes" element={<Programmes />} />
          <Route path="/announcements" element={<Announcements />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />

          <Route path={ROUTES.UNAUTHORIZED} element={<ForbiddenPage />} />
          <Route path={ROUTES.NOT_FOUND} element={<PageNotFound />} />
          <Route path={ROUTES.INTERNAL_ERROR} element={<InternalError />} />
        </Route>

        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>



        {/* Catch-all route for 404 */}
        <Route path="*" element={<Navigate to={ROUTES.NOT_FOUND} replace />} />
      </Routes>
    </Container>
  );
}