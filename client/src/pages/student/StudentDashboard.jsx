import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { AuthContext } from '../../context/AuthContext';
import {
  BookOpen,
  CalendarCheck,
  FileText,
  CreditCard,
  ArrowRight,
  GraduationCap,
  Sparkles,
  TrendingUp,
  Award,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function StudentDashboard() {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    attendancePercent: 0,
    enrolledCourses: 0,
    pendingAssignments: 0,
    pendingFees: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/dashboard/student');
        setStats(res.data.data || res.data || {});
      } catch (error) {
        toast.error(error.response?.data?.error || 'Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        {/* Banner Skeleton */}
        <div className="h-44 bg-gray-200 rounded-2xl"></div>
        {/* Stat Cards Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
          ))}
        </div>
        {/* Content Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-64 bg-gray-200 rounded-2xl"></div>
          <div className="h-64 bg-gray-200 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  const attendanceValue = Number(stats.attendancePercent || 0);
  const isAttendanceLow = attendanceValue < 75;

  const statCards = [
    {
      title: 'Overall Attendance',
      value: `${attendanceValue}%`,
      subtitle: isAttendanceLow ? 'Below 75% requirement' : 'Good standing',
      icon: CalendarCheck,
      color: isAttendanceLow ? 'text-rose-600 bg-rose-50 border-rose-100' : 'text-emerald-600 bg-emerald-50 border-emerald-100',
      progress: Math.min(attendanceValue, 100),
      progressColor: isAttendanceLow ? 'bg-rose-500' : 'bg-emerald-500',
      link: '/student/attendance'
    },
    {
      title: 'Enrolled Courses',
      value: stats.enrolledCourses || 0,
      subtitle: `Semester ${user?.semester || 1} curriculum`,
      icon: BookOpen,
      color: 'text-primary-700 bg-primary-50 border-primary-100',
      link: '/student/courses'
    },
    {
      title: 'Pending Assignments',
      value: stats.pendingAssignments || 0,
      subtitle: stats.pendingAssignments > 0 ? 'Requires attention' : 'All caught up!',
      icon: FileText,
      color: 'text-amber-600 bg-amber-50 border-amber-100',
      link: '/student/assignments'
    },
    {
      title: 'Pending Fees',
      value: `₹${Number(stats.pendingFees || 0).toLocaleString('en-IN')}`,
      subtitle: stats.pendingFees > 0 ? 'Payment due' : 'Fully paid',
      icon: CreditCard,
      color: stats.pendingFees > 0 ? 'text-rose-600 bg-rose-50 border-rose-100' : 'text-emerald-600 bg-emerald-50 border-emerald-100',
      link: '/student/fees'
    }
  ];

  const quickActions = [
    {
      title: 'Course Schedule & Materials',
      desc: 'Browse enrolled subjects, syllabi, and faculty details',
      link: '/student/courses',
      icon: BookOpen,
      color: 'text-primary-700 bg-primary-50'
    },
    {
      title: 'Attendance Log',
      desc: 'Monitor lecture presence and subject requirements',
      link: '/student/attendance',
      icon: CalendarCheck,
      color: 'text-emerald-700 bg-emerald-50'
    },
    {
      title: 'Submit Assignments',
      desc: 'Upload coursework and check grades & faculty feedback',
      link: '/student/assignments',
      icon: FileText,
      color: 'text-amber-700 bg-amber-50'
    },
    {
      title: 'Academic Results',
      desc: 'Check semester SGPA, grade sheets, and credits',
      link: '/student/results',
      icon: Award,
      color: 'text-indigo-700 bg-indigo-50'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary-700 via-primary-800 to-primary-900 text-white p-6 sm:p-8 shadow-lg shadow-primary-900/10">
        {/* Decorative blur rings */}
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 right-32 w-48 h-48 bg-accent-400/20 rounded-full blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-medium text-purple-100 border border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Student Portal</span>
              <span className="opacity-60">•</span>
              <span>Semester {user?.semester || 1}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Welcome back, {user?.name || 'Student'}! 👋
            </h1>
            <p className="text-purple-100/90 text-sm sm:text-base max-w-xl">
              {user?.department?.name ? `${user.department.name} • ` : ''}
              {user?.enrollmentNo ? `Enrollment: ${user.enrollmentNo}` : user?.userId ? `ID: ${user.userId}` : 'Keep up the academic momentum.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/student/courses"
              className="inline-flex items-center px-4 py-2.5 rounded-xl bg-white text-primary-900 font-semibold text-sm hover:bg-purple-50 transition-all active:scale-95 shadow-sm"
            >
              My Courses
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Link>
            <Link
              to="/student/assignments"
              className="inline-flex items-center px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/20 text-white font-medium text-sm transition-all active:scale-95 border border-white/10 backdrop-blur-sm"
            >
              Assignments
            </Link>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <Link
              key={idx}
              to={card.link}
              className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all active:scale-[0.99] group flex flex-col justify-between"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    {card.title}
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2">
                    {card.value}
                  </p>
                </div>
                <div className={`p-3 rounded-xl border ${card.color} group-hover:scale-110 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              {card.progress !== undefined ? (
                <div className="mt-4 pt-3 border-t border-gray-50">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-gray-500">{card.subtitle}</span>
                    <span className="font-semibold text-gray-700">{card.value}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${card.progressColor}`}
                      style={{ width: `${card.progress}%` }}
                    />
                  </div>
                </div>
              ) : (
                <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between text-xs text-gray-500">
                  <span>{card.subtitle}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-primary-700 group-hover:translate-x-1 transition-all" />
                </div>
              )}
            </Link>
          );
        })}
      </div>

      {/* Main Grid: Quick Nav & Academic Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Access */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Academic Quick Access</h2>
              <p className="text-xs text-gray-500 mt-0.5">Jump directly to your daily student workflows</p>
            </div>
            <span className="text-xs font-medium text-primary-700 bg-primary-50 px-2.5 py-1 rounded-lg">
              Active Term
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {quickActions.map((action, i) => {
              const ActionIcon = action.icon;
              return (
                <Link
                  key={i}
                  to={action.link}
                  className="p-4 rounded-xl border border-gray-100 hover:border-primary-200 hover:bg-purple-50/30 transition-all flex items-start space-x-3.5 group active:scale-[0.98]"
                >
                  <div className={`p-2.5 rounded-xl ${action.color} group-hover:scale-105 transition-transform shrink-0`}>
                    <ActionIcon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-gray-900 text-sm group-hover:text-primary-700 transition-colors flex items-center justify-between">
                      <span>{action.title}</span>
                      <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all text-primary-700" />
                    </h3>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                      {action.desc}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Academic Profile Snippet */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Student Profile</h2>
              <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                <CheckCircle2 className="w-3 h-3" />
                Active
              </span>
            </div>

            <div className="flex items-center space-x-3.5 p-3.5 rounded-xl bg-gray-50 border border-gray-100 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-primary-700 to-primary-500 text-white font-bold flex items-center justify-center text-lg shadow-sm">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'S'}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-gray-900 truncate">{user?.name || 'Student'}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1.5 border-b border-gray-100">
                <span className="text-gray-500">Enrollment / ID</span>
                <span className="font-semibold text-gray-800 font-mono">{user?.enrollmentNo || user?.userId || '—'}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-100">
                <span className="text-gray-500">Current Semester</span>
                <span className="font-semibold text-gray-800">Semester {user?.semester || 1}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-100">
                <span className="text-gray-500">Department</span>
                <span className="font-semibold text-gray-800 truncate max-w-[160px] text-right">
                  {user?.department?.name || 'General Studies'}
                </span>
              </div>
              {user?.branch?.name && (
                <div className="flex justify-between py-1.5 border-b border-gray-100">
                  <span className="text-gray-500">Branch</span>
                  <span className="font-semibold text-gray-800 truncate max-w-[160px] text-right">
                    {user.branch.name}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100">
            <Link
              to="/student/profile"
              className="w-full flex items-center justify-center py-2.5 px-4 rounded-xl text-xs font-semibold text-primary-700 bg-primary-50 hover:bg-primary-100 transition-colors active:scale-95"
            >
              View Full Profile & Security
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
