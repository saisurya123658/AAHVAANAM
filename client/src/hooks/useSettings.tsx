import { useQuery } from '@tanstack/react-query';
import { LocalStorageService, DEFAULT_SETTINGS } from '../services/localStorageService';
import { Settings } from '../types';

export { DEFAULT_SETTINGS };

export function useSettings() {
  const query = useQuery<Settings>({
    queryKey: ['settings'],
    queryFn: async () => LocalStorageService.getSettings(),
    initialData: () => LocalStorageService.getSettings(),
    staleTime: 60 * 1000
  });

  return {
    settings: query.data || DEFAULT_SETTINGS,
    isLoading: query.isLoading,
    refetch: query.refetch
  };
}
