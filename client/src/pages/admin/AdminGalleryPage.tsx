import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../api/client';
import { GalleryItem, GalleryCategory } from '../../types';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { Plus, Trash2, CheckCircle2, Image as ImageIcon, X } from 'lucide-react';

export const AdminGalleryPage: React.FC = () => {
  const queryClient = useQueryClient();

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [category, setCategory] = useState<GalleryCategory>('ROOMS');
  const [isCover, setIsCover] = useState(false);
  const [order, setOrder] = useState(0);

  const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; id: string | null }>({
    open: false,
    id: null
  });

  const { data: items = [], isLoading } = useQuery<GalleryItem[]>({
    queryKey: ['admin-gallery'],
    queryFn: async () => {
      const res = await api.get('/gallery');
      return res.data?.items || [];
    }
  });

  const addMutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = await api.post('/admin/gallery', payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-gallery'] });
      queryClient.invalidateQueries({ queryKey: ['gallery'] });
      setAddModalOpen(false);
      setTitle('');
      setImageUrl('');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/admin/gallery/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-gallery'] });
      queryClient.invalidateQueries({ queryKey: ['gallery'] });
      setDeleteConfirm({ open: false, id: null });
    }
  });

  const toggleCoverMutation = useMutation({
    mutationFn: async ({ id, isCover }: { id: string; isCover: boolean }) => {
      await api.patch(`/admin/gallery/${id}`, { isCover });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-gallery'] });
      queryClient.invalidateQueries({ queryKey: ['gallery'] });
    }
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addMutation.mutate({
      title,
      imageUrl,
      category,
      isCover,
      order: Number(order)
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-extrabold text-gold tracking-widest">
            HOTEL MEDIA
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-primary mt-0.5">
            Gallery Management
          </h1>
          <p className="text-xs text-gray-500">
            Organize authentic photography, update categories, and choose cover photos.
          </p>
        </div>

        <button
          onClick={() => setAddModalOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-primary text-cream hover:bg-primary-light font-bold text-xs uppercase tracking-wider shadow-md flex items-center space-x-2 shrink-0"
        >
          <Plus className="w-4 h-4 text-gold" />
          <span>ADD IMAGE</span>
        </button>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-10 h-10 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-gray-500 font-medium">Loading gallery images...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {items.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm flex flex-col justify-between"
            >
              <div className="relative h-48 bg-gray-100">
                <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                <span className="absolute top-2.5 left-2.5 text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-black/70 text-gold backdrop-blur-sm">
                  {item.category}
                </span>
                {item.isCover && (
                  <span className="absolute top-2.5 right-2.5 text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-gold text-brandDark shadow-sm">
                    COVER
                  </span>
                )}
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <h4 className="font-serif font-bold text-sm text-primary line-clamp-1">
                  {item.title}
                </h4>

                <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                  <button
                    onClick={() => toggleCoverMutation.mutate({ id: item._id, isCover: !item.isCover })}
                    className={`text-[11px] font-bold px-2 py-1 rounded-lg border transition-colors ${
                      item.isCover
                        ? 'border-gold text-gold-dark bg-gold/10'
                        : 'border-gray-200 text-gray-500 hover:border-gold'
                    }`}
                  >
                    {item.isCover ? 'Cover Photo' : 'Make Cover'}
                  </button>

                  <button
                    onClick={() => setDeleteConfirm({ open: true, id: item._id })}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-gold/30">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-serif text-xl font-bold text-primary">Add Gallery Photo</h3>
              <button onClick={() => setAddModalOpen(false)} className="p-1 text-gray-400 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 pt-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-1">
                  Image Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Master Bedroom View"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-medium focus:border-gold"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-1">
                  Image URL / Asset Path *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. /images/rooms/room_modern_bathroom.jpg"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-medium focus:border-gold"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-1">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as GalleryCategory)}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-medium focus:border-gold"
                >
                  <option value="ROOMS">Rooms</option>
                  <option value="BATHROOM">Bathroom</option>
                  <option value="PROPERTY">Property</option>
                  <option value="FACILITIES">Facilities</option>
                  <option value="EXTERIOR">Exterior</option>
                  <option value="NEARBY">Nearby</option>
                </select>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="isCoverCheckbox"
                  checked={isCover}
                  onChange={(e) => setIsCover(e.target.checked)}
                  className="w-4 h-4 text-primary rounded"
                />
                <label htmlFor="isCoverCheckbox" className="text-xs font-bold text-gray-700">
                  Feature as Cover Photo
                </label>
              </div>

              <div className="pt-4 flex justify-end space-x-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addMutation.isPending}
                  className="px-6 py-2 bg-primary text-cream hover:bg-primary-light rounded-xl text-xs font-bold uppercase tracking-wider shadow-md"
                >
                  {addMutation.isPending ? 'Saving...' : 'Add Image'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={deleteConfirm.open}
        title="Delete Image"
        message="Are you sure you want to remove this photograph from the public gallery?"
        isDestructive={true}
        onConfirm={() => deleteConfirm.id && deleteMutation.mutate(deleteConfirm.id)}
        onCancel={() => setDeleteConfirm({ open: false, id: null })}
      />

    </div>
  );
};
