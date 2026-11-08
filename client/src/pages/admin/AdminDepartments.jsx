import { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { Building2, Plus, Pencil, Trash2, X, Search, Loader2, Users, GraduationCap } from 'lucide-react';

export default function AdminDepartments() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [form, setForm] = useState({ code: '', name: '', description: '' });

  const fetchDepartments = async () => {
    try {
      const res = await api.get('/departments');
      setDepartments(res.data.data || []);
    } catch (err) { toast.error(err.response?.data?.error || 'Failed to load departments'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchDepartments(); }, []);

  const openCreate = () => {
    setForm({ code: '', name: '', description: '' });
    setEditingId(null);
    setShowModal(true);
  };

  const openEdit = (dept) => {
    setForm({ code: dept.code, name: dept.name, description: dept.description || '' });
    setEditingId(dept._id);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.code || !form.name) { toast.error('Code and name are required'); return; }
    setSaving(true);
    try {
      if (editingId) {
        await api.put(`/departments/${editingId}`, form);
        toast.success('Department updated!');
      } else {
        await api.post('/departments', form);
        toast.success('Department created!');
      }
      setShowModal(false);
      fetchDepartments();
    } catch (err) { toast.error(err.response?.data?.error || 'Failed to save'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/departments/${id}`);
      toast.success('Department deleted');
      setConfirmDelete(null);
      fetchDepartments();
    } catch (err) { toast.error(err.response?.data?.error || 'Failed to delete'); }
  };

  const filtered = departments.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.code.toLowerCase().includes(search.toLowerCase())
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
          <h1 className="text-2xl font-bold text-gray-900">Departments</h1>
          <p className="text-sm text-gray-500 mt-1">{departments.length} department{departments.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={openCreate}
          className="bg-primary-700 text-white px-4 py-2.5 rounded-xl font-medium hover:bg-primary-800 flex items-center transition-all active:scale-95 hover:shadow-lg hover:shadow-primary-700/25">
          <Plus className="h-4 w-4 mr-2" /> Add Department
        </button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          placeholder="Search departments..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Department</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">HOD</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Faculty</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Students</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan="6" className="text-center py-12 text-gray-500">
                  <Building2 className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                  <p className="font-medium">{search ? 'No matches found' : 'No departments yet'}</p>
                </td></tr>
              ) : filtered.map(dept => (
                <tr key={dept._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors group">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 bg-blue-100 text-blue-700 rounded-lg flex items-center justify-center font-bold text-xs">
                        {dept.code?.substring(0, 3)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{dept.name}</p>
                        <span className="bg-gray-100 text-gray-600 text-[10px] font-mono px-1.5 py-0.5 rounded">{dept.code}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-gray-600">{dept.hod?.name || '—'}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center text-sm text-gray-600"><Users className="h-3.5 w-3.5 mr-1.5 text-gray-400" />{dept.facultyCount || 0}</div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center text-sm text-gray-600"><GraduationCap className="h-3.5 w-3.5 mr-1.5 text-gray-400" />{dept.studentCount || 0}</div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${dept.isActive !== false ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {dept.isActive !== false ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openEdit(dept)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all active:scale-90" title="Edit">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button onClick={() => setConfirmDelete(dept._id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all active:scale-90" title="Delete">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    {confirmDelete === dept._id && (
                      <div className="mt-2 p-2 bg-red-50 rounded-lg border border-red-100 text-xs">
                        <p className="text-red-700 mb-1.5">Delete "{dept.name}"?</p>
                        <div className="flex space-x-2">
                          <button onClick={() => handleDelete(dept._id)} className="bg-red-600 text-white px-2.5 py-1 rounded-lg hover:bg-red-700 active:scale-95">Yes</button>
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
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-gray-900">{editingId ? 'Edit Department' : 'Add Department'}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100"><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department Code *</label>
                <input className={`${inputClass} uppercase`} placeholder="e.g. CSE" value={form.code} onChange={e => setForm({...form, code: e.target.value.toUpperCase()})} maxLength={10} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department Name *</label>
                <input className={inputClass} placeholder="e.g. Computer Science & Engineering" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea className={inputClass} rows="3" placeholder="Department description..." value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
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
