import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { AuthContext } from '../../context/AuthContext';
import {
  BookOpen,
  Building2,
  Award,
  Search,
  ClipboardCheck,
  FileText,
  Users,
  Calendar,
  ArrowRight
} from 'lucide-react';

export default function FacultyCourses() {
  const { user } = useContext(AuthContext);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        if (!user?._id) return;
        const res = await api.get(`/courses/faculty/${user._id}`);
        setCourses(res.data.data || []);
      } catch (error) {
        toast.error(error.response?.data?.error || 'Failed to fetch courses');
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [user]);

  const filteredCourses = courses.filter((c) => {
    const query = search.toLowerCase();
    return (
      c.name?.toLowerCase().includes(query) ||
      c.code?.toLowerCase().includes(query) ||
      c.department?.name?.toLowerCase().includes(query)
    );
  });

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="h-8 bg-gray-200 rounded-xl w-48"></div>
            <div className="h-4 bg-gray-200 rounded-xl w-32"></div>
          </div>
          <div className="h-10 bg-gray-200 rounded-xl w-64"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-64 bg-gray-200 rounded-2xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header and Search */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Courses</h1>
          <p className="text-sm text-gray-500 mt-1">
            {courses.length} course{courses.length !== 1 ? 's' : ''} assigned to you this term
          </p>
        </div>

        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all hover:border-gray-400 bg-white"
            placeholder="Search courses by code or name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Courses Grid */}
      {filteredCourses.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm max-w-lg mx-auto mt-8">
          <div className="w-16 h-16 bg-gray-50 text-gray-400 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-gray-100">
            <BookOpen className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-base font-bold text-gray-900">
            {search ? 'No matching courses found' : 'No courses assigned yet'}
          </h3>
          <p className="text-sm text-gray-500 mt-1.5 max-w-sm mx-auto">
            {search
              ? 'Try adjusting your search terms to find what you are looking for.'
              : 'You are not assigned to any teaching courses yet. Please check with your department coordinator.'}
          </p>
          {search && (
            <button
              onClick={() => setSearch('')}
              className="mt-4 text-sm font-semibold text-primary-700 hover:text-primary-800"
            >
              Clear search
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div
              key={course._id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 transition-all flex flex-col justify-between group p-6"
            >
              <div>
                {/* Badges */}
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono bg-primary-50 text-primary-700 text-xs font-semibold px-2.5 py-1 rounded-lg border border-primary-100/60">
                    {course.code}
                  </span>
                  <span className="bg-accent-50 text-accent-700 text-xs font-semibold px-2.5 py-1 rounded-full border border-accent-100/60">
                    Sem {course.semester}
                  </span>
                </div>

                {/* Course Title */}
                <h2 className="text-lg font-bold text-gray-900 group-hover:text-primary-700 transition-colors line-clamp-1">
                  {course.name}
                </h2>

                {/* Description */}
                <p className="text-gray-500 text-sm mt-2 line-clamp-2 min-h-[2.5rem]">
                  {course.description || 'No detailed description provided for this course syllabus.'}
                </p>

                {/* Details Meta */}
                <div className="mt-5 pt-4 border-t border-gray-100 space-y-2.5 text-xs text-gray-600">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center text-gray-500">
                      <Building2 className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
                      Department
                    </span>
                    <span className="font-semibold text-gray-800 truncate max-w-[150px]">
                      {course.department?.name || 'General'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center text-gray-500">
                      <Award className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
                      Credits
                    </span>
                    <span className="font-semibold text-gray-800 bg-gray-50 px-2 py-0.5 rounded border border-gray-200/60">
                      {course.credits} Credits
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-4 border-t border-gray-100 grid grid-cols-2 gap-2.5">
                <Link
                  to="/faculty/attendance"
                  className="inline-flex items-center justify-center space-x-1.5 px-3 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl text-xs font-semibold transition-all active:scale-95"
                >
                  <ClipboardCheck className="h-3.5 w-3.5" />
                  <span>Attendance</span>
                </Link>

                <Link
                  to="/faculty/assignments"
                  className="inline-flex items-center justify-center space-x-1.5 px-3 py-2 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-xl text-xs font-semibold transition-all active:scale-95"
                >
                  <FileText className="h-3.5 w-3.5" />
                  <span>Assignments</span>
                </Link>

                <Link
                  to="/faculty/students"
                  className="col-span-2 inline-flex items-center justify-center space-x-1.5 px-3 py-2 bg-gray-50 hover:bg-primary-50 text-gray-700 hover:text-primary-700 rounded-xl text-xs font-semibold transition-all active:scale-95 border border-gray-200/60 hover:border-primary-200"
                >
                  <Users className="h-3.5 w-3.5" />
                  <span>View Enrolled Students</span>
                  <ArrowRight className="h-3 w-3 ml-0.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
