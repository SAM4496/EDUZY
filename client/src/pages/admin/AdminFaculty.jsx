import { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { Users, Plus, Pencil, Trash2, X, Search, Download, Key, Copy, Check, Loader2, Mail, Phone } from 'lucide-react';

export default function AdminFaculty() {
  const [faculty, setFaculty] = useState([]);
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
  const [form, setForm] = useState({ name: '', email: '', phone: '', department: '', branch: '', field: '', employeeId: '', qualification: '', specialization: '' });

  const fetchData = async () => {
    try {
      const [facRes, depRes, brRes, fiRes] = await Promise.all([
        api.get('/users/faculty'), api.get('/departments'), api.get('/branches'), api.get('/fields')
      ]);
      setFaculty(facRes.data.data || []);
      setDepartments(depRes.data.data || []);
      setBranches(brRes.data.data || []);
      setFields(fiRes.data.data || []);
    } catch (err) { toast.error(err.response?.data?.error || 'Failed to fetch data'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const openCreate = () => {
    setForm({ name: '', email: '', phone: '', department: '', branch: '', field: '', employeeId: '', qualification: '', specialization: '' });
    setEditingId(null);
    setShowModal(true);
  };

  const openEdit = (fac) => {
    setForm({
      name: fac.name || '', email: fac.email || '', phone: fac.phone || '',
      department: fac.department?._id || '', branch: fac.branch?._id || '', field: fac.field?._id || '',
      employeeId: fac.employeeId || '', qualification: fac.qualification || '', specialization: fac.specialization || ''
    });
    setEditingId(fac._id);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.email) { toast.error('Name and email are required'); return; }
    setSaving(true);
    try {
      if (editingId) {
        await api.put(`/users/${editingId}`, form);
        toast.success('Faculty updated!');
        setShowModal(false);
      } else {
        const res = await api.post('/users', { ...form, role: 'faculty' });
        toast.success('Faculty created with auto-generated credentials!');
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
      toast.success('Faculty deactivated');
      setConfirmDelete(null);
      fetchData();
    } catch (err) { toast.error(err.response?.data?.error || 'Failed to delete'); }
  };

  const handleResetPassword = async (id) => {
    try {
      const res = await api.post(`/users/${id}/reset-password`);
      setCredentials(res.data.credentials);
      toast.success('Password reset! Share new credentials.');
    } catch (err) { toast.error(err.response?.data?.error || 'Failed to reset password'); }
  };

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(''), 2000);
  };

  const filtered = faculty.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase()) ||
    f.email.toLowerCase().includes(search.toLowerCase()) ||
    (f.userId || '').toLowerCase().includes(search.toLowerCase())
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Faculty Management</h1>
          <p className="text-sm text-gray-500 mt-1">{faculty.length} faculty member{faculty.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex space-x-3">
          <button onClick={openCreate}
            className="bg-primary-700 text-white px-4 py-2.5 rounded-xl font-medium hover:bg-primary-800 flex items-center transition-all active:scale-95 hover:shadow-lg hover:shadow-primary-700/25">
            <Plus className="h-4 w-4 mr-2" /> Add Faculty
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          placeholder="Search by name, email, or user ID..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Faculty</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">User ID</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Department</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Branch</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan="6" className="text-center py-12 text-gray-500">
                  <Users className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                  <p className="font-medium">No faculty found</p>
                </td></tr>
              ) : filtered.map(fac => (
                <tr key={fac._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-sm">
                        {fac.name?.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{fac.name}</p>
                        <p className="text-xs text-gray-500 flex items-center"><Mail className="h-3 w-3 mr-1" />{fac.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="bg-gray-100 text-gray-700 text-xs font-mono px-2 py-1 rounded">{fac.userId || '—'}</span>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-gray-600">{fac.department?.name || '—'}</td>
                  <td className="px-5 py-3.5 text-sm text-gray-600">{fac.branch?.name || '—'}</td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${fac.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {fac.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center space-x-1">
                      <button onClick={() => openEdit(fac)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all active:scale-90" title="Edit">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleResetPassword(fac._id)} className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all active:scale-90" title="Reset Password">
                        <Key className="h-4 w-4" />
                      </button>
                      <button onClick={() => setConfirmDelete(fac._id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all active:scale-90" title="Delete">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    {confirmDelete === fac._id && (
                      <div className="mt-2 p-2 bg-red-50 rounded-lg border border-red-100 text-xs">
                        <p className="text-red-700 mb-1.5">Deactivate this faculty?</p>
                        <div className="flex space-x-2">
                          <button onClick={() => handleDelete(fac._id)} className="bg-red-600 text-white px-2.5 py-1 rounded-lg hover:bg-red-700 active:scale-95">Yes</button>
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
                <h2 className="text-lg font-bold text-gray-900">{editingId ? 'Edit Faculty' : 'Add Faculty'}</h2>
                {!editingId && <p className="text-xs text-gray-500 mt-0.5">Credentials will be auto-generated</p>}
              </div>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100"><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input className={inputClass} placeholder="e.g. Dr. Amit Sharma" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input type="email" className={inputClass} placeholder="email@institute.edu" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Qualification</label>
                  <input className={inputClass} placeholder="e.g. Ph.D in CS" value={form.qualification} onChange={e => setForm({...form, qualification: e.target.value})} />
                </div>
              </div>
              {!editingId && (
                <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
                  <p className="text-xs text-blue-700">🔐 A unique <strong>User ID</strong> and <strong>temporary password</strong> will be auto-generated. You'll see the credentials after creation.</p>
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

      {/* Credentials Display Modal */}
      {credentials && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <div className="text-center mb-5">
              <div className="bg-green-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3">
                <Key className="h-7 w-7 text-green-600" />
              </div>
              <h2 className="text-lg font-bold text-gray-900">Credentials Generated!</h2>
              <p className="text-sm text-gray-500 mt-1">Share these credentials securely with the faculty member</p>
            </div>
            <div className="space-y-3 bg-gray-50 rounded-xl p-4">
              <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                <div>
                  <p className="text-[10px] text-gray-400 uppercase font-semibold">User ID</p>
                  <p className="font-mono font-bold text-gray-900">{credentials.userId}</p>
                </div>
                <button onClick={() => copyToClipboard(credentials.userId, 'userId')} className="p-2 hover:bg-gray-100 rounded-lg transition-all active:scale-90">
                  {copied === 'userId' ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4 text-gray-400" />}
                </button>
              </div>
              <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                <div>
                  <p className="text-[10px] text-gray-400 uppercase font-semibold">Email</p>
                  <p className="font-mono text-sm text-gray-900">{credentials.email}</p>
                </div>
                <button onClick={() => copyToClipboard(credentials.email, 'email')} className="p-2 hover:bg-gray-100 rounded-lg transition-all active:scale-90">
                  {copied === 'email' ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4 text-gray-400" />}
                </button>
              </div>
              <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-amber-200 bg-amber-50">
                <div>
                  <p className="text-[10px] text-amber-600 uppercase font-semibold">Temporary Password</p>
                  <p className="font-mono font-bold text-amber-800 text-lg">{credentials.tempPassword}</p>
                </div>
                <button onClick={() => copyToClipboard(credentials.tempPassword, 'password')} className="p-2 hover:bg-amber-100 rounded-lg transition-all active:scale-90">
                  {copied === 'password' ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4 text-amber-600" />}
                </button>
              </div>
            </div>
            <p className="text-xs text-amber-700 text-center mt-3 bg-amber-50 p-2 rounded-lg">⚠️ This password is shown only once. The user will be asked to change it on first login.</p>
            <button onClick={() => setCredentials(null)}
              className="w-full mt-4 bg-primary-700 text-white py-2.5 rounded-xl font-medium hover:bg-primary-800 active:scale-[0.98] transition-all">
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
