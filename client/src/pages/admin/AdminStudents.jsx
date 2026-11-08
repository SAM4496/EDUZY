import { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { GraduationCap, Plus, Pencil, Trash2, X, Search, Key, Copy, Check, Loader2, Mail } from 'lucide-react';

export default function AdminStudents() {
  const [students, setStudents] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [branches, setBranches] = useState([]);
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [credentials, setCredentials] = useState(null);
  const [copied, setCopied] = useState('');
  const [form, setForm] = useState({ name: '', email: '', phone: '', department: '', branch: '', field: '', semester: '', enrollmentNo: '' });

  const fetchData = async () => {
    try {
      const [stuRes, depRes, brRes, fiRes] = await Promise.all([
        api.get('/users/students'), api.get('/departments'), api.get('/branches'), api.get('/fields')
      ]);
      setStudents(stuRes.data.data || []);
      setDepartments(depRes.data.data || []);
      setBranches(brRes.data.data || []);
      setFields(fiRes.data.data || []);
    } catch (err) { toast.error(err.response?.data?.error || 'Failed to fetch data'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const openCreate = () => {
    setForm({ name: '', email: '', phone: '', department: '', branch: '', field: '', semester: '', enrollmentNo: '' });
    setEditingId(null);
    setShowModal(true);
  };

  const openEdit = (stu) => {
    setForm({
      name: stu.name || '', email: stu.email || '', phone: stu.phone || '',
      department: stu.department?._id || '', branch: stu.branch?._id || '', field: stu.field?._id || '',
      semester: stu.semester || '', enrollmentNo: stu.enrollmentNo || ''
    });
    setEditingId(stu._id);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.email) { toast.error('Name and email are required'); return; }
    setSaving(true);
    try {
      if (editingId) {
        await api.put(`/users/${editingId}`, form);
        toast.success('Student updated!');
        setShowModal(false);
      } else {
        const res = await api.post('/users', { ...form, role: 'student' });
        toast.success('Student created with auto-generated credentials!');
        setShowModal(false);
        setCredentials(res.data.credentials);
      }
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/users/${id}`);
      toast.success('Student deactivated');
      setConfirmDelete(null);
      fetchData();
    } catch (err) { toast.error(err.response?.data?.error || 'Failed to delete'); }
  };

  const handleResetPassword = async (id) => {
    try {
      const res = await api.post(`/users/${id}/reset-password`);
      setCredentials(res.data.credentials);
      toast.success('Password reset!');
    } catch (err) { toast.error(err.response?.data?.error || 'Failed to reset'); }
  };

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(''), 2000);
  };

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase()) ||
    (s.userId || '').toLowerCase().includes(search.toLowerCase()) ||
    (s.enrollmentNo || '').toLowerCase().includes(search.toLowerCase())
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
          <h1 className="text-2xl font-bold text-gray-900">Student Management</h1>
          <p className="text-sm text-gray-500 mt-1">{students.length} student{students.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={openCreate}
          className="bg-primary-700 text-white px-4 py-2.5 rounded-xl font-medium hover:bg-primary-800 flex items-center transition-all active:scale-95 hover:shadow-lg hover:shadow-primary-700/25">
          <Plus className="h-4 w-4 mr-2" /> Add Student
        </button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          placeholder="Search by name, email, user ID, enrollment..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Student</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">User ID</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Department</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Sem</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Branch</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan="7" className="text-center py-12 text-gray-500">
                  <GraduationCap className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                  <p className="font-medium">No students found</p>
                </td></tr>
              ) : filtered.map(stu => (
                <tr key={stu._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 bg-green-100 text-green-700 rounded-full flex items-center justify-center font-bold text-sm">{stu.name?.charAt(0)}</div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{stu.name}</p>
                        <p className="text-xs text-gray-500 flex items-center"><Mail className="h-3 w-3 mr-1" />{stu.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5"><span className="bg-gray-100 text-gray-700 text-xs font-mono px-2 py-1 rounded">{stu.userId || '—'}</span></td>
                  <td className="px-5 py-3.5 text-sm text-gray-600">{stu.department?.name || '—'}</td>
                  <td className="px-5 py-3.5 text-sm text-gray-600">{stu.semester || '—'}</td>
                  <td className="px-5 py-3.5 text-sm text-gray-600">{stu.branch?.name || '—'}</td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${stu.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {stu.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center space-x-1">
                      <button onClick={() => openEdit(stu)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all active:scale-90" title="Edit"><Pencil className="h-4 w-4" /></button>
                      <button onClick={() => handleResetPassword(stu._id)} className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all active:scale-90" title="Reset Password"><Key className="h-4 w-4" /></button>
                      <button onClick={() => setConfirmDelete(stu._id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all active:scale-90" title="Delete"><Trash2 className="h-4 w-4" /></button>
                    </div>
                    {confirmDelete === stu._id && (
                      <div className="mt-2 p-2 bg-red-50 rounded-lg border border-red-100 text-xs">
                        <p className="text-red-700 mb-1.5">Deactivate this student?</p>
                        <div className="flex space-x-2">
                          <button onClick={() => handleDelete(stu._id)} className="bg-red-600 text-white px-2.5 py-1 rounded-lg hover:bg-red-700 active:scale-95">Yes</button>
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

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-bold text-gray-900">{editingId ? 'Edit Student' : 'Add Student'}</h2>
                {!editingId && <p className="text-xs text-gray-500 mt-0.5">Credentials will be auto-generated</p>}
              </div>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100"><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input className={inputClass} placeholder="e.g. Aarav Patel" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input type="email" className={inputClass} placeholder="student@email.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input className={inputClass} placeholder="+91 9876543210" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  <select className={inputClass} value={form.department} onChange={e => setForm({...form, department: e.target.value})}>
                    <option value="">Select Department</option>
                    {departments.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
                  <select className={inputClass} value={form.semester} onChange={e => setForm({...form, semester: e.target.value})}>
                    <option value="">Select</option>
                    {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Semester {s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
                  <select className={inputClass} value={form.branch} onChange={e => setForm({...form, branch: e.target.value})}>
                    <option value="">Select Branch</option>
                    {branches.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Field / Program</label>
                  <select className={inputClass} value={form.field} onChange={e => setForm({...form, field: e.target.value})}>
                    <option value="">Select Field</option>
                    {fields.map(f => <option key={f._id} value={f._id}>{f.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Enrollment No</label>
                  <input className={inputClass} placeholder="e.g. EN20240001" value={form.enrollmentNo} onChange={e => setForm({...form, enrollmentNo: e.target.value})} />
                </div>
              </div>
              {!editingId && (
                <div className="p-3 bg-green-50 rounded-xl border border-green-100">
                  <p className="text-xs text-green-700">🔐 A unique <strong>User ID</strong> and <strong>temporary password</strong> will be auto-generated. You'll see the credentials after creation.</p>
                </div>
              )}
            </div>
            <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-100">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 border border-gray-300 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 active:scale-95 transition-all">Cancel</button>
              <button onClick={handleSave} disabled={saving || !form.name || !form.email}
                className="px-5 py-2 bg-primary-700 text-white rounded-xl text-sm font-medium hover:bg-primary-800 disabled:opacity-40 active:scale-95 transition-all flex items-center">
                {saving ? <><Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> Saving...</> : editingId ? 'Update' : '🔑 Create & Generate Credentials'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Credentials Modal */}
      {credentials && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <div className="text-center mb-5">
              <div className="bg-green-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3">
                <Key className="h-7 w-7 text-green-600" />
              </div>
              <h2 className="text-lg font-bold text-gray-900">Credentials Generated!</h2>
              <p className="text-sm text-gray-500 mt-1">Share these securely with the student</p>
            </div>
            <div className="space-y-3 bg-gray-50 rounded-xl p-4">
              {[
                { label: 'User ID', value: credentials.userId, key: 'userId', highlight: false },
                { label: 'Email', value: credentials.email, key: 'email', highlight: false },
                { label: 'Temporary Password', value: credentials.tempPassword, key: 'password', highlight: true }
              ].map(item => (
                <div key={item.key} className={`flex items-center justify-between p-3 rounded-lg border ${item.highlight ? 'bg-amber-50 border-amber-200' : 'bg-white border-gray-200'}`}>
                  <div>
                    <p className={`text-[10px] uppercase font-semibold ${item.highlight ? 'text-amber-600' : 'text-gray-400'}`}>{item.label}</p>
                    <p className={`font-mono ${item.highlight ? 'font-bold text-amber-800 text-lg' : 'text-sm text-gray-900'}`}>{item.value}</p>
                  </div>
                  <button onClick={() => copyToClipboard(item.value, item.key)} className="p-2 hover:bg-gray-100 rounded-lg transition-all active:scale-90">
                    {copied === item.key ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4 text-gray-400" />}
                  </button>
                </div>
              ))}
            </div>
            <p className="text-xs text-amber-700 text-center mt-3 bg-amber-50 p-2 rounded-lg">⚠️ This password is shown only once.</p>
            <button onClick={() => setCredentials(null)} className="w-full mt-4 bg-primary-700 text-white py-2.5 rounded-xl font-medium hover:bg-primary-800 active:scale-[0.98] transition-all">Done</button>
          </div>
        </div>
      )}
    </div>
  );
}
