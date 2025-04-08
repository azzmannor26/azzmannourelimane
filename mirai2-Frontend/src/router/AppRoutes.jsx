import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Import ProtectedRoute
import ProtectedRoute from "./ProtectedRoute";

// Import pages
import Home from "../pages/Home";
import LoginPage from "../pages/LoginPage";
import EditProfile from "../pages/RH/EditProfile.jsx";
import ShareThoughts from "../pages/RH/ShareThoughts.jsx";
import InternDash from "../pages/Intern/InternDash";
import Documents from "../pages/Intern/Documents";
import Projects from "../pages/Intern/Projects";
import Chat from "../pages/Intern/Chat";
import Supervisor from "../pages/Intern/Supervisor";
import Internship from "../pages/Intern/Internship";
import Dashboard from "../pages/Supervisor/Dashboard.jsx";
import MyInterns from "../pages/Supervisor/MyInterns.jsx";
import ProjectPage from "../pages/Supervisor/Projectpage.jsx";
import ReportsPage from "../pages/Supervisor/Reportpage.jsx";
import DocumentViewer from "../pages/Supervisor/DocumentViewer";
import MyAvailabilities from "../pages/Supervisor/MyAvailabilities.jsx";
import ApplyPage from "../pages/ApplyPage.jsx";
import HRapplication from "../pages/RH/HRapplication.jsx";
import RHinterns from "../pages/RH/RHinterns.jsx";
import InternDetails from "../pages/RH/InternDetails.jsx";
import HRdocuments from "../pages/RH/HRdocuments.jsx";
import RHsupervisors from "../pages/RH/RHsupervisors.jsx";
import RHdashboard from "../pages/RH/RHdashboard.jsx";
import TaskPage from "../pages/Supervisor/TaskPage.jsx";
import InternshipSummary from "../pages/RH/InternshipSummary.jsx";
//new header routes
import AboutUs from "../pages/AboutUs.jsx"; // Import the AboutUs component
import Features from "../pages//Features.jsx"; //
import Blog from "../pages//Blog.jsx";
import ForInterns from "../pages/ForInterns.jsx"; // Import the ContactUs component
const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* ✅ Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/apply" element={<ApplyPage />} />
        <Route path="/about-us" element={<AboutUs />} />
          <Route path="/features" element={<Features />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/for-interns" element={<ForInterns />} />

        {/* 🔒 Protected Routes (Require Authentication) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/thoughts" element={<ShareThoughts />} />
         
          {/* Intern Routes */}
          <Route path="/interndash" element={<InternDash />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/supervisor" element={<Supervisor />} />
          <Route path="/internship" element={<Internship />} />

          {/* Supervisor Routes */}
          <Route path="/supervisordashboard" element={<Dashboard />} />
          <Route path="/myinterns" element={<MyInterns />} />
          <Route path="/project/:id" element={<ProjectPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/viewdocument/:id" element={<DocumentViewer />} />
          <Route path="/availabilities" element={<MyAvailabilities />} />
          <Route path="/tasks/:stagiaireId" element={<TaskPage />} />

          {/* HR Routes */}
          <Route path="/RHdashboard" element={<RHdashboard />} />
          <Route path="/HR" element={<HRapplication />} />
          <Route path="/interns" element={<RHinterns />} />
          <Route path="/intern/:id" element={<InternDetails />} />
          <Route path="/docs" element={<HRdocuments />} />
          <Route path="/sup" element={<RHsupervisors />} />
          <Route path="/internship-summary" element={<InternshipSummary />} />
        </Route>

        {/* 🚀 Redirect if Route Not Found */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
