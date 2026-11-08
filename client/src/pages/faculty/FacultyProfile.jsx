import { useState, useContext, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { AuthContext } from '../../context/AuthContext';
import {
  User,
  Shield,
  KeyRound,
  Eye,
  EyeOff,
  Check,
  X,
  Building2,
  Mail,
  Phone,
  GraduationCap,
  Briefcase,
  MapPin,
  Save,
  Loader2,
  Lock
} from 'lucide-react';

export default function FacultyProfile() {
  const { user, login } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'security'

  // Profile form state
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    qualification: '',
    specialization: '',
    officeRoom: ''
  });
  const [savingProfile, setSavingProfile] = useState(false);

  // Password form state
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        qualification: user.qualification || '',
        specialization: user.specialization || '',
        officeRoom: user.officeRoom || ''
      });
    }
  }, [user]);

  // Profile submission handler
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      setSavingProfile(true);
      const res = await api.put('/auth/profile', formData);
      toast.success('Profile updated successfully!');

      // Update local context
      const token = localStorage.getItem('token');
      if (token && res.data.data) {
        login(res.data.data, token);
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  // Password submission handler
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (!passwords.currentPassword) {
      return toast.error('Please enter your current password');
    }
    if (passwords.newPassword.length < 6) {
      return toast.error('New password must be at least 6 characters');
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      return toast.error('New passwords do not match');
    }

    try {
      setSavingPassword(true);
      await api.put('/auth/change-password', {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword
      });
      toast.success('Password changed successfully!');
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update password');
    } finally {
      setSavingPassword(false);
    }
  };

  // Password strength calculation
  const calculateStrength = (pwd) => {
    if (!pwd) return { score: 0, text: 'Empty', color: 'bg-gray-200', textClass: 'text-gray-400' };
    let score = 0;
    if (pwd.length >= 6) score += 1;
    if (pwd.length >= 8) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    if (score <= 2) return { score: 25, text: 'Weak', color: 'bg-rose-500', textClass: 'text-rose-600' };
    if (score === 3) return { score: 50, text: 'Fair', color: 'bg-amber-500', textClass: 'text-amber-600' };
    if (score === 4) return { score: 75, text: 'Good', color: 'bg-blue-500', textClass: 'text-blue-600' };
    return { score: 100, text: 'Strong', color: 'bg-emerald-500', textClass: 'text-emerald-600' };
  };

  const strength = calculateStrength(passwords.newPassword);
  const passwordsMatch = passwords.newPassword && passwords.newPassword === passwords.confirmPassword;
  const showMatchWarning = passwords.confirmPassword && !passwordsMatch;

  const inputClass =
    'w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all hover:border-gray-400 bg-white';
  const readOnlyClass =
    'w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm bg-gray-50 text-gray-500 cursor-not-allowed select-none';

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Info Banner Card */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-5 text-center sm:text-left">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-700 to-primary-900 text-white flex items-center justify-center text-3xl font-bold shadow-md shadow-primary-700/20 shrink-0">
            {user?.name?.charAt(0) || 'F'}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
                  {user?.name || 'Faculty Member'}
                </h1>
                <p className="text-sm text-gray-500 mt-0.5">{user?.email}</p>
              </div>

              <span className="self-center sm:self-auto bg-primary-50 text-primary-700 text-xs font-semibold px-3 py-1 rounded-full border border-primary-100 uppercase tracking-wider">
                {user?.role || 'Faculty'}
              </span>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 flex flex-wrap gap-4 text-xs text-gray-600 justify-center sm:justify-start">
              {formData.qualification && (
                <span className="flex items-center text-gray-600">
                  <GraduationCap className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
                  {formData.qualification}
                </span>
              )}
              {formData.specialization && (
                <span className="flex items-center text-gray-600">
                  <Briefcase className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
                  {formData.specialization}
                </span>
              )}
              {formData.officeRoom && (
                <span className="flex items-center text-gray-600">
                  <MapPin className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
                  Room: {formData.officeRoom}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modern Tabs Navigation */}
      <div className="flex space-x-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center space-x-2 py-3 px-5 text-sm font-semibold rounded-t-xl transition-all cursor-pointer ${
            activeTab === 'profile'
              ? 'border-b-2 border-primary-700 text-primary-700 bg-white shadow-xs'
              : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100/60'
          }`}
        >
          <User className="h-4 w-4" />
          <span>Profile Information</span>
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`flex items-center space-x-2 py-3 px-5 text-sm font-semibold rounded-t-xl transition-all cursor-pointer ${
            activeTab === 'security'
              ? 'border-b-2 border-primary-700 text-primary-700 bg-white shadow-xs'
              : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100/60'
          }`}
        >
          <Shield className="h-4 w-4" />
          <span>Security & Password</span>
        </button>
      </div>

      {/* Tab 1: Profile Information */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm">
          <div className="mb-6 pb-4 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900">Personal & Academic Details</h2>
            <p className="text-xs text-gray-500 mt-1">
              Update your contact information and department qualifications.
            </p>
          </div>

          <form onSubmit={handleProfileUpdate} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Full Name *
                </label>
                <div className="relative">
                  <input
                    required
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={inputClass}
                    placeholder="e.g. Dr. Jane Doe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={user?.email || ''}
                    readOnly
                    className={readOnlyClass}
                  />
                  <Lock className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
                <span className="text-[11px] text-gray-400 mt-1 block">
                  Email cannot be changed directly. Contact administrator.
                </span>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className={`pl-10 ${inputClass}`}
                    placeholder="e.g. +1 (555) 000-0000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Office / Cabin Room
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    name="officeRoom"
                    value={formData.officeRoom}
                    onChange={(e) => setFormData({ ...formData, officeRoom: e.target.value })}
                    className={`pl-10 ${inputClass}`}
                    placeholder="e.g. Room 304, Block B"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Highest Qualification
                </label>
                <div className="relative">
                  <GraduationCap className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    name="qualification"
                    value={formData.qualification}
                    onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                    className={`pl-10 ${inputClass}`}
                    placeholder="e.g. Ph.D. in Computer Science"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Area of Specialization
                </label>
                <div className="relative">
                  <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    name="specialization"
                    value={formData.specialization}
                    onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                    className={`pl-10 ${inputClass}`}
                    placeholder="e.g. Distributed Systems & AI"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-end">
              <button
                type="submit"
                disabled={savingProfile}
                className="bg-primary-700 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-primary-800 flex items-center transition-all active:scale-95 hover:shadow-lg hover:shadow-primary-700/25 disabled:opacity-50"
              >
                {savingProfile ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    <span>Saving Changes...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    <span>Save Profile Changes</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 2: Security & Password */}
      {activeTab === 'security' && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm">
          <div className="mb-6 pb-4 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900">Change Account Password</h2>
            <p className="text-xs text-gray-500 mt-1">
              Ensure your account is using a long, random password to stay secure.
            </p>
          </div>

          <form onSubmit={handlePasswordUpdate} className="space-y-5 max-w-lg">
            {/* Current Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Current Password *
              </label>
              <div className="relative">
                <input
                  required
                  type={showCurrent ? 'text' : 'password'}
                  value={passwords.currentPassword}
                  onChange={(e) =>
                    setPasswords({ ...passwords, currentPassword: e.target.value })
                  }
                  className={`pr-10 ${inputClass}`}
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5"
                >
                  {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                New Password *
              </label>
              <div className="relative">
                <input
                  required
                  type={showNew ? 'text' : 'password'}
                  value={passwords.newPassword}
                  onChange={(e) =>
                    setPasswords({ ...passwords, newPassword: e.target.value })
                  }
                  className={`pr-10 ${inputClass}`}
                  placeholder="At least 6 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5"
                >
                  {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {passwords.newPassword && (
                <div className="mt-2.5 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500 font-medium">Password strength:</span>
                    <span className={`font-semibold ${strength.textClass}`}>{strength.text}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${strength.color}`}
                      style={{ width: `${strength.score}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm New Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Confirm New Password *
              </label>
              <div className="relative">
                <input
                  required
                  type={showConfirm ? 'text' : 'password'}
                  value={passwords.confirmPassword}
                  onChange={(e) =>
                    setPasswords({ ...passwords, confirmPassword: e.target.value })
                  }
                  className={`pr-10 ${inputClass}`}
                  placeholder="Re-enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5"
                >
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {/* Password Match Indicator */}
              {showMatchWarning && (
                <p className="text-xs text-rose-600 mt-1.5 flex items-center">
                  <X className="h-3.5 w-3.5 mr-1" />
                  Passwords do not match
                </p>
              )}
              {passwordsMatch && (
                <p className="text-xs text-emerald-600 mt-1.5 flex items-center">
                  <Check className="h-3.5 w-3.5 mr-1" />
                  Passwords match
                </p>
              )}
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-end">
              <button
                type="submit"
                disabled={savingPassword || showMatchWarning}
                className="bg-primary-700 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-primary-800 flex items-center transition-all active:scale-95 hover:shadow-lg hover:shadow-primary-700/25 disabled:opacity-50"
              >
                {savingPassword ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    <span>Updating Password...</span>
                  </>
                ) : (
                  <>
                    <KeyRound className="h-4 w-4 mr-2" />
                    <span>Change Password</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
