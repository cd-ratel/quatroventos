'use client';

import Link from 'next/link';
import { useSiteSettings } from '@/components/SiteSettingsProvider';
import { resolveContentIcon } from '@/lib/content-icons';
import { useScrollAnimation } from '@/hooks/useAnimations';
import styles from './page.module.css';

type SpaceItem = {
  tag: string;
  name: string;
  desc: string;
  icon: string;
  capacity: string;
  area: string;
};

export default function EspacosPage() {
  const { spacesContent } = useSiteSettings();
  const heroAnim = useScrollAnimation(0.1);
  const amenitiesAnim = useScrollAnimation();

  return (
    <>
      <section className={styles.pageHero}>
        <div className={styles.pageHeroDots} />
        <div className="container" ref={heroAnim.ref}>
          <span className="section-label">{spacesContent.heroLabel}</span>
          <h1 className="section-title">{spacesContent.heroTitle}</h1>
          <hr className="divider" />
          <p className="section-subtitle">{spacesContent.heroSubtitle}</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className={styles.spacesGrid}>
            {spacesContent.spaces.map((space, index) => (
              <SpaceRow key={`${space.name}-${space.icon}-${index}`} space={space} />
            ))}
          </div>
        </div>
      </section>

      <section className={styles.amenities}>
        <div className="container">
          <div
            ref={amenitiesAnim.ref}
            className={`section-header animate-on-scroll ${amenitiesAnim.isVisible ? 'visible' : ''}`}
          >
            <span className="section-label">{spacesContent.amenitiesSectionLabel}</span>
            <h2 className="section-title">{spacesContent.amenitiesSectionTitle}</h2>
            <hr className="divider" />
          </div>
          <div className={`${styles.amenitiesGrid} stagger ${amenitiesAnim.isVisible ? 'visible' : ''}`}>
            {spacesContent.amenities.map((amenity) => (
              <div key={`${amenity.name}-${amenity.icon}`} className={styles.amenityCard}>
                <span className={styles.amenityIcon}>{resolveContentIcon(amenity.icon)}</span>
                <span className={styles.amenityName}>{amenity.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ textAlign: 'center' }}>
        <div className="container">
          <h2 className="section-title">{spacesContent.ctaTitle}</h2>
          <p className="section-subtitle" style={{ marginBottom: 'var(--space-2xl)' }}>
            {spacesContent.ctaSubtitle}
          </p>
          <Link href="/agendar" className="btn btn-primary btn-lg">
            {spacesContent.ctaLabel}
          </Link>
        </div>
      </section>
    </>
  );
}

function SpaceRow({ space }: { space: SpaceItem }) {
  const anim = useScrollAnimation();

  return (
    <div
      ref={anim.ref}
      className={`${styles.spaceRow} animate-on-scroll ${anim.isVisible ? 'visible' : ''}`}
    >
      <div className={styles.spaceImageWrapper}>
        <div className={styles.spaceImagePlaceholder}>{resolveContentIcon(space.icon)}</div>
      </div>
      <div className={styles.spaceContent}>
        <span className={styles.spaceTag}>{space.tag}</span>
        <h2 className={styles.spaceName}>{space.name}</h2>
        <p className={styles.spaceDesc}>{space.desc}</p>
        <div className={styles.spaceDetails}>
          <div className={styles.spaceDetail}>
            <span className={styles.spaceDetailValue}>{space.capacity}</span>
            <span className={styles.spaceDetailLabel}>Convidados</span>
          </div>
          <div className={styles.spaceDetail}>
            <span className={styles.spaceDetailValue}>{space.area}</span>
            <span className={styles.spaceDetailLabel}>Área total</span>
          </div>
        </div>
      </div>
    </div>
  );
}
