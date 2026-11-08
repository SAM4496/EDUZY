import React, { useState, useContext, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { AuthContext } from '../../context/AuthContext';
import {
  User,
  ShieldCheck,
  Building2,
  GraduationCap,
  Mail,
  Phone,
  MapPin,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Loader2,
  KeyRound,
  CreditCard,
  Heart,
  PhoneCall
} from 'lucide-react';

export default function StudentProfile() {
  const { user, login } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('profile');

  // Profile Form Data
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    bloodGroup: '',
    emergencyContact: ''
  });
  const [savingProfile, setSavingProfile] = useState(false);

  // Passwords Form Data
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
        address: user.address || '',
        bloodGroup: user.bloodGroup || '',
        emergencyContact: user.emergencyContact || ''
      });
    }
  }, [user]);

  // Password strength logic
  const calculateStrength = (pwd) => {
    if (!pwd) return { score: 0, label: 'Empty', color: 'bg-gray-200' };
    let score = 0;
    if (pwd.length >= 8) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    switch (score) {
      case 1:
        return { score: 25, label: 'Weak', color: 'bg-rose-500', text: 'text-rose-600' };
      case 2:
        return { score: 50, label: 'Fair', color: 'bg-amber-500', text: 'text-amber-600' };
      case 3:
        return { score: 75, label: 'Good', color: 'bg-blue-500', text: 'text-blue-600' };
      case 4:
        return { score: 100, label: 'Strong', color: 'bg-emerald-500', text: 'text-emerald-600' };
      default:
        return { score: 10, label: 'Too short', color: 'bg-rose-400', text: 'text-rose-500' };
    }
  };

  const strength = calculateStrength(passwords.newPassword);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const res = await api.put('/auth/profile', formData);
      toast.success('Profile details updated successfully!');
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

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (passwords.newPassword.length < 6) {
      return toast.error('New password must be at least 6 characters long');
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      return toast.error('New passwords do not match');
    }

    setSavingPassword(true);
    try {
      await api.put('/auth/change-password', {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword
      });
      toast.success('Password updated successfully!');
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update password');
    } finally {
      setSavingPassword(false);
    }
  };

  const inputClass =
    'w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all hover:border-gray-400 bg-white text-gray-900';

  const readOnlyClass =
    'w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm bg-gray-50 text-gray-500 cursor-not-allowed select-none';

  if (!user) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-40 bg-gray-200 rounded-2xl"></div>
        <div className="h-12 bg-gray-200 rounded-xl w-72"></div>
        <div className="h-96 bg-gray-200 rounded-2xl"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Student Profile & Settings</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage your personal details, campus affiliations, and account security
        </p>
      </div>

      {/* Top Banner Profile Summary Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-primary-700 to-primary-500 text-white font-bold flex items-center justify-center text-2xl sm:text-3xl shadow-md shrink-0">
              {user.name ? user.name.charAt(0).toUpperCase() : 'S'}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{user.name}</h2>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary-50 text-primary-700 border border-primary-100">
                  Student
                </span>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                  Semester {user.semester || 1}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-gray-500 flex items-center gap-2">
                <span>{user.email}</span>
                <span>•</span>
                <span className="font-mono">{user.enrollmentNo ? `Enrollment: ${user.enrollmentNo}` : `ID: ${user.userId || 'N/A'}`}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            {user.institute?.name && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-700 font-medium">
                <Building2 className="w-3.5 h-3.5 text-gray-500" />
                {user.institute.name}
              </span>
            )}
            {user.branch?.name && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-700 font-medium">
                <GraduationCap className="w-3.5 h-3.5 text-gray-500" />
                {user.branch.name}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex bg-gray-100 p-1.5 rounded-xl w-fit space-x-1.5 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
            activeTab === 'profile'
              ? 'bg-white text-gray-900 shadow-xs'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Profile Information</span>
        </button>

        <button
          onClick={() => setActiveTab('affiliation')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
            activeTab === 'affiliation'
              ? 'bg-white text-gray-900 shadow-xs'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Campus Affiliation</span>
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
            activeTab === 'security'
              ? 'bg-white text-gray-900 shadow-xs'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Security & Password</span>
        </button>
      </div>

      {/* Tab 1: Profile Information */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
          <form onSubmit={handleProfileUpdate} className="space-y-6">
            <div>
              <h3 className="text-base font-bold text-gray-900 mb-1">Personal Contact Details</h3>
              <p className="text-xs text-gray-500 mb-4">
                Update your active phone number, address, and emergency contact information
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Full Legal Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Contact Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="tel"
                    placeholder="+91 9876543210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Blood Group
                </label>
                <div className="relative">
                  <Heart className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="e.g. O+, A+, B+"
                    value={formData.bloodGroup}
                    onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Emergency Contact Number
                </label>
                <div className="relative">
                  <PhoneCall className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="tel"
                    placeholder="Parent / Guardian Contact"
                    value={formData.emergencyContact}
                    onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Residential / Campus Address
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
                  <textarea
                    rows="3"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Enter your local or permanent address..."
                    className={`${inputClass} pl-10 resize-none`}
                  />
                </div>
              </div>
            </div>

            {/* Read-only Institutional Registry */}
            <div className="pt-6 border-t border-gray-100">
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Locked Institutional Identity Records (Read Only)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <span className="text-[11px] text-gray-500 block mb-1">Official Email</span>
                  <input value={user.email || ''} readOnly className={readOnlyClass} />
                </div>
                <div>
                  <span className="text-[11px] text-gray-500 block mb-1">Enrollment Number</span>
                  <input value={user.enrollmentNo || user.userId || 'N/A'} readOnly className={readOnlyClass} />
                </div>
                <div>
                  <span className="text-[11px] text-gray-500 block mb-1">Department Unit</span>
                  <input value={user.department?.name || 'General Department'} readOnly className={readOnlyClass} />
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-4 border-t border-gray-100 flex justify-end">
              <button
                type="submit"
                disabled={savingProfile}
                className="bg-primary-700 text-white px-5 py-2.5 rounded-xl font-medium text-sm hover:bg-primary-800 flex items-center transition-all active:scale-95 hover:shadow-lg hover:shadow-primary-700/25 disabled:opacity-50"
              >
                {savingProfile ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving Changes...
                  </>
                ) : (
                  'Save Profile Details'
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 2: Institutional Affiliation */}
      {activeTab === 'affiliation' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-6">
          <div>
            <h3 className="text-base font-bold text-gray-900 mb-1">Academic & Multi-Tenant Affiliations</h3>
            <p className="text-xs text-gray-500">
              Verified institutional registrations configured by campus administration
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex items-start space-x-3.5">
              <div className="p-2.5 rounded-xl bg-primary-50 text-primary-700 shrink-0">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Institute</p>
                <p className="text-base font-bold text-gray-900 mt-0.5">
                  {user.institute?.name || 'Central University / Institute'}
                </p>
                {user.institute?.code && (
                  <span className="inline-block font-mono text-[11px] text-gray-500 bg-gray-200 px-1.5 py-0.5 rounded mt-1">
                    Code: {user.institute.code}
                  </span>
                )}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex items-start space-x-3.5">
              <div className="p-2.5 rounded-xl bg-blue-50 text-blue-700 shrink-0">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Campus Branch</p>
                <p className="text-base font-bold text-gray-900 mt-0.5">
                  {user.branch?.name || 'Main Campus'}
                </p>
                {user.branch?.code && (
                  <span className="inline-block font-mono text-[11px] text-gray-500 bg-gray-200 px-1.5 py-0.5 rounded mt-1">
                    Code: {user.branch.code}
                  </span>
                )}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex items-start space-x-3.5">
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 shrink-0">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Field of Study</p>
                <p className="text-base font-bold text-gray-900 mt-0.5">
                  {user.field?.name || 'Engineering & Technology'}
                </p>
                {user.field?.code && (
                  <span className="inline-block font-mono text-[11px] text-gray-500 bg-gray-200 px-1.5 py-0.5 rounded mt-1">
                    Code: {user.field.code}
                  </span>
                )}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex items-start space-x-3.5">
              <div className="p-2.5 rounded-xl bg-purple-50 text-purple-700 shrink-0">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Department</p>
                <p className="text-base font-bold text-gray-900 mt-0.5">
                  {user.department?.name || 'Computer Science & Engineering'}
                </p>
                {user.department?.code && (
                  <span className="inline-block font-mono text-[11px] text-gray-500 bg-gray-200 px-1.5 py-0.5 rounded mt-1">
                    Code: {user.department.code}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="p-5 rounded-xl bg-purple-50/40 border border-purple-100 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-primary-800">Enrollment & Status</p>
              <p className="text-sm font-semibold text-gray-800 mt-0.5">
                Semester {user.semester || 1} • Enrollment No: {user.enrollmentNo || user.userId || '—'}
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Active Enrolled Student
            </span>
          </div>
        </div>
      )}

      {/* Tab 3: Security & Password */}
      {activeTab === 'security' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
          <form onSubmit={handlePasswordUpdate} className="space-y-6 max-w-xl">
            <div>
              <h3 className="text-base font-bold text-gray-900 mb-1">Update Password</h3>
              <p className="text-xs text-gray-500 mb-4">
                Ensure your account is protected with a secure and strong alphanumeric passphrase
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Current Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  required
                  type={showCurrent ? 'text' : 'password'}
                  value={passwords.currentPassword}
                  onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                  placeholder="Enter current password"
                  className={`${inputClass} pl-10 pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                New Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  required
                  type={showNew ? 'text' : 'password'}
                  value={passwords.newPassword}
                  onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                  placeholder="Enter new strong password"
                  className={`${inputClass} pl-10 pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {passwords.newPassword && (
                <div className="mt-3 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500 font-medium">Password Strength:</span>
                    <span className={`font-bold ${strength.text}`}>{strength.label}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${strength.color}`}
                      style={{ width: `${strength.score}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Confirm New Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  required
                  type={showConfirm ? 'text' : 'password'}
                  value={passwords.confirmPassword}
                  onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                  placeholder="Re-enter new password"
                  className={`${inputClass} pl-10 pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-end">
              <button
                type="submit"
                disabled={savingPassword}
                className="bg-primary-700 text-white px-5 py-2.5 rounded-xl font-medium text-sm hover:bg-primary-800 flex items-center transition-all active:scale-95 hover:shadow-lg hover:shadow-primary-700/25 disabled:opacity-50"
              >
                {savingPassword ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Updating Password...
                  </>
                ) : (
                  'Change Password'
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
