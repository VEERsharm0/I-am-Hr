import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Layouts
import MainLayout from './layouts/MainLayout';

// Seeker Pages
import HomePage from './pages/Seeker/HomePage';
import JobsPage from './pages/Seeker/JobsPage';
import JobDetailsPage from './pages/Seeker/JobDetailsPage';
import CompaniesPage from './pages/Seeker/CompaniesPage';
import CompanyDetailsPage from './pages/Seeker/CompanyDetailsPage';
// Add these later: 
// import ApplyJobPage from './pages/Seeker/ApplyJobPage';
import SeekerDashboard from './pages/Seeker/SeekerDashboard';

// Recruiter Pages
import RecruiterDashboard from './pages/Recruiter/RecruiterDashboard';
import PostJob from './pages/Recruiter/PostJob';
import ManageJobs from './pages/Recruiter/ManageJobs';
import JobApplicants from './pages/Recruiter/JobApplicants';
import AllApplications from './pages/Recruiter/AllApplications';

// Auth Pages
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import Profile from './pages/Shared/Profile';
import ProtectedRoute from './components/common/ProtectedRoute';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            {/* Public Routes */}
            <Route index element={<HomePage />} />
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
            
            {/* Protected Routes (Requires Login) */}
            <Route element={<ProtectedRoute />}>
              <Route path="jobs" element={<JobsPage />} />
              <Route path="jobs/:id" element={<JobDetailsPage />} />
              <Route path="companies" element={<CompaniesPage />} />
              <Route path="companies/:id" element={<CompanyDetailsPage />} />
              <Route path="profile" element={<Profile />} />
              <Route path="dashboard" element={<SeekerDashboard />} />
              
              {/* Recruiter Routes */}
              <Route path="recruiter" element={<RecruiterDashboard />} />
              <Route path="recruiter/post-job" element={<PostJob />} />
              <Route path="recruiter/manage-jobs" element={<ManageJobs />} />
              <Route path="recruiter/applications" element={<AllApplications />} />
              <Route path="recruiter/applicants/:jobId" element={<JobApplicants />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
