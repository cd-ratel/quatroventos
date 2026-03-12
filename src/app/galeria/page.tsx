'use client';

import { useMemo, useState } from 'react';
import VisualPlaceholder from '@/components/VisualPlaceholder';
import { useSiteSettings } from '@/components/SiteSettingsProvider';
import { usePublicMedia, type PublicMediaItem } from '@/hooks/usePublicMedia';
import { resolveContentIcon } from '@/lib/content-icons';
import { getCategoryLabel } from '@/lib/public-site';
import styles from './page.module.css';

function placeholderToMedia(
  item: {
    id: string;
    title: string;
    category: string;
    caption: string;
    icon: string;
  }
): PublicMediaItem {
  return {
    id: item.id,
    filename: '',
    originalName: item.title,
    category: item.category,
    caption: item.caption,
    mimeType: 'image/jpeg',
    icon: item.icon,
  };
}

function getMediaUrl(item: PublicMediaItem) {
  return item.url || `/media/${item.id}`;
}

export default function GaleriaPage() {
  const { galleryContent } = useSiteSettings();
  const [filter, setFilter] = useState('all');
  const [lightboxId, setLightboxId] = useState<string | null>(null);
  const fallbackMedia = useMemo(
    () => galleryContent.placeholderMedia.map(placeholderToMedia),
    [galleryContent.placeholderMedia]
  );
  const { media } = usePublicMedia(fallbackMedia);

  const filteredMedia =
    filter === 'all' ? media : media.filter((item) => item.category === filter);

  const currentItem =
    filteredMedia.find((item) => item.id === lightboxId) ||
    media.find((item) => item.id === lightboxId) ||
    null;

  return (
    <>
      <section className="pageHero">
        <div className="container">
          <span className="section-label">{galleryContent.heroLabel}</span>
          <h1 className="section-title">{galleryContent.heroTitle}</h1>
          <p className="section-subtitle">{galleryContent.heroSubtitle}</p>

          <div className={styles.filterBar}>
            {galleryContent.categories.map((category) => (
              <button
                key={category.value}
                type="button"
                className={`${styles.filterChip} ${filter === category.value ? styles.filterChipActive : ''}`}
                onClick={() => setFilter(category.value)}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.gallerySection}>
        <div className="container">
          {filteredMedia.length > 0 ? (
            <div className={styles.galleryGrid}>
              {filteredMedia.map((item, index) => (
                <button
                  type="button"
                  key={`${item.id}-${index}`}
                  className={`${styles.galleryCard} ${index % 5 === 0 ? styles.galleryCardWide : ''}`}
                  onClick={() => setLightboxId(item.id)}
                >
                  {item.filename ? (
                    item.mimeType.startsWith('image/') ? (
                      <div
                        className={styles.galleryImage}
                        style={{ backgroundImage: `url(${getMediaUrl(item)})` }}
                      />
                    ) : (
                      <div className={styles.galleryFallback}>
                        <VisualPlaceholder
                          compact
                          label="Vídeo"
                          title={item.caption || item.originalName}
                          description={getCategoryLabel(item.category, galleryContent.categories)}
                        />
                      </div>
                    )
                  ) : (
                    <div className={styles.galleryFallback}>
                      <VisualPlaceholder
                        compact
                        label={getCategoryLabel(item.category, galleryContent.categories)}
                        title={item.caption || item.originalName}
                      />
                    </div>
                  )}

                  <div className={styles.galleryCaption}>
                    <strong>{item.caption || item.originalName}</strong>
                    <span>{getCategoryLabel(item.category, galleryContent.categories)}</span>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className={`${styles.emptyState} surfaceCard`}>
              <span className={styles.emptyIcon}>{resolveContentIcon('EV')}</span>
              <h2>Nenhum item nesta seleção</h2>
              <p>{galleryContent.emptyMessage}</p>
            </div>
          )}
        </div>
      </section>

      {currentItem ? (
        <div className={styles.lightbox} onClick={() => setLightboxId(null)}>
          <button
            type="button"
            className={styles.lightboxClose}
            onClick={() => setLightboxId(null)}
            aria-label="Fechar galeria"
          >
            ×
          </button>

          <div className={styles.lightboxPanel} onClick={(event) => event.stopPropagation()}>
            {currentItem.filename ? (
              currentItem.mimeType.startsWith('video/') ? (
                <video src={getMediaUrl(currentItem)} controls className={styles.lightboxMedia} />
              ) : (
                <img
                  src={getMediaUrl(currentItem)}
                  alt={currentItem.caption || currentItem.originalName}
                  className={styles.lightboxMedia}
                />
              )
            ) : (
              <div className={styles.lightboxFallback}>
                <VisualPlaceholder
                  label={getCategoryLabel(currentItem.category, galleryContent.categories)}
                  title={currentItem.caption || currentItem.originalName}
                />
              </div>
            )}

            <div className={styles.lightboxMeta}>
              <strong>{currentItem.caption || currentItem.originalName}</strong>
              <span>{getCategoryLabel(currentItem.category, galleryContent.categories)}</span>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
