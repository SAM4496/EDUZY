import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { GraduationCap, Shield, Users, BookOpen, ArrowRight, Loader2, Sparkles, Zap, BarChart3 } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [isFirstTime, setIsFirstTime] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await api.get('/setup/status');
        if (res.data.data.isFirstTime) setIsFirstTime(true);
      } catch (err) {}
      finally { setChecking(false); }
    };
    checkStatus();
    setTimeout(() => setMounted(true), 100);
  }, []);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="relative">
            <div className="absolute inset-0 bg-primary-400 rounded-full opacity-20 animate-ping"></div>
            <div className="relative bg-primary-600 p-4 rounded-2xl">
              <GraduationCap className="h-10 w-10 text-white" />
            </div>
          </div>
          <p className="mt-4 text-gray-500 animate-pulse">Loading Eduzy...</p>
        </div>
      </div>
    );
  }

  if (isFirstTime) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-800 via-primary-700 to-accent-400 p-4 relative overflow-hidden">
        {/* Animated background shapes */}
        <div className="absolute top-10 left-10 w-40 h-40 bg-white/5 rounded-full animate-[pulse_4s_ease-in-out_infinite]"></div>
        <div className="absolute bottom-20 right-20 w-60 h-60 bg-white/5 rounded-full animate-[pulse_6s_ease-in-out_infinite_1s]"></div>
        <div className="absolute top-1/3 right-10 w-20 h-20 bg-white/10 rounded-lg rotate-45 animate-[bounce_3s_ease-in-out_infinite]"></div>
        
        <div className={`bg-white rounded-2xl shadow-2xl p-8 md:p-12 max-w-lg w-full text-center transform transition-all duration-700 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <div className="bg-primary-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-[bounce_2s_ease-in-out_infinite]">
            <GraduationCap className="h-8 w-8 text-primary-700" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Welcome to Eduzy</h1>
          <p className="text-gray-500 mb-2">Smart Institute Management System</p>
          <div className="flex justify-center space-x-1 mb-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-2 h-2 bg-primary-400 rounded-full animate-[bounce_1s_ease-in-out_infinite]" style={{animationDelay: `${i * 0.2}s`}}></div>
            ))}
          </div>
          <p className="text-gray-600 mb-8">
            It looks like this is your first time here. Let's set up your institute to get started.
          </p>
          <button
            onClick={() => navigate('/setup')}
            className="w-full bg-primary-700 text-white py-3.5 rounded-xl font-semibold hover:bg-primary-800 transition-all duration-300 flex items-center justify-center group hover:shadow-lg hover:shadow-primary-700/25 active:scale-[0.98]"
          >
            <Sparkles className="h-5 w-5 mr-2 group-hover:animate-spin" />
            Start Setup 
            <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    );
  }

  const portals = [
    {
      title: 'Admin Portal',
      description: 'Manage institute, branches, faculty, students, and system settings',
      icon: Shield,
      bgGradient: 'from-primary-500 to-primary-700',
      iconBg: 'bg-primary-100',
      iconColor: 'text-primary-700',
      hoverBorder: 'hover:border-primary-300',
      path: '/admin/login',
      badge: 'Institute Management',
      badgeColor: 'bg-primary-50 text-primary-700',
      features: ['Branch Management', 'User Accounts', 'Reports & Analytics']
    },
    {
      title: 'Faculty Portal',
      description: 'Manage courses, mark attendance, create assignments, and view students',
      icon: Users,
      bgGradient: 'from-blue-500 to-blue-700',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-700',
      hoverBorder: 'hover:border-blue-300',
      path: '/faculty/login',
      badge: 'Teaching & Academics',
      badgeColor: 'bg-blue-50 text-blue-700',
      features: ['Attendance Marking', 'Assignments', 'Student Progress']
    },
    {
      title: 'Student Portal',
      description: 'View courses, attendance, assignments, results, fees, and profile',
      icon: BookOpen,
      bgGradient: 'from-green-500 to-green-700',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-700',
      hoverBorder: 'hover:border-green-300',
      path: '/student/login',
      badge: 'Learning & Progress',
      badgeColor: 'bg-green-50 text-green-700',
      features: ['Courses & Grades', 'Attendance', 'Fee Status']
    }
  ];

  const stats = [
    { icon: Zap, label: 'Fast & Secure', desc: 'Real-time data processing' },
    { icon: BarChart3, label: 'Analytics', desc: 'Comprehensive reports' },
    { icon: Shield, label: 'Role-Based', desc: 'Secure access control' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3 group cursor-pointer">
            <div className="bg-primary-600 p-2 rounded-xl group-hover:scale-110 transition-transform duration-300">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold text-gray-900">Eduzy</span>
              <span className="text-xs text-gray-400 ml-2 hidden sm:inline">Smart Institute Management</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {stats.map((s, i) => (
              <div key={i} className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-gray-50 text-xs text-gray-500">
                <s.icon className="h-3.5 w-3.5" />
                <span className="font-medium">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className={`max-w-6xl mx-auto px-4 pt-16 pb-10 text-center transition-all duration-700 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
        <div className="inline-flex items-center bg-primary-50 text-primary-700 px-4 py-1.5 rounded-full text-sm font-medium mb-6 animate-[bounce_3s_ease-in-out_infinite]">
          <Sparkles className="h-4 w-4 mr-1.5" />
          Smart Institute Management Platform
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
          Welcome to <span className="bg-gradient-to-r from-primary-700 to-accent-400 bg-clip-text text-transparent">Eduzy</span>
        </h1>
        <p className="text-gray-500 text-lg max-w-2xl mx-auto mb-2">
          Select your portal to access the institute management system
        </p>
      </div>

      {/* Portal Cards */}
      <div className={`max-w-5xl mx-auto px-4 pb-16 transition-all duration-700 delay-200 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {portals.map((portal, idx) => (
            <button
              key={portal.title}
              onClick={() => navigate(portal.path)}
              onMouseEnter={() => setHoveredCard(idx)}
              onMouseLeave={() => setHoveredCard(null)}
              className={`bg-white rounded-2xl shadow-sm border-2 border-gray-100 ${portal.hoverBorder} p-8 text-left hover:shadow-xl transition-all duration-300 group relative overflow-hidden active:scale-[0.98]`}
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              {/* Hover gradient overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${portal.bgGradient} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-300`}></div>
              
              <div className="relative z-10">
                <div className={`${portal.iconBg} w-14 h-14 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  <portal.icon className={`h-7 w-7 ${portal.iconColor}`} />
                </div>
                
                <span className={`inline-block ${portal.badgeColor} text-xs font-medium px-2.5 py-1 rounded-full mb-3`}>
                  {portal.badge}
                </span>

                <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-700 transition-colors">
                  {portal.title}
                </h2>
                <p className="text-gray-500 text-sm mb-5 leading-relaxed">
                  {portal.description}
                </p>

                {/* Feature tags */}
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {portal.features.map((f, i) => (
                    <span key={i} className={`text-[10px] font-medium px-2 py-0.5 rounded bg-gray-100 text-gray-500 transition-all duration-300 ${hoveredCard === idx ? 'bg-gray-200 text-gray-700' : ''}`}>
                      {f}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center text-primary-600 font-medium text-sm group-hover:translate-x-2 transition-transform duration-300">
                  Sign In <ArrowRight className="h-4 w-4 ml-1.5" />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Features Strip */}
      <div className={`max-w-5xl mx-auto px-4 pb-16 transition-all duration-700 delay-300 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((s, i) => (
              <div key={i} className="flex items-center space-x-4 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-default">
                <div className="bg-primary-50 p-2.5 rounded-xl">
                  <s.icon className="h-5 w-5 text-primary-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{s.label}</p>
                  <p className="text-xs text-gray-500">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-6">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} Eduzy — Smart Institute Management System
        </div>
      </footer>
    </div>
  );
}
