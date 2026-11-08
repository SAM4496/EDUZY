import { useState, useEffect, useContext } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { AuthContext } from '../../context/AuthContext';
import {
  Users,
  Search,
  BookOpen,
  GraduationCap,
  Building2,
  Mail,
  Calendar,
  Layers,
  Loader2
} from 'lucide-react';

export default function FacultyStudents() {
  const { user } = useContext(AuthContext);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [students, setStudents] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [search, setSearch] = useState('');

  // Fetch faculty's courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        if (!user?._id) return;
        const res = await api.get(`/courses/faculty/${user._id}`);
        const crsList = res.data.data || [];
        setCourses(crsList);
        if (crsList.length > 0 && !selectedCourse) {
          setSelectedCourse(crsList[0]._id);
        }
      } catch (error) {
        toast.error(error.response?.data?.error || 'Failed to fetch courses');
      } finally {
        setLoadingCourses(false);
      }
    };
    fetchCourses();
  }, [user]);

  // Fetch students for the selected course's department
  useEffect(() => {
    const fetchStudents = async () => {
      if (!selectedCourse) {
        setStudents([]);
        return;
      }
      try {
        setLoadingStudents(true);
        const course = courses.find((c) => c._id === selectedCourse);
        if (course?.department?._id) {
          const res = await api.get(`/users/students?department=${course.department._id}`);
          setStudents(res.data.data || []);
        } else {
          setStudents([]);
        }
      } catch (error) {
        toast.error(error.response?.data?.error || 'Failed to fetch students');
      } finally {
        setLoadingStudents(false);
      }
    };
    fetchStudents();
  }, [selectedCourse, courses]);

  const currentCourse = courses.find((c) => c._id === selectedCourse);

  const filteredStudents = students.filter((stu) => {
    const query = search.toLowerCase();
    return (
      stu.name?.toLowerCase().includes(query) ||
      stu.enrollmentNo?.toLowerCase().includes(query) ||
      stu.email?.toLowerCase().includes(query)
    );
  });

  const inputClass =
    'w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all hover:border-gray-400 bg-white';

  if (loadingCourses) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded-xl w-48"></div>
        <div className="h-28 bg-gray-200 rounded-2xl"></div>
        <div className="h-72 bg-gray-200 rounded-2xl"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Students</h1>
        <p className="text-sm text-gray-500 mt-1">
          View and monitor enrolled student rosters by course curriculum.
        </p>
      </div>

      {/* Course Filter Card */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <div className="md:col-span-7">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Select Teaching Course
            </label>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className={inputClass}
            >
              <option value="">-- Select a Course --</option>
              {courses.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.code} - {c.name} {c.department?.name ? `(${c.department.name})` : ''}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-5">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Search Student
            </label>
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, enrollment, or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                disabled={!selectedCourse}
                className={`pl-10 ${inputClass} disabled:opacity-50`}
              />
            </div>
          </div>
        </div>

        {/* Selected Course Metadata Bar */}
        {currentCourse && (
          <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between text-xs text-gray-600 gap-2">
            <div className="flex items-center space-x-3">
              <span className="font-semibold text-gray-900">
                {currentCourse.name}
              </span>
              <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-gray-700">
                {currentCourse.code}
              </span>
              <span>•</span>
              <span className="flex items-center">
                <Building2 className="h-3.5 w-3.5 mr-1 text-gray-400" />
                {currentCourse.department?.name || 'Department'}
              </span>
              <span>•</span>
              <span className="flex items-center">
                <Layers className="h-3.5 w-3.5 mr-1 text-gray-400" />
                Sem {currentCourse.semester}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <span className="bg-primary-50 text-primary-700 font-semibold px-2.5 py-1 rounded-lg">
                {students.length} Enrolled Students
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Main Student Listing */}
      {!selectedCourse ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
          <div className="w-16 h-16 bg-gray-50 text-gray-400 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-gray-100">
            <BookOpen className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-base font-bold text-gray-900">Select a course to view students</h3>
          <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">
            Choose a course from the filter above to view all enrolled students and their academic details.
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
            No students are currently enrolled in this department’s batch.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-40">
                    Enrollment No
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Student Name
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Email Address
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Semester
                  </th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-10 text-gray-500 text-sm">
                      No students matching "{search}"
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((stu) => (
                    <tr
                      key={stu._id}
                      className="border-b border-gray-50 hover:bg-gray-50/80 transition-colors group"
                    >
                      <td className="px-5 py-3.5">
                        <span className="font-mono text-xs font-semibold bg-gray-100 text-gray-800 px-2.5 py-1 rounded-md">
                          {stu.enrollmentNo || '—'}
                        </span>
                      </td>

                      <td className="px-5 py-3.5">
                        <div className="flex items-center space-x-3">
                          <div className="w-9 h-9 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-xs shrink-0">
                            {stu.name?.charAt(0) || 'S'}
                          </div>
                          <span className="font-semibold text-gray-900 text-sm">{stu.name}</span>
                        </div>
                      </td>

                      <td className="px-5 py-3.5 text-sm text-gray-600">
                        {stu.email}
                      </td>

                      <td className="px-5 py-3.5 text-sm text-gray-600">
                        <div className="flex items-center space-x-1.5">
                          <Building2 className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                          <span>{stu.department?.name || currentCourse?.department?.name || '—'}</span>
                        </div>
                      </td>

                      <td className="px-5 py-3.5">
                        <span className="bg-accent-50 text-accent-700 text-xs font-semibold px-2.5 py-1 rounded-full border border-accent-100/60">
                          Sem {stu.semester ?? currentCourse?.semester ?? '—'}
                        </span>
                      </td>

                      <td className="px-5 py-3.5 text-right">
                        {stu.email && (
                          <a
                            href={`mailto:${stu.email}`}
                            className="inline-flex items-center p-1.5 text-gray-400 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-all active:scale-90"
                            title={`Send email to ${stu.name}`}
                          >
                            <Mail className="h-4 w-4" />
                          </a>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer Count */}
          <div className="px-5 py-3 bg-gray-50/60 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <span>
              Showing {filteredStudents.length} of {students.length} students
            </span>
            {search && (
              <button
                onClick={() => setSearch('')}
                className="text-primary-700 hover:underline font-medium"
              >
                Clear filter
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
