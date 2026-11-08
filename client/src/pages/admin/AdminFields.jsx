import { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { Layers, Plus, Pencil, Trash2, X, Search, Loader2 } from 'lucide-react';

const TYPE_CONFIG = {
  engineering: { label: 'Engineering', emoji: '⚙️', bg: 'bg-blue-50 text-blue-700' },
  medical: { label: 'Medical', emoji: '🏥', bg: 'bg-red-50 text-red-700' },
  commerce: { label: 'Commerce', emoji: '📊', bg: 'bg-amber-50 text-amber-700' },
  science: { label: 'Science', emoji: '🔬', bg: 'bg-green-50 text-green-700' },
  arts: { label: 'Arts', emoji: '🎨', bg: 'bg-purple-50 text-purple-700' },
  computer_science: { label: 'Computer Science', emoji: '💻', bg: 'bg-indigo-50 text-indigo-700' },
  law: { label: 'Law', emoji: '⚖️', bg: 'bg-gray-100 text-gray-700' },
  management: { label: 'Management', emoji: '📈', bg: 'bg-teal-50 text-teal-700' },
  other: { label: 'Other', emoji: '📚', bg: 'bg-gray-50 text-gray-600' }
};

export default function AdminFields() {
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [form, setForm] = useState({ name: '', code: '', type: 'other', description: '' });

  const fetchFields = async () => {
    try {
      const res = await api.get('/fields');
      setFields(res.data.data);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to load fields');
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchFields(); }, []);

  const openCreate = () => {
    setForm({ name: '', code: '', type: 'other', description: '' });
    setEditingId(null);
    setShowModal(true);
  };

  const openEdit = (field) => {
    setForm({ name: field.name, code: field.code, type: field.type || 'other', description: field.description || '' });
    setEditingId(field._id);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.code) { toast.error('Name and code are required'); return; }
    setSaving(true);
    try {
      if (editingId) {
        await api.put(`/fields/${editingId}`, form);
        toast.success('Field updated!');
      } else {
        await api.post('/fields', form);
        toast.success('Field created!');
      }
      setShowModal(false);
      fetchFields();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/fields/${id}`);
      toast.success('Field deleted');
      setConfirmDelete(null);
      fetchFields();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to delete');
    }
  };

  const filtered = fields.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase()) ||
    f.code.toLowerCase().includes(search.toLowerCase())
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
          <h1 className="text-2xl font-bold text-gray-900">Fields / Programs</h1>
          <p className="text-sm text-gray-500 mt-1">{fields.length} program{fields.length !== 1 ? 's' : ''} offered</p>
        </div>
        <button onClick={openCreate}
          className="bg-primary-700 text-white px-4 py-2.5 rounded-xl font-medium hover:bg-primary-800 flex items-center transition-all active:scale-95 hover:shadow-lg hover:shadow-primary-700/25">
          <Plus className="h-4 w-4 mr-2" /> Add Field
        </button>
      </div>

      {/* Search */}
      {fields.length > 0 && (
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="Search fields..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      )}

      {/* Field Cards */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <Layers className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{search ? 'No matches found' : 'No fields yet'}</h3>
          <p className="text-sm text-gray-500 mb-4">{search ? 'Try a different search' : 'Add your first field/program to get started'}</p>
          {!search && (
            <button onClick={openCreate} className="bg-primary-700 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-primary-800 transition-all active:scale-95">
              <Plus className="h-4 w-4 mr-1.5 inline" /> Add Field
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((field, idx) => {
            const config = TYPE_CONFIG[field.type] || TYPE_CONFIG.other;
            return (
              <div key={field._id}
                className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md hover:border-primary-200 transition-all group"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="text-3xl">{config.emoji}</div>
                  <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openEdit(field)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all active:scale-90">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button onClick={() => setConfirmDelete(field._id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all active:scale-90">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{field.name}</h3>
                <div className="flex items-center space-x-2 mb-2">
                  <span className="bg-gray-100 text-gray-600 text-xs font-mono px-2 py-0.5 rounded">{field.code}</span>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${config.bg}`}>{config.label}</span>
                </div>
                {field.description && (
                  <p className="text-xs text-gray-500 mt-2 line-clamp-2">{field.description}</p>
                )}

                {confirmDelete === field._id && (
                  <div className="mt-3 p-3 bg-red-50 rounded-lg border border-red-100 animate-[fadeIn_0.2s_ease-out]">
                    <p className="text-xs text-red-700 mb-2">Delete this field?</p>
                    <div className="flex space-x-2">
                      <button onClick={() => handleDelete(field._id)} className="bg-red-600 text-white text-xs px-3 py-1 rounded-lg hover:bg-red-700 active:scale-95 transition-all">Delete</button>
                      <button onClick={() => setConfirmDelete(null)} className="bg-gray-200 text-gray-700 text-xs px-3 py-1 rounded-lg hover:bg-gray-300 active:scale-95 transition-all">Cancel</button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-[slideUp_0.3s_ease-out]" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-gray-900">{editingId ? 'Edit Field' : 'Add Field'}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 active:scale-90 transition-all">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Field Name *</label>
                <input className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                  placeholder="e.g. Computer Science & Engineering" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Code *</label>
                <input className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all uppercase"
                  placeholder="e.g. CSE" value={form.code} onChange={e => setForm({...form, code: e.target.value.toUpperCase()})} maxLength={10} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                  value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
                  {Object.entries(TYPE_CONFIG).map(([value, { label, emoji }]) => (
                    <option key={value} value={value}>{emoji} {label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                  rows="2" placeholder="Brief description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
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
