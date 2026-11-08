import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, GraduationCap } from 'lucide-react';

export default function LoginPage() {
  const { login, isAuthenticated, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('admin');

  // If already authenticated, redirect
  React.useEffect(() => {
    if (isAuthenticated && user) {
      const redirectMap = { admin: '/admin/dashboard', faculty: '/faculty/dashboard', student: '/student/dashboard' };
      navigate(redirectMap[user.role] || '/login');
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter email and password');
      return;
    }
    setLoading(true);
    try {
      const result = await login(email, password);
      if (result.success) {
        toast.success('Logged in successfully!');
        const redirectMap = { admin: '/admin/dashboard', faculty: '/faculty/dashboard', student: '/student/dashboard' };
        navigate(redirectMap[result.role] || '/admin/dashboard');
      } else {
        toast.error(result.message || 'Login failed');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'admin', label: 'Admin', hint: 'admin@eduzy.college.edu' },
    { id: 'faculty', label: 'Faculty', hint: 'faculty1@eduzy.college.edu' },
    { id: 'student', label: 'Student', hint: 'student1@eduzy.college.edu' },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-2/5 bg-gradient-to-br from-primary-800 via-primary-700 to-accent-400 p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute top-20 right-10 w-32 h-32 bg-white/10 rounded-full"></div>
        <div className="absolute bottom-32 left-10 w-24 h-24 bg-white/5 rounded-full"></div>
        <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-white/10 rounded-lg rotate-45"></div>
        
        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-8">
            <div className="bg-white/20 p-2 rounded-xl">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">Eduzy</span>
          </div>
          <h1 className="text-4xl font-bold text-white leading-tight mb-4">
            Smart College,<br />Smarter Future
          </h1>
          <p className="text-white/80 text-lg">
            Complete college management system for administrators, faculty, and students.
          </p>
        </div>

        <div className="relative z-10 space-y-4">
          {['Manage Departments & Courses', 'Track Attendance in Real-time', 'Smart Analytics & Reports'].map((feat, i) => (
            <div key={i} className="flex items-center space-x-3 text-white/90">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span>{feat}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center space-x-3 mb-8 justify-center">
            <div className="bg-primary-600 p-2 rounded-xl">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Eduzy</span>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back</h2>
            <p className="text-gray-500 mb-6">Sign in to your account</p>

            {/* Role Tabs */}
            <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id); setEmail(tab.hint); }}
                  className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-white text-primary-700 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email" required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'} required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    placeholder="Enter your password"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit" disabled={loading}
                className="w-full bg-primary-700 text-white py-2.5 rounded-lg font-medium hover:bg-primary-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <><svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg> Signing in...</>
                ) : 'Sign In'}
              </button>
            </form>

            <div className="mt-6 p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 text-center">
                <strong>Demo:</strong> Admin: admin@eduzy.college.edu / Admin@123<br/>
                Faculty: faculty1@eduzy.college.edu / Password@123<br/>
                Student: student1@eduzy.college.edu / Password@123
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
