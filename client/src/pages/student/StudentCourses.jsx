import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import {
  BookOpen,
  Search,
  Users,
  Building2,
  Award,
  Calendar,
  X,
  FileText,
  Mail,
  GraduationCap,
  Sparkles
} from 'lucide-react';

export default function StudentCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get('/courses/student/my-courses');
        setCourses(res.data.data || []);
      } catch (error) {
        toast.error(error.response?.data?.error || 'Failed to fetch enrolled courses');
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const filteredCourses = courses.filter((c) => {
    const term = search.toLowerCase();
    const nameMatch = c.name?.toLowerCase().includes(term);
    const codeMatch = c.code?.toLowerCase().includes(term);
    const facultyMatch = c.faculty?.name?.toLowerCase().includes(term);
    return nameMatch || codeMatch || facultyMatch;
  });

  const totalCredits = courses.reduce((acc, c) => acc + (Number(c.credits) || 0), 0);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-2">
            <div className="h-8 bg-gray-200 rounded-xl w-60"></div>
            <div className="h-4 bg-gray-200 rounded-lg w-40"></div>
          </div>
          <div className="h-10 bg-gray-200 rounded-xl w-48"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-gray-200 rounded-xl"></div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-56 bg-gray-200 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Enrolled Courses</h1>
          <p className="text-sm text-gray-500 mt-1">
            {courses.length} course{courses.length !== 1 ? 's' : ''} enrolled for your active curriculum
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all hover:border-gray-400 bg-white"
            placeholder="Search by course or faculty..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Summary Pills */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm flex items-center space-x-3.5">
          <div className="p-2.5 rounded-xl bg-primary-50 text-primary-700">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Enrolled</p>
            <p className="text-xl font-bold text-gray-900">{courses.length} Subjects</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm flex items-center space-x-3.5">
          <div className="p-2.5 rounded-xl bg-blue-50 text-blue-700">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Credits</p>
            <p className="text-xl font-bold text-gray-900">{totalCredits} Credits</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm flex items-center space-x-3.5">
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Current Term</p>
            <p className="text-xl font-bold text-gray-900">
              Semester {courses[0]?.semester || 1}
            </p>
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      {filteredCourses.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
          <div className="w-16 h-16 bg-gray-50 text-gray-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-gray-300" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">
            {search ? 'No matching courses found' : 'No courses enrolled yet'}
          </h3>
          <p className="text-sm text-gray-500 max-w-sm mx-auto">
            {search
              ? `No subjects match "${search}". Try adjusting your search query.`
              : 'You do not have any enrolled courses assigned to your current semester and department.'}
          </p>
          {search && (
            <button
              onClick={() => setSearch('')}
              className="mt-4 px-4 py-2 text-xs font-medium text-primary-700 bg-primary-50 rounded-xl hover:bg-primary-100 transition-colors"
            >
              Clear Search
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div
              key={course._id}
              className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-5 flex flex-col justify-between group"
            >
              <div>
                {/* Badges Top Bar */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-primary-50 text-primary-700 border border-primary-100">
                    {course.code}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700">
                      {course.credits} Credits
                    </span>
                    {course.semester && (
                      <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-gray-100 text-gray-600">
                        Sem {course.semester}
                      </span>
                    )}
                  </div>
                </div>

                {/* Course Name */}
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary-700 transition-colors line-clamp-1 mb-2">
                  {course.name}
                </h3>

                {/* Description */}
                <p className="text-xs text-gray-500 line-clamp-2 mb-4 leading-relaxed">
                  {course.description || 'Comprehensive curriculum subject designed for fundamental and applied mastery.'}
                </p>

                {/* Meta Items */}
                <div className="space-y-2 pt-3 border-t border-gray-100 text-xs text-gray-600">
                  <div className="flex items-center space-x-2">
                    <Building2 className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span className="truncate">{course.department?.name || 'Department Academic Unit'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span className="font-medium text-gray-700 truncate">
                      {course.faculty?.name ? `Prof. ${course.faculty.name}` : 'Faculty Not Assigned'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-5 pt-3 border-t border-gray-50">
                <button
                  onClick={() => setSelectedCourse(course)}
                  className="w-full flex items-center justify-center py-2 px-3 text-xs font-semibold text-primary-700 bg-primary-50 rounded-xl hover:bg-primary-100 transition-colors active:scale-95"
                >
                  <FileText className="w-3.5 h-3.5 mr-1.5" />
                  View Course Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Course Detail Modal */}
      {selectedCourse && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in"
          onClick={() => setSelectedCourse(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-gray-100">
              <div>
                <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-primary-50 text-primary-700 border border-primary-100">
                  {selectedCourse.code}
                </span>
                <h2 className="text-xl font-bold text-gray-900 mt-2">{selectedCourse.name}</h2>
              </div>
              <button
                onClick={() => setSelectedCourse(null)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="py-4 space-y-4 text-sm">
              <div>
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  Overview & Syllabus
                </h4>
                <p className="text-gray-700 leading-relaxed text-xs sm:text-sm bg-gray-50 p-3.5 rounded-xl border border-gray-100">
                  {selectedCourse.description ||
                    'This course is structured according to the semester academic guidelines, focusing on core concepts, practical assignments, and end-term examinations.'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <span className="text-gray-500 block mb-0.5">Academic Credits</span>
                  <span className="font-bold text-gray-900 text-sm">{selectedCourse.credits} Credits</span>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <span className="text-gray-500 block mb-0.5">Semester</span>
                  <span className="font-bold text-gray-900 text-sm">Semester {selectedCourse.semester || 1}</span>
                </div>
              </div>

              <div className="p-3.5 bg-purple-50/50 rounded-xl border border-purple-100 space-y-2">
                <div className="flex items-center space-x-2 text-xs font-semibold text-primary-900">
                  <Users className="w-4 h-4 text-primary-700" />
                  <span>Course Instructor</span>
                </div>
                <p className="text-sm font-bold text-gray-900">
                  {selectedCourse.faculty?.name ? `Prof. ${selectedCourse.faculty.name}` : 'Not currently assigned'}
                </p>
                {selectedCourse.faculty?.email && (
                  <p className="text-xs text-primary-700 flex items-center">
                    <Mail className="w-3.5 h-3.5 mr-1" />
                    {selectedCourse.faculty.email}
                  </p>
                )}
              </div>

              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-xs">
                <span className="text-gray-500 block mb-0.5">Department / Faculty Unit</span>
                <span className="font-semibold text-gray-800">
                  {selectedCourse.department?.name || 'Central Department of Academics'}
                </span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-4 border-t border-gray-100 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedCourse(null)}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors active:scale-95"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
