import { useState, useContext, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { AuthContext } from '../../context/AuthContext';
import { Settings, Building2, User, Lock, Eye, EyeOff, Check, Shield, Mail, Phone, MapPin, Loader2 } from 'lucide-react';

export default function AdminSettings() {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('institute');
  const [institute, setInstitute] = useState(null);
  const [loadingInstitute, setLoadingInstitute] = useState(true);
  const [showCurrentPwd, setShowCurrentPwd] = useState(false);
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [savingPwd, setSavingPwd] = useState(false);
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

  useEffect(() => {
    const fetchInstitute = async () => {
      try {
        const res = await api.get('/auth/me');
        setInstitute(res.data.data?.institute || null);
      } catch (err) {}
      finally { setLoadingInstitute(false); }
    };
    fetchInstitute();
  }, []);

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) return toast.error('Passwords do not match');
    if (passwords.newPassword.length < 6) return toast.error('Password must be at least 6 characters');
    setSavingPwd(true);
    try {
      await api.put('/auth/change-password', {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword
      });
      toast.success('Password updated!');
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update password');
    } finally { setSavingPwd(false); }
  };

  const tabs = [
    { id: 'institute', label: 'Institute', icon: Building2 },
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
  ];

  const inputClass = "w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all hover:border-gray-400";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Manage institute settings and your profile</p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl max-w-md">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}>
            <tab.icon className="h-4 w-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Institute Tab */}
      {activeTab === 'institute' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {loadingInstitute ? (
            <div className="p-8 text-center animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-48 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-32 mx-auto"></div>
            </div>
          ) : institute ? (
            <>
              <div className="bg-gradient-to-r from-primary-600 to-primary-800 p-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                    <Building2 className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">{institute.name}</h2>
                    <span className="bg-white/20 text-white text-xs font-mono px-2 py-0.5 rounded mt-1 inline-block">{institute.code}</span>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {institute.contactEmail && (
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                      <Mail className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-400 font-medium">Contact Email</p>
                        <p className="text-sm text-gray-900">{institute.contactEmail}</p>
                      </div>
                    </div>
                  )}
                  {institute.contactPhone && (
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                      <Phone className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-400 font-medium">Contact Phone</p>
                        <p className="text-sm text-gray-900">{institute.contactPhone}</p>
                      </div>
                    </div>
                  )}
                  {(institute.city || institute.state) && (
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                      <MapPin className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-400 font-medium">Location</p>
                        <p className="text-sm text-gray-900">{[institute.city, institute.state].filter(Boolean).join(', ')}</p>
                      </div>
                    </div>
                  )}
                  {institute.address && (
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                      <Building2 className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-400 font-medium">Address</p>
                        <p className="text-sm text-gray-900">{institute.address}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="p-8 text-center text-gray-500">
              <Building2 className="h-10 w-10 text-gray-300 mx-auto mb-3" />
              <p>No institute information available</p>
            </div>
          )}
        </div>
      )}

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-primary-100 text-primary-700 rounded-2xl flex items-center justify-center font-bold text-2xl">
              {user?.name?.charAt(0)}
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">{user?.name}</h2>
              <div className="flex items-center space-x-2 mt-1">
                <span className="bg-purple-100 text-purple-700 text-xs font-semibold px-2 py-0.5 rounded-full capitalize flex items-center">
                  <Shield className="h-3 w-3 mr-1" />{user?.role}
                </span>
                {user?.userId && (
                  <span className="bg-gray-100 text-gray-600 text-xs font-mono px-2 py-0.5 rounded">{user.userId}</span>
                )}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 bg-gray-50 rounded-xl">
              <p className="text-xs text-gray-400 font-medium mb-0.5">Email</p>
              <p className="text-sm text-gray-900">{user?.email}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl">
              <p className="text-xs text-gray-400 font-medium mb-0.5">Phone</p>
              <p className="text-sm text-gray-900">{user?.phone || '—'}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl">
              <p className="text-xs text-gray-400 font-medium mb-0.5">Role</p>
              <p className="text-sm text-gray-900 capitalize">{user?.role}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl">
              <p className="text-xs text-gray-400 font-medium mb-0.5">Institute</p>
              <p className="text-sm text-gray-900">{institute?.name || '—'}</p>
            </div>
          </div>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 max-w-lg">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-amber-100 p-2 rounded-xl">
              <Lock className="h-5 w-5 text-amber-700" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Change Password</h2>
              <p className="text-sm text-gray-500">Update your account password</p>
            </div>
          </div>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
              <div className="relative">
                <input required type={showCurrentPwd ? 'text' : 'password'} name="currentPassword" value={passwords.currentPassword}
                  onChange={e => setPasswords({...passwords, currentPassword: e.target.value})} className={inputClass} placeholder="Enter current password" />
                <button type="button" onClick={() => setShowCurrentPwd(!showCurrentPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1">
                  {showCurrentPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <div className="relative">
                <input required type={showNewPwd ? 'text' : 'password'} name="newPassword" value={passwords.newPassword}
                  onChange={e => setPasswords({...passwords, newPassword: e.target.value})} className={inputClass} placeholder="Enter new password (min 6 chars)" />
                <button type="button" onClick={() => setShowNewPwd(!showNewPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1">
                  {showNewPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {passwords.newPassword && (
                <div className="mt-1.5 flex items-center space-x-1">
                  <div className={`h-1 flex-1 rounded-full transition-all ${passwords.newPassword.length >= 8 ? 'bg-green-400' : passwords.newPassword.length >= 6 ? 'bg-yellow-400' : 'bg-red-400'}`}></div>
                  <span className={`text-[10px] font-medium ${passwords.newPassword.length >= 8 ? 'text-green-600' : passwords.newPassword.length >= 6 ? 'text-yellow-600' : 'text-red-500'}`}>
                    {passwords.newPassword.length >= 8 ? 'Strong' : passwords.newPassword.length >= 6 ? 'OK' : 'Weak'}
                  </span>
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
              <input required type="password" name="confirmPassword" value={passwords.confirmPassword}
                onChange={e => setPasswords({...passwords, confirmPassword: e.target.value})} className={inputClass} placeholder="Confirm new password"
                style={passwords.confirmPassword && passwords.confirmPassword !== passwords.newPassword ? {borderColor: '#ef4444'} : passwords.confirmPassword && passwords.confirmPassword === passwords.newPassword ? {borderColor: '#22c55e'} : {}}
              />
              {passwords.confirmPassword && (
                <p className={`text-xs mt-1 flex items-center ${passwords.confirmPassword === passwords.newPassword ? 'text-green-500' : 'text-red-500'}`}>
                  {passwords.confirmPassword === passwords.newPassword ? <><Check className="h-3 w-3 mr-1" /> Match</> : 'Passwords do not match'}
                </p>
              )}
            </div>
            <button type="submit" disabled={savingPwd || !passwords.currentPassword || !passwords.newPassword || passwords.newPassword !== passwords.confirmPassword}
              className="bg-primary-700 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-primary-800 disabled:opacity-40 transition-all active:scale-95 flex items-center">
              {savingPwd ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Updating...</> : <><Lock className="h-4 w-4 mr-2" /> Update Password</>}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
