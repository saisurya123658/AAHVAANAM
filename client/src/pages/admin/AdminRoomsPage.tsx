import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../api/client';
import { Room, RoomStatus, RoomType } from '../../types';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import {
  Plus,
  Edit2,
  Trash2,
  Wrench,
  CheckCircle2,
  Power,
  Users,
  BedDouble,
  X,
  Sparkles,
  AlertCircle
} from 'lucide-react';

export const AdminRoomsPage: React.FC = () => {
  const queryClient = useQueryClient();

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  const [confirmModal, setConfirmModal] = useState<{
    open: boolean;
    title: string;
    message: string;
    action: () => void;
    isDestructive?: boolean;
  }>({
    open: false,
    title: '',
    message: '',
    action: () => {}
  });

  const [formError, setFormError] = useState<string | null>(null);

  // Form fields
  const [roomNumber, setRoomNumber] = useState('');
  const [roomType, setRoomType] = useState<RoomType>('Deluxe AC Room');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [amenitiesInput, setAmenitiesInput] = useState('');
  const [imagesInput, setImagesInput] = useState('');
  const [priceInput, setPriceInput] = useState('');
  const [maxGuests, setMaxGuests] = useState(2);
  const [status, setStatus] = useState<RoomStatus>('AVAILABLE');
  const [isActive, setIsActive] = useState(true);

  // Fetch all physical rooms
  const { data: rooms = [], isLoading } = useQuery<Room[]>({
    queryKey: ['admin-rooms'],
    queryFn: async () => {
      const res = await api.get('/rooms?activeOnly=false');
      return res.data?.rooms || [];
    }
  });

  const openAddModal = () => {
    setSelectedRoom(null);
    setRoomNumber('');
    setRoomType('Deluxe AC Room');
    setTitle('Deluxe AC Room');
    setDescription('Clean AC room with WiFi, 24-hour hot water, attached bathroom and lift facility.');
    setAmenitiesInput('A/C Room, High-Speed WiFi, 24 Hrs. Hot Water, RO Purified Water, Lift Facility, Attached Bathroom');
    setImagesInput('/images/rooms/room_deluxe_double_bed.jpg');
    setPriceInput('');
    setMaxGuests(2);
    setStatus('AVAILABLE');
    setIsActive(true);
    setFormError(null);
    setEditModalOpen(true);
  };

  const openEditModal = (room: Room) => {
    setSelectedRoom(room);
    setRoomNumber(room.roomNumber);
    setRoomType(room.roomType);
    setTitle(room.title);
    setDescription(room.description || '');
    setAmenitiesInput(room.amenities.join(', '));
    setImagesInput(room.images.join(', '));
    setPriceInput(room.price ? String(room.price) : '');
    setMaxGuests(room.maxGuests);
    setStatus(room.status);
    setIsActive(room.isActive);
    setFormError(null);
    setEditModalOpen(true);
  };

  // Save room mutation
  const saveMutation = useMutation({
    mutationFn: async (payload: any) => {
      if (selectedRoom) {
        const res = await api.put(`/rooms/${selectedRoom._id}`, payload);
        return res.data;
      } else {
        const res = await api.post('/rooms', payload);
        return res.data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-rooms'] });
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      setEditModalOpen(false);
    },
    onError: (err: any) => {
      setFormError(err.response?.data?.error || 'Failed to save room.');
    }
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/rooms/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-rooms'] });
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
    },
    onError: (err: any) => {
      alert(err.response?.data?.error || 'Failed to delete room');
    }
  });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const amenities = amenitiesInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const images = imagesInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const price = priceInput.trim() ? Number(priceInput.trim()) : null;

    saveMutation.mutate({
      roomNumber,
      roomType,
      title,
      description,
      amenities,
      images,
      price,
      maxGuests,
      status,
      isActive
    });
  };

  const toggleMaintenance = (room: Room) => {
    const nextStatus: RoomStatus = room.status === 'MAINTENANCE' ? 'AVAILABLE' : 'MAINTENANCE';
    saveMutation.mutate({
      ...room,
      status: nextStatus
    });
  };

  const toggleActive = (room: Room) => {
    saveMutation.mutate({
      ...room,
      isActive: !room.isActive
    });
  };

  const promptDelete = (room: Room) => {
    setConfirmModal({
      open: true,
      title: `Delete Room #${room.roomNumber}`,
      message: `Are you sure you want to delete room #${room.roomNumber}? This cannot be undone if there are no active bookings.`,
      isDestructive: true,
      action: () => {
        deleteMutation.mutate(room._id);
        setConfirmModal((prev) => ({ ...prev, open: false }));
      }
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-extrabold text-gold tracking-widest">
            INVENTORY & TARIFF
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-primary mt-0.5">
            Room Management
          </h1>
          <p className="text-xs text-gray-500">
            Configure physical rooms, adjust prices, and toggle maintenance or active status.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-5 py-2.5 rounded-xl bg-primary text-cream hover:bg-primary-light font-bold text-xs uppercase tracking-wider shadow-md flex items-center space-x-2 shrink-0"
        >
          <Plus className="w-4 h-4 text-gold" />
          <span>ADD NEW ROOM</span>
        </button>
      </div>

      {/* Rooms Table */}
      {isLoading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-10 h-10 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-gray-500 font-medium">Loading physical rooms...</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-600">
              <thead className="bg-gray-50 text-gray-700 font-bold uppercase text-[10px] tracking-wider border-b border-gray-200">
                <tr>
                  <th className="py-3.5 px-4">Room No</th>
                  <th className="py-3.5 px-4">Type</th>
                  <th className="py-3.5 px-4">Title</th>
                  <th className="py-3.5 px-4">Guests</th>
                  <th className="py-3.5 px-4">Tariff</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Active</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rooms.map((room) => (
                  <tr key={room._id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-primary text-sm">
                      #{room.roomNumber}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-gray-800">
                      {room.roomType}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-brandDark">
                      {room.title}
                    </td>
                    <td className="py-3.5 px-4">Max {room.maxGuests}</td>
                    <td className="py-3.5 px-4 font-bold text-primary">
                      {room.price ? `₹${room.price.toLocaleString('en-IN')}` : 'Contact for Price'}
                    </td>
                    <td className="py-3.5 px-4">
                      {room.status === 'AVAILABLE' ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          AVAILABLE
                        </span>
                      ) : room.status === 'MAINTENANCE' ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                          MAINTENANCE
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-700">
                          INACTIVE
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      {room.isActive ? (
                        <span className="text-emerald-600 font-bold">Active</span>
                      ) : (
                        <span className="text-gray-400 font-bold">Disabled</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center space-x-1.5">
                        <button
                          onClick={() => toggleMaintenance(room)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            room.status === 'MAINTENANCE'
                              ? 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100'
                              : 'text-amber-600 hover:bg-amber-50'
                          }`}
                          title={room.status === 'MAINTENANCE' ? 'Mark Available' : 'Mark Maintenance'}
                        >
                          <Wrench className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => toggleActive(room)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            room.isActive ? 'text-gray-400 hover:text-gray-600' : 'text-emerald-600'
                          }`}
                          title={room.isActive ? 'Deactivate' : 'Activate'}
                        >
                          <Power className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => openEditModal(room)}
                          className="p-1.5 rounded-lg text-primary hover:bg-primary/5 transition-colors"
                          title="Edit Room"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => promptDelete(room)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Delete Room"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Room Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl border border-gold/30">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <h3 className="font-serif text-xl font-bold text-primary">
                {selectedRoom ? `Edit Room #${selectedRoom.roomNumber}` : 'Add New Physical Room'}
              </h3>
              <button
                onClick={() => setEditModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-4 pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-1">
                    Room Number *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 101, 102"
                    value={roomNumber}
                    onChange={(e) => setRoomNumber(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-medium focus:border-gold"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-1">
                    Room Type *
                  </label>
                  <select
                    value={roomType}
                    onChange={(e) => setRoomType(e.target.value as RoomType)}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-medium focus:border-gold"
                  >
                    <option value="Deluxe AC Room">Deluxe AC Room</option>
                    <option value="Premium AC Room">Premium AC Room</option>
                    <option value="Family Room">Family Room</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-1">
                  Display Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Deluxe AC Room 101"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-medium focus:border-gold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-1">
                    Price / Night (INR)
                  </label>
                  <input
                    type="number"
                    placeholder="Leave blank for 'Contact for Price'"
                    value={priceInput}
                    onChange={(e) => setPriceInput(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-medium focus:border-gold"
                  />
                  <span className="text-[10px] text-gray-400 block mt-0.5">
                    If unset, displays &ldquo;Contact for Price&rdquo;
                  </span>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-1">
                    Max Guests
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={maxGuests}
                    onChange={(e) => setMaxGuests(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-medium focus:border-gold"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-1">
                  Amenities (comma-separated)
                </label>
                <input
                  type="text"
                  value={amenitiesInput}
                  onChange={(e) => setAmenitiesInput(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-medium focus:border-gold"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-1">
                  Image URLs (comma-separated)
                </label>
                <input
                  type="text"
                  value={imagesInput}
                  onChange={(e) => setImagesInput(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-medium focus:border-gold"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-medium focus:border-gold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-1">
                    Room Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as RoomStatus)}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-medium focus:border-gold"
                  >
                    <option value="AVAILABLE">AVAILABLE</option>
                    <option value="MAINTENANCE">MAINTENANCE</option>
                    <option value="INACTIVE">INACTIVE</option>
                  </select>
                </div>

                <div className="flex items-center space-x-2 pt-6">
                  <input
                    type="checkbox"
                    id="isActiveCheck"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-4 h-4 text-primary rounded"
                  />
                  <label htmlFor="isActiveCheck" className="text-xs font-bold text-gray-700">
                    Active in Inventory
                  </label>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end space-x-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saveMutation.isPending}
                  className="px-6 py-2 bg-primary text-cream hover:bg-primary-light rounded-xl text-xs font-bold uppercase tracking-wider shadow-md"
                >
                  {saveMutation.isPending ? 'Saving...' : 'Save Room'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={confirmModal.open}
        title={confirmModal.title}
        message={confirmModal.message}
        isDestructive={confirmModal.isDestructive}
        onConfirm={confirmModal.action}
        onCancel={() => setConfirmModal((prev) => ({ ...prev, open: false }))}
      />

    </div>
  );
};
