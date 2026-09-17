import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  Users,
  Home,
  Search,
  AlertCircle,
} from 'lucide-react';

interface SearchWidgetProps {
  initialCheckIn?: string;
  initialCheckOut?: string;
  initialGuests?: number;
  initialRoomType?: string;
  onSearch?: (params: {
    checkIn: string;
    checkOut: string;
    guests: number;
    roomType: string;
  }) => void;
  compact?: boolean;
}

export const SearchWidget: React.FC<SearchWidgetProps> = ({
  initialCheckIn,
  initialCheckOut,
  initialGuests = 1,
  initialRoomType = 'ALL',
  onSearch,
  compact = false,
}) => {
  const navigate = useNavigate();

  const getTomorrowDate = (dateStr: string) => {
    const d = new Date(dateStr);
    d.setDate(d.getDate() + 1);
    return d.toISOString().slice(0, 10);
  };

  const todayStr = new Date().toISOString().slice(0, 10);

  const defaultCheckIn = initialCheckIn || todayStr;
  const defaultCheckOut =
    initialCheckOut || getTomorrowDate(defaultCheckIn);

  const [checkIn, setCheckIn] = useState(defaultCheckIn);
  const [checkOut, setCheckOut] = useState(defaultCheckOut);
  const [guests, setGuests] = useState(initialGuests);
  const [roomType, setRoomType] = useState(initialRoomType);
  const [error, setError] = useState<string | null>(null);

  const handleCheckInChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newCheckIn = e.target.value;

    setCheckIn(newCheckIn);
    setError(null);

    if (newCheckIn >= checkOut) {
      setCheckOut(getTomorrowDate(newCheckIn));
    }
  };

  const handleCheckOutChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newCheckOut = e.target.value;

    if (newCheckOut <= checkIn) {
      setError(
        'Check-out date must be after check-in date.'
      );
    } else {
      setError(null);
    }

    setCheckOut(newCheckOut);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (checkIn < todayStr) {
      setError(
        'Check-in date cannot be in the past.'
      );
      return;
    }

    if (checkOut <= checkIn) {
      setError(
        'Check-out date must be strictly after check-in date.'
      );
      return;
    }

    setError(null);

    const searchParams = {
      checkIn,
      checkOut,
      guests,
      roomType: roomType === 'ALL' ? '' : roomType,
    };

    if (onSearch) {
      onSearch(searchParams);
    } else {
      const q = new URLSearchParams({
        checkIn,
        checkOut,
        guests: String(guests),
        ...(roomType !== 'ALL' ? { roomType } : {}),
      });

      navigate(`/booking?${q.toString()}`);
    }
  };

  return (
    <div
      className={`w-full ${
        compact
          ? ''
          : `
            bg-[#171411]/95
            backdrop-blur-lg
            rounded-2xl
            p-4
            sm:p-6
            border-2
            border-[#D4A72C]/70
            shadow-[0_20px_60px_rgba(0,0,0,0.45)]
          `
      }`}
    >
      <form onSubmit={handleSearch}>
        <div
          className={`
            grid
            grid-cols-1
            sm:grid-cols-2
            ${compact ? 'lg:grid-cols-4' : 'lg:grid-cols-5'}
            gap-4
            items-end
          `}
        >

          {/* =========================
              CHECK-IN
          ========================== */}
          <div className="space-y-1.5">
            <label
              className="
                text-xs
                uppercase
                tracking-wider
                font-extrabold
                text-[#F4C542]
                flex
                items-center
              "
            >
              <Calendar className="w-4 h-4 mr-1.5 text-[#F4C542]" />
              Check-In Date
            </label>

            <input
              type="date"
              min={todayStr}
              value={checkIn}
              onChange={handleCheckInChange}
              required
              className="
                w-full
                h-[50px]
                bg-[#FFFDF8]
                text-[#171411]
                px-3.5
                py-2.5
                rounded-xl
                border-2
                border-[#D4A72C]/50
                focus:outline-none
                focus:border-[#D4A72C]
                focus:ring-2
                focus:ring-[#D4A72C]/30
                font-semibold
                text-sm
                shadow-inner
                placeholder:text-[#55504A]
              "
            />
          </div>

          {/* =========================
              CHECK-OUT
          ========================== */}
          <div className="space-y-1.5">
            <label
              className="
                text-xs
                uppercase
                tracking-wider
                font-extrabold
                text-[#F4C542]
                flex
                items-center
              "
            >
              <Calendar className="w-4 h-4 mr-1.5 text-[#F4C542]" />
              Check-Out Date
            </label>

            <input
              type="date"
              min={getTomorrowDate(checkIn)}
              value={checkOut}
              onChange={handleCheckOutChange}
              required
              className="
                w-full
                h-[50px]
                bg-[#FFFDF8]
                text-[#171411]
                px-3.5
                py-2.5
                rounded-xl
                border-2
                border-[#D4A72C]/50
                focus:outline-none
                focus:border-[#D4A72C]
                focus:ring-2
                focus:ring-[#D4A72C]/30
                font-semibold
                text-sm
                shadow-inner
              "
            />
          </div>

          {/* =========================
              GUESTS
          ========================== */}
          <div className="space-y-1.5">
            <label
              className="
                text-xs
                uppercase
                tracking-wider
                font-extrabold
                text-[#F4C542]
                flex
                items-center
              "
            >
              <Users className="w-4 h-4 mr-1.5 text-[#F4C542]" />
              Guests
            </label>

            <select
              value={guests}
              onChange={(e) =>
                setGuests(Number(e.target.value))
              }
              className="
                w-full
                h-[50px]
                bg-[#FFFDF8]
                text-[#171411]
                px-3.5
                py-2.5
                rounded-xl
                border-2
                border-[#D4A72C]/50
                focus:outline-none
                focus:border-[#D4A72C]
                focus:ring-2
                focus:ring-[#D4A72C]/30
                font-semibold
                text-sm
                cursor-pointer
              "
            >
              <option value={1}>1 Guest</option>
              <option value={2}>2 Guests</option>
              <option value={3}>3 Guests</option>
              <option value={4}>4 Guests</option>
              <option value={5}>
                5+ Guests (Family)
              </option>
            </select>
          </div>

          {/* =========================
              ROOM TYPE
          ========================== */}
          <div className="space-y-1.5">
            <label
              className="
                text-xs
                uppercase
                tracking-wider
                font-extrabold
                text-[#F4C542]
                flex
                items-center
              "
            >
              <Home className="w-4 h-4 mr-1.5 text-[#F4C542]" />
              Room Type
            </label>

            <select
              value={roomType}
              onChange={(e) =>
                setRoomType(e.target.value)
              }
              className="
                w-full
                h-[50px]
                bg-[#FFFDF8]
                text-[#171411]
                px-3.5
                py-2.5
                rounded-xl
                border-2
                border-[#D4A72C]/50
                focus:outline-none
                focus:border-[#D4A72C]
                focus:ring-2
                focus:ring-[#D4A72C]/30
                font-semibold
                text-sm
                cursor-pointer
              "
            >
              <option value="ALL">
                All Room Types
              </option>

              <option value="Deluxe AC Room">
                Deluxe AC Room
              </option>

              <option value="Premium AC Room">
                Premium AC Room
              </option>

              <option value="Family Room">
                Family Room
              </option>
            </select>
          </div>

          {/* =========================
              CHECK AVAILABILITY
          ========================== */}
          <div
            className="
              sm:col-span-2
              lg:col-span-1
              pt-2
              sm:pt-0
            "
          >
            <button
              type="submit"
              className="
                w-full
                h-[50px]
                px-4
                rounded-xl

                bg-gradient-to-r
                from-[#F4C542]
                via-[#D4A72C]
                to-[#B8860B]

                text-[#171411]

                font-black
                text-xs
                sm:text-sm

                tracking-wider
                uppercase

                border-2
                border-[#F4C542]

                shadow-[0_8px_25px_rgba(212,167,44,0.35)]

                hover:brightness-110
                hover:shadow-[0_10px_30px_rgba(212,167,44,0.5)]

                active:scale-[0.98]

                transition-all
                duration-200

                flex
                items-center
                justify-center
                gap-2
              "
            >
              <Search
                className="
                  w-4
                  h-4
                  shrink-0
                  text-[#171411]
                "
              />

              <span className="text-[#171411] font-black">
                CHECK AVAILABILITY
              </span>
            </button>
          </div>
        </div>

        {/* =========================
            ERROR MESSAGE
        ========================== */}
        {error && (
          <div
            className="
              mt-4
              flex
              items-center
              text-sm
              font-semibold
              text-[#FFE4E4]
              bg-[#5A0710]
              px-4
              py-3
              rounded-xl
              border
              border-[#F87171]/60
              shadow-lg
            "
          >
            <AlertCircle
              className="
                w-4
                h-4
                mr-2
                shrink-0
                text-[#FCA5A5]
              "
            />

            <span>{error}</span>
          </div>
        )}
      </form>
    </div>
  );
};
