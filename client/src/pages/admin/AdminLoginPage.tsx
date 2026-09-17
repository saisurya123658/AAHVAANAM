import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Sparkles, Lock, Mail, AlertCircle, ArrowRight, KeyRound } from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const { login, admin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('admin@aahvaanam.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect to /admin/dashboard
  useEffect(() => {
    if (admin) {
      const from = (location.state as any)?.from?.pathname || '/admin/dashboard';
      navigate(from, { replace: true });
    }
  }, [admin, navigate, location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, password);
      const from = (location.state as any)?.from?.pathname || '/admin/dashboard';
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCredentials = () => {
    setEmail('admin@aahvaanam.com');
    setPassword('admin123');
    setError(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brandDark px-4 py-12 relative overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/40 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-10 right-10 w-72 h-72 bg-gold/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-md w-full">
        {/* Brand Card */}
        <div className="bg-primary/45 backdrop-blur-xl rounded-3xl p-8 sm:p-10 border-2 border-gold/40 shadow-2xl space-y-6 text-cream">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-gold/20 border-2 border-gold flex items-center justify-center text-gold mx-auto shadow-gold-glow">
              <Sparkles className="w-7 h-7" />
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-wide text-cream">
              AAHVAANAM
            </h1>
            <p className="text-[11px] uppercase tracking-[0.25em] text-gold font-semibold">
              ADMIN MANAGEMENT PORTAL
            </p>
          </div>

          {/* Demo Mode Notice Banner */}
          <div className="p-3.5 rounded-xl bg-amber-500/15 border border-gold/40 text-xs text-cream/90 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-gold uppercase tracking-wider text-[10px] flex items-center">
                <KeyRound className="w-3.5 h-3.5 mr-1 text-gold" />
                Demo Credentials
              </span>
              <button
                type="button"
                onClick={fillDemoCredentials}
                className="text-[10px] text-brandDark bg-gold font-bold px-2 py-0.5 rounded shadow-sm hover:brightness-110 active:scale-95 transition-all"
              >
                Auto-Fill
              </button>
            </div>
            <div className="font-mono text-[11px] text-cream/80 space-y-0.5">
              <div>Email: <strong className="text-gold">admin@aahvaanam.com</strong></div>
              <div>Pass: <strong className="text-gold">admin123</strong></div>
            </div>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-950/70 border border-rose-500/50 text-rose-200 text-xs flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs uppercase font-bold tracking-wider text-gold block mb-1.5">
                Staff / Admin Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="admin@aahvaanam.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-cream-light text-brandDark pl-10 pr-4 py-2.5 rounded-xl border border-gold/40 focus:outline-none focus:ring-2 focus:ring-gold text-sm font-medium"
                />
              </div>
            </div>

            <div>
              <label className="text-xs uppercase font-bold tracking-wider text-gold block mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="admin123"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-cream-light text-brandDark pl-10 pr-4 py-2.5 rounded-xl border border-gold/40 focus:outline-none focus:ring-2 focus:ring-gold text-sm font-medium"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-bright-gold via-gold to-yellow-600 text-brandDark font-extrabold text-xs uppercase tracking-wider shadow-gold-glow hover:brightness-110 active:scale-95 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <span>{loading ? 'Signing in...' : 'SIGN IN TO DASHBOARD'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          <div className="pt-2 border-t border-white/10 text-center">
            <Link to="/" className="text-xs text-cream/70 hover:text-gold transition-colors">
              ← Return to Public Website
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
