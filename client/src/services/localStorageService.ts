import { Room, Booking, Settings, GalleryItem, Enquiry, AdminUser, DashboardStats } from '../types';

// Storage Keys
export const STORAGE_KEYS = {
  ROOMS: 'aahvaanam_rooms',
  BOOKINGS: 'aahvaanam_bookings',
  ADMIN: 'aahvaanam_admin',
  SETTINGS: 'aahvaanam_settings',
  GALLERY: 'aahvaanam_gallery',
  ENQUIRIES: 'aahvaanam_enquiries'
} as const;

// Default Hotel Settings
export const DEFAULT_SETTINGS: Settings = {
  hotelName: 'Aahvaanam – Luxury Rooms',
  phone: '+91 96402 89999',
  whatsappNumber: '919640289999',
  location: 'Opp: Kurnool New Bus Stand, Kurnool City, Andhra Pradesh, India',
  landmark: 'Near Kurnool New Bus Stand',
  address: 'Opposite New Bus Stand, Kurnool City, Andhra Pradesh 518003',
  googleMapsUrl: 'https://maps.google.com/?q=Kurnool+New+Bus+Stand',
  instagramUrl: 'https://instagram.com/aahvaanam_hotel',
  facebookUrl: '',
  checkInTime: '12:00 PM',
  checkOutTime: '11:00 AM',
  bookingInstructions:
    'Please carry a valid government photo ID card (Aadhaar / Driving License / Passport) at check-in.',
  contactMessage:
    'Spacious. Comfortable. Clean. Feel at Home. Ideal for students, families, professionals and travellers visiting Kurnool.'
};

// Default Realistic Hotel Rooms
export const DEFAULT_ROOMS: Room[] = [
  {
    _id: 'room-101',
    roomNumber: '101',
    roomType: 'Deluxe Room',
    title: 'Deluxe Room 101',
    description:
      'Elegantly furnished double bedroom with premium mattress, blue padded headboard, clean linen, wall-mounted LED TV, 24/7 hot water, and lift facility.',
    amenities: [
      'A/C Room',
      'High-Speed WiFi',
      '24 Hrs. Hot Water',
      'RO Purified Water',
      'Lift Facility',
      'Attached Luxury Bathroom',
      'Wall-Mounted LED TV'
    ],
    images: [
      '/images/rooms/room_deluxe_double_bed.jpg',
      '/images/rooms/room_modern_bathroom.jpg',
      '/images/rooms/room_deluxe_tv_console.jpg'
    ],
    price: 2500,
    maxGuests: 2,
    status: 'AVAILABLE',
    isActive: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z'
  },
  {
    _id: 'room-102',
    roomNumber: '102',
    roomType: 'Premium Room',
    title: 'Premium Room 102',
    description:
      'Spacious room featuring modern false ceiling with ambient cove lighting, large mirrored wooden wardrobes, study desk, AC, and high-pressure shower.',
    amenities: [
      'A/C Room',
      'High-Speed WiFi',
      'Ambient Cove Lighting & False Ceiling',
      '24 Hrs. Hot Water',
      'RO Purified Water',
      'Spacious Wardrobes',
      'Lift Facility',
      'Modern Grey-Tiled Bathroom'
    ],
    images: [
      '/images/rooms/room_premium_master_bedroom.jpg',
      '/images/rooms/room_modern_bathroom.jpg',
      '/images/rooms/room_ac_curtains_tv.jpg'
    ],
    price: 3500,
    maxGuests: 3,
    status: 'AVAILABLE',
    isActive: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z'
  },
  {
    _id: 'room-103',
    roomNumber: '103',
    roomType: 'Family Suite',
    title: 'Family Suite 103',
    description:
      'Grand family room with expansive floor space, multiple wardrobes, dressing unit, writing desk, and comfortable arrangements for larger groups or families.',
    amenities: [
      'A/C Room',
      'High-Speed WiFi',
      'Extra Space for Family',
      '24 Hrs. Hot Water',
      'RO Purified Water',
      'Full Length Wardrobes',
      'Lift Facility',
      'Attached Luxury Bathroom'
    ],
    images: [
      '/images/rooms/room_spacious_suite_wardrobe.jpg',
      '/images/rooms/room_deluxe_double_bed.jpg',
      '/images/rooms/room_corridor_entrance.jpg',
      '/images/rooms/room_modern_bathroom.jpg'
    ],
    price: 5000,
    maxGuests: 5,
    status: 'AVAILABLE',
    isActive: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z'
  },
  {
    _id: 'room-104',
    roomNumber: '104',
    roomType: 'Luxury Suite',
    title: 'Luxury Suite 104',
    description:
      'Supreme luxury accommodation with exquisite interior styling, plush seating, vanity dressing area, master ensuite bath, and panoramic property perspective.',
    amenities: [
      'A/C Room',
      'High-Speed WiFi',
      'Vanity Dressing Area',
      '24 Hrs. Hot Water',
      'Premium Linen & Bedding',
      'Lift Facility',
      'Attached Luxury Bathroom'
    ],
    images: [
      '/images/rooms/room_deluxe_angle_bed.jpg',
      '/images/rooms/room_wash_basin_vanity.jpg',
      '/images/rooms/room_premium_master_bedroom.jpg',
      '/images/rooms/room_modern_bathroom.jpg'
    ],
    price: 6500,
    maxGuests: 4,
    status: 'AVAILABLE',
    isActive: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z'
  }
];

// Default Gallery Items
export const DEFAULT_GALLERY: GalleryItem[] = [
  {
    _id: 'gal-1',
    title: 'Premium Master Bedroom with Cove Lighting',
    imageUrl: '/images/rooms/room_premium_master_bedroom.jpg',
    category: 'ROOMS',
    isCover: true,
    order: 1,
    createdAt: '2026-01-01T00:00:00.000Z'
  },
  {
    _id: 'gal-2',
    title: 'Deluxe Double Bed with Padded Headboard',
    imageUrl: '/images/rooms/room_deluxe_double_bed.jpg',
    category: 'ROOMS',
    isCover: false,
    order: 2,
    createdAt: '2026-01-01T00:00:00.000Z'
  },
  {
    _id: 'gal-3',
    title: 'Modern Luxury Grey-Tiled Bathroom with Health Faucet',
    imageUrl: '/images/rooms/room_modern_bathroom.jpg',
    category: 'BATHROOM',
    isCover: false,
    order: 3,
    createdAt: '2026-01-01T00:00:00.000Z'
  },
  {
    _id: 'gal-4',
    title: 'Spacious Suite with Wardrobes & Dressing Area',
    imageUrl: '/images/rooms/room_spacious_suite_wardrobe.jpg',
    category: 'ROOMS',
    isCover: false,
    order: 4,
    createdAt: '2026-01-01T00:00:00.000Z'
  },
  {
    _id: 'gal-5',
    title: 'Marble-Textured Corridor & Room Entrance',
    imageUrl: '/images/rooms/room_corridor_entrance.jpg',
    category: 'PROPERTY',
    isCover: false,
    order: 5,
    createdAt: '2026-01-01T00:00:00.000Z'
  },
  {
    _id: 'gal-6',
    title: 'Room Vanity & Wash Basin Area',
    imageUrl: '/images/rooms/room_wash_basin_vanity.jpg',
    category: 'FACILITIES',
    isCover: false,
    order: 6,
    createdAt: '2026-01-01T00:00:00.000Z'
  },
  {
    _id: 'gal-7',
    title: 'Comfortable Deluxe Bedroom Perspective',
    imageUrl: '/images/rooms/room_deluxe_angle_bed.jpg',
    category: 'ROOMS',
    isCover: false,
    order: 7,
    createdAt: '2026-01-01T00:00:00.000Z'
  },
  {
    _id: 'gal-8',
    title: 'Wall Mounted LED TV and Media Console',
    imageUrl: '/images/rooms/room_deluxe_tv_console.jpg',
    category: 'FACILITIES',
    isCover: false,
    order: 8,
    createdAt: '2026-01-01T00:00:00.000Z'
  },
  {
    _id: 'gal-9',
    title: 'Chilled Air Conditioning & Pleated Curtains',
    imageUrl: '/images/rooms/room_ac_curtains_tv.jpg',
    category: 'FACILITIES',
    isCover: false,
    order: 9,
    createdAt: '2026-01-01T00:00:00.000Z'
  },
  {
    _id: 'gal-10',
    title: 'Aahvaanam Official Poster & Amenities Banner',
    imageUrl: '/images/aahvaanam-poster.png',
    category: 'EXTERIOR',
    isCover: false,
    order: 10,
    createdAt: '2026-01-01T00:00:00.000Z'
  }
];

// Seed initial demo bookings for rich dashboard experience
export const DEFAULT_BOOKINGS: Booking[] = [
  {
    _id: 'book-seed-001',
    bookingReference: 'AAH-20260920-001',
    customer: {
      _id: 'cust-1',
      name: 'Ramesh Reddy',
      phone: '9848012345',
      email: 'ramesh.reddy@example.com',
      createdAt: '2026-09-10T10:00:00.000Z'
    },
    room: DEFAULT_ROOMS[1], // Premium Room
    checkIn: '2026-09-20',
    checkOut: '2026-09-22',
    guests: 2,
    specialRequest: 'Late check-in around 8 PM. Please keep room ready.',
    status: 'CONFIRMED',
    paymentStatus: 'PAID',
    totalAmount: 7000,
    createdAt: '2026-09-10T10:00:00.000Z',
    updatedAt: '2026-09-10T10:00:00.000Z'
  },
  {
    _id: 'book-seed-002',
    bookingReference: 'AAH-20260925-002',
    customer: {
      _id: 'cust-2',
      name: 'K. Venkatesh',
      phone: '9988776655',
      email: 'venkat@example.com',
      createdAt: '2026-09-12T14:30:00.000Z'
    },
    room: DEFAULT_ROOMS[2], // Family Suite
    checkIn: '2026-09-25',
    checkOut: '2026-09-28',
    guests: 4,
    specialRequest: 'Need extra mattress and hot water flask for children.',
    status: 'PENDING',
    paymentStatus: 'PENDING',
    totalAmount: 15000,
    createdAt: '2026-09-12T14:30:00.000Z',
    updatedAt: '2026-09-12T14:30:00.000Z'
  }
];

// Helper: Safe JSON Parse
function safeJsonParse<T>(jsonStr: string | null, fallback: T): T {
  if (!jsonStr) return fallback;
  try {
    return JSON.parse(jsonStr) as T;
  } catch (err) {
    console.warn('[LocalStorageService] Failed to parse JSON, falling back:', err);
    return fallback;
  }
}

// Helper: Safe LocalStorage Read & Write
function getItem<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    return safeJsonParse<T>(raw, fallback);
  } catch (err) {
    console.error(`[LocalStorageService] Error reading key "${key}":`, err);
    return fallback;
  }
}

function setItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`[LocalStorageService] Error writing key "${key}":`, err);
  }
}

// Generate unique booking reference: e.g. AAH-20260916-001
export function generateBookingReference(dateStr?: string): string {
  const datePart = (dateStr ? new Date(dateStr) : new Date())
    .toISOString()
    .slice(0, 10)
    .replace(/-/g, '');
  const randomPart = Math.floor(100 + Math.random() * 900);
  return `AAH-${datePart}-${randomPart}`;
}

export class LocalStorageService {
  // Initialization & Auto-seed
  static initialize(): void {
    if (typeof window === 'undefined') return;

    // Seed Rooms
    if (!localStorage.getItem(STORAGE_KEYS.ROOMS)) {
      setItem(STORAGE_KEYS.ROOMS, DEFAULT_ROOMS);
    }

    // Seed Bookings
    if (!localStorage.getItem(STORAGE_KEYS.BOOKINGS)) {
      setItem(STORAGE_KEYS.BOOKINGS, DEFAULT_BOOKINGS);
    }

    // Seed Settings
    if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
      setItem(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
    }

    // Seed Gallery
    if (!localStorage.getItem(STORAGE_KEYS.GALLERY)) {
      setItem(STORAGE_KEYS.GALLERY, DEFAULT_GALLERY);
    }
  }

  // ================= ROOMS =================
  static getRooms(): Room[] {
    this.initialize();
    const rooms = getItem<Room[]>(STORAGE_KEYS.ROOMS, DEFAULT_ROOMS);
    return Array.isArray(rooms) && rooms.length > 0 ? rooms : DEFAULT_ROOMS;
  }

  static saveRooms(rooms: Room[]): void {
    setItem(STORAGE_KEYS.ROOMS, rooms);
  }

  static getRoomById(id: string): Room | null {
    const rooms = this.getRooms();
    return rooms.find((r) => r._id === id || r.roomNumber === id) || null;
  }

  static saveRoom(room: Partial<Room> & { _id?: string; roomNumber: string }): Room {
    const rooms = this.getRooms();
    const now = new Date().toISOString();
    const id = room._id || `room-${room.roomNumber}-${Date.now()}`;

    const existingIndex = rooms.findIndex((r) => r._id === id);
    let savedRoom: Room;

    if (existingIndex >= 0) {
      savedRoom = {
        ...rooms[existingIndex],
        ...room,
        _id: id,
        updatedAt: now
      };
      rooms[existingIndex] = savedRoom;
    } else {
      savedRoom = {
        _id: id,
        roomNumber: room.roomNumber,
        roomType: room.roomType || 'Deluxe Room',
        title: room.title || `Room ${room.roomNumber}`,
        description: room.description || '',
        amenities: room.amenities || [],
        images: room.images && room.images.length > 0 ? room.images : ['/images/rooms/room_deluxe_double_bed.jpg'],
        price: room.price || 2500,
        maxGuests: room.maxGuests || 2,
        status: room.status || 'AVAILABLE',
        isActive: room.isActive !== undefined ? room.isActive : true,
        createdAt: now,
        updatedAt: now
      };
      rooms.push(savedRoom);
    }

    this.saveRooms(rooms);
    return savedRoom;
  }

  static deleteRoom(id: string): void {
    const rooms = this.getRooms();
    const filtered = rooms.filter((r) => r._id !== id);
    this.saveRooms(filtered);
  }

  // ================= BOOKINGS =================
  static getBookings(): Booking[] {
    this.initialize();
    const bookings = getItem<Booking[]>(STORAGE_KEYS.BOOKINGS, DEFAULT_BOOKINGS);
    return Array.isArray(bookings) ? bookings : DEFAULT_BOOKINGS;
  }

  static saveBookings(bookings: Booking[]): void {
    setItem(STORAGE_KEYS.BOOKINGS, bookings);
  }

  static getBookingById(id: string): Booking | null {
    const bookings = this.getBookings();
    return bookings.find((b) => b._id === id || b.bookingReference === id) || null;
  }

  static getBookingByReference(reference: string): Booking | null {
    const bookings = this.getBookings();
    const cleanRef = reference.trim().toUpperCase();
    return bookings.find((b) => b.bookingReference.toUpperCase() === cleanRef || b._id === reference) || null;
  }

  static createBooking(data: {
    roomId: string;
    guestName: string;
    phone: string;
    email?: string;
    checkIn: string;
    checkOut: string;
    guests: number;
    specialRequest?: string;
    totalAmount?: number | null;
  }): Booking {
    const room = this.getRoomById(data.roomId);
    if (!room) {
      throw new Error('Selected room does not exist.');
    }

    // Availability validation check
    const isAvailable = this.isRoomAvailable(room._id, data.checkIn, data.checkOut);
    if (!isAvailable) {
      throw new Error('This room is no longer available for the selected dates. Please select another room.');
    }

    // Calculate total price if not provided
    const nights = Math.max(
      1,
      Math.ceil(Math.abs(new Date(data.checkOut).getTime() - new Date(data.checkIn).getTime()) / (1000 * 60 * 60 * 24))
    );
    const totalAmount = data.totalAmount !== undefined ? data.totalAmount : (room.price ? room.price * nights : 2500 * nights);

    const now = new Date().toISOString();
    const bookingId = `book-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
    const reference = generateBookingReference(data.checkIn);

    const newBooking: Booking = {
      _id: bookingId,
      bookingReference: reference,
      customer: {
        _id: `cust-${Date.now()}`,
        name: data.guestName,
        phone: data.phone,
        email: data.email || undefined,
        createdAt: now
      },
      room,
      checkIn: data.checkIn,
      checkOut: data.checkOut,
      guests: data.guests,
      specialRequest: data.specialRequest || '',
      status: 'CONFIRMED', // Confirmed directly for smooth demo flow
      paymentStatus: 'PENDING',
      totalAmount,
      createdAt: now,
      updatedAt: now
    };

    const bookings = this.getBookings();
    bookings.unshift(newBooking);
    this.saveBookings(bookings);

    return newBooking;
  }

  static updateBooking(id: string, updates: Partial<Booking>): Booking {
    const bookings = this.getBookings();
    const index = bookings.findIndex((b) => b._id === id || b.bookingReference === id);
    if (index === -1) {
      throw new Error(`Booking ${id} not found.`);
    }

    const updatedBooking: Booking = {
      ...bookings[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    bookings[index] = updatedBooking;
    this.saveBookings(bookings);
    return updatedBooking;
  }

  static deleteBooking(id: string): void {
    const bookings = this.getBookings();
    const filtered = bookings.filter((b) => b._id !== id && b.bookingReference !== id);
    this.saveBookings(filtered);
  }

  static clearBookings(): void {
    this.saveBookings([]);
  }

  static getMostRecentBooking(): Booking | null {
    const bookings = this.getBookings();
    return bookings.length > 0 ? bookings[0] : null;
  }

  // ================= AVAILABILITY ENGINE =================
  /**
   * Overlap rule:
   * Two date ranges overlap when:
   * requestedCheckIn < existingCheckOut AND requestedCheckOut > existingCheckIn
   * Any booking with status != 'CANCELLED' marks the room as booked.
   */
  static isDateRangeOverlapping(reqIn: string, reqOut: string, existIn: string, existOut: string): boolean {
    const rIn = reqIn.slice(0, 10);
    const rOut = reqOut.slice(0, 10);
    const eIn = existIn.slice(0, 10);
    const eOut = existOut.slice(0, 10);

    return rIn < eOut && rOut > eIn;
  }

  static isRoomAvailable(roomId: string, checkIn: string, checkOut: string, excludeBookingId?: string): boolean {
    const bookings = this.getBookings();

    const overlappingBooking = bookings.find((b) => {
      if (b.status === 'CANCELLED') return false;
      if (excludeBookingId && (b._id === excludeBookingId || b.bookingReference === excludeBookingId)) return false;
      if (b.room?._id !== roomId && b.room?.roomNumber !== roomId) return false;

      return this.isDateRangeOverlapping(checkIn, checkOut, b.checkIn, b.checkOut);
    });

    return !overlappingBooking;
  }

  static checkAvailability(
    checkIn: string,
    checkOut: string,
    guests: number = 1,
    roomType?: string
  ) {
    const allRooms = this.getRooms();
    const bookings = this.getBookings();

    // Active physical rooms
    const activeRooms = allRooms.filter((r) => r.isActive && r.status !== 'INACTIVE');

    // Categorize rooms into available and unavailable
    const availablePhysicalRooms: Room[] = [];
    const unavailablePhysicalRooms: Array<{ room: Room; conflictBooking: Booking }> = [];

    for (const room of activeRooms) {
      if (roomType && roomType !== 'ALL' && room.roomType !== roomType) {
        continue;
      }
      if (guests && room.maxGuests < guests) {
        continue;
      }

      const conflict = bookings.find((b) => {
        if (b.status === 'CANCELLED') return false;
        if (b.room?._id !== room._id && b.room?.roomNumber !== room.roomNumber) return false;
        return this.isDateRangeOverlapping(checkIn, checkOut, b.checkIn, b.checkOut);
      });

      if (conflict) {
        unavailablePhysicalRooms.push({ room, conflictBooking: conflict });
      } else {
        availablePhysicalRooms.push(room);
      }
    }

    // Aggregate room types availability
    const roomTypesMap = new Map<string, Room[]>();
    for (const room of activeRooms) {
      const list = roomTypesMap.get(room.roomType) || [];
      list.push(room);
      roomTypesMap.set(room.roomType, list);
    }

    const availableRoomTypes = Array.from(roomTypesMap.entries()).map(([type, roomsOfThisType]) => {
      const sample = roomsOfThisType[0];
      const availableRoomsForType = roomsOfThisType.filter((r) =>
        availablePhysicalRooms.some((avail) => avail._id === r._id)
      );

      return {
        roomType: type,
        title: sample.title,
        description: sample.description,
        amenities: sample.amenities,
        images: sample.images,
        price: sample.price,
        maxGuests: sample.maxGuests,
        availableCount: availableRoomsForType.length,
        totalRooms: roomsOfThisType.length,
        sampleRoomId: sample._id,
        availableRoomIds: availableRoomsForType.map((r) => r._id)
      };
    });

    return {
      checkIn,
      checkOut,
      availablePhysicalRooms,
      unavailablePhysicalRooms,
      availableRoomTypes
    };
  }

  // ================= ADMIN & DASHBOARD METRICS =================
  static getDashboardStats(): DashboardStats {
    const bookings = this.getBookings();
    const rooms = this.getRooms();
    const todayStr = new Date().toISOString().slice(0, 10);

    const totalBookings = bookings.length;
    const pendingBookings = bookings.filter((b) => b.status === 'PENDING').length;
    const confirmedBookings = bookings.filter((b) => b.status === 'CONFIRMED').length;
    const cancelledBookings = bookings.filter((b) => b.status === 'CANCELLED').length;
    const checkedInBookings = bookings.filter((b) => b.status === 'CHECKED_IN').length;

    // Total revenue from non-cancelled bookings
    const totalRevenue = bookings
      .filter((b) => b.status !== 'CANCELLED')
      .reduce((sum, b) => sum + (b.totalAmount || 0), 0);

    const todayCheckins = bookings.filter(
      (b) => b.status !== 'CANCELLED' && b.checkIn.slice(0, 10) === todayStr
    ).length;

    const todayCheckouts = bookings.filter(
      (b) => b.status !== 'CANCELLED' && b.checkOut.slice(0, 10) === todayStr
    ).length;

    const availableRooms = rooms.filter((r) => this.isRoomAvailable(r._id, todayStr, todayStr)).length;
    const occupiedRooms = rooms.length - availableRooms;

    const uniqueCustomers = new Set(bookings.map((b) => b.customer?.phone || b.customer?.name)).size;

    // Inventory status matrix for today
    const inventoryRooms = rooms.map((room) => {
      const activeBooking = bookings.find((b) => {
        if (b.status === 'CANCELLED') return false;
        if (b.room?._id !== room._id && b.room?.roomNumber !== room.roomNumber) return false;
        return todayStr >= b.checkIn.slice(0, 10) && todayStr < b.checkOut.slice(0, 10);
      });

      const liveStatus: 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE' | 'INACTIVE' =
        room.status === 'MAINTENANCE'
          ? 'MAINTENANCE'
          : room.status === 'INACTIVE'
          ? 'INACTIVE'
          : activeBooking
          ? 'OCCUPIED'
          : 'AVAILABLE';

      return {
        _id: room._id,
        roomNumber: room.roomNumber,
        roomType: room.roomType,
        title: room.title,
        price: room.price,
        maxGuests: room.maxGuests,
        baseStatus: room.status,
        liveStatus,
        activeBooking: activeBooking
          ? {
              bookingReference: activeBooking.bookingReference,
              guestName: activeBooking.customer?.name || 'Guest',
              phone: activeBooking.customer?.phone || '',
              status: activeBooking.status,
              checkIn: activeBooking.checkIn,
              checkOut: activeBooking.checkOut
            }
          : null
      };
    });

    const statusDistribution = [
      { name: 'Pending', value: pendingBookings, color: '#f59e0b' },
      { name: 'Confirmed', value: confirmedBookings, color: '#10b981' },
      { name: 'Checked In', value: checkedInBookings, color: '#3b82f6' },
      { name: 'Cancelled', value: cancelledBookings, color: '#ef4444' }
    ];

    const roomTypeDistribution = [
      { roomType: 'Deluxe Room', count: bookings.filter((b) => b.room?.roomType?.includes('Deluxe')).length },
      { roomType: 'Premium Room', count: bookings.filter((b) => b.room?.roomType?.includes('Premium')).length },
      { roomType: 'Family Suite', count: bookings.filter((b) => b.room?.roomType?.includes('Family')).length },
      { roomType: 'Luxury Suite', count: bookings.filter((b) => b.room?.roomType?.includes('Luxury')).length }
    ];

    return {
      kpis: {
        totalBookings,
        todayCheckins,
        todayCheckouts,
        pendingBookings,
        confirmedBookings,
        checkedInBookings,
        availableRooms,
        occupiedRooms,
        maintenanceRooms: rooms.filter((r) => r.status === 'MAINTENANCE').length,
        inactiveRooms: rooms.filter((r) => r.status === 'INACTIVE').length,
        totalRooms: rooms.length,
        weekBookings: totalBookings,
        monthBookings: totalBookings,
        yearBookings: totalBookings,
        totalCustomers: uniqueCustomers
      },
      todayInventory: {
        date: todayStr,
        summary: {
          total: rooms.length,
          available: availableRooms,
          occupied: occupiedRooms,
          maintenance: rooms.filter((r) => r.status === 'MAINTENANCE').length,
          inactive: rooms.filter((r) => r.status === 'INACTIVE').length
        },
        rooms: inventoryRooms
      },
      statusDistribution,
      roomTypeDistribution,
      upcomingCheckins: bookings.filter((b) => b.status === 'CONFIRMED' || b.status === 'PENDING').slice(0, 5),
      upcomingCheckouts: bookings.filter((b) => b.status === 'CHECKED_IN').slice(0, 5),
      recentBookings: bookings.slice(0, 6)
    };
  }

  // ================= ADMIN AUTHENTICATION =================
  static getAdminSession(): AdminUser | null {
    return getItem<AdminUser | null>(STORAGE_KEYS.ADMIN, null);
  }

  static loginAdmin(email: string, pass: string): AdminUser {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = pass.trim();

    // Standard demo credentials as required by spec
    if (
      (cleanEmail === 'admin@aahvaanam.com' && cleanPass === 'admin123') ||
      (cleanEmail === 'admin@aahvaanam.com' && cleanPass === 'AahvaanamAdmin2026!')
    ) {
      const adminUser: AdminUser = {
        _id: 'admin-01',
        id: 'admin-01',
        name: 'Aahvaanam General Manager',
        email: 'admin@aahvaanam.com',
        role: 'SUPER_ADMIN',
        isActive: true
      };

      setItem(STORAGE_KEYS.ADMIN, adminUser);
      return adminUser;
    }

    throw new Error('Invalid email or password. Use demo credentials: admin@aahvaanam.com / admin123');
  }

  static logoutAdmin(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.ADMIN);
    }
  }

  // ================= HOTEL SETTINGS =================
  static getSettings(): Settings {
    this.initialize();
    return getItem<Settings>(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
  }

  static saveSettings(settings: Partial<Settings>): Settings {
    const current = this.getSettings();
    const updated = { ...current, ...settings };
    setItem(STORAGE_KEYS.SETTINGS, updated);
    return updated;
  }

  // ================= GALLERY =================
  static getGallery(): GalleryItem[] {
    this.initialize();
    return getItem<GalleryItem[]>(STORAGE_KEYS.GALLERY, DEFAULT_GALLERY);
  }

  static saveGallery(items: GalleryItem[]): void {
    setItem(STORAGE_KEYS.GALLERY, items);
  }

  // ================= ENQUIRIES =================
  static getEnquiries(): Enquiry[] {
    return getItem<Enquiry[]>(STORAGE_KEYS.ENQUIRIES, [
      {
        _id: 'enq-1',
        name: 'K. Venkatesh',
        phone: '9988776655',
        email: 'venkat@example.com',
        message: 'Need 2 Deluxe rooms for family marriage function next month.',
        status: 'NEW',
        createdAt: '2026-09-10T09:00:00.000Z'
      }
    ]);
  }

  static createEnquiry(data: Partial<Enquiry>): Enquiry {
    const enquiries = this.getEnquiries();
    const newEnquiry: Enquiry = {
      _id: `enq-${Date.now()}`,
      name: data.name || 'Guest',
      phone: data.phone || '',
      email: data.email,
      checkIn: data.checkIn,
      checkOut: data.checkOut,
      guests: data.guests || 1,
      message: data.message || '',
      status: 'NEW',
      createdAt: new Date().toISOString()
    };
    enquiries.unshift(newEnquiry);
    setItem(STORAGE_KEYS.ENQUIRIES, enquiries);
    return newEnquiry;
  }

  static updateEnquiry(id: string, updates: Partial<Enquiry>): Enquiry {
    const enquiries = this.getEnquiries();
    const index = enquiries.findIndex((e) => e._id === id);
    if (index === -1) throw new Error('Enquiry not found');
    enquiries[index] = { ...enquiries[index], ...updates };
    setItem(STORAGE_KEYS.ENQUIRIES, enquiries);
    return enquiries[index];
  }

  static deleteEnquiry(id: string): void {
    const enquiries = this.getEnquiries();
    setItem(STORAGE_KEYS.ENQUIRIES, enquiries.filter((e) => e._id !== id));
  }

  // ================= DEMO CONTROLS =================
  static resetDemoData(): void {
    if (typeof window !== 'undefined') {
      setItem(STORAGE_KEYS.ROOMS, DEFAULT_ROOMS);
      setItem(STORAGE_KEYS.BOOKINGS, DEFAULT_BOOKINGS);
      setItem(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
      setItem(STORAGE_KEYS.GALLERY, DEFAULT_GALLERY);
    }
  }

  static createDemoBooking(): Booking {
    const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
    const dayAfter = new Date(Date.now() + 2 * 86400000).toISOString().slice(0, 10);

    return this.createBooking({
      roomId: 'room-101',
      guestName: 'Ravi Kumar',
      phone: '9876543210',
      email: 'ravi.kumar@example.com',
      checkIn: tomorrow,
      checkOut: dayAfter,
      guests: 2,
      specialRequest: 'Demo client booking reservation test.'
    });
  }
}

// Auto-initialize on file import
if (typeof window !== 'undefined') {
  LocalStorageService.initialize();
}
