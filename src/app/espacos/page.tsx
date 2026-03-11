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
      <section className={styles.hero}>
        <div className="container" ref={heroAnim.ref}>
          <span className="section-label">{spacesContent.heroLabel}</span>
          <h1 className="section-title">{spacesContent.heroTitle}</h1>
          <p className="section-subtitle">{spacesContent.heroSubtitle}</p>
        </div>
      </section>

      {spacesContent.spaces.map((space, index) => (
        <SpaceRow key={`${space.name}-${space.icon}-${index}`} space={space} index={index} />
      ))}

      <section className={styles.amenities}>
        <div className="container">
          <div
            ref={amenitiesAnim.ref}
            className={`section-header animate-on-scroll ${amenitiesAnim.isVisible ? 'visible' : ''}`}
          >
            <span className="section-label">{spacesContent.amenitiesSectionLabel}</span>
            <h2 className="section-title">{spacesContent.amenitiesSectionTitle}</h2>
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

      <section className={styles.spaceCta}>
        <div className="container">
          <h2 className={styles.spaceCtaTitle}>{spacesContent.ctaTitle}</h2>
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

function SpaceRow({ space, index }: { space: SpaceItem; index: number }) {
  const anim = useScrollAnimation();
  const isEven = index % 2 === 0;

  return (
    <section
      ref={anim.ref}
      className={`${styles.spaceRow} ${isEven ? '' : styles.spaceRowAlt} animate-on-scroll ${anim.isVisible ? 'visible' : ''}`}
    >
      <div className={`container ${styles.spaceRowInner}`}>
        <div className={styles.spaceImageWrapper}>
          <div className={styles.spaceImagePlaceholder}>{resolveContentIcon(space.icon)}</div>
        </div>
        <div className={styles.spaceContent}>
          <span className={styles.spaceTag}>{space.tag}</span>
          <h2 className={styles.spaceName}>{space.name}</h2>
          <p className={styles.spaceDesc}>{space.desc}</p>
          <div className={styles.spaceMeta}>
            <div className={styles.spaceMetaItem}>
              <span className={styles.spaceMetaIcon}>👥</span>
              <span>{space.capacity} convidados</span>
            </div>
            <div className={styles.spaceMetaItem}>
              <span className={styles.spaceMetaIcon}>📐</span>
              <span>{space.area}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
