import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarCheck2,
  BedDouble,
  Users,
  Image as ImageIcon,
  MessageSquare,
  Settings as SettingsIcon,
  ShieldCheck,
  History,
  LogOut,
  Menu,
  X,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const AdminLayout: React.FC = () => {
  const { admin, loading, logout, isSuperAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brandDark text-cream">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-medium tracking-wide">Authenticating Aahvaanam Admin...</p>
        </div>
      </div>
    );
  }

  if (!admin) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Bookings', path: '/admin/bookings', icon: CalendarCheck2 },
    { name: 'Rooms & Inventory', path: '/admin/rooms', icon: BedDouble },
    { name: 'Customers', path: '/admin/customers', icon: Users },
    { name: 'Photo Gallery', path: '/admin/gallery', icon: ImageIcon },
    { name: 'Enquiries', path: '/admin/enquiries', icon: MessageSquare },
    { name: 'Hotel Settings', path: '/admin/settings', icon: SettingsIcon },
    ...(isSuperAdmin
      ? [{ name: 'Admin Users', path: '/admin/admins', icon: ShieldCheck }]
      : []),
    { name: 'Audit Logs', path: '/admin/audit-logs', icon: History }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar for Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-primary text-cream border-r border-gold/30 shadow-2xl shrink-0">
        {/* Brand Header */}
        <div className="p-6 border-b border-white/10 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gold/20 border border-gold flex items-center justify-center text-gold shadow-gold-glow">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-serif font-bold text-lg text-cream tracking-wide">AAHVAANAM</h1>
            <p className="text-[10px] text-gold tracking-widest uppercase font-semibold">ADMIN MANAGEMENT</p>
          </div>
        </div>

        {/* User Card */}
        <div className="p-4 mx-4 my-4 rounded-xl bg-black/20 border border-gold/20">
          <div className="text-xs text-cream/70">Signed in as:</div>
          <div className="text-sm font-bold text-cream truncate">{admin.name}</div>
          <div className="flex items-center justify-between mt-1">
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-gold text-brandDark font-bold">
              {admin.role}
            </span>
            <span className="text-[11px] text-emerald-400 font-medium">● Online</span>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center px-3.5 py-2.5 text-sm font-medium rounded-xl transition-all ${
                  isActive
                    ? 'bg-gold text-brandDark font-bold shadow-gold-glow translate-x-1'
                    : 'text-cream/80 hover:bg-white/10 hover:text-cream'
                }`}
              >
                <Icon className={`w-4 h-4 mr-3 ${isActive ? 'text-brandDark' : 'text-gold'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-white/10 space-y-2">
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-center w-full py-2 px-3 text-xs text-cream/70 hover:text-gold hover:bg-white/5 rounded-lg transition-colors"
          >
            <span>View Public Website</span>
            <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center justify-center w-full py-2.5 px-3 text-xs font-bold text-rose-300 hover:text-white bg-rose-950/40 hover:bg-rose-900/60 rounded-xl transition-colors border border-rose-800/40"
          >
            <LogOut className="w-4 h-4 mr-2" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header for Mobile & Desktop */}
        <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3.5 flex items-center justify-between shadow-sm sticky top-0 z-30">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
              aria-label="Open sidebar"
            >
              {mobileNavOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <div className="flex items-center space-x-2">
              <span className="font-serif text-lg font-bold text-primary">AAHVAANAM ADMIN</span>
              <span className="hidden sm:inline-block text-xs bg-gold/20 text-gold-dark font-semibold px-2 py-0.5 rounded-full">
                Kurnool Property
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              to="/"
              target="_blank"
              className="hidden sm:flex items-center text-xs font-semibold text-primary hover:text-primary-light px-3 py-1.5 rounded-lg border border-primary/20 hover:bg-primary/5"
            >
              <span>Live Site</span>
              <ExternalLink className="w-3 h-3 ml-1" />
            </Link>

            <button
              onClick={handleLogout}
              className="p-2 text-gray-500 hover:text-red-600 lg:hidden"
              title="Sign Out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileNavOpen && (
          <div className="lg:hidden bg-primary text-cream border-b border-gold/40 p-4 space-y-2 animate-in slide-in-from-top duration-150">
            <div className="text-xs text-gold font-bold uppercase tracking-wider pb-2 border-b border-white/10">
              Admin Menu ({admin.name} • {admin.role})
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setMobileNavOpen(false)}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg ${
                    isActive ? 'bg-gold text-brandDark font-bold' : 'text-cream/90 hover:bg-white/10'
                  }`}
                >
                  <Icon className={`w-4 h-4 mr-2.5 ${isActive ? 'text-brandDark' : 'text-gold'}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-3 py-2 text-sm font-bold text-red-300 hover:bg-red-900/30 rounded-lg"
            >
              <LogOut className="w-4 h-4 mr-2.5" />
              <span>Sign Out</span>
            </button>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
