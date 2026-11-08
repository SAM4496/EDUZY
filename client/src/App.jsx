import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Layouts
import AdminLayout from './layouts/AdminLayout';
import FacultyLayout from './layouts/FacultyLayout';
import StudentLayout from './layouts/StudentLayout';

// Public Pages
import LandingPage from './pages/LandingPage';
import SetupWizard from './pages/SetupWizard';
import RoleLogin from './pages/RoleLogin';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminBranches from './pages/admin/AdminBranches';
import AdminFields from './pages/admin/AdminFields';
import AdminDepartments from './pages/admin/AdminDepartments';
import AdminFaculty from './pages/admin/AdminFaculty';
import AdminStudents from './pages/admin/AdminStudents';
import AdminCourses from './pages/admin/AdminCourses';
import AdminSettings from './pages/admin/AdminSettings';

// Faculty Pages
import FacultyDashboard from './pages/faculty/FacultyDashboard';
import FacultyCourses from './pages/faculty/FacultyCourses';
import FacultyAttendance from './pages/faculty/FacultyAttendance';
import FacultyAssignments from './pages/faculty/FacultyAssignments';
import FacultyStudents from './pages/faculty/FacultyStudents';
import FacultyProfile from './pages/faculty/FacultyProfile';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import StudentCourses from './pages/student/StudentCourses';
import StudentAttendance from './pages/student/StudentAttendance';
import StudentAssignments from './pages/student/StudentAssignments';
import StudentResults from './pages/student/StudentResults';
import StudentFees from './pages/student/StudentFees';
import StudentProfile from './pages/student/StudentProfile';

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/setup" element={<SetupWizard />} />
        
        {/* Role-Specific Login Pages */}
        <Route path="/admin/login" element={
          <RoleLogin 
            role="admin" 
            title="Admin Portal" 
            subtitle="Manage your institute, branches, faculty, students, and system settings"
            gradientFrom="from-primary-800" 
            gradientTo="to-primary-600" 
          />
        } />
        <Route path="/faculty/login" element={
          <RoleLogin 
            role="faculty" 
            title="Faculty Portal" 
            subtitle="Manage courses, mark attendance, create assignments, and track student progress"
            gradientFrom="from-blue-700" 
            gradientTo="to-blue-500" 
          />
        } />
        <Route path="/student/login" element={
          <RoleLogin 
            role="student" 
            title="Student Portal" 
            subtitle="View your courses, attendance, assignments, results, and fee status"
            gradientFrom="from-green-700" 
            gradientTo="to-green-500" 
          />
        } />

        {/* Legacy login redirect */}
        <Route path="/login" element={<Navigate to="/" replace />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout /></ProtectedRoute>}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="branches" element={<AdminBranches />} />
          <Route path="fields" element={<AdminFields />} />
          <Route path="departments" element={<AdminDepartments />} />
          <Route path="faculty" element={<AdminFaculty />} />
          <Route path="students" element={<AdminStudents />} />
          <Route path="courses" element={<AdminCourses />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route index element={<Navigate to="dashboard" replace />} />
        </Route>

        {/* Faculty Routes */}
        <Route path="/faculty" element={<ProtectedRoute allowedRoles={['faculty']}><FacultyLayout /></ProtectedRoute>}>
          <Route path="dashboard" element={<FacultyDashboard />} />
          <Route path="courses" element={<FacultyCourses />} />
          <Route path="attendance" element={<FacultyAttendance />} />
          <Route path="assignments" element={<FacultyAssignments />} />
          <Route path="students" element={<FacultyStudents />} />
          <Route path="profile" element={<FacultyProfile />} />
          <Route index element={<Navigate to="dashboard" replace />} />
        </Route>

        {/* Student Routes */}
        <Route path="/student" element={<ProtectedRoute allowedRoles={['student']}><StudentLayout /></ProtectedRoute>}>
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="courses" element={<StudentCourses />} />
          <Route path="attendance" element={<StudentAttendance />} />
          <Route path="assignments" element={<StudentAssignments />} />
          <Route path="results" element={<StudentResults />} />
          <Route path="fees" element={<StudentFees />} />
          <Route path="profile" element={<StudentProfile />} />
          <Route index element={<Navigate to="dashboard" replace />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
