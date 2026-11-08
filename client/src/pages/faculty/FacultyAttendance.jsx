import { useState, useEffect, useContext } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { AuthContext } from '../../context/AuthContext';
import {
  Calendar,
  BookOpen,
  Users,
  CheckCircle2,
  XCircle,
  Save,
  Loader2,
  Check,
  X,
  Search,
  Filter,
  AlertCircle
} from 'lucide-react';

export default function FacultyAttendance() {
  const { user } = useContext(AuthContext);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch courses taught by faculty
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        if (!user?._id) return;
        const res = await api.get(`/courses/faculty/${user._id}`);
        const crsList = res.data.data || [];
        setCourses(crsList);
        if (crsList.length > 0 && !selectedCourse) {
          // Pre-select first course for convenience
          setSelectedCourse(crsList[0]._id);
        }
      } catch (error) {
        toast.error(error.response?.data?.error || 'Failed to fetch courses');
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [user]);

  // Fetch students when selected course changes
  useEffect(() => {
    const fetchStudents = async () => {
      if (!selectedCourse) {
        setStudents([]);
        setAttendance({});
        return;
      }
      try {
        setLoadingStudents(true);
        const course = courses.find((c) => c._id === selectedCourse);
        if (course?.department?._id) {
          const res = await api.get(`/users/students?department=${course.department._id}`);
          const stus = res.data.data || [];
          setStudents(stus);

          // Initialize attendance state (default all present)
          const initialAtt = {};
          stus.forEach((s) => {
            initialAtt[s._id] = 'present';
          });
          setAttendance(initialAtt);
        } else {
          setStudents([]);
          setAttendance({});
        }
      } catch (error) {
        toast.error(error.response?.data?.error || 'Failed to fetch students');
      } finally {
        setLoadingStudents(false);
      }
    };
    fetchStudents();
  }, [selectedCourse, courses]);

  const handleToggle = (studentId) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: prev[studentId] === 'present' ? 'absent' : 'present'
    }));
  };

  const markAll = (status) => {
    const newAtt = {};
    students.forEach((s) => {
      newAtt[s._id] = status;
    });
    setAttendance(newAtt);
    toast.success(`Marked all ${students.length} students as ${status}`);
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!selectedCourse || !date) {
      return toast.error('Please select both a course and a date');
    }
    if (students.length === 0) {
      return toast.error('No students to mark attendance for');
    }

    try {
      setSaving(true);
      const records = students.map((s) => ({
        student: s._id,
        status: attendance[s._id] || 'present'
      }));

      await api.post('/attendance/mark', {
        courseId: selectedCourse,
        date,
        records
      });
      toast.success('Attendance recorded successfully!');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to record attendance');
    } finally {
      setSaving(false);
    }
  };

  const presentCount = Object.values(attendance).filter((v) => v === 'present').length;
  const absentCount = students.length - presentCount;
  const attendanceRate = students.length > 0 ? Math.round((presentCount / students.length) * 100) : 0;

  const currentCourse = courses.find((c) => c._id === selectedCourse);

  const filteredStudents = students.filter(
    (stu) =>
      stu.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stu.enrollmentNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stu.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const inputClass =
    'w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all hover:border-gray-400 bg-white';

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded-xl w-48"></div>
        <div className="h-32 bg-gray-200 rounded-2xl"></div>
        <div className="h-80 bg-gray-200 rounded-2xl"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mark Attendance</h1>
        <p className="text-sm text-gray-500 mt-1">
          Select course, verify date, and record present or absent status for enrolled students.
        </p>
      </div>

      {/* Selectors Card */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <div className="md:col-span-7">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Select Course *
            </label>
            <div className="relative">
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className={inputClass}
              >
                <option value="">-- Choose Course --</option>
                {courses.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.code} - {c.name} {c.department?.name ? `(${c.department.name})` : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="md:col-span-5">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Session Date *
            </label>
            <div className="relative">
              <input
                type="date"
                value={date}
                max={new Date().toISOString().split('T')[0]}
                onChange={(e) => setDate(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {currentCourse && (
          <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between text-xs text-gray-500 gap-2">
            <div className="flex items-center space-x-3">
              <span className="font-semibold text-gray-800">
                {currentCourse.name} ({currentCourse.code})
              </span>
              <span>•</span>
              <span>Sem {currentCourse.semester}</span>
              <span>•</span>
              <span>{currentCourse.department?.name || 'Department'}</span>
            </div>
            <span className="bg-primary-50 text-primary-700 font-medium px-2 py-0.5 rounded-md">
              {currentCourse.credits} Credits
            </span>
          </div>
        )}
      </div>

      {!selectedCourse ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
          <div className="w-16 h-16 bg-gray-50 text-gray-400 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-gray-100">
            <BookOpen className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-base font-bold text-gray-900">Select a course to mark attendance</h3>
          <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">
            Choose one of your assigned courses from the dropdown above to load the registered students.
          </p>
        </div>
      ) : loadingStudents ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm space-y-3">
          <Loader2 className="h-8 w-8 text-primary-600 animate-spin mx-auto" />
          <p className="text-sm text-gray-600 font-medium">Loading enrolled students...</p>
        </div>
      ) : students.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
          <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-amber-100">
            <Users className="h-8 w-8 text-amber-500" />
          </div>
          <h3 className="text-base font-bold text-gray-900">No students found</h3>
          <p className="text-sm text-gray-500 mt-1 max-w-md mx-auto">
            There are currently no students registered in this course’s department ({currentCourse?.department?.name || 'department'}).
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Summary & Controls Bar */}
          <div className="p-4 sm:p-5 border-b border-gray-100 bg-gray-50/70 flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Stats Metrics */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-sm">
              <div className="bg-white px-3.5 py-1.5 rounded-xl border border-gray-200/80 shadow-xs flex items-center space-x-2">
                <span className="text-gray-500 text-xs uppercase font-medium">Total:</span>
                <span className="font-bold text-gray-900">{students.length}</span>
              </div>
              <div className="bg-emerald-50 px-3.5 py-1.5 rounded-xl border border-emerald-200/80 shadow-xs flex items-center space-x-2">
                <span className="text-emerald-700 text-xs uppercase font-medium">Present:</span>
                <span className="font-bold text-emerald-800">{presentCount}</span>
              </div>
              <div className="bg-rose-50 px-3.5 py-1.5 rounded-xl border border-rose-200/80 shadow-xs flex items-center space-x-2">
                <span className="text-rose-700 text-xs uppercase font-medium">Absent:</span>
                <span className="font-bold text-rose-800">{absentCount}</span>
              </div>
              <div className="bg-primary-50 px-3.5 py-1.5 rounded-xl border border-primary-200/80 shadow-xs flex items-center space-x-2">
                <span className="text-primary-700 text-xs uppercase font-medium">Rate:</span>
                <span className="font-bold text-primary-800">{attendanceRate}%</span>
              </div>
            </div>

            {/* Quick Bulk Actions */}
            <div className="flex items-center space-x-2.5">
              <button
                type="button"
                onClick={() => markAll('present')}
                className="px-3 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold transition-all active:scale-95 flex items-center space-x-1"
              >
                <Check className="h-3.5 w-3.5" />
                <span>Mark All Present</span>
              </button>
              <button
                type="button"
                onClick={() => markAll('absent')}
                className="px-3 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-800 rounded-xl text-xs font-semibold transition-all active:scale-95 flex items-center space-x-1"
              >
                <X className="h-3.5 w-3.5" />
                <span>Mark All Absent</span>
              </button>
            </div>
          </div>

          {/* Search Bar for Table */}
          <div className="px-5 py-3 border-b border-gray-100 bg-white">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search students in this list..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-gray-50/50"
              />
            </div>
          </div>

          {/* Attendance Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50/70 border-b border-gray-100">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-40">
                    Enrollment No
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Student Details
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                    Department
                  </th>
                  <th className="text-center px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-36">
                    Attendance
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-8 text-gray-500 text-sm">
                      No students match "{searchTerm}"
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((stu) => {
                    const isPresent = attendance[stu._id] === 'present';
                    return (
                      <tr
                        key={stu._id}
                        className="border-b border-gray-50 hover:bg-gray-50/80 transition-colors"
                      >
                        <td className="px-5 py-3.5">
                          <span className="font-mono text-xs font-semibold bg-gray-100 text-gray-700 px-2.5 py-1 rounded-md">
                            {stu.enrollmentNo || '—'}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-xs">
                              {stu.name?.charAt(0) || 'S'}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 text-sm">{stu.name}</p>
                              <p className="text-xs text-gray-400">{stu.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-xs text-gray-600 hidden sm:table-cell">
                          {stu.department?.name || currentCourse?.department?.name || '—'}
                        </td>
                        <td className="px-5 py-3.5 text-center">
                          <button
                            type="button"
                            onClick={() => handleToggle(stu._id)}
                            className={`inline-flex items-center justify-center space-x-1.5 w-28 py-1.5 rounded-full text-xs font-bold transition-all active:scale-95 shadow-xs cursor-pointer ${
                              isPresent
                                ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20'
                                : 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/20'
                            }`}
                          >
                            {isPresent ? (
                              <>
                                <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                                <span>Present</span>
                              </>
                            ) : (
                              <>
                                <X className="h-3.5 w-3.5 stroke-[2.5]" />
                                <span>Absent</span>
                              </>
                            )}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Footer Save Action Bar */}
          <div className="p-4 sm:p-5 border-t border-gray-100 bg-gray-50/70 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs text-gray-500 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1.5 text-primary-600 shrink-0" />
              <span>Ensure accurate records before submitting. You can re-submit if updates are needed.</span>
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={saving || students.length === 0}
              className="w-full sm:w-auto bg-primary-700 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-primary-800 flex items-center justify-center transition-all active:scale-95 hover:shadow-lg hover:shadow-primary-700/25 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  <span>Saving Attendance...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  <span>Save Attendance</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
