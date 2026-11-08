import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { AuthContext } from '../../context/AuthContext';
import {
  BookOpen,
  Users,
  FileText,
  CheckCircle2,
  ClipboardCheck,
  ArrowRight,
  Sparkles,
  Calendar,
  GraduationCap
} from 'lucide-react';

export default function FacultyDashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    coursesTeaching: 0,
    totalStudents: 0,
    activeAssignments: 0,
    avgAttendance: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/dashboard/faculty');
        const data = res.data.data || res.data || {};
        setStats({
          coursesTeaching: data.coursesTeaching ?? 0,
          totalStudents: data.totalStudents ?? 0,
          activeAssignments: data.activeAssignments ?? 0,
          avgAttendance: data.avgAttendance ?? 0
        });
      } catch (error) {
        toast.error(error.response?.data?.error || 'Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        {/* Banner Skeleton */}
        <div className="h-44 bg-gray-200 rounded-2xl"></div>

        {/* Stats Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-gray-200 rounded-xl"></div>
          ))}
        </div>

        {/* Actions Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="h-56 bg-gray-200 rounded-2xl"></div>
          <div className="h-56 bg-gray-200 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Courses Teaching',
      value: stats.coursesTeaching,
      icon: BookOpen,
      iconBg: 'bg-blue-50 text-blue-600',
      description: 'Active assigned courses',
      link: '/faculty/courses'
    },
    {
      title: 'Total Students',
      value: stats.totalStudents,
      icon: Users,
      iconBg: 'bg-emerald-50 text-emerald-600',
      description: 'Across your courses',
      link: '/faculty/students'
    },
    {
      title: 'Active Assignments',
      value: stats.activeAssignments,
      icon: FileText,
      iconBg: 'bg-amber-50 text-amber-600',
      description: 'Pending submissions & review',
      link: '/faculty/assignments'
    },
    {
      title: 'Avg Attendance',
      value: `${stats.avgAttendance}%`,
      icon: CheckCircle2,
      iconBg: 'bg-purple-50 text-purple-600',
      description: 'Overall student attendance',
      link: '/faculty/attendance'
    }
  ];

  const quickShortcuts = [
    {
      title: 'Mark Attendance',
      desc: 'Record student attendance for today’s lectures',
      icon: ClipboardCheck,
      color: 'text-emerald-600 bg-emerald-50 hover:border-emerald-200',
      path: '/faculty/attendance'
    },
    {
      title: 'Create Assignment',
      desc: 'Post new coursework, deadlines, and points',
      icon: FileText,
      color: 'text-amber-600 bg-amber-50 hover:border-amber-200',
      path: '/faculty/assignments'
    },
    {
      title: 'Course Curriculum',
      desc: 'Review teaching schedule and course details',
      icon: BookOpen,
      color: 'text-blue-600 bg-blue-50 hover:border-blue-200',
      path: '/faculty/courses'
    },
    {
      title: 'Enrolled Students',
      desc: 'View students directory by course and section',
      icon: GraduationCap,
      color: 'text-purple-600 bg-purple-50 hover:border-purple-200',
      path: '/faculty/students'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-primary-800 via-primary-700 to-accent-400 rounded-2xl p-6 md:p-8 text-white relative overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute -bottom-10 right-20 w-48 h-48 bg-white/10 rounded-full blur-xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white/15 backdrop-blur-sm rounded-full text-xs font-medium text-white/90">
              <Sparkles className="h-3.5 w-3.5 text-accent-300" />
              <span>Faculty Workspace</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              {getGreeting()}, {user?.name || 'Professor'} 👋
            </h1>
            <p className="text-white/80 text-sm md:text-base max-w-xl">
              Welcome to your faculty dashboard. Monitor class attendance, organize assignments, and engage with your students.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={() => navigate('/faculty/attendance')}
              className="bg-white text-primary-700 hover:bg-white/95 px-4 py-2.5 rounded-xl text-sm font-semibold shadow-sm transition-all active:scale-95 flex items-center space-x-2"
            >
              <ClipboardCheck className="h-4 w-4" />
              <span>Mark Attendance</span>
            </button>
            <button
              onClick={() => navigate('/faculty/courses')}
              className="bg-white/15 hover:bg-white/25 text-white border border-white/20 px-4 py-2.5 rounded-xl text-sm font-medium backdrop-blur-sm transition-all active:scale-95 flex items-center space-x-2"
            >
              <BookOpen className="h-4 w-4" />
              <span>My Courses</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              onClick={() => navigate(card.link)}
              className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer group hover:border-gray-200"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {card.title}
                </span>
                <div className={`p-2.5 rounded-xl ${card.iconBg} transition-transform group-hover:scale-105`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900 tracking-tight">{card.value}</p>
              <p className="text-xs text-gray-500 mt-1 flex items-center justify-between">
                <span>{card.description}</span>
                <ArrowRight className="h-3.5 w-3.5 text-gray-400 group-hover:text-primary-600 group-hover:translate-x-0.5 transition-all" />
              </p>
            </div>
          );
        })}
      </div>

      {/* Quick Shortcuts & Information Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Shortcuts */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Quick Shortcuts</h2>
              <p className="text-xs text-gray-500 mt-0.5">Common everyday actions at your fingertips</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {quickShortcuts.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  onClick={() => navigate(item.path)}
                  className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:border-gray-200 hover:shadow-sm transition-all cursor-pointer group active:scale-[0.99]"
                >
                  <div className="flex items-start space-x-3.5">
                    <div className={`p-2.5 rounded-xl ${item.color} transition-transform group-hover:scale-105`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-gray-900 group-hover:text-primary-700 transition-colors">
                          {item.title}
                        </h3>
                        <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-primary-700 group-hover:translate-x-0.5 transition-all" />
                      </div>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-1">{item.desc}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Schedule & Overview Note */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-primary-700 mb-3">
              <Calendar className="h-5 w-5" />
              <h3 className="text-base font-bold text-gray-900">Today’s Overview</h3>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              Keep attendance logs current for accurate academic reporting. Remember to publish assignment evaluation grades within one week of deadlines.
            </p>

            <div className="mt-5 space-y-3">
              <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl">
                <p className="text-xs font-semibold text-blue-900">Daily Attendance</p>
                <p className="text-xs text-blue-700 mt-0.5">
                  Select your scheduled course and record student attendance.
                </p>
              </div>
              <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-xl">
                <p className="text-xs font-semibold text-emerald-900">Department Support</p>
                <p className="text-xs text-emerald-700 mt-0.5">
                  Need curriculum updates? Reach out to your Department Head.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100 text-xs text-gray-400 flex items-center justify-between">
            <span>Eduzy Campus ERP</span>
            <span className="font-mono text-[11px] bg-gray-100 px-2 py-0.5 rounded text-gray-600">v2.4</span>
          </div>
        </div>
      </div>
    </div>
  );
}
