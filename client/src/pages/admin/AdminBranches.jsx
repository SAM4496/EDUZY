import { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { GitBranch, Plus, Pencil, Trash2, X, Search, MapPin, Loader2 } from 'lucide-react';

export default function AdminBranches() {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [form, setForm] = useState({ name: '', code: '', address: '' });

  const fetchBranches = async () => {
    try {
      const res = await api.get('/branches');
      setBranches(res.data.data);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to load branches');
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchBranches(); }, []);

  const openCreate = () => {
    setForm({ name: '', code: '', address: '' });
    setEditingId(null);
    setShowModal(true);
  };

  const openEdit = (branch) => {
    setForm({ name: branch.name, code: branch.code, address: branch.address || '' });
    setEditingId(branch._id);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.code) { toast.error('Name and code are required'); return; }
    setSaving(true);
    try {
      if (editingId) {
        await api.put(`/branches/${editingId}`, form);
        toast.success('Branch updated!');
      } else {
        await api.post('/branches', form);
        toast.success('Branch created!');
      }
      setShowModal(false);
      fetchBranches();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/branches/${id}`);
      toast.success('Branch deleted');
      setConfirmDelete(null);
      fetchBranches();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to delete');
    }
  };

  const filtered = branches.filter(b =>
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    b.code.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div className="space-y-4 animate-pulse">
      <div className="h-10 bg-gray-200 rounded-xl w-48"></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1,2,3].map(i => <div key={i} className="h-40 bg-gray-200 rounded-xl"></div>)}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Branches</h1>
          <p className="text-sm text-gray-500 mt-1">{branches.length} branch{branches.length !== 1 ? 'es' : ''} configured</p>
        </div>
        <button onClick={openCreate}
          className="bg-primary-700 text-white px-4 py-2.5 rounded-xl font-medium hover:bg-primary-800 flex items-center transition-all active:scale-95 hover:shadow-lg hover:shadow-primary-700/25">
          <Plus className="h-4 w-4 mr-2" /> Add Branch
        </button>
      </div>

      {/* Search */}
      {branches.length > 0 && (
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="Search branches..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      )}

      {/* Branch Cards */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <GitBranch className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{search ? 'No matches found' : 'No branches yet'}</h3>
          <p className="text-sm text-gray-500 mb-4">{search ? 'Try a different search' : 'Add your first branch to get started'}</p>
          {!search && (
            <button onClick={openCreate} className="bg-primary-700 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-primary-800 transition-all active:scale-95">
              <Plus className="h-4 w-4 mr-1.5 inline" /> Add Branch
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((branch, idx) => (
            <div key={branch._id}
              className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md hover:border-primary-200 transition-all group"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="bg-primary-50 p-2 rounded-lg group-hover:bg-primary-100 transition-colors">
                  <GitBranch className="h-5 w-5 text-primary-600" />
                </div>
                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEdit(branch)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all active:scale-90">
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button onClick={() => setConfirmDelete(branch._id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all active:scale-90">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{branch.name}</h3>
              <span className="inline-block bg-gray-100 text-gray-600 text-xs font-mono px-2 py-0.5 rounded mb-2">{branch.code}</span>
              {branch.address && (
                <p className="text-xs text-gray-500 flex items-center mt-2">
                  <MapPin className="h-3 w-3 mr-1 flex-shrink-0" /> {branch.address}
                </p>
              )}

              {/* Delete confirmation */}
              {confirmDelete === branch._id && (
                <div className="mt-3 p-3 bg-red-50 rounded-lg border border-red-100 animate-[fadeIn_0.2s_ease-out]">
                  <p className="text-xs text-red-700 mb-2">Delete this branch?</p>
                  <div className="flex space-x-2">
                    <button onClick={() => handleDelete(branch._id)} className="bg-red-600 text-white text-xs px-3 py-1 rounded-lg hover:bg-red-700 active:scale-95 transition-all">Delete</button>
                    <button onClick={() => setConfirmDelete(null)} className="bg-gray-200 text-gray-700 text-xs px-3 py-1 rounded-lg hover:bg-gray-300 active:scale-95 transition-all">Cancel</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-[slideUp_0.3s_ease-out]" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-gray-900">{editingId ? 'Edit Branch' : 'Add Branch'}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 active:scale-90 transition-all">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Branch Name *</label>
                <input className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                  placeholder="e.g. Main Campus" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Branch Code *</label>
                <input className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all uppercase"
                  placeholder="e.g. MAIN" value={form.code} onChange={e => setForm({...form, code: e.target.value.toUpperCase()})} maxLength={10} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                  placeholder="Branch address" value={form.address} onChange={e => setForm({...form, address: e.target.value})} />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-100">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 border border-gray-300 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 active:scale-95 transition-all">Cancel</button>
              <button onClick={handleSave} disabled={saving || !form.name || !form.code}
                className="px-5 py-2 bg-primary-700 text-white rounded-xl text-sm font-medium hover:bg-primary-800 disabled:opacity-40 active:scale-95 transition-all flex items-center hover:shadow-lg hover:shadow-primary-700/25">
                {saving ? <><Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> Saving...</> : editingId ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
