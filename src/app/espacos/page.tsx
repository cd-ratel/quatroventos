'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { useSiteSettings } from '@/components/SiteSettingsProvider';
import { usePublicMedia, type PublicMediaItem } from '@/hooks/usePublicMedia';
import { resolveContentIcon } from '@/lib/content-icons';
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

export default function EspacosPage() {
  const { spacesContent, galleryContent } = useSiteSettings();
  const fallbackMedia = useMemo(
    () => galleryContent.placeholderMedia.map(placeholderToMedia),
    [galleryContent.placeholderMedia]
  );
  const { media } = usePublicMedia(fallbackMedia);
  const venueMedia = media.filter((item) => item.category === 'venue');

  return (
    <>
      <section className="pageHero">
        <div className="container">
          <span className="section-label">{spacesContent.heroLabel}</span>
          <h1 className="section-title">{spacesContent.heroTitle}</h1>
          <p className="section-subtitle">{spacesContent.heroSubtitle}</p>
          <div className={styles.heroMetrics}>
            <span className="metricPill">{spacesContent.spaces.length} ambientes principais</span>
            <span className="metricPill">{spacesContent.amenities.length} facilidades disponíveis</span>
          </div>
        </div>
      </section>

      <section className={styles.spacesSection}>
        <div className="container">
          {spacesContent.spaces.map((space, index) => {
            const visual = venueMedia[index] || media[index];
            return (
              <article
                key={`${space.name}-${index}`}
                className={`${styles.spaceRow} ${index % 2 === 1 ? styles.spaceRowReverse : ''}`}
              >
                <div className={`${styles.spaceVisual} surfaceCard`}>
                  {visual?.filename ? (
                    <div
                      className={styles.spaceImage}
                      style={{ backgroundImage: `url(${getMediaUrl(visual)})` }}
                    />
                  ) : (
                    <div className={styles.spaceFallback}>{resolveContentIcon(visual?.icon || space.icon)}</div>
                  )}
                </div>

                <div className={styles.spaceContent}>
                  <span className="eyebrow">{space.tag}</span>
                  <h2>{space.name}</h2>
                  <p>{space.desc}</p>
                  <div className={styles.spaceStats}>
                    <div className={styles.spaceStat}>
                      <strong>{space.capacity}</strong>
                      <span>convidados</span>
                    </div>
                    <div className={styles.spaceStat}>
                      <strong>{space.area}</strong>
                      <span>área</span>
                    </div>
                  </div>
                  <Link href="/agendar" className="btn-primary">
                    {spacesContent.ctaLabel}
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className={styles.amenitiesSection}>
        <div className="container">
          <div className={styles.amenitiesHeader}>
            <span className="eyebrow">{spacesContent.amenitiesSectionLabel}</span>
            <h2>{spacesContent.amenitiesSectionTitle}</h2>
          </div>
          <div className={styles.amenitiesGrid}>
            {spacesContent.amenities.map((amenity) => (
              <div key={`${amenity.name}-${amenity.icon}`} className={`${styles.amenityCard} surfaceCard`}>
                <span className={styles.amenityIcon}>{resolveContentIcon(amenity.icon)}</span>
                <strong>{amenity.name}</strong>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.bottomBand}>
        <div className="container">
          <div className={styles.bottomBandInner}>
            <div>
              <span className="eyebrow">Visita técnica</span>
              <h2>{spacesContent.ctaTitle}</h2>
              <p>{spacesContent.ctaSubtitle}</p>
            </div>
            <Link href="/agendar" className="btn-primary btn-lg">
              {spacesContent.ctaLabel}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
