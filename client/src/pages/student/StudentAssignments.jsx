import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import {
  FileText,
  Search,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  UploadCloud,
  X,
  Loader2,
  Award,
  Link as LinkIcon,
  BookOpen
} from 'lucide-react';

export default function StudentAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Submit Modal
  const [submitModal, setSubmitModal] = useState(false);
  const [selectedAssn, setSelectedAssn] = useState(null);
  const [fileUrl, setFileUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // View Details Modal
  const [viewModal, setViewModal] = useState(false);
  const [activeSubmission, setActiveSubmission] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [assnRes, subRes] = await Promise.all([
        api.get('/assignments/student/my-assignments'),
        api.get('/submissions/student/my-submissions')
      ]);
      setAssignments(assnRes.data.data || []);
      setSubmissions(subRes.data.data || []);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to fetch assignments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getSubmissionFor = (assnId) => {
    return submissions.find(
      (s) => s.assignment === assnId || s.assignment?._id === assnId
    );
  };

  const getStatusInfo = (assn) => {
    const sub = getSubmissionFor(assn._id);
    const dueDate = new Date(assn.dueDate);
    const isOverdue = dueDate < new Date();

    if (!sub) {
      if (isOverdue) {
        return {
          key: 'overdue',
          label: 'Overdue',
          badgeClass: 'bg-rose-50 text-rose-700 border border-rose-200',
          icon: AlertCircle
        };
      }
      return {
        key: 'pending',
        label: 'Pending',
        badgeClass: 'bg-amber-50 text-amber-700 border border-amber-200',
        icon: Clock
      };
    }

    if (sub.status === 'graded') {
      const score = sub.score !== undefined ? sub.score : sub.obtainedMarks;
      const points = assn.totalPoints || 100;
      return {
        key: 'graded',
        label: `Graded (${score}/${points})`,
        score,
        grade: sub.grade,
        badgeClass: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
        icon: Award
      };
    }

    return {
      key: 'submitted',
      label: 'Submitted',
      badgeClass: 'bg-blue-50 text-blue-700 border border-blue-200',
      icon: CheckCircle2
    };
  };

  const openSubmit = (assn) => {
    setSelectedAssn(assn);
    const existingSub = getSubmissionFor(assn._id);
    setFileUrl(existingSub?.files?.[0] || existingSub?.fileUrl || '');
    setNotes('');
    setSubmitModal(true);
  };

  const openView = (assn, sub) => {
    setSelectedAssn(assn);
    setActiveSubmission(sub);
    setViewModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fileUrl.trim()) {
      return toast.error('Please provide a file URL or submission link');
    }

    setSubmitting(true);
    try {
      await api.post('/submissions', {
        assignment: selectedAssn._id,
        assignmentId: selectedAssn._id,
        files: [fileUrl.trim()],
        fileUrl: fileUrl.trim(),
        notes: notes.trim()
      });
      toast.success('Assignment submitted successfully!');
      setSubmitModal(false);
      setFileUrl('');
      setNotes('');
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to submit assignment');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredAssignments = assignments.filter((assn) => {
    const status = getStatusInfo(assn);
    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'pending' && (status.key === 'pending' || status.key === 'overdue')) ||
      (statusFilter === 'submitted' && status.key === 'submitted') ||
      (statusFilter === 'graded' && status.key === 'graded');

    const term = search.toLowerCase();
    const matchesSearch =
      !term ||
      assn.title?.toLowerCase().includes(term) ||
      assn.course?.name?.toLowerCase().includes(term) ||
      assn.course?.code?.toLowerCase().includes(term);

    return matchesStatus && matchesSearch;
  });

  const pendingCount = assignments.filter((a) => !getSubmissionFor(a._id)).length;
  const gradedCount = assignments.filter((a) => getSubmissionFor(a._id)?.status === 'graded').length;

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 bg-gray-200 rounded-xl w-60"></div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-xl"></div>
          ))}
        </div>
        <div className="h-96 bg-gray-200 rounded-xl"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Assignments</h1>
          <p className="text-sm text-gray-500 mt-1">
            Track coursework deadlines, submit digital deliverables, and view instructor evaluations
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all hover:border-gray-400 bg-white"
            placeholder="Search assignments or courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* KPI Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm flex items-center space-x-3.5">
          <div className="p-2.5 rounded-xl bg-primary-50 text-primary-700">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Tasks</p>
            <p className="text-xl font-bold text-gray-900">{assignments.length} Coursework</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm flex items-center space-x-3.5">
          <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Pending Action</p>
            <p className="text-xl font-bold text-gray-900">{pendingCount} Due</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm flex items-center space-x-3.5">
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Evaluated & Graded</p>
            <p className="text-xl font-bold text-gray-900">{gradedCount} Completed</p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex bg-gray-100 p-1 rounded-xl w-fit text-xs font-medium space-x-1">
        {[
          { key: 'ALL', label: 'All Tasks' },
          { key: 'pending', label: 'Pending / Due' },
          { key: 'submitted', label: 'Submitted' },
          { key: 'graded', label: 'Graded' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setStatusFilter(tab.key)}
            className={`px-3.5 py-1.5 rounded-lg transition-all ${
              statusFilter === tab.key
                ? 'bg-white text-gray-900 shadow-xs font-semibold'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Assignment Title</th>
                <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Course</th>
                <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Due Date</th>
                <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Weightage</th>
                <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredAssignments.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-gray-500">
                    <FileText className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                    <p className="font-medium text-sm">No assignments found</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {search ? 'Try adjusting your search criteria.' : 'No coursework has been scheduled.'}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredAssignments.map((assn) => {
                  const sub = getSubmissionFor(assn._id);
                  const status = getStatusInfo(assn);
                  const StatusIcon = status.icon;
                  const isSubmitted = !!sub;
                  const dueDate = new Date(assn.dueDate);

                  return (
                    <tr key={assn._id} className="hover:bg-gray-50/70 transition-colors group">
                      {/* Title & Description */}
                      <td className="px-5 py-4 max-w-xs">
                        <p className="font-semibold text-gray-900 text-sm">{assn.title}</p>
                        {assn.description && (
                          <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                            {assn.description}
                          </p>
                        )}
                      </td>

                      {/* Course */}
                      <td className="px-5 py-4">
                        <div className="flex items-center space-x-1.5">
                          <span className="font-mono text-xs font-bold px-1.5 py-0.5 rounded bg-gray-100 text-gray-700">
                            {assn.course?.code || '—'}
                          </span>
                          <span className="text-xs font-medium text-gray-800 truncate max-w-[180px]">
                            {assn.course?.name}
                          </span>
                        </div>
                        {assn.faculty?.name && (
                          <p className="text-[11px] text-gray-500 mt-0.5">By Prof. {assn.faculty.name}</p>
                        )}
                      </td>

                      {/* Due Date */}
                      <td className="px-5 py-4 text-xs text-gray-700">
                        <div className="flex items-center space-x-1.5">
                          <Calendar className="w-3.5 h-3.5 text-gray-400" />
                          <span>{dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          {dueDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </td>

                      {/* Total Points */}
                      <td className="px-5 py-4 text-xs font-medium text-gray-700">
                        {assn.totalPoints || 100} Pts
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${status.badgeClass}`}>
                          <StatusIcon className="w-3.5 h-3.5" />
                          {status.label}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="px-5 py-4 text-right">
                        {!isSubmitted ? (
                          <button
                            onClick={() => openSubmit(assn)}
                            className="bg-primary-700 text-white px-3.5 py-1.5 rounded-xl font-medium text-xs hover:bg-primary-800 flex items-center ml-auto transition-all active:scale-95 hover:shadow-md hover:shadow-primary-700/20"
                          >
                            <UploadCloud className="w-3.5 h-3.5 mr-1.5" />
                            Submit
                          </button>
                        ) : (
                          <button
                            onClick={() => openView(assn, sub)}
                            className="bg-gray-100 text-gray-700 px-3.5 py-1.5 rounded-xl font-medium text-xs hover:bg-gray-200 flex items-center ml-auto transition-all active:scale-95"
                          >
                            <ExternalLink className="w-3.5 h-3.5 mr-1.5 text-gray-500" />
                            View Details
                          </button>
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

      {/* Submission Modal */}
      {submitModal && selectedAssn && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in"
          onClick={() => setSubmitModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-gray-100">
              <div>
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-primary-50 text-primary-700 border border-primary-100">
                  {selectedAssn.course?.code}
                </span>
                <h2 className="text-xl font-bold text-gray-900 mt-1.5">{selectedAssn.title}</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Due: {new Date(selectedAssn.dueDate).toLocaleString()} • Maximum Points: {selectedAssn.totalPoints || 100}
                </p>
              </div>
              <button
                onClick={() => setSubmitModal(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="py-4 space-y-4">
              {selectedAssn.description && (
                <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100 text-xs text-gray-700 leading-relaxed">
                  <p className="font-semibold text-gray-900 mb-1">Instructions:</p>
                  {selectedAssn.description}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Submission File / Drive Link <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <LinkIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    required
                    type="url"
                    value={fileUrl}
                    onChange={(e) => setFileUrl(e.target.value)}
                    placeholder="https://drive.google.com/... or https://github.com/..."
                    className="w-full border border-gray-300 rounded-xl pl-10 pr-3.5 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all hover:border-gray-400"
                  />
                </div>
                <p className="text-[11px] text-gray-500 mt-1.5">
                  Paste a publicly accessible URL to your file (Google Drive, GitHub repo, Dropbox, OneDrive, etc.)
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Student Remarks / Notes (Optional)
                </label>
                <textarea
                  rows="2"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any comments for your instructor..."
                  className="w-full border border-gray-300 rounded-xl px-3.5 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all hover:border-gray-400 resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-gray-100 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setSubmitModal(false)}
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors active:scale-95"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-primary-700 text-white px-5 py-2.5 rounded-xl font-medium text-sm hover:bg-primary-800 flex items-center transition-all active:scale-95 hover:shadow-lg hover:shadow-primary-700/25 disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Confirm Submission'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Submission Details Modal */}
      {viewModal && selectedAssn && activeSubmission && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in"
          onClick={() => setViewModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between pb-4 border-b border-gray-100">
              <div>
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-gray-100 text-gray-700">
                  {selectedAssn.course?.code}
                </span>
                <h2 className="text-xl font-bold text-gray-900 mt-1">{selectedAssn.title}</h2>
              </div>
              <button
                onClick={() => setViewModal(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-4 text-sm">
              <div className="flex items-center justify-between p-3.5 bg-gray-50 rounded-xl border border-gray-100">
                <div>
                  <span className="text-xs text-gray-500 block">Submitted At</span>
                  <span className="font-semibold text-gray-800">
                    {new Date(activeSubmission.submittedAt).toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-gray-500 block">Submission Status</span>
                  <span className="font-bold text-xs uppercase px-2.5 py-1 rounded-full bg-blue-50 text-blue-700">
                    {activeSubmission.status}
                  </span>
                </div>
              </div>

              {/* Grade / Evaluation if available */}
              {activeSubmission.status === 'graded' && (
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-emerald-600" />
                      Evaluated Grade
                    </span>
                    <span className="text-lg font-extrabold text-emerald-700">
                      {activeSubmission.grade || 'Graded'}
                    </span>
                  </div>
                  <div className="text-sm font-semibold text-emerald-900">
                    Score: {activeSubmission.score ?? activeSubmission.obtainedMarks} / {selectedAssn.totalPoints || 100} Points
                  </div>
                  {activeSubmission.feedback && (
                    <div className="text-xs text-emerald-800 pt-2 border-t border-emerald-200/60">
                      <span className="font-semibold block mb-0.5">Faculty Feedback:</span>
                      {activeSubmission.feedback}
                    </div>
                  )}
                </div>
              )}

              {/* Submitted File Link */}
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">
                  Submitted Deliverable
                </label>
                {activeSubmission.files?.[0] || activeSubmission.fileUrl ? (
                  <a
                    href={activeSubmission.files?.[0] || activeSubmission.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between p-3 rounded-xl bg-purple-50/50 border border-purple-100 text-primary-700 hover:bg-purple-100/50 transition-colors text-xs font-medium"
                  >
                    <span className="truncate pr-3">
                      {activeSubmission.files?.[0] || activeSubmission.fileUrl}
                    </span>
                    <ExternalLink className="w-4 h-4 shrink-0" />
                  </a>
                ) : (
                  <p className="text-xs text-gray-500 italic">No link recorded</p>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setViewModal(false);
                  openSubmit(selectedAssn);
                }}
                className="text-xs font-semibold text-primary-700 hover:underline"
              >
                Re-submit Work
              </button>
              <button
                type="button"
                onClick={() => setViewModal(false)}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors active:scale-95"
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
