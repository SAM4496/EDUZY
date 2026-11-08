import { useState, useEffect, useContext } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { AuthContext } from '../../context/AuthContext';
import {
  FileText,
  Plus,
  Pencil,
  Trash2,
  X,
  Search,
  Loader2,
  Calendar,
  Award,
  BookOpen,
  Clock,
  Filter
} from 'lucide-react';

export default function FacultyAssignments() {
  const { user } = useContext(AuthContext);
  const [assignments, setAssignments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [selectedCourseFilter, setSelectedCourseFilter] = useState('');
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    course: '',
    description: '',
    dueDate: '',
    totalPoints: '100',
    weightage: '10'
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      if (!user?._id) return;
      const [assnRes, crsRes] = await Promise.all([
        api.get('/assignments'),
        api.get(`/courses/faculty/${user._id}`)
      ]);

      const facultyCourses = crsRes.data.data || [];
      const courseIds = facultyCourses.map((c) => c._id);
      const allAssn = assnRes.data.data || [];

      // Filter assignments belonging to faculty's courses
      setAssignments(allAssn.filter((a) => courseIds.includes(a.course?._id || a.course)));
      setCourses(facultyCourses);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to fetch assignments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openCreateModal = () => {
    setEditingId(null);
    setFormData({
      title: '',
      course: courses.length > 0 ? courses[0]._id : '',
      description: '',
      dueDate: '',
      totalPoints: '100',
      weightage: '10'
    });
    setShowModal(true);
  };

  const openEditModal = (assn) => {
    setEditingId(assn._id);
    setFormData({
      title: assn.title || '',
      course: assn.course?._id || assn.course || '',
      description: assn.description || '',
      dueDate: assn.dueDate ? new Date(assn.dueDate).toISOString().split('T')[0] : '',
      totalPoints: assn.totalPoints?.toString() || '100',
      weightage: assn.weightage?.toString() || '10'
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.course || !formData.dueDate) {
      return toast.error('Please fill in all required fields');
    }

    try {
      setSaving(true);
      if (editingId) {
        await api.put(`/assignments/${editingId}`, formData);
        toast.success('Assignment updated successfully');
      } else {
        await api.post('/assignments', formData);
        toast.success('Assignment created successfully');
      }
      setShowModal(false);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to save assignment');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setDeletingId(id);
      await api.delete(`/assignments/${id}`);
      toast.success('Assignment deleted successfully');
      setConfirmDelete(null);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to delete assignment');
    } finally {
      setDeletingId(null);
    }
  };

  const filteredAssignments = assignments.filter((assn) => {
    const matchesSearch =
      assn.title?.toLowerCase().includes(search.toLowerCase()) ||
      assn.course?.name?.toLowerCase().includes(search.toLowerCase()) ||
      assn.course?.code?.toLowerCase().includes(search.toLowerCase());

    const courseId = assn.course?._id || assn.course;
    const matchesCourse = selectedCourseFilter ? courseId === selectedCourseFilter : true;

    return matchesSearch && matchesCourse;
  });

  const inputClass =
    'w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all hover:border-gray-400 bg-white';

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <div className="h-8 bg-gray-200 rounded-xl w-48"></div>
            <div className="h-4 bg-gray-200 rounded-xl w-32"></div>
          </div>
          <div className="h-10 bg-gray-200 rounded-xl w-40"></div>
        </div>
        <div className="h-64 bg-gray-200 rounded-2xl"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header and Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Assignments</h1>
          <p className="text-sm text-gray-500 mt-1">
            {assignments.length} total assignment{assignments.length !== 1 ? 's' : ''} across your courses
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="bg-primary-700 text-white px-4 py-2.5 rounded-xl font-medium hover:bg-primary-800 flex items-center justify-center transition-all active:scale-95 hover:shadow-lg hover:shadow-primary-700/25 shrink-0"
        >
          <Plus className="h-4 w-4 mr-2" />
          <span>Create Assignment</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all hover:border-gray-400 bg-white"
            placeholder="Search assignments by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="w-full sm:w-64">
          <select
            value={selectedCourseFilter}
            onChange={(e) => setSelectedCourseFilter(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all hover:border-gray-400 bg-white"
          >
            <option value="">All Courses</option>
            {courses.map((c) => (
              <option key={c._id} value={c._id}>
                {c.code} - {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Assignments Table Container */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Assignment Title
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Course
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Points & Weight
                </th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredAssignments.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-12 text-gray-500">
                    <FileText className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                    <p className="font-medium text-gray-800">
                      {search || selectedCourseFilter ? 'No matching assignments' : 'No assignments created yet'}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {search || selectedCourseFilter
                        ? 'Try clearing the search or course filter.'
                        : 'Click "Create Assignment" above to assign new work to your students.'}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredAssignments.map((assn) => {
                  const isPastDue = assn.dueDate && new Date(assn.dueDate) < new Date();
                  return (
                    <tr
                      key={assn._id}
                      className="border-b border-gray-50 hover:bg-gray-50/80 transition-colors group"
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                            <FileText className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">{assn.title}</p>
                            {assn.description && (
                              <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                                {assn.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-3.5 text-sm text-gray-700">
                        <div className="flex items-center space-x-1.5">
                          <BookOpen className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                          <span className="font-medium">
                            {assn.course?.name || '—'}
                          </span>
                          {assn.course?.code && (
                            <span className="bg-gray-100 text-gray-600 text-[10px] font-mono px-1.5 py-0.5 rounded">
                              {assn.course.code}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="px-5 py-3.5 text-sm">
                        <div className="flex items-center space-x-1.5">
                          <Calendar className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                          <span className={isPastDue ? 'text-rose-600 font-medium' : 'text-gray-700'}>
                            {assn.dueDate ? new Date(assn.dueDate).toLocaleDateString() : '—'}
                          </span>
                        </div>
                      </td>

                      <td className="px-5 py-3.5">
                        <div className="flex items-center space-x-2">
                          <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                            {assn.totalPoints || 100} pts
                          </span>
                          {assn.weightage && (
                            <span className="bg-purple-50 text-purple-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                              {assn.weightage}% wt
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => openEditModal(assn)}
                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all active:scale-90"
                            title="Edit Assignment"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setConfirmDelete(assn._id)}
                            className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all active:scale-90"
                            title="Delete Assignment"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        {/* Inline Delete Confirmation */}
                        {confirmDelete === assn._id && (
                          <div className="mt-2 p-2.5 bg-rose-50 rounded-xl border border-rose-100 text-left text-xs max-w-xs ml-auto shadow-sm">
                            <p className="text-rose-800 font-medium mb-2">
                              Delete this assignment?
                            </p>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleDelete(assn._id)}
                                disabled={deletingId === assn._id}
                                className="bg-rose-600 text-white px-3 py-1 rounded-lg font-semibold hover:bg-rose-700 active:scale-95 transition-all text-xs flex items-center"
                              >
                                {deletingId === assn._id ? (
                                  <Loader2 className="h-3 w-3 animate-spin mr-1" />
                                ) : null}
                                Yes, Delete
                              </button>
                              <button
                                onClick={() => setConfirmDelete(null)}
                                className="bg-white border border-gray-200 text-gray-700 px-3 py-1 rounded-lg font-medium hover:bg-gray-50 active:scale-95 transition-all text-xs"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">
                {editingId ? 'Edit Assignment' : 'Create Assignment'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Assignment Title *
                </label>
                <input
                  required
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g. Lab Project 1 - Binary Search Trees"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Course *
                </label>
                <select
                  required
                  name="course"
                  value={formData.course}
                  onChange={handleInputChange}
                  className={inputClass}
                >
                  <option value="">-- Select Course --</option>
                  {courses.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.code} - {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Instructions & Description
                </label>
                <textarea
                  name="description"
                  rows="3"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Provide instructions, submission guidelines, or rubrics..."
                  className={inputClass}
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Due Date *
                </label>
                <input
                  required
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleInputChange}
                  className={inputClass}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Total Points *
                  </label>
                  <input
                    required
                    type="number"
                    min="1"
                    name="totalPoints"
                    value={formData.totalPoints}
                    onChange={handleInputChange}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Weightage (%) *
                  </label>
                  <input
                    required
                    type="number"
                    min="0"
                    max="100"
                    name="weightage"
                    value={formData.weightage}
                    onChange={handleInputChange}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-100 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 active:scale-95 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 bg-primary-700 text-white rounded-xl text-sm font-semibold hover:bg-primary-800 disabled:opacity-50 active:scale-95 transition-all flex items-center hover:shadow-lg hover:shadow-primary-700/25"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>{editingId ? 'Update Assignment' : 'Create Assignment'}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
