import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  Phone,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Shield,
  ShieldCheck,
  LogIn,
  UserPlus
} from 'lucide-react';
import { useUserAuth } from '../../hooks/useUserAuth';
import { useAuth } from '../../hooks/useAuth';

export const LoginPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Authentication hooks
  const { login: userLogin, signup: userSignup } = useUserAuth();
  const { login: adminLogin } = useAuth();

  // Active Tab: 'user-login' | 'user-signup' | 'admin-login'
  const initialTab = searchParams.get('tab') === 'signup'
    ? 'user-signup'
    : searchParams.get('tab') === 'admin'
    ? 'admin-login'
    : 'user-login';

  const [activeTab, setActiveTab] = useState<'user-login' | 'user-signup' | 'admin-login'>(initialTab);

  // Sync tab with URL if needed
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'signup') setActiveTab('user-signup');
    else if (tabParam === 'admin') setActiveTab('admin-login');
    else if (tabParam === 'login') setActiveTab('user-login');
  }, [searchParams]);

  // Form states
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [showUserPassword, setShowUserPassword] = useState(false);

  // Sign up form states
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showSignupConfirmPassword, setShowSignupConfirmPassword] = useState(false);

  // Admin form states
  const [adminEmail, setAdminEmail] = useState('admin@aahvaanam.com');
  const [adminPassword, setAdminPassword] = useState('admin123');
  const [showAdminPassword, setShowAdminPassword] = useState(false);

  // Status feedback
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const redirectPath = (location.state as any)?.from?.pathname || '/my-bookings';

  // Handle Tab Switch
  const switchTab = (tab: 'user-login' | 'user-signup' | 'admin-login') => {
    setActiveTab(tab);
    setError(null);
    setSuccess(null);
  };

  // 1. USER LOGIN SUBMIT
  const handleUserLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!userEmail.trim() || !userPassword.trim()) {
      setError('Please enter both your email address and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      await userLogin(userEmail, userPassword);
      setSuccess('Guest login successful! Redirecting to your account...');
      setTimeout(() => {
        navigate(redirectPath, { replace: true });
      }, 700);
    } catch (err: any) {
      setError(err.message || 'Invalid email or password. Please verify your credentials.');
      setIsSubmitting(false);
    }
  };

  // Demo user login shortcut
  const handleOneClickDemoUser = async () => {
    setUserEmail('user@example.com');
    setUserPassword('user123');
    setError(null);
    setIsSubmitting(true);
    try {
      await userLogin('user@example.com', 'user123');
      setSuccess('Demo account logged in! Redirecting...');
      setTimeout(() => {
        navigate(redirectPath, { replace: true });
      }, 700);
    } catch (err: any) {
      setError(err.message || 'Demo login failed.');
      setIsSubmitting(false);
    }
  };

  // 2. USER SIGNUP SUBMIT
  const handleUserSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!signupName.trim()) {
      setError('Please provide your full name.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(signupEmail.trim())) {
      setError('Please enter a valid email address.');
      return;
    }

    const cleanPhone = signupPhone.trim().replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (signupPassword.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }

    if (signupPassword !== signupConfirmPassword) {
      setError('Passwords do not match. Please verify your password confirmation.');
      return;
    }

    setIsSubmitting(true);
    try {
      await userSignup({
        name: signupName.trim(),
        email: signupEmail.trim(),
        phone: cleanPhone,
        password: signupPassword
      });

      setSuccess('Account created successfully! Redirecting...');
      setTimeout(() => {
        navigate(redirectPath, { replace: true });
      }, 700);
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please check your details.');
      setIsSubmitting(false);
    }
  };

  // 3. ADMIN LOGIN SUBMIT
  const handleAdminLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!adminEmail.trim() || !adminPassword.trim()) {
      setError('Please provide admin email and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      await adminLogin(adminEmail, adminPassword);
      setSuccess('Admin credentials verified! Entering management dashboard...');
      setTimeout(() => {
        navigate('/admin/dashboard', { replace: true });
      }, 700);
    } catch (err: any) {
      setError(err.message || 'Invalid administrator credentials.');
      setIsSubmitting(false);
    }
  };

  const handleOneClickDemoAdmin = () => {
    setAdminEmail('admin@aahvaanam.com');
    setAdminPassword('admin123');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#171411] text-white flex flex-col justify-between pt-24 pb-16 px-4 sm:px-6 relative overflow-hidden">
      {/* Decorative Gold Radial Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#E0B84D]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-96 h-96 bg-[#C49A32]/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Bar with Logo & Back to Home */}
      <div className="max-w-4xl w-full mx-auto flex items-center justify-between pb-8 relative z-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#E0B84D] hover:text-white transition-colors py-2 px-3 rounded-lg hover:bg-white/5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        {/* Brand Logo Header */}
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full border border-[#E0B84D] bg-[#221D17] flex items-center justify-center text-[#E0B84D] shadow-gold">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="flex flex-col text-left">
            <span className="font-serif text-xl font-bold tracking-wider text-white">
              AAHVAANAM
            </span>
            <span className="text-[9px] tracking-[0.22em] text-[#E0B84D] uppercase -mt-0.5 font-medium">
              Luxury Rooms • Kurnool
            </span>
          </div>
        </Link>
      </div>

      {/* Main Centered Opaque Authentication Card */}
      <div className="max-w-xl w-full mx-auto relative z-10 my-auto">
        <div className="bg-[#201C18] border-2 border-[#E0B84D]/40 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.7)] p-6 sm:p-10 space-y-6">

          {/* Heading */}
          <div className="text-center space-y-1.5">
            <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#E0B84D]">
              OFFICIAL AUTHENTICATION PORTAL
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-wide">
              {activeTab === 'user-login' && 'Guest Sign In'}
              {activeTab === 'user-signup' && 'Create Guest Account'}
              {activeTab === 'admin-login' && 'Administrator Portal'}
            </h1>
            <p className="text-xs text-white/70 max-w-sm mx-auto">
              {activeTab === 'user-login' && 'Sign in to access your hotel bookings and stay history.'}
              {activeTab === 'user-signup' && 'Register for easy room reservations and fast booking management.'}
              {activeTab === 'admin-login' && 'Restricted access for Aahvaanam hotel staff and operations.'}
            </p>
          </div>

          {/* 3 Selectable Tabs / Cards */}
          <div className="grid grid-cols-3 gap-2 bg-[#171411] p-1.5 rounded-2xl border border-white/10">
            {/* Tab 1: User Login */}
            <button
              type="button"
              onClick={() => switchTab('user-login')}
              className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'user-login'
                  ? 'bg-gradient-to-r from-[#F4C542] to-[#C49A32] text-[#171411] shadow-md'
                  : 'text-white/80 hover:text-white hover:bg-white/5'
              }`}
            >
              <LogIn className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="whitespace-nowrap">User Login</span>
            </button>

            {/* Tab 2: User Sign Up */}
            <button
              type="button"
              onClick={() => switchTab('user-signup')}
              className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'user-signup'
                  ? 'bg-gradient-to-r from-[#F4C542] to-[#C49A32] text-[#171411] shadow-md'
                  : 'text-white/80 hover:text-white hover:bg-white/5'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="whitespace-nowrap">User Sign Up</span>
            </button>

            {/* Tab 3: Admin Login */}
            <button
              type="button"
              onClick={() => switchTab('admin-login')}
              className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'admin-login'
                  ? 'bg-gradient-to-r from-[#F4C542] to-[#C49A32] text-[#171411] shadow-md'
                  : 'text-white/80 hover:text-white hover:bg-white/5'
              }`}
            >
              <Shield className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="whitespace-nowrap">Admin Login</span>
            </button>
          </div>

          {/* Alert Messages */}
          {error && (
            <div className="p-3.5 bg-red-950/80 border border-red-500/50 text-red-200 text-xs rounded-xl flex items-start gap-2.5 animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3.5 bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs rounded-xl flex items-start gap-2.5 animate-in fade-in duration-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span>{success}</span>
            </div>
          )}

          {/* =========================================================
              FORM 1: USER LOGIN
              ========================================================= */}
          {activeTab === 'user-login' && (
            <form onSubmit={handleUserLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white/80 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/40">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-[#171411] border border-white/20 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-[#E0B84D] focus:ring-1 focus:ring-[#E0B84D] transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white/80 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/40">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showUserPassword ? 'text' : 'password'}
                    required
                    value={userPassword}
                    onChange={(e) => setUserPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 text-sm bg-[#171411] border border-white/20 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-[#E0B84D] focus:ring-1 focus:ring-[#E0B84D] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowUserPassword(!showUserPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-white/40 hover:text-white"
                    aria-label="Toggle password visibility"
                  >
                    {showUserPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 mt-2 bg-gradient-to-r from-[#F4C542] via-[#E0B84D] to-[#C49A32] text-[#171411] font-bold text-xs uppercase tracking-widest rounded-xl shadow-[0_4px_16px_rgba(224,184,77,0.35)] hover:brightness-105 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-[#171411] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Sign In as Guest</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Demo User Helper */}
              <div className="pt-2 border-t border-white/10 text-center">
                <button
                  type="button"
                  onClick={handleOneClickDemoUser}
                  disabled={isSubmitting}
                  className="w-full py-2 px-3 text-xs font-semibold text-[#F4C542] bg-black/40 hover:bg-black/60 border border-[#E0B84D]/40 rounded-xl transition-all flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#E0B84D]" />
                  <span>One-Click Demo Guest (user@example.com)</span>
                </button>
              </div>

              <div className="text-center pt-1 text-xs text-white/70">
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => switchTab('user-signup')}
                  className="font-bold text-[#E0B84D] hover:underline ml-1 cursor-pointer"
                >
                  Create User Account
                </button>
              </div>
            </form>
          )}

          {/* =========================================================
              FORM 2: USER SIGN UP
              ========================================================= */}
          {activeTab === 'user-signup' && (
            <form onSubmit={handleUserSignupSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white/80 mb-1.5">
                  Full Name *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/40">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    placeholder="e.g. Ramesh Reddy"
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-[#171411] border border-white/20 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-[#E0B84D] focus:ring-1 focus:ring-[#E0B84D] transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white/80 mb-1.5">
                  Email Address *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/40">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    placeholder="ramesh@example.com"
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-[#171411] border border-white/20 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-[#E0B84D] focus:ring-1 focus:ring-[#E0B84D] transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white/80 mb-1.5">
                  Mobile Number *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/40">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    required
                    value={signupPhone}
                    onChange={(e) => setSignupPhone(e.target.value)}
                    placeholder="98480 12345"
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-[#171411] border border-white/20 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-[#E0B84D] focus:ring-1 focus:ring-[#E0B84D] transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/80 mb-1.5">
                    Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showSignupPassword ? 'text' : 'password'}
                      required
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      placeholder="Min 6 chars"
                      className="w-full pl-3 pr-8 py-2.5 text-sm bg-[#171411] border border-white/20 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-[#E0B84D] focus:ring-1 focus:ring-[#E0B84D] transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignupPassword(!showSignupPassword)}
                      className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-white/40 hover:text-white"
                    >
                      {showSignupPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/80 mb-1.5">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showSignupConfirmPassword ? 'text' : 'password'}
                      required
                      value={signupConfirmPassword}
                      onChange={(e) => setSignupConfirmPassword(e.target.value)}
                      placeholder="Re-enter password"
                      className="w-full pl-3 pr-8 py-2.5 text-sm bg-[#171411] border border-white/20 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-[#E0B84D] focus:ring-1 focus:ring-[#E0B84D] transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignupConfirmPassword(!showSignupConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-white/40 hover:text-white"
                    >
                      {showSignupConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 mt-2 bg-gradient-to-r from-[#F4C542] via-[#E0B84D] to-[#C49A32] text-[#171411] font-bold text-xs uppercase tracking-widest rounded-xl shadow-[0_4px_16px_rgba(224,184,77,0.35)] hover:brightness-105 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-[#171411] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Register New Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="text-center pt-1 text-xs text-white/70">
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => switchTab('user-login')}
                  className="font-bold text-[#E0B84D] hover:underline ml-1 cursor-pointer"
                >
                  Sign In to User Account
                </button>
              </div>
            </form>
          )}

          {/* =========================================================
              FORM 3: ADMIN LOGIN
              ========================================================= */}
          {activeTab === 'admin-login' && (
            <form onSubmit={handleAdminLoginSubmit} className="space-y-4">
              <div className="p-3 bg-amber-500/10 border border-[#E0B84D]/30 rounded-xl text-xs text-amber-200/90 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-[#E0B84D] flex-shrink-0 mt-0.5" />
                <span>
                  Admin portal grants access to room pricing, availability overrides, and live reservation management.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white/80 mb-1.5">
                  Admin Email / Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/40">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    placeholder="admin@aahvaanam.com"
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-[#171411] border border-white/20 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-[#E0B84D] focus:ring-1 focus:ring-[#E0B84D] transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white/80 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/40">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showAdminPassword ? 'text' : 'password'}
                    required
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 text-sm bg-[#171411] border border-white/20 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-[#E0B84D] focus:ring-1 focus:ring-[#E0B84D] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowAdminPassword(!showAdminPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-white/40 hover:text-white"
                  >
                    {showAdminPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 mt-2 bg-gradient-to-r from-[#F4C542] via-[#E0B84D] to-[#C49A32] text-[#171411] font-bold text-xs uppercase tracking-widest rounded-xl shadow-[0_4px_16px_rgba(224,184,77,0.35)] hover:brightness-105 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-[#171411] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Login to Admin Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="pt-2 border-t border-white/10 text-center">
                <button
                  type="button"
                  onClick={handleOneClickDemoAdmin}
                  className="w-full py-2 px-3 text-xs font-semibold text-[#F4C542] bg-black/40 hover:bg-black/60 border border-[#E0B84D]/40 rounded-xl transition-all flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#E0B84D]" />
                  <span>Fill Demo Admin Credentials (admin@aahvaanam.com)</span>
                </button>
              </div>

              <div className="text-center pt-1 text-xs text-white/60">
                Are you a guest staying with us?{' '}
                <button
                  type="button"
                  onClick={() => switchTab('user-login')}
                  className="font-bold text-[#E0B84D] hover:underline ml-1 cursor-pointer"
                >
                  Switch to Guest Login
                </button>
              </div>
            </form>
          )}

        </div>
      </div>

      {/* Footer copyright */}
      <div className="text-center text-xs text-white/40 pt-8 relative z-10">
        © {new Date().getFullYear()} AAHVAANAM Luxury Rooms • Kurnool. All rights reserved.
      </div>
    </div>
  );
};
