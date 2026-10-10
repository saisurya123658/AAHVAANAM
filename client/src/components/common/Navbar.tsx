import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Menu,
  X,
  Phone,
  Calendar,
  Sparkles,
  User,
  BookmarkCheck,
  ShieldCheck
} from 'lucide-react';
import { useSettings } from '../../hooks/useSettings';
import { useUserAuth } from '../../hooks/useUserAuth';
import { useAuth } from '../../hooks/useAuth';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { settings } = useSettings();

  const { user, isAuthenticated, logout: logoutUser } = useUserAuth();
  const { admin, logout: logoutAdmin } = useAuth();

  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Rooms', path: '/rooms' },
    { name: 'Amenities', path: '/#amenities' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Location', path: '/location' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const handleNavClick = (path: string) => {
    setMobileMenuOpen(false);

    if (path.startsWith('/#')) {
      const id = path.replace('/#', '');
      if (location.pathname !== '/') {
        navigate(`/${path.replace('/', '')}`);
      } else {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    } else {
      navigate(path);
    }
  };

  /**
   * Smart Booking CTA Handler:
   * - If on HomePage: check if the booking/availability form is already visible. If not, smoothly scroll to it.
   * - If on BookingPage: check if form is already visible. If not, smoothly scroll to it.
   * - If on any other page: navigate to /booking.
   */
  const handleBookingCtaClick = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    setMobileMenuOpen(false);

    const isElementInViewport = (el: HTMLElement) => {
      const rect = el.getBoundingClientRect();
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;
      return rect.top >= 0 && rect.top <= windowHeight * 0.7;
    };

    if (location.pathname === '/') {
      const formEl = document.getElementById('booking-form');
      if (formEl) {
        if (!isElementInViewport(formEl)) {
          formEl.scrollIntoView({ behavior: 'smooth' });
        }
        return;
      }
    } else if (location.pathname === '/booking') {
      const formEl = document.getElementById('booking-form');
      if (formEl) {
        if (!isElementInViewport(formEl)) {
          formEl.scrollIntoView({ behavior: 'smooth' });
        }
        return;
      }
    }

    navigate('/booking');
  };

  /*
   * Luxury header styling:
   * Transparent dark overlay at top of homepage; sleek sticky charcoal glass with gold border when scrolled.
   */
  const navBg =
    isHome && !isScrolled
      ? 'bg-gradient-to-b from-black/85 via-black/55 to-transparent text-white'
      : 'bg-[#171411]/95 backdrop-blur-md text-white border-b border-[#E0B84D]/30 shadow-[0_4px_25px_rgba(0,0,0,0.5)]';

  return (
    <header
      className={`
        fixed
        top-0
        left-0
        right-0
        z-50
        transition-all
        duration-300
        ${navBg}
      `}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-2 sm:gap-4">

          {/* =====================================================
              1. BRAND LOGO
              ===================================================== */}
          <Link
            to="/"
            className="flex items-center space-x-3 group flex-shrink-0"
          >
            <div
              className="
                w-10
                h-10
                rounded-full
                border-2
                border-[#E0B84D]
                flex
                items-center
                justify-center
                bg-[#171411]/80
                shadow-gold
                group-hover:scale-105
                transition-transform
                duration-300
              "
            >
              <Sparkles className="w-5 h-5 text-[#E0B84D]" />
            </div>

            <div className="flex flex-col">
              <span
                className="
                  font-serif
                  text-2xl
                  sm:text-3xl
                  tracking-wider
                  font-bold
                  text-white
                  group-hover:text-[#E0B84D]
                  transition-colors
                  duration-300
                "
              >
                AAHVAANAM
              </span>

              <span
                className="
                  text-[10px]
                  tracking-[0.25em]
                  text-[#E0B84D]
                  uppercase
                  -mt-1
                  font-medium
                "
              >
                Luxury Rooms • Kurnool
              </span>
            </div>
          </Link>

          {/* =====================================================
              2. DESKTOP NAVIGATION LINKS:
              Home | Rooms | Amenities | Gallery | Location | About | Contact
              ===================================================== */}
          <nav
            className="
              hidden
              lg:flex
              items-center
              space-x-3
              xl:space-x-5
              2xl:space-x-6
              text-xs
              xl:text-sm
              font-medium
              tracking-wide
            "
          >
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;

              return (
                <button
                  key={link.name}
                  onClick={() => handleNavClick(link.path)}
                  className={`
                    relative
                    py-2
                    transition-colors
                    duration-300
                    hover:text-[#E0B84D]
                    cursor-pointer
                    ${
                      isActive
                        ? 'text-[#E0B84D] font-semibold'
                        : 'text-white/90'
                    }
                  `}
                >
                  {link.name}
                  {isActive && (
                    <span
                      className="
                        absolute
                        left-0
                        right-0
                        -bottom-1
                        h-0.5
                        bg-[#E0B84D]
                        rounded-full
                      "
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* =====================================================
              3. ACTION BUTTONS:
              Login | Phone | BOOK YOUR STAY
              Exact layout: Logo | Home... | Login | Phone | BOOK YOUR STAY
              ===================================================== */}
          <div
            className="
              hidden
              lg:flex
              items-center
              space-x-2.5
              xl:space-x-4
              flex-shrink-0
            "
          >
            {/* LOGIN BUTTON: Directly navigates to /login */}
            {admin ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/admin/dashboard"
                  className="
                    inline-flex
                    items-center
                    gap-1.5
                    px-3
                    py-2
                    text-xs
                    font-bold
                    text-[#F4C542]
                    bg-black/40
                    hover:bg-black/70
                    border
                    border-[#E0B84D]/50
                    rounded-xl
                    transition-all
                    whitespace-nowrap
                  "
                  title="Admin Dashboard"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[#E0B84D]" />
                  <span>Admin Panel</span>
                </Link>
                <button
                  onClick={logoutAdmin}
                  className="text-xs text-white/60 hover:text-red-400 font-semibold transition-colors px-1 cursor-pointer"
                >
                  Logout
                </button>
              </div>
            ) : isAuthenticated && user ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/my-bookings"
                  className="
                    inline-flex
                    items-center
                    gap-1.5
                    px-3
                    py-2
                    text-xs
                    font-bold
                    text-[#E0B84D]
                    bg-white/10
                    hover:bg-white/15
                    border
                    border-white/20
                    rounded-xl
                    transition-all
                    whitespace-nowrap
                  "
                  title="View Your Bookings"
                >
                  <BookmarkCheck className="w-3.5 h-3.5 text-[#E0B84D]" />
                  <span>{user.name.split(' ')[0]}</span>
                </Link>
                <button
                  onClick={logoutUser}
                  className="text-xs text-white/60 hover:text-red-400 font-semibold transition-colors px-1 cursor-pointer"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="
                  inline-flex
                  items-center
                  gap-1.5
                  px-3.5
                  py-2
                  text-xs
                  font-bold
                  text-white/95
                  hover:text-[#E0B84D]
                  hover:bg-white/10
                  rounded-xl
                  border
                  border-white/20
                  hover:border-[#E0B84D]
                  transition-all
                  whitespace-nowrap
                "
                id="nav-login-button"
              >
                <User className="w-3.5 h-3.5 text-[#E0B84D]" />
                <span>Login</span>
              </Link>
            )}

            {/* PHONE RECEPTION (+91 96402 89999) */}
            <a
              href={`tel:${settings.phone.replace(/\s+/g, '')}`}
              className="
                hidden
                lg:flex
                items-center
                text-xs
                font-medium
                text-white/95
                hover:text-[#E0B84D]
                transition-colors
                h-[46px]
                px-3.5
                rounded-xl
                border
                border-white/20
                hover:border-[#E0B84D]
                bg-black/30
                hover:bg-black/50
                whitespace-nowrap
                flex-shrink-0
              "
              title="Direct Hotel Reception"
            >
              <Phone className="w-3.5 h-3.5 mr-2 text-[#E0B84D] flex-shrink-0" />
              <span className="tracking-wide font-medium">{settings.phone}</span>
            </a>

            {/* BOOK YOUR STAY (WIDE HORIZONTAL RECTANGULAR GOLD BUTTON) */}
            <button
              onClick={handleBookingCtaClick}
              className="
                relative
                inline-flex
                items-center
                justify-center
                gap-2.5
                px-6
                h-[50px]
                min-w-[200px]
                text-xs
                font-extrabold
                tracking-wider
                text-[#171411]
                uppercase
                whitespace-nowrap
                bg-gradient-to-r
                from-[#F4C542]
                via-[#E0B84D]
                to-[#C49A32]
                rounded-xl
                shadow-[0_4px_16px_rgba(224,184,77,0.35)]
                hover:brightness-105
                hover:shadow-[0_6px_22px_rgba(224,184,77,0.55)]
                active:scale-[0.98]
                transition-all
                duration-200
                cursor-pointer
                flex-shrink-0
              "
              id="sticky-book-stay-cta"
            >
              <Calendar className="w-4 h-4 flex-shrink-0 text-[#171411]" />
              <span className="whitespace-nowrap tracking-widest font-bold">
                BOOK YOUR STAY
              </span>
            </button>
          </div>

          {/* =====================================================
              4. MOBILE TOP CONTROLS (LOGIN, BOOK, HAMBURGER)
              ===================================================== */}
          <div
            className="
              flex
              md:hidden
              items-center
              space-x-2
            "
          >
            {/* Mobile Login Link */}
            <Link
              to="/login"
              className="
                px-2.5
                py-1.5
                text-[11px]
                font-bold
                text-white
                border
                border-white/20
                rounded-lg
                bg-black/30
                flex
                items-center
                gap-1
              "
            >
              <User className="w-3 h-3 text-[#E0B84D]" />
              <span>Login</span>
            </Link>

            {/* Mobile Booking button */}
            <button
              onClick={handleBookingCtaClick}
              className="
                px-3
                py-1.5
                text-[11px]
                font-bold
                bg-gradient-to-r
                from-[#F4C542]
                to-[#C49A32]
                text-[#171411]
                rounded-lg
                shadow-gold
                whitespace-nowrap
              "
            >
              BOOK
            </button>

            {/* Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="
                p-2
                rounded-md
                text-white
                hover:text-[#E0B84D]
                transition-colors
                focus:outline-none
              "
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

        </div>
      </div>

      {/* =====================================================
          5. MOBILE DRAWER
          ===================================================== */}
      {mobileMenuOpen && (
        <div
          className="
            md:hidden
            bg-[#171411]/98
            backdrop-blur-xl
            border-b
            border-[#E0B84D]/40
            px-6
            pt-4
            pb-8
            space-y-4
            shadow-2xl
            animate-in
            slide-in-from-top
            duration-200
          "
        >
          {/* Mobile Login & Account Quick Action */}
          <div className="p-3 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-between">
            {admin ? (
              <div className="flex items-center justify-between w-full">
                <span className="text-xs text-[#E0B84D] font-bold">Administrator</span>
                <div className="flex items-center gap-2">
                  <Link
                    to="/admin/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-xs font-bold text-white hover:underline"
                  >
                    Dashboard
                  </Link>
                  <button onClick={logoutAdmin} className="text-xs text-red-400 font-bold">Logout</button>
                </div>
              </div>
            ) : isAuthenticated && user ? (
              <div className="flex items-center justify-between w-full">
                <span className="text-xs text-[#E0B84D] font-bold">{user.name}</span>
                <div className="flex items-center gap-2">
                  <Link
                    to="/my-bookings"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-xs font-bold text-white hover:underline"
                  >
                    My Bookings
                  </Link>
                  <button onClick={logoutUser} className="text-xs text-red-400 font-bold">Sign Out</button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between w-full">
                <span className="text-xs text-white/80">Guest & Admin Access</span>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-1.5 bg-gradient-to-r from-[#F4C542] to-[#C49A32] text-[#171411] font-bold text-xs rounded-lg shadow-sm"
                >
                  Login / Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;

              return (
                <button
                  key={link.name}
                  onClick={() => handleNavClick(link.path)}
                  className={`
                    text-left
                    text-base
                    font-medium
                    py-2
                    border-b
                    border-white/5
                    transition-colors
                    ${
                      isActive
                        ? 'text-[#E0B84D] font-bold'
                        : 'text-white/90 hover:text-[#E0B84D]'
                    }
                  `}
                >
                  {link.name}
                </button>
              );
            })}
          </div>

          {/* Mobile Contact & Book CTA */}
          <div className="pt-3 flex flex-col space-y-3">
            <a
              href={`tel:${settings.phone.replace(/\s+/g, '')}`}
              className="
                flex
                items-center
                justify-center
                w-full
                py-2.5
                border
                border-[#E0B84D]/50
                rounded-xl
                text-white
                text-xs
                font-semibold
                hover:bg-[#E0B84D]/10
                transition-colors
              "
            >
              <Phone className="w-3.5 h-3.5 mr-2 text-[#E0B84D]" />
              Call Reception: {settings.phone}
            </a>

            {/* Mobile Rectangular Button */}
            <button
              onClick={handleBookingCtaClick}
              className="
                w-full
                h-[48px]
                text-xs
                font-extrabold
                tracking-wider
                text-[#171411]
                uppercase
                whitespace-nowrap
                bg-gradient-to-r
                from-[#F4C542]
                via-[#E0B84D]
                to-[#C49A32]
                rounded-xl
                shadow-[0_4px_16px_rgba(224,184,77,0.4)]
                flex
                items-center
                justify-center
                gap-2
              "
            >
              <Calendar className="w-4 h-4 text-[#171411]" />
              <span className="whitespace-nowrap tracking-widest font-bold">
                BOOK YOUR STAY
              </span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};