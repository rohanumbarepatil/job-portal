import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ProtectedRoute from "./ProtectedRoute";
import Onboarding from "../pages/profile/Onboarding";
import ProfileEditor from "../pages/profile/ProfileEditor";
import PublicProfile from "../pages/profile/PublicProfile";
import CompanyEditor from "../pages/company/CompanyEditor";
import CompanyPublicProfile from "../pages/company/CompanyPublicProfile";
import JobSearch from "../pages/jobs/JobSearch";
import JobDetails from "../pages/jobs/JobDetails";
import JobEditor from "../pages/jobs/JobEditor";
import RecruiterJobDashboard from '../pages/jobs/RecruiterJobDashboard';
import SavedJobs from '../pages/jobs/SavedJobs';
import AppliedJobs from '../pages/applications/AppliedJobs';
import ApplicationDetails from '../pages/applications/ApplicationDetails';
import ATSBoard from '../pages/applications/ATSBoard';
import UpcomingInterviews from '../pages/interviews/UpcomingInterviews';
import InterviewHistory from '../pages/interviews/InterviewHistory';
import RecruiterCalendar from '../pages/interviews/RecruiterCalendar';

import AdminLayout from '../pages/admin/AdminLayout';
import AdminDashboard from '../pages/admin/AdminDashboard';
import VerificationCenter from '../pages/admin/VerificationCenter';
import AuditLogs from '../pages/admin/AuditLogs';
import NotificationSettings from '../pages/settings/NotificationSettings';
import NotificationBell from '../components/notifications/NotificationBell';

import RecommendedJobs from '../components/ai/RecommendedJobs';
import AIInsightsDashboard from '../components/ai/AIInsightsDashboard';

import { useAuth } from "../context/AuthContext";

const DashboardSwitch = () => {
  const { dbUser, logout } = useAuth();

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex items-center space-x-6">
          <NotificationBell />
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-600 text-white rounded font-bold"
          >
            Logout
          </button>
        </div>
      </div>
      {dbUser?.role === "ROLE_ADMIN" && <div>Admin View</div>}
      {dbUser?.role === "ROLE_RECRUITER" && (
        <div className="space-y-6">
          <AIInsightsDashboard />
        </div>
      )}
      {dbUser?.role === "ROLE_PENDING_RECRUITER" && (
        <div>Your account is pending admin approval.</div>
      )}
      {dbUser?.role === "ROLE_JOB_SEEKER" && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold border-b pb-2">AI Recommended Jobs</h2>
          <RecommendedJobs />
        </div>
      )}
    </div>
  );
};

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/u/:username" element={<PublicProfile />} />
      <Route path="/company/:slug" element={<CompanyPublicProfile />} />
      <Route path="/jobs" element={<JobSearch />} />
      <Route path="/jobs/:jobId" element={<JobDetails />} />
      <Route path="/unauthorized" element={<div>Unauthorized Access</div>} />

      <Route element={<ProtectedRoute />}>
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/dashboard/profile/edit" element={<ProfileEditor />} />
        <Route path="/dashboard/company/edit" element={<CompanyEditor />} />
        <Route path="/dashboard/jobs" element={<RecruiterJobDashboard />} />
        <Route path="/dashboard/jobs/new" element={<JobEditor />} />
        <Route path="/dashboard/jobs/edit/:jobId" element={<JobEditor />} />
        <Route path="/dashboard/jobs/saved" element={<SavedJobs />} />
        <Route path="/dashboard/applications" element={<AppliedJobs />} />
        <Route path="/dashboard/applications/:applicationId" element={<ApplicationDetails />} />
        <Route path="/dashboard/interviews" element={<UpcomingInterviews />} />
        <Route path="/dashboard/interviews/history" element={<InterviewHistory />} />
        <Route path="/dashboard/jobs/:jobId/ats" element={<ATSBoard />} />
        <Route path="/dashboard/calendar" element={<RecruiterCalendar />} />
        <Route path="/dashboard/settings/notifications" element={<NotificationSettings />} />
        <Route path="/dashboard" element={<DashboardSwitch />} />
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Route>

      {/* Admin Zone */}
      <Route path="/admin" element={<AdminLayout />}>
         <Route index element={<AdminDashboard />} />
         <Route path="verification" element={<VerificationCenter />} />
         <Route path="logs" element={<AuditLogs />} />
         {/* Stubbed Routes for remaining features */}
         <Route path="users" element={<div className="p-10 font-bold">User Management (Coming Soon)</div>} />
         <Route path="moderation" element={<div className="p-10 font-bold">Job Moderation (Coming Soon)</div>} />
         <Route path="analytics" element={<AdminDashboard />} />
         <Route path="announcements" element={<div className="p-10 font-bold">Announcements (Coming Soon)</div>} />
      </Route>

    </Routes>
  );
}
