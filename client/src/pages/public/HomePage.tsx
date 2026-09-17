import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Phone,
  Calendar,
  Wifi,
  Wind,
  Droplets,
  Flame,
  ArrowUpCircle,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  Star,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

import { SearchWidget } from '../../components/common/SearchWidget';
import { Lightbox } from '../../components/common/Lightbox';
import { useSettings } from '../../hooks/useSettings';

export const HomePage: React.FC = () => {
  const { settings } = useSettings();

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const heroImages = [
    '/images/rooms/room_premium_master_bedroom.jpg',
    '/images/rooms/room_deluxe_double_bed.jpg',
    '/images/rooms/room_modern_bathroom.jpg',
    '/images/rooms/room_spacious_suite_wardrobe.jpg',
  ];

  const galleryPreview = [
    {
      title: 'Premium AC Master Bedroom',
      category: 'Rooms',
      url: '/images/rooms/room_premium_master_bedroom.jpg',
    },
    {
      title: 'Deluxe Double Bed with Clean Linens',
      category: 'Rooms',
      url: '/images/rooms/room_deluxe_double_bed.jpg',
    },
    {
      title: 'Modern Grey-Tiled Luxury Bathroom',
      category: 'Bathrooms',
      url: '/images/rooms/room_modern_bathroom.jpg',
    },
    {
      title: 'Spacious Suite & Dressing Area',
      category: 'Rooms',
      url: '/images/rooms/room_spacious_suite_wardrobe.jpg',
    },
    {
      title: 'Textured Entrance Corridor',
      category: 'Property',
      url: '/images/rooms/room_corridor_entrance.jpg',
    },
    {
      title: 'Vanity & Wash Basin Area',
      category: 'Facilities',
      url: '/images/rooms/room_wash_basin_vanity.jpg',
    },
  ];

  const amenities = [
    {
      icon: Wind,
      title: 'A/C Rooms',
      desc: 'Energy efficient silent cooling in every luxury room',
    },
    {
      icon: Wifi,
      title: 'High-Speed WiFi',
      desc: 'Seamless connectivity for students and business travelers',
    },
    {
      icon: Flame,
      title: '24 Hrs. Hot Water',
      desc: 'Uninterrupted geyser facility around the clock',
    },
    {
      icon: Droplets,
      title: 'RO Purified Water',
      desc: 'Clean and safe drinking water available on premises',
    },
    {
      icon: ArrowUpCircle,
      title: 'Lift Facility',
      desc: 'Modern elevator access to all room floors',
    },
    {
      icon: ShieldCheck,
      title: 'Hygienic FreshUp',
      desc: 'Sanitized bathrooms, crisp linen and daily housekeeping',
    },
  ];

  const roomCategories = [
    {
      title: 'Deluxe AC Room',
      subtitle: 'Comfortable stay for students & couples',
      image: '/images/rooms/room_deluxe_double_bed.jpg',
      features: [
        'Double Bed with Padded Headboard',
        'AC & Ceiling Fan',
        'Attached Modern Bathroom',
        'Wall Mounted LED TV',
        'Bedside Tables',
      ],
      maxGuests: 2,
      link: '/rooms',
    },
    {
      title: 'Premium AC Room',
      subtitle:
        'Luxury accommodation with false ceiling & ambient cove lights',
      image: '/images/rooms/room_premium_master_bedroom.jpg',
      features: [
        'Cove Lighting & False Ceiling',
        'Large Wooden Mirrored Wardrobes',
        'Modern Ensuite Bathroom',
        'Working Desk & TV',
        'High-Speed WiFi',
      ],
      maxGuests: 3,
      link: '/rooms',
    },
    {
      title: 'Family Room',
      subtitle: 'Spacious floor plan designed for family groups & pilgrims',
      image: '/images/rooms/room_spacious_suite_wardrobe.jpg',
      features: [
        'Extra Large Floor Area',
        'Multiple Wardrobes & Dressing Unit',
        'Lift Facility Access',
        '24h Hot Water & RO Water',
        'Comfortable Multiple Guests',
      ],
      maxGuests: 5,
      link: '/rooms',
    },
  ];

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const phoneNumber = settings.phone.replace(/\s+/g, '');

  return (
    <div className="min-h-screen bg-[#FCFAF5] text-[#241F1B] overflow-hidden">

      {/* =========================================================
          HERO SECTION
      ========================================================= */}
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden bg-[#171411]">

        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={heroImages[0]}
            alt="Aahvaanam Luxury Bedroom"
            className="
              w-full
              h-full
              object-cover
              object-center
              scale-105
              animate-[heroZoom_18s_ease-in-out_infinite_alternate]
            "
          />

          {/* Soft luxury charcoal overlay */}
          <div
            className="
              absolute inset-0
              bg-gradient-to-r
              from-[#171411]/80
              via-[#171411]/48
              to-[#171411]/20
            "
          />

          {/* Bottom dark fade */}
          <div
            className="
              absolute inset-x-0 bottom-0
              h-64
              bg-gradient-to-t
              from-[#171411]/80
              via-[#171411]/20
              to-transparent
            "
          />

          {/* Vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(23,20,17,0.32)_100%)]" />
        </div>

        {/* Decorative Gold Lines */}
        <div className="absolute top-32 left-6 sm:left-12 w-20 h-px bg-gradient-to-r from-transparent to-[#E0B84D]/70" />
        <div className="absolute top-32 right-6 sm:right-12 w-20 h-px bg-gradient-to-l from-transparent to-[#E0B84D]/70" />

        {/* Hero Content */}
        <div
          className="
            relative z-10
            w-full
            max-w-6xl
            mx-auto
            px-4
            sm:px-6
            lg:px-8
            pt-28
            pb-16
          "
        >

          <div className="max-w-4xl mx-auto text-center">

            {/* Location Badge */}
            <div
              className="
                inline-flex
                items-center
                gap-2
                px-4
                py-2
                rounded-full
                border
                border-[#E0B84D]/60
                bg-[#171411]/45
                backdrop-blur-md
                text-[#F4C542]
                text-[10px]
                sm:text-xs
                font-bold
                tracking-[0.18em]
                uppercase
                shadow-[0_8px_30px_rgba(0,0,0,0.18)]
                animate-[fadeUp_0.8s_ease-out_both]
              "
            >
              <MapPin className="w-4 h-4" />
              <span>Near Kurnool New Bus Stand</span>
            </div>

            {/* Brand */}
            <div className="mt-7 animate-[fadeUp_0.9s_0.1s_ease-out_both]">

              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="w-14 sm:w-24 h-px bg-gradient-to-r from-transparent to-[#D4A72C]" />

                <Sparkles className="w-4 h-4 text-[#E0B84D]" />

                <div className="w-14 sm:w-24 h-px bg-gradient-to-l from-transparent to-[#D4A72C]" />
              </div>

              <h1
                className="
                  font-serif
                  text-5xl
                  sm:text-7xl
                  lg:text-8xl
                  font-bold
                  tracking-[0.12em]
                  text-white
                  leading-none
                  drop-shadow-[0_4px_20px_rgba(0,0,0,0.55)]
                "
              >
                AAHVAANAM
              </h1>

              <p
                className="
                  mt-4
                  font-serif
                  text-xl
                  sm:text-3xl
                  lg:text-4xl
                  italic
                  text-[#E0B84D]
                  tracking-wide
                  drop-shadow-[0_3px_10px_rgba(0,0,0,0.55)]
                "
              >
                Luxury Rooms in Kurnool
              </p>
            </div>

            {/* Tagline */}
            <div
              className="
                mt-7
                max-w-2xl
                mx-auto
                space-y-3
                animate-[fadeUp_1s_0.2s_ease-out_both]
              "
            >
              <p
                className="
                  font-serif
                  text-lg
                  sm:text-2xl
                  text-white
                  font-medium
                  leading-relaxed
                  drop-shadow-[0_3px_8px_rgba(0,0,0,0.6)]
                "
              >
                “Spacious. Comfortable. Clean. Feel at Home.”
              </p>

              <p
                className="
                  text-sm
                  sm:text-base
                  text-white/90
                  font-light
                  leading-relaxed
                  drop-shadow-[0_2px_7px_rgba(0,0,0,0.7)]
                "
              >
                Comfortable AC rooms for students, families,
                professionals and travellers in Kurnool.
              </p>
            </div>

            {/* =====================================================
                HERO BUTTONS
            ===================================================== */}
            <div
              className="
                flex
                flex-wrap
                items-center
                justify-center
                gap-4
                mt-8
                animate-[fadeUp_1s_0.3s_ease-out_both]
              "
            >

              {/* BOOK YOUR STAY */}
              <Link
                to="/booking"
                className="
                  group
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  px-8
                  py-3.5
                  rounded-full
                  bg-gradient-to-r
                  from-[#F4C542]
                  via-[#D4A72C]
                  to-[#B8860B]
                  text-[#171411]
                  font-extrabold
                  text-sm
                  sm:text-base
                  tracking-wider
                  uppercase
                  border
                  border-[#F4C542]/80
                  shadow-[0_8px_30px_rgba(212,167,44,0.35)]
                  hover:brightness-110
                  hover:-translate-y-1
                  hover:shadow-[0_14px_40px_rgba(212,167,44,0.45)]
                  active:scale-95
                  transition-all
                  duration-300
                "
              >
                <Calendar className="w-5 h-5" />

                <span>BOOK YOUR STAY</span>

                <ArrowRight
                  className="
                    w-4
                    h-4
                    transition-transform
                    duration-300
                    group-hover:translate-x-1
                  "
                />
              </Link>

              {/* CALL HOTEL */}
              <a
                href={`tel:${phoneNumber}`}
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  px-7
                  py-3.5
                  rounded-full
                  border
                  border-white/70
                  bg-[#171411]/35
                  backdrop-blur-md
                  text-white
                  font-semibold
                  text-sm
                  sm:text-base
                  tracking-wide
                  hover:bg-white/10
                  hover:border-[#E0B84D]
                  hover:text-[#F4C542]
                  active:scale-95
                  transition-all
                  duration-300
                "
              >
                <Phone className="w-4 h-4" />
                <span>CALL {settings.phone}</span>
              </a>
            </div>

            {/* =====================================================
                AVAILABILITY
            ===================================================== */}
            <div
              className="
                pt-10
                sm:pt-14
                max-w-5xl
                mx-auto
                text-left
                animate-[fadeUp_1s_0.4s_ease-out_both]
              "
            >

              <div className="text-center mb-3">
                <div className="inline-flex items-center gap-2">
                  <div className="w-8 h-px bg-[#D4A72C]" />

                  <span
                    className="
                      text-[10px]
                      sm:text-xs
                      uppercase
                      tracking-[0.22em]
                      text-[#F4C542]
                      font-bold
                    "
                  >
                    Check Room Availability
                  </span>

                  <div className="w-8 h-px bg-[#D4A72C]" />
                </div>
              </div>

              <SearchWidget />
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div
          className="
            absolute
            bottom-5
            left-1/2
            -translate-x-1/2
            z-20
            hidden
            sm:flex
            flex-col
            items-center
            gap-2
            text-white/60
          "
        >
          <span className="text-[9px] uppercase tracking-[0.3em]">
            Explore
          </span>

          <div className="w-px h-8 bg-gradient-to-b from-[#D4A72C] to-transparent" />
        </div>

        {/* Bottom Divider */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#FCFAF5] to-transparent" />
      </section>

      {/* =========================================================
          AMENITIES
      ========================================================= */}
      <section
        id="amenities"
        className="py-20 sm:py-24 bg-[#FCFAF5]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Heading */}
          <div
            className="
              text-center
              max-w-3xl
              mx-auto
              mb-14
            "
          >
            <span
              className="
                text-[10px]
                sm:text-xs
                uppercase
                font-bold
                tracking-[0.25em]
                text-[#A57A1F]
              "
            >
              Your Comfort Our Priority
            </span>

            <h2
              className="
                mt-3
                font-serif
                text-3xl
                sm:text-4xl
                lg:text-5xl
                font-bold
                text-[#25211D]
              "
            >
              Modern Amenities & Hygienic Comfort
            </h2>

            <div className="flex items-center justify-center gap-3 mt-5">
              <div className="w-16 h-px bg-gradient-to-r from-transparent to-[#C49A32]" />
              <Sparkles className="w-4 h-4 text-[#C49A32]" />
              <div className="w-16 h-px bg-gradient-to-l from-transparent to-[#C49A32]" />
            </div>

            <p className="mt-5 text-[#6F675E] text-sm sm:text-base leading-relaxed">
              Every detail at Aahvaanam is designed to give you
              a peaceful, stress-free stay in Kurnool City.
            </p>
          </div>

          {/* Amenity Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {amenities.map((item, idx) => {
              const Icon = item.icon;

              return (
                <div
                  key={idx}
                  className="
                    group
                    bg-white
                    rounded-2xl
                    p-7
                    border
                    border-[#E3DBCF]
                    shadow-[0_12px_40px_rgba(36,31,27,0.06)]
                    hover:-translate-y-2
                    hover:border-[#C49A32]/60
                    hover:shadow-[0_20px_50px_rgba(36,31,27,0.10)]
                    transition-all
                    duration-500
                  "
                >

                  <div
                    className="
                      w-14
                      h-14
                      rounded-2xl
                      bg-[#F7F3EA]
                      border
                      border-[#C49A32]/40
                      flex
                      items-center
                      justify-center
                      text-[#A57A1F]
                      group-hover:bg-[#25211D]
                      group-hover:text-[#E0B84D]
                      group-hover:scale-110
                      transition-all
                      duration-300
                    "
                  >
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3
                    className="
                      mt-5
                      font-serif
                      text-xl
                      font-bold
                      text-[#25211D]
                    "
                  >
                    {item.title}
                  </h3>

                  <p
                    className="
                      mt-2
                      text-sm
                      text-[#6F675E]
                      leading-relaxed
                    "
                  >
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>

          {/* FreshUp Banner */}
          <div
            className="
              mt-14
              rounded-3xl
              bg-gradient-to-r
              from-[#25211D]
              via-[#302B26]
              to-[#171411]
              p-8
              sm:p-10
              text-white
              border
              border-[#C49A32]/50
              shadow-[0_20px_60px_rgba(36,31,27,0.15)]
              flex
              flex-col
              md:flex-row
              items-center
              justify-between
              gap-7
            "
          >

            <div className="space-y-2 text-center md:text-left">

              <span
                className="
                  text-[10px]
                  uppercase
                  tracking-[0.25em]
                  text-[#E0B84D]
                  font-bold
                "
              >
                Way to FreshUp
              </span>

              <h3
                className="
                  font-serif
                  text-2xl
                  sm:text-3xl
                  font-bold
                  text-white
                "
              >
                Clean & Hygienic Stay for Every Guest
              </h3>

              <p
                className="
                  text-sm
                  text-white/70
                  max-w-xl
                  leading-relaxed
                "
              >
                Whether you need a restful night after a long
                journey or a fresh start for your college exams
                and interviews, Aahvaanam delivers pristine hospitality.
              </p>
            </div>

            <Link
              to="/rooms"
              className="
                shrink-0
                inline-flex
                items-center
                gap-2
                px-7
                py-3
                rounded-full
                bg-gradient-to-r
                from-[#F4C542]
                to-[#C49A32]
                text-[#171411]
                font-bold
                text-xs
                uppercase
                tracking-wider
                shadow-[0_8px_25px_rgba(196,154,50,0.25)]
                hover:brightness-110
                hover:-translate-y-1
                transition-all
                duration-300
              "
            >
              EXPLORE ROOMS
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================
          ROOMS
      ========================================================= */}
      <section
        className="
          py-20
          sm:py-24
          bg-[#F7F3EA]
          border-y
          border-[#C49A32]/15
        "
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Section Header */}
          <div
            className="
              flex
              flex-col
              md:flex-row
              md:items-end
              md:justify-between
              mb-14
              gap-5
            "
          >

            <div>

              <span
                className="
                  text-[10px]
                  uppercase
                  font-bold
                  tracking-[0.25em]
                  text-[#A57A1F]
                "
              >
                Configured Accommodations
              </span>

              <h2
                className="
                  font-serif
                  text-3xl
                  sm:text-4xl
                  lg:text-5xl
                  font-bold
                  text-[#25211D]
                  mt-2
                "
              >
                Our Luxury Rooms
              </h2>

              <div className="flex items-center gap-2 mt-4">
                <div className="w-20 h-px bg-[#C49A32]" />
                <div className="w-2 h-2 rounded-full bg-[#C49A32]" />
              </div>
            </div>

            <Link
              to="/rooms"
              className="
                inline-flex
                items-center
                text-sm
                font-bold
                text-[#25211D]
                hover:text-[#A57A1F]
                transition-colors
              "
            >
              <span>View All Rooms & Pricing</span>
              <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          {/* Room Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">

            {roomCategories.map((room, idx) => (
              <div
                key={idx}
                className="
                  group
                  bg-white
                  rounded-3xl
                  overflow-hidden
                  border
                  border-[#E3DBCF]
                  shadow-[0_15px_45px_rgba(36,31,27,0.07)]
                  hover:-translate-y-2
                  hover:shadow-[0_25px_65px_rgba(36,31,27,0.13)]
                  transition-all
                  duration-500
                  flex
                  flex-col
                "
              >

                {/* Image */}
                <div className="relative h-72 overflow-hidden bg-[#EDE5D6]">

                  <img
                    src={room.image}
                    alt={room.title}
                    className="
                      w-full
                      h-full
                      object-cover
                      group-hover:scale-105
                      transition-transform
                      duration-700
                    "
                    loading="lazy"
                  />

                  {/* Image overlay */}
                  <div
                    className="
                      absolute
                      inset-0
                      bg-gradient-to-t
                      from-[#171411]/55
                      via-transparent
                      to-transparent
                      opacity-70
                    "
                  />

                  {/* Guests */}
                  <div
                    className="
                      absolute
                      top-4
                      right-4
                      bg-[#171411]/80
                      backdrop-blur-md
                      text-[#F4C542]
                      text-xs
                      font-bold
                      px-3
                      py-1.5
                      rounded-full
                      border
                      border-[#E0B84D]/50
                    "
                  >
                    Max {room.maxGuests} Guests
                  </div>

                  {/* Room Number */}
                  <div
                    className="
                      absolute
                      bottom-4
                      left-5
                      text-white/80
                      text-[10px]
                      tracking-[0.2em]
                      uppercase
                    "
                  >
                    Room Collection 0{idx + 1}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 sm:p-7 flex-1 flex flex-col">

                  <h3
                    className="
                      font-serif
                      text-2xl
                      font-bold
                      text-[#25211D]
                    "
                  >
                    {room.title}
                  </h3>

                  <p
                    className="
                      text-xs
                      text-[#918980]
                      mt-2
                      mb-5
                      leading-relaxed
                    "
                  >
                    {room.subtitle}
                  </p>

                  {/* Features */}
                  <div className="space-y-2.5 mb-7">

                    {room.features.map((feat, fIdx) => (
                      <div
                        key={fIdx}
                        className="
                          flex
                          items-center
                          text-xs
                          text-[#514941]
                        "
                      >
                        <CheckCircle2
                          className="
                            w-4
                            h-4
                            text-[#C49A32]
                            mr-2.5
                            shrink-0
                          "
                        />

                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>

                  {/* Bottom */}
                  <div
                    className="
                      mt-auto
                      pt-5
                      border-t
                      border-[#EDE5D6]
                      flex
                      items-center
                      justify-between
                      gap-3
                    "
                  >

                    <div>
                      <span
                        className="
                          text-[10px]
                          uppercase
                          tracking-wider
                          text-[#918980]
                          block
                          font-semibold
                        "
                      >
                        Pricing
                      </span>

                      <span
                        className="
                          text-sm
                          font-bold
                          text-[#25211D]
                        "
                      >
                        Contact for Price
                      </span>
                    </div>

                    <Link
                      to={`/booking?roomType=${encodeURIComponent(room.title)}`}
                      className="
                        inline-flex
                        items-center
                        gap-1.5
                        px-4
                        py-2.5
                        rounded-xl
                        bg-[#25211D]
                        text-[#F4C542]
                        hover:bg-[#403A33]
                        text-xs
                        font-bold
                        uppercase
                        tracking-wider
                        transition-all
                        duration-300
                        hover:-translate-y-0.5
                      "
                    >
                      Book Room
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          GALLERY
      ========================================================= */}
      <section className="py-20 sm:py-24 bg-[#FCFAF5]">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-14">

            <span
              className="
                text-[10px]
                uppercase
                font-bold
                tracking-[0.25em]
                text-[#A57A1F]
              "
            >
              Real Photographs
            </span>

            <h2
              className="
                font-serif
                text-3xl
                sm:text-4xl
                lg:text-5xl
                font-bold
                text-[#25211D]
                mt-3
              "
            >
              Experience Aahvaanam
            </h2>

            <div className="flex items-center justify-center gap-3 mt-5">
              <div className="w-16 h-px bg-gradient-to-r from-transparent to-[#C49A32]" />
              <Sparkles className="w-4 h-4 text-[#C49A32]" />
              <div className="w-16 h-px bg-gradient-to-l from-transparent to-[#C49A32]" />
            </div>

            <p className="mt-5 text-[#6F675E] text-sm sm:text-base">
              Authentic glimpses of our spotless rooms,
              modern washrooms, and peaceful atmosphere.
            </p>
          </div>

          {/* Gallery */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">

            {galleryPreview.map((item, idx) => (
              <div
                key={idx}
                onClick={() => openLightbox(idx)}
                className="
                  relative
                  h-56
                  sm:h-72
                  rounded-2xl
                  overflow-hidden
                  cursor-pointer
                  group
                  shadow-[0_8px_30px_rgba(36,31,27,0.08)]
                "
              >

                <img
                  src={item.url}
                  alt={item.title}
                  className="
                    w-full
                    h-full
                    object-cover
                    group-hover:scale-110
                    transition-transform
                    duration-700
                  "
                  loading="lazy"
                />

                {/* Hover overlay */}
                <div
                  className="
                    absolute
                    inset-0
                    bg-gradient-to-t
                    from-[#171411]/85
                    via-[#171411]/20
                    to-transparent
                    opacity-0
                    group-hover:opacity-100
                    transition-opacity
                    duration-400
                    p-5
                    flex
                    flex-col
                    justify-end
                  "
                >
                  <span
                    className="
                      text-[10px]
                      text-[#F4C542]
                      uppercase
                      font-bold
                      tracking-wider
                    "
                  >
                    {item.category}
                  </span>

                  <h4
                    className="
                      font-serif
                      text-base
                      sm:text-lg
                      font-bold
                      text-white
                      mt-1
                    "
                  >
                    {item.title}
                  </h4>
                </div>
              </div>
            ))}
          </div>

          {/* Gallery Button */}
          <div className="text-center mt-10">

            <Link
              to="/gallery"
              className="
                inline-flex
                items-center
                gap-2
                px-7
                py-3
                rounded-full
                border
                border-[#25211D]
                text-[#25211D]
                font-bold
                text-xs
                uppercase
                tracking-wider
                hover:bg-[#25211D]
                hover:text-[#F4C542]
                transition-all
                duration-300
              "
            >
              <span>View Full Photo Gallery</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================
          LOCATION
      ========================================================= */}
      <section
        className="
          py-20
          sm:py-24
          bg-[#25211D]
          text-white
          relative
          overflow-hidden
        "
      >

        {/* Decorative circles */}
        <div
          className="
            absolute
            -top-32
            -right-32
            w-96
            h-96
            rounded-full
            border
            border-[#C49A32]/10
          "
        />

        <div
          className="
            absolute
            -bottom-40
            -left-40
            w-96
            h-96
            rounded-full
            border
            border-[#C49A32]/10
          "
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* Text */}
            <div className="space-y-6">

              <div
                className="
                  inline-flex
                  items-center
                  gap-2
                  px-3
                  py-1.5
                  rounded-full
                  bg-[#C49A32]/15
                  text-[#F4C542]
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-wider
                  border
                  border-[#C49A32]/40
                "
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Prime Kurnool Location</span>
              </div>

              <h2
                className="
                  font-serif
                  text-3xl
                  sm:text-4xl
                  lg:text-5xl
                  font-bold
                  text-white
                  leading-tight
                "
              >
                Opposite Kurnool
                <br />
                <span className="text-[#E0B84D]">
                  New Bus Stand
                </span>
              </h2>

              <p
                className="
                  text-white/70
                  text-sm
                  sm:text-base
                  leading-relaxed
                  max-w-xl
                "
              >
                Aahvaanam provides immediate access for bus
                travelers, students visiting examination centers,
                families attending functions, and business visitors
                in Kurnool City.
              </p>

              {/* Benefits */}
              <div className="space-y-3 pt-2">

                {[
                  'Right opposite Kurnool New Bus Stand — zero travel hassle.',
                  'Auto stands, food courts, and medical stores within immediate reach.',
                  '24/7 check-in assistance and welcoming staff.',
                ].map((text, index) => (
                  <div
                    key={index}
                    className="
                      flex
                      items-start
                      gap-3
                      text-sm
                      text-white/85
                    "
                  >
                    <CheckCircle2
                      className="
                        w-5
                        h-5
                        text-[#E0B84D]
                        shrink-0
                        mt-0.5
                      "
                    />

                    <span>{text}</span>
                  </div>
                ))}
              </div>

              {/* Buttons */}
              <div className="flex flex-wrap gap-4 pt-4">

                <a
                  href={settings.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    inline-flex
                    items-center
                    gap-2
                    px-6
                    py-3
                    rounded-full
                    bg-gradient-to-r
                    from-[#F4C542]
                    to-[#C49A32]
                    text-[#171411]
                    font-bold
                    text-xs
                    uppercase
                    tracking-wider
                    shadow-[0_8px_25px_rgba(196,154,50,0.25)]
                    hover:brightness-110
                    hover:-translate-y-1
                    transition-all
                    duration-300
                  "
                >
                  <span>GET DIRECTIONS</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <a
                  href={`tel:${phoneNumber}`}
                  className="
                    inline-flex
                    items-center
                    gap-2
                    px-6
                    py-3
                    rounded-full
                    border
                    border-white/40
                    text-white
                    hover:border-[#E0B84D]
                    hover:text-[#F4C542]
                    hover:bg-white/5
                    font-bold
                    text-xs
                    uppercase
                    tracking-wider
                    transition-all
                    duration-300
                  "
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>CALL HOTEL</span>
                </a>
              </div>
            </div>

            {/* Map */}
            <div
              className="
                rounded-3xl
                overflow-hidden
                border
                border-[#C49A32]/40
                bg-[#171411]
                p-3
                shadow-[0_25px_70px_rgba(0,0,0,0.25)]
              "
            >
              <div
                className="
                  rounded-2xl
                  overflow-hidden
                  h-80
                  sm:h-[430px]
                  relative
                  bg-gray-900
                "
              >
                <iframe
                  title="Aahvaanam Location Map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3844.757827878841!2d78.033!3d15.828!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bb5e7a9e0f6b7c5%3A0x6b!2sKurnool+New+Bus+Stand!5e0!3m2!1sen!2sin!4v1600000000000"
                  className="w-full h-full border-0"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          TESTIMONIALS
      ========================================================= */}
      <section className="py-20 sm:py-24 bg-[#FCFAF5]">

        <div
          className="
            max-w-5xl
            mx-auto
            px-4
            sm:px-6
            lg:px-8
            text-center
          "
        >

          <span
            className="
              text-[10px]
              uppercase
              font-bold
              tracking-[0.25em]
              text-[#A57A1F]
            "
          >
            Guest Experiences
          </span>

          <h2
            className="
              font-serif
              text-3xl
              sm:text-4xl
              font-bold
              text-[#25211D]
              mt-3
            "
          >
            What Our Guests Say
          </h2>

          <div className="flex items-center justify-center gap-3 mt-5">
            <div className="w-16 h-px bg-gradient-to-r from-transparent to-[#C49A32]" />
            <Sparkles className="w-4 h-4 text-[#C49A32]" />
            <div className="w-16 h-px bg-gradient-to-l from-transparent to-[#C49A32]" />
          </div>

          {/* Review Placeholder */}
          <div
            className="
              mt-10
              bg-white
              rounded-3xl
              p-8
              sm:p-12
              border
              border-[#E3DBCF]
              shadow-[0_15px_50px_rgba(36,31,27,0.07)]
              max-w-xl
              mx-auto
            "
          >

            <div className="flex justify-center gap-1 text-[#C49A32]">

              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-5 h-5 fill-[#C49A32]"
                />
              ))}
            </div>

            <p
              className="
                font-serif
                italic
                text-lg
                sm:text-xl
                text-[#514941]
                mt-5
              "
            >
              “Guest reviews will appear here.”
            </p>

            <p
              className="
                text-xs
                text-[#918980]
                mt-4
                leading-relaxed
              "
            >
              We look forward to welcoming you to
              Aahvaanam – Luxury Rooms. Share your stay
              experience with our front desk!
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================
          FINAL BOOKING CTA
      ========================================================= */}
      <section
        className="
          relative
          py-20
          overflow-hidden
          bg-gradient-to-br
          from-[#F7F3EA]
          via-[#FCFAF5]
          to-[#EDE5D6]
        "
      >

        <div
          className="
            absolute
            inset-0
            bg-[radial-gradient(circle_at_center,rgba(196,154,50,0.12),transparent_55%)]
          "
        />

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">

          <span
            className="
              text-[10px]
              uppercase
              tracking-[0.25em]
              font-bold
              text-[#A57A1F]
            "
          >
            Your Stay Awaits
          </span>

          <h2
            className="
              mt-3
              font-serif
              text-3xl
              sm:text-5xl
              font-bold
              text-[#25211D]
            "
          >
            Make Aahvaanam Your
            <span className="block text-[#A57A1F]">
              Home in Kurnool
            </span>
          </h2>

          <p
            className="
              max-w-2xl
              mx-auto
              mt-5
              text-sm
              sm:text-base
              text-[#6F675E]
              leading-relaxed
            "
          >
            Reserve your room today and experience spacious,
            comfortable and hygienic accommodation in a
            convenient location.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mt-8">

            <Link
              to="/booking"
              className="
                inline-flex
                items-center
                gap-2
                px-8
                py-3.5
                rounded-full
                bg-gradient-to-r
                from-[#F4C542]
                via-[#D4A72C]
                to-[#B8860B]
                text-[#171411]
                font-extrabold
                text-sm
                uppercase
                tracking-wider
                shadow-[0_10px_30px_rgba(196,154,50,0.28)]
                hover:-translate-y-1
                hover:brightness-110
                transition-all
                duration-300
              "
            >
              <Calendar className="w-5 h-5" />
              BOOK YOUR STAY
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href={`tel:${phoneNumber}`}
              className="
                inline-flex
                items-center
                gap-2
                px-7
                py-3.5
                rounded-full
                border-2
                border-[#25211D]
                text-[#25211D]
                font-bold
                text-sm
                uppercase
                tracking-wider
                hover:bg-[#25211D]
                hover:text-[#F4C542]
                transition-all
                duration-300
              "
            >
              <Phone className="w-4 h-4" />
              CALL HOTEL
            </a>
          </div>
        </div>
      </section>

      {/* =========================================================
          LIGHTBOX
      ========================================================= */}
      <Lightbox
        images={galleryPreview.map((g) => g.url)}
        currentIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onPrev={() =>
          setLightboxIndex((prev) =>
            prev > 0
              ? prev - 1
              : galleryPreview.length - 1
          )
        }
        onNext={() =>
          setLightboxIndex((prev) =>
            prev < galleryPreview.length - 1
              ? prev + 1
              : 0
          )
        }
        title={galleryPreview[lightboxIndex]?.title}
      />

      {/* =========================================================
          ANIMATIONS
      ========================================================= */}
      <style>
        {`
          @keyframes heroZoom {
            0% {
              transform: scale(1.03);
            }

            100% {
              transform: scale(1.10);
            }
          }

          @keyframes fadeUp {
            from {
              opacity: 0;
              transform: translateY(24px);
            }

            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </div>
  );
};