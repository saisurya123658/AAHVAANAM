import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { LocalStorageService } from '../services/localStorageService';

/**
 * Offline Mock Axios Adapter
 * Routes all API calls directly to LocalStorageService without any network requests.
 * Completely eliminates dependency on Express, Render, MongoDB, or any external backend.
 */
export const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  },
  adapter: async (config: InternalAxiosRequestConfig): Promise<AxiosResponse> => {
    const url = (config.url || '').replace(/^\/api/, '');
    const method = (config.method || 'get').toLowerCase();
    const data = typeof config.data === 'string' ? JSON.parse(config.data || '{}') : (config.data || {});
    const params = config.params || {};

    // Helper for successful response
    const ok = (payload: any, status = 200): AxiosResponse => ({
      data: payload,
      status,
      statusText: 'OK',
      headers: {},
      config
    });

    // Helper for error response
    const err = (message: string, status = 400): Promise<AxiosResponse> => {
      const errorObj: any = new Error(message);
      errorObj.response = {
        data: { error: message },
        status,
        statusText: 'Bad Request',
        headers: {},
        config
      };
      return Promise.reject(errorObj);
    };

    try {
      // 1. AUTHENTICATION
      if (url === '/auth/admin/login' && method === 'post') {
        const { email, password } = data;
        const admin = LocalStorageService.loginAdmin(email, password);
        return ok({ message: 'Login successful', token: 'demo-jwt-token-aahvaanam', admin });
      }

      if (url === '/auth/admin/me' && method === 'get') {
        const admin = LocalStorageService.getAdminSession();
        if (admin) {
          return ok({ authenticated: true, admin });
        }
        return ok({ authenticated: false, admin: null });
      }

      if (url === '/auth/admin/logout' && method === 'post') {
        LocalStorageService.logoutAdmin();
        return ok({ message: 'Logged out successfully' });
      }

      // 2. SETTINGS
      if ((url === '/settings' || url === '/admin/settings') && method === 'get') {
        return ok({ settings: LocalStorageService.getSettings() });
      }

      if (url === '/admin/settings' && (method === 'put' || method === 'patch')) {
        const updated = LocalStorageService.saveSettings(data);
        return ok({ message: 'Settings updated successfully', settings: updated });
      }

      // 3. AVAILABILITY
      if (url.startsWith('/availability/grid') && method === 'get') {
        const stats = LocalStorageService.getDashboardStats();
        return ok(stats.todayInventory);
      }

      if (url.startsWith('/availability') && method === 'get') {
        const searchParams = new URLSearchParams(url.split('?')[1] || '');
        const checkIn = searchParams.get('checkIn') || params.checkIn || new Date().toISOString().slice(0, 10);
        const checkOut =
          searchParams.get('checkOut') ||
          params.checkOut ||
          new Date(Date.now() + 86400000).toISOString().slice(0, 10);
        const guests = Number(searchParams.get('guests') || params.guests || 1);
        const roomType = searchParams.get('roomType') || params.roomType || '';

        const result = LocalStorageService.checkAvailability(checkIn, checkOut, guests, roomType);
        return ok(result);
      }

      // 4. ROOMS
      if (url.match(/^\/rooms\/[a-zA-Z0-9_-]+$/) && method === 'get') {
        const id = url.split('/rooms/')[1];
        const room = LocalStorageService.getRoomById(id);
        if (!room) return err('Room not found', 404);
        return ok({ room });
      }

      if (url.startsWith('/rooms') && method === 'get') {
        return ok({ rooms: LocalStorageService.getRooms() });
      }

      if (url === '/rooms' && method === 'post') {
        const saved = LocalStorageService.saveRoom(data);
        return ok({ message: 'Room created successfully', room: saved }, 201);
      }

      if (url.match(/^\/rooms\/[a-zA-Z0-9_-]+$/) && (method === 'put' || method === 'patch')) {
        const id = url.split('/rooms/')[1];
        const saved = LocalStorageService.saveRoom({ ...data, _id: id });
        return ok({ message: 'Room updated successfully', room: saved });
      }

      if (url.match(/^\/rooms\/[a-zA-Z0-9_-]+$/) && method === 'delete') {
        const id = url.split('/rooms/')[1];
        LocalStorageService.deleteRoom(id);
        return ok({ message: 'Room deleted successfully' });
      }

      // 5. BOOKINGS
      if (url === '/bookings' && method === 'post') {
        const booking = LocalStorageService.createBooking(data);
        return ok({ message: 'Booking confirmed successfully', booking }, 201);
      }

      if (url.startsWith('/bookings/ref/') && method === 'get') {
        const ref = url.split('/bookings/ref/')[1];
        const booking = LocalStorageService.getBookingByReference(ref);
        if (!booking) return err('Booking not found', 404);
        return ok({ booking });
      }

      if (url.match(/^\/bookings\/[a-zA-Z0-9_-]+$/) && method === 'get') {
        const id = url.split('/bookings/')[1];
        const booking = LocalStorageService.getBookingById(id);
        if (!booking) return err('Booking not found', 404);
        return ok({ booking });
      }

      // 6. ADMIN BOOKINGS
      if (url.startsWith('/admin/bookings') && method === 'get') {
        const searchParams = new URLSearchParams(url.split('?')[1] || '');
        const q = (searchParams.get('q') || '').toLowerCase();
        const status = searchParams.get('status') || 'ALL';
        const roomType = searchParams.get('roomType') || 'ALL';

        let bookings = LocalStorageService.getBookings();

        if (status !== 'ALL') {
          bookings = bookings.filter((b) => b.status === status);
        }
        if (roomType !== 'ALL') {
          bookings = bookings.filter((b) => b.room?.roomType === roomType);
        }
        if (q) {
          bookings = bookings.filter(
            (b) =>
              b.bookingReference.toLowerCase().includes(q) ||
              b.customer?.name.toLowerCase().includes(q) ||
              b.customer?.phone.includes(q) ||
              b.room?.roomNumber.includes(q)
          );
        }

        return ok({
          data: bookings,
          total: bookings.length,
          page: 1,
          totalPages: 1
        });
      }

      if (url.match(/^\/admin\/bookings\/[a-zA-Z0-9_-]+\/status$/) && method === 'patch') {
        const parts = url.split('/');
        const id = parts[3];
        const updated = LocalStorageService.updateBooking(id, { status: data.status });
        return ok({ message: 'Booking status updated', booking: updated });
      }

      if (url.match(/^\/admin\/bookings\/[a-zA-Z0-9_-]+$/) && method === 'delete') {
        const id = url.split('/admin/bookings/')[1];
        LocalStorageService.deleteBooking(id);
        return ok({ message: 'Booking deleted successfully' });
      }

      // 7. ADMIN DASHBOARD STATS
      if (url === '/admin/dashboard/stats' && method === 'get') {
        return ok(LocalStorageService.getDashboardStats());
      }

      // 8. GALLERY
      if ((url.startsWith('/gallery') || url.startsWith('/admin/gallery')) && method === 'get') {
        const searchParams = new URLSearchParams(url.split('?')[1] || '');
        const cat = searchParams.get('category') || 'ALL';
        let items = LocalStorageService.getGallery();
        if (cat !== 'ALL') {
          items = items.filter((i) => i.category === cat);
        }
        return ok({ items, total: items.length });
      }

      if (url === '/admin/gallery' && method === 'post') {
        const items = LocalStorageService.getGallery();
        const newItem = {
          _id: `gal-${Date.now()}`,
          title: data.title || 'Hotel Photo',
          imageUrl: data.imageUrl || '/images/rooms/room_deluxe_double_bed.jpg',
          category: data.category || 'ROOMS',
          isCover: data.isCover || false,
          order: items.length + 1,
          createdAt: new Date().toISOString()
        };
        items.push(newItem);
        LocalStorageService.saveGallery(items);
        return ok({ message: 'Gallery item added', item: newItem }, 201);
      }

      if (url.match(/^\/admin\/gallery\/[a-zA-Z0-9_-]+$/) && method === 'delete') {
        const id = url.split('/admin/gallery/')[1];
        const items = LocalStorageService.getGallery().filter((i) => i._id !== id);
        LocalStorageService.saveGallery(items);
        return ok({ message: 'Gallery item deleted' });
      }

      // 9. ENQUIRIES
      if (url === '/enquiries' && method === 'post') {
        const created = LocalStorageService.createEnquiry(data);
        return ok({ message: 'Enquiry submitted successfully', enquiry: created }, 201);
      }

      if (url.startsWith('/admin/enquiries') && method === 'get') {
        const enquiries = LocalStorageService.getEnquiries();
        return ok({ data: enquiries, total: enquiries.length });
      }

      if (url.match(/^\/admin\/enquiries\/[a-zA-Z0-9_-]+$/) && method === 'patch') {
        const id = url.split('/admin/enquiries/')[1];
        const updated = LocalStorageService.updateEnquiry(id, data);
        return ok({ enquiry: updated });
      }

      if (url.match(/^\/admin\/enquiries\/[a-zA-Z0-9_-]+$/) && method === 'delete') {
        const id = url.split('/admin/enquiries/')[1];
        LocalStorageService.deleteEnquiry(id);
        return ok({ message: 'Enquiry deleted' });
      }

      // 10. CUSTOMERS
      if (url.startsWith('/admin/customers') && method === 'get') {
        const bookings = LocalStorageService.getBookings();
        const customerMap = new Map<string, any>();

        for (const b of bookings) {
          if (!b.customer) continue;
          const key = b.customer.phone || b.customer.name;
          if (!customerMap.has(key)) {
            customerMap.set(key, {
              _id: b.customer._id || `cust-${key}`,
              name: b.customer.name,
              phone: b.customer.phone,
              email: b.customer.email,
              createdAt: b.customer.createdAt || b.createdAt,
              totalBookings: 1,
              lastBookingDate: b.checkIn,
              lastBookingStatus: b.status,
              bookings: [b]
            });
          } else {
            const existing = customerMap.get(key);
            existing.totalBookings += 1;
            existing.bookings.push(b);
          }
        }

        const list = Array.from(customerMap.values());
        return ok({ data: list, total: list.length });
      }

      // 11. ADMIN USERS & AUDIT LOGS
      if (url.startsWith('/admin/admins') && method === 'get') {
        return ok({
          admins: [
            {
              _id: 'admin-01',
              name: 'Aahvaanam General Manager',
              email: 'admin@aahvaanam.com',
              role: 'SUPER_ADMIN',
              isActive: true
            }
          ]
        });
      }

      if (url.startsWith('/admin/audit-logs') && method === 'get') {
        return ok({
          logs: [
            {
              _id: 'log-01',
              adminEmail: 'admin@aahvaanam.com',
              adminName: 'Aahvaanam General Manager',
              action: 'Demo mode active: running entirely on localStorage',
              entity: 'System',
              timestamp: new Date().toISOString()
            }
          ],
          total: 1
        });
      }

      // Default fallback
      return ok({ message: 'OK', url });
    } catch (e: any) {
      return err(e.message || 'Operation failed');
    }
  }
});

// Demo token helper
export function setAuthToken(token: string | null) {
  if (typeof window === 'undefined') return;
  if (token) {
    localStorage.setItem('admin_token', token);
  } else {
    localStorage.removeItem('admin_token');
  }
}
