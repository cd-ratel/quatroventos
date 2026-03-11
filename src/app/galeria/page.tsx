'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSiteSettings } from '@/components/SiteSettingsProvider';
import { resolveContentIcon } from '@/lib/content-icons';
import styles from './page.module.css';

interface MediaItem {
  id: string;
  filename: string;
  originalName: string;
  category: string;
  caption: string | null;
  mimeType: string;
  icon?: string;
  url?: string;
}

export default function GaleriaPage() {
  const { galleryContent } = useSiteSettings();
  const placeholderMedia = useMemo<MediaItem[]>(
    () =>
      galleryContent.placeholderMedia.map((item) => ({
        id: item.id,
        filename: '',
        originalName: item.title,
        category: item.category,
        caption: item.caption,
        mimeType: 'image/jpeg',
        icon: item.icon,
      })),
    [galleryContent.placeholderMedia]
  );
  const [filter, setFilter] = useState('all');
  const [media, setMedia] = useState<MediaItem[]>(placeholderMedia);
  const [lightbox, setLightbox] = useState<string | null>(null);

  useEffect(() => {
    setMedia((current) => (current.some((item) => item.filename) ? current : placeholderMedia));
  }, [placeholderMedia]);

  useEffect(() => {
    let cancelled = false;

    fetch('/api/media')
      .then((res) => res.json())
      .then((data: MediaItem[]) => {
        if (cancelled) {
          return;
        }

        if (Array.isArray(data) && data.length > 0) {
          setMedia(data);
          return;
        }

        setMedia(placeholderMedia);
      })
      .catch(() => {
        if (!cancelled) {
          setMedia(placeholderMedia);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [placeholderMedia]);

  const filtered =
    filter === 'all' ? media : media.filter((item) => item.category === filter);

  return (
    <>
      <section className={styles.hero}>
        <div className="container">
          <span className="section-label">{galleryContent.heroLabel}</span>
          <h1 className="section-title">{galleryContent.heroTitle}</h1>
          <p className="section-subtitle">{galleryContent.heroSubtitle}</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className={styles.filters}>
            {galleryContent.categories.map((category) => (
              <button
                key={`${category.value}-${category.label}`}
                className={`${styles.filterBtn} ${filter === category.value ? styles.active : ''}`}
                onClick={() => setFilter(category.value)}
              >
                {category.label}
              </button>
            ))}
          </div>

          {filtered.length > 0 ? (
            <div className={styles.galleryGrid}>
              {filtered.map((item) => (
                <div
                  key={item.id}
                  className={styles.galleryItem}
                  onClick={() => setLightbox(item.id)}
                >
                  {item.filename ? (
                    item.mimeType.startsWith('image/') ? (
                      <img
                        src={item.url || `/media/${item.id}`}
                        alt={item.caption || item.originalName}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0 }}
                        loading="lazy"
                      />
                    ) : (
                      <div className={styles.galleryPlaceholder}>🎬</div>
                    )
                  ) : (
                    <div className={styles.galleryPlaceholder}>
                      {resolveContentIcon(item.icon || 'IMG')}
                    </div>
                  )}
                  <div className={styles.galleryCaption}>
                    <span>{item.category}</span>
                    <p>{item.caption || item.originalName}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <span className={styles.emptyIcon}>🖼</span>
              <p>{galleryContent.emptyMessage}</p>
            </div>
          )}
        </div>
      </section>

      {lightbox && (
        <div className={styles.lightbox} onClick={() => setLightbox(null)}>
          <button className={styles.lightboxClose} onClick={() => setLightbox(null)}>
            X
          </button>
          {(() => {
            const item = media.find((mediaItem) => mediaItem.id === lightbox);
            if (!item) {
              return null;
            }

            if (item.filename) {
              if (item.mimeType.startsWith('video/')) {
                return (
                  <video
                    src={item.url || `/media/${item.id}`}
                    controls
                    className={styles.lightboxImage}
                    style={{ objectFit: 'contain' }}
                  />
                );
              }

              return (
                <img
                  src={item.url || `/media/${item.id}`}
                  alt={item.caption || ''}
                  className={styles.lightboxImage}
                  style={{ maxWidth: '90vw', maxHeight: '85vh', objectFit: 'contain' }}
                />
              );
            }

            return (
              <div
                style={{
                  fontSize: '5rem',
                  background: 'var(--color-bg-warm)',
                  padding: '4rem 6rem',
                  borderRadius: 'var(--radius-xl)',
                  border: '1px solid #eee',
                }}
              >
                {resolveContentIcon(item.icon || 'IMG')}
              </div>
            );
          })()}
        </div>
      )}
    </>
  );
}
