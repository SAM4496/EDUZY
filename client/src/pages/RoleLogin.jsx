import { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Mail, Lock, Eye, EyeOff, GraduationCap, ArrowLeft, Loader2, Shield, Users, BookOpen, CheckCircle } from 'lucide-react';

export default function RoleLogin({ role, title, subtitle, gradientFrom, gradientTo }) {
  const { login, isAuthenticated, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [focused, setFocused] = useState(null);
  const [loginSuccess, setLoginSuccess] = useState(false);

  useEffect(() => {
    setTimeout(() => setMounted(true), 50);
  }, []);

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === role) navigate(`/${role}/dashboard`, { replace: true });
    }
  }, [isAuthenticated, user, role, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter your credentials');
      return;
    }
    setLoading(true);
    try {
      const result = await login(email, password, role);
      if (result.success) {
        setLoginSuccess(true);
        if (result.mustChangePassword) {
          toast('Please change your temporary password', { icon: '🔐' });
        }
        toast.success('Login successful!');
        setTimeout(() => navigate(`/${role}/dashboard`, { replace: true }), 600);
      } else {
        toast.error(result.message || 'Login failed');
        // Shake animation on error
        const form = document.getElementById('login-form');
        form?.classList.add('animate-shake');
        setTimeout(() => form?.classList.remove('animate-shake'), 500);
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const RoleIcon = role === 'admin' ? Shield : role === 'faculty' ? Users : BookOpen;
  const roleColors = {
    admin: { ring: 'focus:ring-primary-500 focus:border-primary-500', btn: 'bg-primary-700 hover:bg-primary-800 hover:shadow-primary-700/25', badge: 'bg-purple-100 text-purple-700', accent: 'text-primary-600' },
    faculty: { ring: 'focus:ring-blue-500 focus:border-blue-500', btn: 'bg-blue-600 hover:bg-blue-700 hover:shadow-blue-600/25', badge: 'bg-blue-100 text-blue-700', accent: 'text-blue-600' },
    student: { ring: 'focus:ring-green-500 focus:border-green-500', btn: 'bg-green-600 hover:bg-green-700 hover:shadow-green-600/25', badge: 'bg-green-100 text-green-700', accent: 'text-green-600' }
  };
  const colors = roleColors[role];

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className={`hidden lg:flex lg:w-2/5 bg-gradient-to-br ${gradientFrom} ${gradientTo} p-12 flex-col justify-between relative overflow-hidden`}>
        {/* Animated background elements */}
        <div className="absolute top-20 right-10 w-32 h-32 bg-white/10 rounded-full animate-[pulse_4s_ease-in-out_infinite]"></div>
        <div className="absolute bottom-32 left-10 w-24 h-24 bg-white/5 rounded-full animate-[pulse_5s_ease-in-out_infinite_1s]"></div>
        <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-white/10 rounded-lg rotate-45 animate-[bounce_6s_ease-in-out_infinite]"></div>
        <div className="absolute bottom-1/4 right-8 w-12 h-12 bg-white/5 rounded-full animate-[pulse_3s_ease-in-out_infinite_2s]"></div>

        <div className={`relative z-10 transition-all duration-700 ${mounted ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0'}`}>
          <Link to="/" className="inline-flex items-center text-white/70 hover:text-white mb-8 text-sm transition-all duration-200 hover:-translate-x-1 group">
            <ArrowLeft className="h-4 w-4 mr-1.5 group-hover:-translate-x-0.5 transition-transform" /> Back to Portal Selection
          </Link>
          <div className="flex items-center space-x-3 mb-10">
            <div className="bg-white/20 p-2.5 rounded-xl backdrop-blur-sm">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">Eduzy</span>
          </div>
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-white/20 p-2 rounded-lg">
              <RoleIcon className="h-6 w-6 text-white" />
            </div>
            <span className="text-sm font-medium text-white/80 uppercase tracking-wider">{role} Portal</span>
          </div>
          <h1 className="text-4xl font-bold text-white leading-tight mb-4">{title}</h1>
          <p className="text-white/80 text-lg leading-relaxed">{subtitle}</p>

          {/* Feature list */}
          <div className="mt-10 space-y-3">
            {(role === 'admin' 
              ? ['Full institute management', 'Branch & field control', 'User credential generation']
              : role === 'faculty'
              ? ['Attendance marking', 'Assignment management', 'Student progress tracking']
              : ['Course enrollment', 'Attendance calendar', 'Fee & result tracking']
            ).map((feature, i) => (
              <div key={i} className={`flex items-center space-x-3 text-white/70 transition-all duration-500`} style={{ transitionDelay: `${300 + i * 100}ms`, opacity: mounted ? 1 : 0, transform: mounted ? 'translateX(0)' : 'translateX(-20px)' }}>
                <CheckCircle className="h-4 w-4 text-white/50 flex-shrink-0" />
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={`relative z-10 text-white/50 text-sm transition-all duration-700 delay-500 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
          © {new Date().getFullYear()} Eduzy — Smart Institute Management
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 bg-gray-50 relative overflow-hidden">
        {/* Success overlay */}
        {loginSuccess && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center animate-[fadeIn_0.3s_ease-out]">
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 animate-[bounce_1s_ease-in-out]">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <p className="text-lg font-semibold text-gray-900">Welcome back!</p>
              <p className="text-sm text-gray-500">Redirecting to your dashboard...</p>
            </div>
          </div>
        )}

        <div className={`w-full max-w-md transition-all duration-500 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}>
          {/* Mobile header */}
          <div className="lg:hidden mb-8">
            <Link to="/" className="inline-flex items-center text-gray-500 hover:text-gray-700 text-sm mb-4 hover:-translate-x-1 transition-all">
              <ArrowLeft className="h-4 w-4 mr-1.5" /> Back
            </Link>
            <div className="flex items-center space-x-3">
              <div className="bg-primary-600 p-2 rounded-xl">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Eduzy</span>
            </div>
          </div>

          <div id="login-form" className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 transition-all hover:shadow-xl">
            <div className="mb-6">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-3 ${colors.badge}`}>
                <RoleIcon className="h-3.5 w-3.5 mr-1.5" />
                {role} Portal
              </span>
              <h2 className="text-2xl font-bold text-gray-900">Sign In</h2>
              <p className="text-gray-500 text-sm mt-1">
                Enter your {role === 'admin' ? 'admin' : 'institute-provided'} credentials
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {role === 'admin' ? 'Email Address' : 'User ID or Email'}
                </label>
                <div className={`relative transition-all duration-200 ${focused === 'email' ? 'scale-[1.01]' : ''}`}>
                  <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors duration-200 ${focused === 'email' ? colors.accent : 'text-gray-400'}`} />
                  <input
                    type="text" required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocused('email')}
                    onBlur={() => setFocused(null)}
                    className={`w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl ${colors.ring} transition-all duration-200 text-sm`}
                    placeholder={role === 'admin' ? 'admin@institute.edu' : `${role === 'faculty' ? 'FAC' : 'STU'}-2024-0001 or email`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                <div className={`relative transition-all duration-200 ${focused === 'password' ? 'scale-[1.01]' : ''}`}>
                  <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors duration-200 ${focused === 'password' ? colors.accent : 'text-gray-400'}`} />
                  <input
                    type={showPassword ? 'text' : 'password'} required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocused('password')}
                    onBlur={() => setFocused(null)}
                    className={`w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl ${colors.ring} transition-all duration-200 text-sm`}
                    placeholder="Enter your password"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100 active:scale-90">
                    {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit" disabled={loading || !email || !password}
                className={`w-full text-white py-3 rounded-xl font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center hover:shadow-lg active:scale-[0.98] ${colors.btn}`}
              >
                {loading ? (
                  <><Loader2 className="h-5 w-5 mr-2 animate-spin" /> Signing in...</>
                ) : (
                  <>
                    <RoleIcon className="h-5 w-5 mr-2" /> Sign In
                  </>
                )}
              </button>
            </form>

            {role !== 'admin' && (
              <div className="mt-5 p-3.5 bg-amber-50 rounded-xl border border-amber-100 transition-all hover:bg-amber-100/60">
                <p className="text-xs text-amber-700 text-center leading-relaxed">
                  📋 Your login credentials are provided by your institute admin. Contact your admin if you don't have credentials.
                </p>
              </div>
            )}

            {/* Other portals */}
            <div className="mt-6 pt-5 border-t border-gray-100">
              <p className="text-xs text-gray-400 text-center mb-3">Looking for a different portal?</p>
              <div className="flex justify-center space-x-3">
                {['admin', 'faculty', 'student'].filter(r => r !== role).map(r => (
                  <Link key={r} to={`/${r}/login`} 
                    className="text-xs font-medium text-gray-500 hover:text-primary-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-primary-50 capitalize">
                    {r} Portal
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom shake animation style */}
      <style>{`
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          50% { transform: translateX(8px); }
          75% { transform: translateX(-4px); }
        }
        @keyframes fadeIn {
          from { opacity: 0; } to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
