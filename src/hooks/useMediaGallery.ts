import { useContext } from 'react';
import { MediaGalleryContext } from '@/contexts/MediaGalleryContext';

export function useMediaGallery() {
  const context = useContext(MediaGalleryContext);

  if (!context) {
    throw new Error('useMediaGallery must be used within a MediaGalleryProvider');
  }

  return context;
}
