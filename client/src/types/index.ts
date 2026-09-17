export type RoomType =
  | 'Deluxe Room'
  | 'Premium Room'
  | 'Family Suite'
  | 'Luxury Suite'
  | 'Deluxe AC Room'
  | 'Premium AC Room'
  | 'Family Room'
  | string;
export type RoomStatus = 'AVAILABLE' | 'MAINTENANCE' | 'INACTIVE';
export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CHECKED_IN' | 'CHECKED_OUT' | 'CANCELLED';
export type PaymentStatus = 'NOT_REQUIRED' | 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
export type GalleryCategory = 'ROOMS' | 'PROPERTY' | 'FACILITIES' | 'BATHROOM' | 'EXTERIOR' | 'NEARBY';
export type EnquiryStatus = 'NEW' | 'CONTACTED' | 'CLOSED';
export type AdminRole = 'SUPER_ADMIN' | 'ADMIN' | 'STAFF';

export interface Room {
  _id: string;
  roomNumber: string;
  roomType: RoomType;
  title: string;
  description: string;
  amenities: string[];
  images: string[];
  price?: number | null;
  maxGuests: number;
  status: RoomStatus;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  createdAt: string;
  totalBookings?: number;
  lastBookingDate?: string;
  lastBookingStatus?: string;
}

export interface Booking {
  _id: string;
  bookingReference: string;
  customer: Customer;
  room: Room;
  checkIn: string;
  checkOut: string;
  guests: number;
  specialRequest?: string;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  totalAmount?: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface RoomTypeAvailability {
  roomType: string;
  title: string;
  description: string;
  amenities: string[];
  images: string[];
  price?: number | null;
  maxGuests: number;
  availableCount: number;
  totalRooms: number;
  sampleRoomId: string;
  availableRoomIds: string[];
}

export interface AvailabilityResult {
  checkIn: string;
  checkOut: string;
  availablePhysicalRooms: Room[];
  availableRoomTypes: RoomTypeAvailability[];
}

export interface GalleryItem {
  _id: string;
  title: string;
  imageUrl: string;
  category: GalleryCategory;
  isCover: boolean;
  order: number;
  createdAt: string;
}

export interface Enquiry {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  message: string;
  status: EnquiryStatus;
  notes?: string;
  createdAt: string;
}

export interface Settings {
  _id?: string;
  hotelName: string;
  phone: string;
  whatsappNumber: string;
  location: string;
  landmark: string;
  address: string;
  googleMapsUrl: string;
  instagramUrl?: string;
  facebookUrl?: string;
  checkInTime: string;
  checkOutTime: string;
  bookingInstructions: string;
  contactMessage: string;
}

export interface AdminUser {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  role: AdminRole;
  isActive?: boolean;
}

export interface DashboardStats {
  kpis: {
    totalBookings: number;
    todayCheckins: number;
    todayCheckouts: number;
    pendingBookings: number;
    confirmedBookings: number;
    checkedInBookings: number;
    availableRooms: number;
    occupiedRooms: number;
    maintenanceRooms: number;
    inactiveRooms: number;
    totalRooms: number;
    weekBookings: number;
    monthBookings: number;
    yearBookings: number;
    totalCustomers: number;
  };
  todayInventory: {
    date: string;
    summary: {
      total: number;
      available: number;
      occupied: number;
      maintenance: number;
      inactive: number;
    };
    rooms: Array<{
      _id: string;
      roomNumber: string;
      roomType: RoomType;
      title: string;
      price?: number | null;
      maxGuests: number;
      baseStatus: string;
      liveStatus: 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE' | 'INACTIVE';
      activeBooking?: {
        bookingReference: string;
        guestName: string;
        phone: string;
        status: string;
        checkIn: string;
        checkOut: string;
      } | null;
    }>;
  };
  statusDistribution: Array<{ name: string; value: number; color: string }>;
  roomTypeDistribution: Array<{ roomType: string; count: number }>;
  upcomingCheckins: Booking[];
  upcomingCheckouts: Booking[];
  recentBookings: Booking[];
}

export interface AuditLogItem {
  _id: string;
  adminEmail: string;
  adminName?: string;
  action: string;
  entity: string;
  entityId?: string;
  metadata?: Record<string, any>;
  timestamp: string;
}
