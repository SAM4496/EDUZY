import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { GraduationCap, Building2, BookOpen, Shield, ArrowRight, ArrowLeft, Plus, X, Check, Loader2, Sparkles, Eye, EyeOff } from 'lucide-react';

const STEPS = [
  { label: 'Institute Info', icon: Building2, color: 'primary' },
  { label: 'Branches', icon: Building2, color: 'blue' },
  { label: 'Fields / Programs', icon: BookOpen, color: 'green' },
  { label: 'Create Admin', icon: Shield, color: 'purple' }
];

export default function SetupWizard() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [stepAnimating, setStepAnimating] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => { setTimeout(() => setMounted(true), 100); }, []);

  const [institute, setInstitute] = useState({
    name: '', code: '', contactEmail: '', contactPhone: '',
    address: '', city: '', state: '', pincode: ''
  });
  const [branches, setBranches] = useState([{ name: '', code: '', address: '' }]);
  const [fields, setFields] = useState([{ name: '', code: '', type: 'other', description: '' }]);
  const [admin, setAdmin] = useState({ name: '', email: '', password: '', confirmPassword: '', phone: '' });

  const addBranch = () => setBranches([...branches, { name: '', code: '', address: '' }]);
  const removeBranch = (i) => setBranches(branches.filter((_, idx) => idx !== i));
  const updateBranch = (i, key, val) => { const c = [...branches]; c[i][key] = val; setBranches(c); };

  const addField = () => setFields([...fields, { name: '', code: '', type: 'other', description: '' }]);
  const removeField = (i) => setFields(fields.filter((_, idx) => idx !== i));
  const updateField = (i, key, val) => { const c = [...fields]; c[i][key] = val; setFields(c); };

  const fieldTypes = [
    { value: 'engineering', label: '⚙️ Engineering' },
    { value: 'medical', label: '🏥 Medical' },
    { value: 'commerce', label: '📊 Commerce' },
    { value: 'science', label: '🔬 Science' },
    { value: 'arts', label: '🎨 Arts' },
    { value: 'computer_science', label: '💻 Computer Science' },
    { value: 'law', label: '⚖️ Law' },
    { value: 'management', label: '📈 Management' },
    { value: 'other', label: '📚 Other' }
  ];

  const canProceed = () => {
    if (step === 0) return institute.name && institute.code;
    if (step === 1) return branches.every(b => b.name && b.code);
    if (step === 2) return fields.every(f => f.name && f.code);
    if (step === 3) return admin.name && admin.email && admin.password && admin.password === admin.confirmPassword && admin.password.length >= 6;
    return false;
  };

  const goToStep = (newStep) => {
    setStepAnimating(true);
    setTimeout(() => {
      setStep(newStep);
      setStepAnimating(false);
    }, 200);
  };

  const handleSubmit = async () => {
    if (admin.password !== admin.confirmPassword) { toast.error('Passwords do not match'); return; }
    setLoading(true);
    try {
      const res = await api.post('/setup/institute', {
        institute,
        branches: branches.filter(b => b.name && b.code),
        fields: fields.filter(f => f.name && f.code),
        admin: { name: admin.name, email: admin.email, password: admin.password, phone: admin.phone }
      });
      if (res.data.success) {
        localStorage.setItem('token', res.data.data.token);
        toast.success('🎉 Institute setup complete! Welcome to Eduzy.');
        const loginResult = await login(admin.email, admin.password);
        if (loginResult.success) { navigate('/admin/dashboard', { replace: true }); }
        else { navigate('/admin/login', { replace: true }); }
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Setup failed. Please try again.');
    } finally { setLoading(false); }
  };

  const inputClass = "w-full border border-gray-300 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 text-sm hover:border-gray-400";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1.5";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center space-x-3">
          <div className="bg-primary-600 p-2 rounded-xl">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          <div>
            <span className="text-xl font-bold text-gray-900">Eduzy</span>
            <span className="text-sm text-gray-400 ml-2">Institute Setup</span>
          </div>
        </div>
      </header>

      {/* Progress Steps */}
      <div className={`max-w-3xl mx-auto px-4 pt-8 pb-6 transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div className="flex items-center justify-between">
          {STEPS.map((s, i) => (
            <div key={s.label} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div 
                  className={`flex items-center justify-center w-10 h-10 rounded-xl text-sm font-bold transition-all duration-500 ${
                    i < step ? 'bg-green-500 text-white shadow-lg shadow-green-500/25 scale-100' :
                    i === step ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/25 scale-110' :
                    'bg-gray-100 text-gray-400 scale-100'
                  }`}
                >
                  {i < step ? <Check className="h-5 w-5" /> : <s.icon className="h-5 w-5" />}
                </div>
                <span className={`mt-2 text-xs hidden sm:inline font-medium transition-colors duration-300 ${
                  i === step ? 'text-primary-700' : i < step ? 'text-green-600' : 'text-gray-400'
                }`}>{s.label}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className="flex-1 mx-3 mt-[-1.5rem]">
                  <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full bg-green-400 rounded-full transition-all duration-700 ease-out ${i < step ? 'w-full' : 'w-0'}`}></div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="max-w-3xl mx-auto px-4 pb-8">
        <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 transition-all duration-300 ${stepAnimating ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'}`}>

          {/* STEP 0: Institute Info */}
          {step === 0 && (
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-primary-100 p-2.5 rounded-xl"><Building2 className="h-5 w-5 text-primary-700" /></div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Institute Information</h2>
                  <p className="text-sm text-gray-500">Tell us about your institute</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className={labelClass}>Institute Name <span className="text-red-500">*</span></label>
                  <input className={inputClass} placeholder="e.g. ABC College of Engineering" value={institute.name} onChange={e => setInstitute({...institute, name: e.target.value})} />
                </div>
                <div>
                  <label className={labelClass}>Institute Code <span className="text-red-500">*</span></label>
                  <input className={`${inputClass} uppercase`} placeholder="e.g. ABCCE" value={institute.code} onChange={e => setInstitute({...institute, code: e.target.value.toUpperCase()})} maxLength={10} />
                  <p className="text-[11px] text-gray-400 mt-1">Short unique code for your institute</p>
                </div>
                <div>
                  <label className={labelClass}>Contact Email</label>
                  <input type="email" className={inputClass} placeholder="info@institute.edu" value={institute.contactEmail} onChange={e => setInstitute({...institute, contactEmail: e.target.value})} />
                </div>
                <div>
                  <label className={labelClass}>Contact Phone</label>
                  <input className={inputClass} placeholder="+91 9876543210" value={institute.contactPhone} onChange={e => setInstitute({...institute, contactPhone: e.target.value})} />
                </div>
                <div>
                  <label className={labelClass}>City</label>
                  <input className={inputClass} placeholder="City" value={institute.city} onChange={e => setInstitute({...institute, city: e.target.value})} />
                </div>
                <div>
                  <label className={labelClass}>State</label>
                  <input className={inputClass} placeholder="State" value={institute.state} onChange={e => setInstitute({...institute, state: e.target.value})} />
                </div>
                <div>
                  <label className={labelClass}>Pincode</label>
                  <input className={inputClass} placeholder="Pincode" value={institute.pincode} onChange={e => setInstitute({...institute, pincode: e.target.value})} />
                </div>
                <div className="md:col-span-2">
                  <label className={labelClass}>Address</label>
                  <textarea className={inputClass} rows="2" placeholder="Full address" value={institute.address} onChange={e => setInstitute({...institute, address: e.target.value})} />
                </div>
              </div>
            </div>
          )}

          {/* STEP 1: Branches */}
          {step === 1 && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-2.5 rounded-xl"><Building2 className="h-5 w-5 text-blue-700" /></div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Branches / Campuses</h2>
                    <p className="text-sm text-gray-500">Add your institute's branches ({branches.length} added)</p>
                  </div>
                </div>
                <button onClick={addBranch} className="bg-blue-50 text-blue-700 px-3.5 py-2 rounded-xl text-sm font-medium hover:bg-blue-100 flex items-center transition-all active:scale-95 hover:shadow-sm">
                  <Plus className="h-4 w-4 mr-1.5" /> Add Branch
                </button>
              </div>
              <div className="space-y-4">
                {branches.map((b, i) => (
                  <div key={i} className="border border-gray-200 rounded-xl p-4 relative hover:border-blue-200 hover:shadow-sm transition-all group">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-semibold text-gray-400 uppercase">Branch {i + 1}</span>
                      {branches.length > 1 && (
                        <button onClick={() => removeBranch(i)} className="text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 active:scale-90">
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className={labelClass}>Name <span className="text-red-500">*</span></label>
                        <input className={inputClass} placeholder="e.g. Main Campus" value={b.name} onChange={e => updateBranch(i, 'name', e.target.value)} />
                      </div>
                      <div>
                        <label className={labelClass}>Code <span className="text-red-500">*</span></label>
                        <input className={`${inputClass} uppercase`} placeholder="e.g. MAIN" value={b.code} onChange={e => updateBranch(i, 'code', e.target.value.toUpperCase())} />
                      </div>
                      <div>
                        <label className={labelClass}>Address</label>
                        <input className={inputClass} placeholder="Branch address" value={b.address} onChange={e => updateBranch(i, 'address', e.target.value)} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: Fields */}
          {step === 2 && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 p-2.5 rounded-xl"><BookOpen className="h-5 w-5 text-green-700" /></div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Fields / Programs</h2>
                    <p className="text-sm text-gray-500">What programs does your institute offer? ({fields.length} added)</p>
                  </div>
                </div>
                <button onClick={addField} className="bg-green-50 text-green-700 px-3.5 py-2 rounded-xl text-sm font-medium hover:bg-green-100 flex items-center transition-all active:scale-95 hover:shadow-sm">
                  <Plus className="h-4 w-4 mr-1.5" /> Add Field
                </button>
              </div>
              <div className="space-y-4">
                {fields.map((f, i) => (
                  <div key={i} className="border border-gray-200 rounded-xl p-4 relative hover:border-green-200 hover:shadow-sm transition-all group">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-semibold text-gray-400 uppercase">Field {i + 1}</span>
                      {fields.length > 1 && (
                        <button onClick={() => removeField(i)} className="text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 active:scale-90">
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className={labelClass}>Name <span className="text-red-500">*</span></label>
                        <input className={inputClass} placeholder="e.g. Computer Science" value={f.name} onChange={e => updateField(i, 'name', e.target.value)} />
                      </div>
                      <div>
                        <label className={labelClass}>Code <span className="text-red-500">*</span></label>
                        <input className={`${inputClass} uppercase`} placeholder="e.g. CSE" value={f.code} onChange={e => updateField(i, 'code', e.target.value.toUpperCase())} />
                      </div>
                      <div>
                        <label className={labelClass}>Type</label>
                        <select className={inputClass} value={f.type} onChange={e => updateField(i, 'type', e.target.value)}>
                          {fieldTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: Admin Account */}
          {step === 3 && (
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-purple-100 p-2.5 rounded-xl"><Shield className="h-5 w-5 text-purple-700" /></div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Create Admin Account</h2>
                  <p className="text-sm text-gray-500">This will be the primary administrator</p>
                </div>
              </div>

              {/* Summary banner */}
              <div className="bg-gradient-to-r from-primary-50 to-blue-50 rounded-xl p-4 mb-6 border border-primary-100">
                <p className="text-sm font-medium text-primary-800 mb-1">📋 Setup Summary</p>
                <div className="flex flex-wrap gap-3 text-xs text-primary-600">
                  <span className="bg-white px-2 py-0.5 rounded-full">🏛 {institute.name || 'Unnamed'}</span>
                  <span className="bg-white px-2 py-0.5 rounded-full">🏢 {branches.filter(b => b.name).length} branches</span>
                  <span className="bg-white px-2 py-0.5 rounded-full">📚 {fields.filter(f => f.name).length} fields</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className={labelClass}>Full Name <span className="text-red-500">*</span></label>
                  <input className={inputClass} placeholder="e.g. Dr. John Doe" value={admin.name} onChange={e => setAdmin({...admin, name: e.target.value})} />
                </div>
                <div>
                  <label className={labelClass}>Email <span className="text-red-500">*</span></label>
                  <input type="email" className={inputClass} placeholder="admin@institute.edu" value={admin.email} onChange={e => setAdmin({...admin, email: e.target.value})} />
                </div>
                <div>
                  <label className={labelClass}>Phone</label>
                  <input className={inputClass} placeholder="+91 9876543210" value={admin.phone} onChange={e => setAdmin({...admin, phone: e.target.value})} />
                </div>
                <div>
                  <label className={labelClass}>Password <span className="text-red-500">*</span> <span className="text-gray-400 font-normal">(min 6 chars)</span></label>
                  <div className="relative">
                    <input type={showPassword ? 'text' : 'password'} className={inputClass} placeholder="Create a strong password" value={admin.password} onChange={e => setAdmin({...admin, password: e.target.value})} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1">
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {admin.password && (
                    <div className="mt-1.5 flex items-center space-x-1">
                      <div className={`h-1 flex-1 rounded-full transition-all duration-300 ${admin.password.length >= 8 ? 'bg-green-400' : admin.password.length >= 6 ? 'bg-yellow-400' : 'bg-red-400'}`}></div>
                      <span className={`text-[10px] font-medium ${admin.password.length >= 8 ? 'text-green-600' : admin.password.length >= 6 ? 'text-yellow-600' : 'text-red-500'}`}>
                        {admin.password.length >= 8 ? 'Strong' : admin.password.length >= 6 ? 'OK' : 'Weak'}
                      </span>
                    </div>
                  )}
                </div>
                <div>
                  <label className={labelClass}>Confirm Password <span className="text-red-500">*</span></label>
                  <input type={showPassword ? 'text' : 'password'} className={inputClass} placeholder="Confirm password"
                    value={admin.confirmPassword} onChange={e => setAdmin({...admin, confirmPassword: e.target.value})}
                    style={admin.confirmPassword && admin.confirmPassword !== admin.password ? {borderColor: '#ef4444', boxShadow: '0 0 0 1px #ef4444'} : admin.confirmPassword && admin.confirmPassword === admin.password ? {borderColor: '#22c55e', boxShadow: '0 0 0 1px #22c55e'} : {}}
                  />
                  {admin.confirmPassword && (
                    <p className={`text-xs mt-1 flex items-center ${admin.confirmPassword === admin.password ? 'text-green-500' : 'text-red-500'}`}>
                      {admin.confirmPassword === admin.password ? <><Check className="h-3 w-3 mr-1" /> Passwords match</> : <><X className="h-3 w-3 mr-1" /> Passwords do not match</>}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
            <button
              onClick={() => step === 0 ? navigate('/') : goToStep(step - 1)}
              className="px-5 py-2.5 border border-gray-300 rounded-xl text-gray-600 hover:bg-gray-50 flex items-center text-sm font-medium transition-all active:scale-95 hover:shadow-sm"
            >
              <ArrowLeft className="h-4 w-4 mr-1.5" /> {step === 0 ? 'Cancel' : 'Previous'}
            </button>

            {step < STEPS.length - 1 ? (
              <button
                onClick={() => goToStep(step + 1)}
                disabled={!canProceed()}
                className="px-6 py-2.5 bg-primary-700 text-white rounded-xl hover:bg-primary-800 flex items-center text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95 hover:shadow-lg hover:shadow-primary-700/25"
              >
                Next <ArrowRight className="h-4 w-4 ml-1.5" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!canProceed() || loading}
                className="px-7 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 flex items-center text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95 hover:shadow-lg hover:shadow-green-600/25"
              >
                {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Setting up...</> : <><Sparkles className="h-4 w-4 mr-1.5" /> Complete Setup</>}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
