import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Menu,
  X,
  Phone,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { useSettings } from '../../hooks/useSettings';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { settings } = useSettings();

  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

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
      if (location.pathname !== '/') {
        navigate(path);
      } else {
        const id = path.replace('/#', '');
        const element = document.getElementById(id);

        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
          });
        }
      }
    } else {
      navigate(path);
    }
  };

  /*
   * Luxury charcoal navbar.
   * No maroon colors.
   */
  const navBg =
    isHome && !isScrolled
      ? 'bg-gradient-to-b from-black/65 via-black/35 to-transparent text-white'
      : 'bg-primary/95 backdrop-blur-md text-white border-b border-gold/30 shadow-lg';

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
        <div className="flex items-center justify-between h-20">

          {/* =====================================================
              BRAND LOGO
              ===================================================== */}

          <Link
            to="/"
            className="flex items-center space-x-3 group"
          >
            <div
              className="
                w-10
                h-10
                rounded-full
                border-2
                border-gold
                flex
                items-center
                justify-center
                bg-primary/70
                shadow-gold
                group-hover:scale-105
                transition-transform
                duration-300
              "
            >
              <Sparkles
                className="
                  w-5
                  h-5
                  text-gold
                "
              />
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
                  group-hover:text-gold
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
                  text-gold
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
              DESKTOP NAVIGATION
              ===================================================== */}

          <nav
            className="
              hidden
              lg:flex
              items-center
              space-x-7
              text-sm
              font-medium
              tracking-wide
            "
          >
            {navLinks.map((link) => {
              const isActive =
                location.pathname === link.path;

              return (
                <button
                  key={link.name}
                  onClick={() => handleNavClick(link.path)}
                  className={`
                    relative
                    py-2
                    transition-colors
                    duration-300
                    hover:text-gold

                    ${
                      isActive
                        ? 'text-gold font-semibold'
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
                        bg-gold
                        rounded-full
                      "
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* =====================================================
              DESKTOP CTA
              ===================================================== */}

          <div
            className="
              hidden
              sm:flex
              items-center
              space-x-4
            "
          >

            {/* Phone */}

            <a
              href={`tel:${settings.phone.replace(/\s+/g, '')}`}
              className="
                flex
                items-center
                text-xs
                font-medium
                text-white/95
                hover:text-gold
                transition-colors
                duration-300
                py-2
                px-3
                rounded-md
                border
                border-white/20
                hover:border-gold
                hover:bg-white/5
              "
              title="Direct Hotel Reception"
            >
              <Phone
                className="
                  w-3.5
                  h-3.5
                  mr-1.5
                  text-gold
                "
              />

              <span>
                {settings.phone}
              </span>
            </a>

            {/* Book Your Stay */}

            <Link
              to="/booking"
              className="
                relative
                inline-flex
                items-center
                justify-center

                px-5
                py-2.5

                text-xs
                font-bold
                tracking-wider

                text-primary

                uppercase

                bg-gradient-to-r
                from-bright-gold
                via-gold
                to-gold-dark

                rounded-full

                shadow-gold

                hover:brightness-110
                hover:shadow-gold-lg

                transition-all
                duration-300

                active:scale-95
              "
            >
              <Calendar
                className="
                  w-3.5
                  h-3.5
                  mr-1.5
                "
              />

              BOOK YOUR STAY
            </Link>
          </div>

          {/* =====================================================
              MOBILE MENU
              ===================================================== */}

          <div
            className="
              flex
              lg:hidden
              items-center
              space-x-2
            "
          >

            <Link
              to="/booking"
              className="
                sm:hidden
                px-3
                py-1.5
                text-xs
                font-bold
                bg-gold
                text-primary
                rounded-full
                shadow-gold
              "
            >
              BOOK
            </Link>

            <button
              onClick={() =>
                setMobileMenuOpen(!mobileMenuOpen)
              }
              className="
                p-2
                rounded-md
                text-white
                hover:text-gold
                transition-colors
                focus:outline-none
              "
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? (
                <X className="w-7 h-7" />
              ) : (
                <Menu className="w-7 h-7" />
              )}
            </button>

          </div>
        </div>
      </div>

      {/* =====================================================
          MOBILE DRAWER
          ===================================================== */}

      {mobileMenuOpen && (
        <div
          className="
            lg:hidden

            bg-primary/95
            backdrop-blur-lg

            border-b
            border-gold/40

            px-6
            pt-4
            pb-8

            space-y-4

            shadow-xl

            animate-in
            slide-in-from-top
            duration-200
          "
        >

          <div
            className="
              flex
              flex-col
              space-y-3
              pt-2
            "
          >
            {navLinks.map((link) => {

              const isActive =
                location.pathname === link.path;

              return (
                <button
                  key={link.name}
                  onClick={() =>
                    handleNavClick(link.path)
                  }
                  className={`
                    text-left
                    text-base
                    font-medium
                    py-2
                    border-b
                    border-white/10
                    transition-colors

                    ${
                      isActive
                        ? 'text-gold font-bold'
                        : 'text-white/90 hover:text-gold'
                    }
                  `}
                >
                  {link.name}
                </button>
              );
            })}
          </div>

          {/* Mobile Contact */}

          <div
            className="
              pt-3
              flex
              flex-col
              space-y-3
            "
          >

            <a
              href={`tel:${settings.phone.replace(/\s+/g, '')}`}
              className="
                flex
                items-center
                justify-center
                w-full
                py-2.5

                border
                border-gold/50

                rounded-lg

                text-white
                text-sm
                font-medium

                hover:bg-gold/10
                transition-colors
              "
            >
              <Phone
                className="
                  w-4
                  h-4
                  mr-2
                  text-gold
                "
              />

              Call Hotel: {settings.phone}
            </a>

            {/* Mobile Booking */}

            <Link
  to="/booking"
  className="
    relative
    inline-flex
    items-center
    justify-center
    px-5
    py-2.5
    text-xs
    font-bold
    tracking-wider
    text-primary
    uppercase
    bg-gradient-to-r
    from-bright-gold
    via-gold
    to-gold-dark
    rounded-full
    shadow-gold
    hover:brightness-110
    transition-all
  "
>
  <Calendar className="w-3.5 h-3.5 mr-1.5" />
  BOOK YOUR STAY
</Link>

          </div>
        </div>
      )}
    </header>
  );
};