import React, { useState, useEffect, useContext } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { AuthContext } from '../../context/AuthContext';
import {
  CalendarCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  TrendingUp,
  Search,
  Filter,
  BookOpen,
  Calendar,
  Clock
} from 'lucide-react';

export default function StudentAttendance() {
  const { user } = useContext(AuthContext);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourseFilter, setSelectedCourseFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        if (!user?._id) return;
        const res = await api.get(`/attendance/student/${user._id}`);
        setRecords(res.data.data || []);
      } catch (error) {
        toast.error(error.response?.data?.error || 'Failed to fetch attendance');
      } finally {
        setLoading(false);
      }
    };
    fetchAttendance();
  }, [user]);

  // Group records by course
  const courseStats = records.reduce((acc, record) => {
    const cId = record.course?._id;
    if (!cId) return acc;
    if (!acc[cId]) {
      acc[cId] = {
        course: record.course,
        total: 0,
        present: 0,
        absent: 0
      };
    }
    acc[cId].total += 1;
    if (record.status === 'present') {
      acc[cId].present += 1;
    } else {
      acc[cId].absent += 1;
    }
    return acc;
  }, {});

  const statList = Object.values(courseStats);

  // Overall calculations
  const totalClasses = records.length;
  const totalPresent = records.filter((r) => r.status === 'present').length;
  const overallPercent = totalClasses > 0 ? Math.round((totalPresent / totalClasses) * 100) : 0;
  const isOverallLow = overallPercent < 75;

  // Filtered log records
  const filteredRecords = records.filter((r) => {
    const matchesCourse =
      selectedCourseFilter === 'ALL' || r.course?._id === selectedCourseFilter;
    const matchesStatus =
      statusFilter === 'ALL' || r.status?.toLowerCase() === statusFilter.toLowerCase();
    const term = search.toLowerCase();
    const matchesSearch =
      !term ||
      r.course?.name?.toLowerCase().includes(term) ||
      r.course?.code?.toLowerCase().includes(term) ||
      new Date(r.date).toLocaleDateString().includes(term);
    return matchesCourse && matchesStatus && matchesSearch;
  });

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 bg-gray-200 rounded-xl w-60"></div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 bg-gray-200 rounded-xl"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-44 bg-gray-200 rounded-xl"></div>
          ))}
        </div>
        <div className="h-72 bg-gray-200 rounded-xl"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Attendance Overview</h1>
        <p className="text-sm text-gray-500 mt-1">
          Monitor your subject-wise lecture presence, eligibility criteria, and daily attendance records
        </p>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Overall Attendance</p>
            <p className={`text-3xl font-bold mt-1.5 ${isOverallLow ? 'text-rose-600' : 'text-emerald-600'}`}>
              {overallPercent}%
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {isOverallLow ? '⚠️ Minimum 75% mandatory' : '✓ Satisfies requirement'}
            </p>
          </div>
          <div className={`p-3 rounded-xl border ${isOverallLow ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
            <CalendarCheck className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Lectures Attended</p>
            <p className="text-3xl font-bold text-gray-900 mt-1.5">
              {totalPresent} <span className="text-base font-normal text-gray-400">/ {totalClasses}</span>
            </p>
            <p className="text-xs text-gray-500 mt-1">Total conducted classes</p>
          </div>
          <div className="p-3 rounded-xl bg-primary-50 text-primary-700 border border-primary-100">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Subject Health</p>
            <p className="text-3xl font-bold text-gray-900 mt-1.5">
              {statList.filter((s) => (s.present / s.total) * 100 >= 75).length}{' '}
              <span className="text-base font-normal text-gray-400">/ {statList.length}</span>
            </p>
            <p className="text-xs text-gray-500 mt-1">Subjects in good standing</p>
          </div>
          <div className="p-3 rounded-xl bg-blue-50 text-blue-700 border border-blue-100">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Subject-wise Cards Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Subject-wise Attendance</h2>
          <span className="text-xs text-gray-500">Criteria: 75% or above</span>
        </div>

        {statList.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center shadow-sm">
            <CalendarCheck className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-gray-800">No attendance records found</h3>
            <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
              Attendance records have not yet been marked by faculty for your enrolled courses.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {statList.map((stat, idx) => {
              const percentage = Math.round((stat.present / stat.total) * 100);
              const isLow = percentage < 75;
              const isCritical = percentage < 60;

              return (
                <div
                  key={idx}
                  className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-gray-100 text-gray-700">
                        {stat.course?.code || 'N/A'}
                      </span>
                      <span
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
                          isLow
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        }`}
                      >
                        {isLow ? 'Shortage Alert' : 'Eligible'}
                      </span>
                    </div>

                    <h3 className="font-bold text-gray-900 text-sm mb-4 line-clamp-1" title={stat.course?.name}>
                      {stat.course?.name}
                    </h3>

                    <div className="flex items-baseline justify-between mb-2">
                      <span
                        className={`text-2xl font-extrabold ${
                          isCritical ? 'text-rose-600' : isLow ? 'text-amber-600' : 'text-emerald-600'
                        }`}
                      >
                        {percentage}%
                      </span>
                      <span className="text-xs text-gray-500 font-medium">
                        {stat.present} present of {stat.total}
                      </span>
                    </div>

                    {/* Percentage Bar */}
                    <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isCritical ? 'bg-rose-500' : isLow ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      />
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between text-[11px] text-gray-500">
                    <span>Missed: {stat.absent} classes</span>
                    <button
                      onClick={() => setSelectedCourseFilter(stat.course?._id)}
                      className="text-primary-700 font-medium hover:underline"
                    >
                      Filter Log
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Attendance Log Table Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h2 className="text-lg font-bold text-gray-900">Attendance Log</h2>

          {/* Filters Bar */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search date, subject..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
              />
            </div>

            {/* Course Dropdown */}
            <select
              value={selectedCourseFilter}
              onChange={(e) => setSelectedCourseFilter(e.target.value)}
              className="text-xs border border-gray-300 rounded-xl px-3 py-1.5 bg-white text-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="ALL">All Subjects</option>
              {statList.map((s) => (
                <option key={s.course?._id} value={s.course?._id}>
                  {s.course?.code} - {s.course?.name}
                </option>
              ))}
            </select>

            {/* Status Pills */}
            <div className="flex bg-gray-100 p-0.5 rounded-xl text-xs">
              {['ALL', 'present', 'absent'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1 rounded-lg font-medium transition-all capitalize ${
                    statusFilter === st ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  {st === 'ALL' ? 'All' : st}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">
                    Session Date
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">
                    Subject & Code
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">
                    Verification
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredRecords.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-12 text-gray-500">
                      <CalendarCheck className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                      <p className="font-medium text-sm">No attendance records match your filter</p>
                      {(selectedCourseFilter !== 'ALL' || statusFilter !== 'ALL' || search) && (
                        <button
                          onClick={() => {
                            setSelectedCourseFilter('ALL');
                            setStatusFilter('ALL');
                            setSearch('');
                          }}
                          className="mt-2 text-xs font-semibold text-primary-700 hover:underline"
                        >
                          Reset Filters
                        </button>
                      )}
                    </td>
                  </tr>
                ) : (
                  filteredRecords.map((record, idx) => {
                    const isPresent = record.status === 'present';
                    const recDate = new Date(record.date);

                    return (
                      <tr key={idx} className="hover:bg-gray-50/80 transition-colors">
                        <td className="px-5 py-3.5 text-xs text-gray-800 font-medium">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-3.5 h-3.5 text-gray-400" />
                            <span>{recDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center space-x-2">
                            <span className="font-mono text-xs font-semibold text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded">
                              {record.course?.code || '—'}
                            </span>
                            <span className="text-xs font-medium text-gray-900 truncate max-w-xs">
                              {record.course?.name || 'Course Name'}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          {isPresent ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              PRESENT
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                              <XCircle className="w-3.5 h-3.5 text-rose-600" />
                              ABSENT
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-3.5 text-xs text-gray-500">
                          <span className="inline-flex items-center gap-1">
                            <Clock className="w-3 h-3 text-gray-400" />
                            Official Faculty Entry
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
