'use client';

import { useEffect, useState } from 'react';

export interface PublicMediaItem {
  id: string;
  filename: string;
  originalName: string;
  category: string;
  caption: string | null;
  mimeType: string;
  icon?: string;
  url?: string;
}

export function usePublicMedia(fallback: PublicMediaItem[] = []) {
  const [media, setMedia] = useState<PublicMediaItem[]>(fallback);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMedia(fallback);
  }, [fallback]);

  useEffect(() => {
    let cancelled = false;

    fetch('/api/media')
      .then((response) => response.json())
      .then((data: PublicMediaItem[]) => {
        if (cancelled) {
          return;
        }

        if (Array.isArray(data) && data.length > 0) {
          setMedia(data);
        } else {
          setMedia(fallback);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setMedia(fallback);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [fallback]);

  return { media, loading };
}
