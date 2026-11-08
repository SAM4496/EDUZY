import { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { BookOpen, Plus, Pencil, Trash2, X, Search, Loader2, Users, Building2 } from 'lucide-react';

export default function AdminCourses() {
  const [courses, setCourses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [form, setForm] = useState({ code: '', name: '', department: '', faculty: '', credits: '3', semester: '1', description: '' });

  const fetchData = async () => {
    try {
      const [crsRes, depRes, facRes] = await Promise.all([
        api.get('/courses'), api.get('/departments'), api.get('/users/faculty')
      ]);
      setCourses(crsRes.data.data || []);
      setDepartments(depRes.data.data || []);
      setFaculty(facRes.data.data || []);
    } catch (err) { toast.error(err.response?.data?.error || 'Failed to fetch data'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const openCreate = () => {
    setForm({ code: '', name: '', department: '', faculty: '', credits: '3', semester: '1', description: '' });
    setEditingId(null);
    setShowModal(true);
  };

  const openEdit = (crs) => {
    setForm({
      code: crs.code || '', name: crs.name || '', department: crs.department?._id || '',
      faculty: crs.faculty?._id || '', credits: crs.credits || '3', semester: crs.semester || '1',
      description: crs.description || ''
    });
    setEditingId(crs._id);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.code || !form.name) { toast.error('Code and name are required'); return; }
    setSaving(true);
    try {
      if (editingId) {
        await api.put(`/courses/${editingId}`, form);
        toast.success('Course updated!');
      } else {
        await api.post('/courses', form);
        toast.success('Course created!');
      }
      setShowModal(false);
      fetchData();
    } catch (err) { toast.error(err.response?.data?.error || 'Failed to save'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/courses/${id}`);
      toast.success('Course deleted');
      setConfirmDelete(null);
      fetchData();
    } catch (err) { toast.error(err.response?.data?.error || 'Failed to delete'); }
  };

  const filtered = courses.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.code.toLowerCase().includes(search.toLowerCase())
  );

  const inputClass = "w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all hover:border-gray-400";

  if (loading) return (
    <div className="space-y-4 animate-pulse">
      <div className="h-10 bg-gray-200 rounded-xl w-48"></div>
      <div className="h-64 bg-gray-200 rounded-xl"></div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Courses</h1>
          <p className="text-sm text-gray-500 mt-1">{courses.length} course{courses.length !== 1 ? 's' : ''} available</p>
        </div>
        <button onClick={openCreate}
          className="bg-primary-700 text-white px-4 py-2.5 rounded-xl font-medium hover:bg-primary-800 flex items-center transition-all active:scale-95 hover:shadow-lg hover:shadow-primary-700/25">
          <Plus className="h-4 w-4 mr-2" /> Add Course
        </button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          placeholder="Search courses..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Course</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Department</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Faculty</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Credits</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Sem</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan="6" className="text-center py-12 text-gray-500">
                  <BookOpen className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                  <p className="font-medium">{search ? 'No matches found' : 'No courses yet'}</p>
                </td></tr>
              ) : filtered.map(crs => (
                <tr key={crs._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors group">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 bg-purple-100 text-purple-700 rounded-lg flex items-center justify-center font-bold text-xs">
                        {crs.code?.substring(0, 2)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{crs.name}</p>
                        <span className="bg-gray-100 text-gray-600 text-[10px] font-mono px-1.5 py-0.5 rounded">{crs.code}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-gray-600">
                    <div className="flex items-center"><Building2 className="h-3.5 w-3.5 mr-1.5 text-gray-400" />{crs.department?.name || '—'}</div>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-gray-600">
                    <div className="flex items-center"><Users className="h-3.5 w-3.5 mr-1.5 text-gray-400" />{crs.faculty?.name || '—'}</div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="bg-blue-50 text-blue-700 text-xs font-medium px-2 py-0.5 rounded-full">{crs.credits} cr</span>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-gray-600">Sem {crs.semester}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openEdit(crs)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all active:scale-90" title="Edit">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button onClick={() => setConfirmDelete(crs._id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all active:scale-90" title="Delete">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    {confirmDelete === crs._id && (
                      <div className="mt-2 p-2 bg-red-50 rounded-lg border border-red-100 text-xs">
                        <p className="text-red-700 mb-1.5">Delete this course?</p>
                        <div className="flex space-x-2">
                          <button onClick={() => handleDelete(crs._id)} className="bg-red-600 text-white px-2.5 py-1 rounded-lg hover:bg-red-700 active:scale-95">Yes</button>
                          <button onClick={() => setConfirmDelete(null)} className="bg-gray-200 text-gray-700 px-2.5 py-1 rounded-lg hover:bg-gray-300 active:scale-95">No</button>
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-gray-900">{editingId ? 'Edit Course' : 'Add Course'}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100"><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Course Code *</label>
                  <input className={`${inputClass} uppercase`} placeholder="e.g. CS501" value={form.code} onChange={e => setForm({...form, code: e.target.value.toUpperCase()})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Credits *</label>
                  <select className={inputClass} value={form.credits} onChange={e => setForm({...form, credits: e.target.value})}>
                    {[1,2,3,4,5,6].map(c => <option key={c} value={c}>{c} Credits</option>)}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Course Name *</label>
                  <input className={inputClass} placeholder="e.g. Data Structures & Algorithms" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  <select className={inputClass} value={form.department} onChange={e => setForm({...form, department: e.target.value})}>
                    <option value="">Select Department</option>
                    {departments.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Faculty</label>
                  <select className={inputClass} value={form.faculty} onChange={e => setForm({...form, faculty: e.target.value})}>
                    <option value="">Select Faculty</option>
                    {faculty.filter(f => !form.department || f.department?._id === form.department).map(f => (
                      <option key={f._id} value={f._id}>{f.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
                  <select className={inputClass} value={form.semester} onChange={e => setForm({...form, semester: e.target.value})}>
                    {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Semester {s}</option>)}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea className={inputClass} rows="2" placeholder="Brief description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-100">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 border border-gray-300 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 active:scale-95 transition-all">Cancel</button>
              <button onClick={handleSave} disabled={saving || !form.code || !form.name}
                className="px-5 py-2 bg-primary-700 text-white rounded-xl text-sm font-medium hover:bg-primary-800 disabled:opacity-40 active:scale-95 transition-all flex items-center hover:shadow-lg hover:shadow-primary-700/25">
                {saving ? <><Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> Saving...</> : editingId ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
