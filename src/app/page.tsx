'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import VisualPlaceholder from '@/components/VisualPlaceholder';
import { useSiteSettings } from '@/components/SiteSettingsProvider';
import { usePublicMedia, type PublicMediaItem } from '@/hooks/usePublicMedia';
import { resolveContentIcon } from '@/lib/content-icons';
import {
  getCategoryLabel,
  getDisplayAddress,
  getDisplayPhone,
} from '@/lib/public-site';
import styles from './page.module.css';

type HeroSlide = {
  key: string;
  title: string;
  description: string;
  imageUrl?: string;
  category: string;
  icon?: string;
};

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

function findMediaForCategories(
  media: PublicMediaItem[],
  categories: string[],
  fallbackIndex: number
) {
  for (const category of categories) {
    const exact = media.find((item) => item.category === category && item.filename);
    if (exact) {
      return exact;
    }
  }

  return media.find((item) => item.filename) || media[fallbackIndex] || media[0];
}

function shortenText(text: string, maxLength = 132) {
  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, maxLength).trimEnd()}...`;
}

export default function HomePage() {
  const settings = useSiteSettings();
  const { homeContent, spacesContent, galleryContent } = settings;
  const [activeSlide, setActiveSlide] = useState(0);
  const fallbackMedia = useMemo(
    () => galleryContent.placeholderMedia.map(placeholderToMedia),
    [galleryContent.placeholderMedia]
  );
  const { media } = usePublicMedia(fallbackMedia);
  const addressLabel = useMemo(() => getDisplayAddress(settings), [settings]);
  const phoneLabel = useMemo(() => getDisplayPhone(settings), [settings]);

  const heroSlides = useMemo<HeroSlide[]>(() => {
    const categoryMap = [
      ['wedding', 'venue'],
      ['children', 'venue'],
      ['corporate', 'venue'],
    ];

    return homeContent.events.map((event, index) => {
      const visual = findMediaForCategories(
        media,
        categoryMap[index] || ['venue'],
        index
      );

      return {
        key: `${event.title}-${index}`,
        title: event.title,
        description: event.desc,
        imageUrl: visual?.filename ? getMediaUrl(visual) : undefined,
        category: visual?.category || 'venue',
        icon: visual?.icon || event.icon,
      };
    });
  }, [homeContent.events, media]);

  const showcaseCards = useMemo(() => {
    return homeContent.events.map((event, index) => {
      const preferredCategory =
        index === 0
          ? ['wedding', 'venue']
          : index === 1
            ? ['children', 'venue']
            : ['corporate', 'venue'];
      const visual = findMediaForCategories(media, preferredCategory, index);

      return {
        event,
        imageUrl: visual?.filename ? getMediaUrl(visual) : undefined,
        category: visual?.category || preferredCategory[0],
      };
    });
  }, [homeContent.events, media]);

  const galleryPreview = useMemo(() => media.slice(0, 8), [media]);

  const differenceCards = useMemo(
    () => [
      {
        title: 'Cenário com presença e personalidade',
        eyebrow: 'Recepção e atmosfera',
        description: shortenText(homeContent.aboutParagraphs[0] || settings.aboutText),
        icon: 'END',
      },
      {
        title: 'Ambientes flexíveis para formatos diferentes',
        eyebrow: 'Estrutura adaptável',
        description: shortenText(spacesContent.heroSubtitle),
        icon: 'SV',
      },
      {
        title: 'Atendimento atento do primeiro contato ao evento',
        eyebrow: 'Operação e cuidado',
        description: shortenText(homeContent.aboutParagraphs[1] || settings.aboutText),
        icon: 'VIP',
      },
    ],
    [homeContent.aboutParagraphs, settings.aboutText, spacesContent.heroSubtitle]
  );

  useEffect(() => {
    if (heroSlides.length <= 1) {
      return;
    }

    const interval = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % heroSlides.length);
    }, 6500);

    return () => window.clearInterval(interval);
  }, [heroSlides.length]);

  const activeHero = heroSlides[activeSlide] || heroSlides[0];

  return (
    <>
      <section className={styles.hero} data-home-hero>
        <div className={styles.heroSlides}>
          {heroSlides.map((slide, index) => (
            <article
              key={slide.key}
              className={`${styles.heroSlide} ${index === activeSlide ? styles.heroSlideActive : ''}`}
            >
              {slide.imageUrl ? (
                <div
                  className={styles.heroSlideImage}
                  style={{ backgroundImage: `url(${slide.imageUrl})` }}
                />
              ) : (
                <div className={styles.heroSlideFallback}>
                  <VisualPlaceholder
                    label={getCategoryLabel(slide.category, galleryContent.categories)}
                    title={slide.title}
                    description={settings.venueSubtitle}
                  />
                </div>
              )}
              <div className={styles.heroSlideShade} />
            </article>
          ))}
        </div>

        <div className={`container ${styles.heroInner}`}>
          <div className={styles.heroCopy}>
            <span className={styles.heroEyebrow}>{homeContent.heroLabel}</span>
            <h1 className={styles.heroTitle}>
              {homeContent.heroTitle}
              <span>{homeContent.heroTitleAccent}</span>
            </h1>
            <p className={styles.heroSubtitle}>{homeContent.heroSubtitle}</p>

            <div className={styles.heroActions}>
              <Link href="/agendar" className="btn-primary btn-lg">
                {homeContent.primaryCtaLabel}
              </Link>
              <Link href="/espacos" className="btn-ghost btn-lg">
                {homeContent.secondaryCtaLabel}
              </Link>
            </div>
          </div>

          <div className={styles.heroAside}>
            <div className={styles.heroAsideLabel}>Em destaque agora</div>
            <div className={styles.heroAsideCard}>
              <p className={styles.heroAsideCategory}>{activeHero?.title}</p>
              <h2>{activeHero?.description}</h2>
              <div className={styles.heroAsideMeta}>
                <span className={`metricPill ${styles.heroAsidePill}`}>{addressLabel}</span>
                {phoneLabel ? (
                  <span className={`metricPill ${styles.heroAsidePill}`}>{phoneLabel}</span>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        <div className={`container ${styles.heroFooter}`}>
          <div className={styles.heroDots}>
            {heroSlides.map((slide, index) => (
              <button
                type="button"
                key={`${slide.key}-dot`}
                className={`${styles.heroDot} ${index === activeSlide ? styles.heroDotActive : ''}`}
                onClick={() => setActiveSlide(index)}
                aria-label={`Ir para o slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      <section className={styles.storySection}>
        <div className={`container ${styles.storyGrid}`}>
          <div className={`${styles.storyVisual} surfaceCard`}>
            {heroSlides[0]?.imageUrl ? (
              <div
                className={styles.storyVisualImage}
                style={{ backgroundImage: `url(${heroSlides[0].imageUrl})` }}
              />
            ) : (
              <div className={styles.storyVisualFallback}>
                <VisualPlaceholder
                  label="Assinatura do espaço"
                  title={settings.venueTitle}
                  description={settings.venueSubtitle}
                />
              </div>
            )}

            <div className={styles.storyBadge}>
              <span>{settings.venueSubtitle}</span>
            </div>
          </div>

          <div className={styles.storyContent}>
            <span className="eyebrow">{homeContent.aboutSectionLabel}</span>
            <h2 className={styles.storyTitle}>{homeContent.aboutSectionTitle}</h2>
            <div className={styles.storyText}>
              {homeContent.aboutParagraphs.map((paragraph, index) => (
                <p key={`${paragraph.slice(0, 24)}-${index}`}>{paragraph}</p>
              ))}
            </div>

            <div className={styles.storyHighlights}>
              {homeContent.features.slice(0, 4).map((feature) => (
                <span key={feature} className={styles.storyHighlight}>
                  {feature}
                </span>
              ))}
            </div>

            <Link href="/espacos" className="btn-outline btn-lg">
              {homeContent.aboutCtaLabel}
            </Link>
          </div>
        </div>
      </section>

      <section className={styles.statementSection}>
        <div className="container">
          <div className={styles.statementCard}>
            <span className="eyebrow">{homeContent.eventsSectionLabel}</span>
            <h2>{homeContent.eventsSectionTitle}</h2>
            <p>{homeContent.eventsSectionSubtitle}</p>
          </div>
        </div>
      </section>

      <section className={styles.showcaseSection}>
        <div className="container">
          {showcaseCards.map(({ event, imageUrl, category }, index) => (
            <article
              key={`${event.title}-${index}`}
              className={`${styles.showcaseRow} ${index % 2 === 1 ? styles.showcaseRowReverse : ''}`}
            >
              <div className={`${styles.showcaseVisual} surfaceCard`}>
                {imageUrl ? (
                  <div
                    className={styles.showcaseImage}
                    style={{ backgroundImage: `url(${imageUrl})` }}
                  />
                ) : (
                  <div className={styles.showcaseFallback}>
                    <VisualPlaceholder
                      label={getCategoryLabel(category, galleryContent.categories)}
                      title={event.title}
                      description={event.desc}
                    />
                  </div>
                )}
              </div>

              <div className={styles.showcaseContent}>
                <span className="eyebrow">{event.title}</span>
                <h2>{event.title}</h2>
                <p>{event.desc}</p>
                <div className={styles.showcaseActions}>
                  <Link href="/galeria" className="btn-outline">
                    Ver galeria
                  </Link>
                  <Link href="/agendar" className="btn-primary">
                    Agendar visita
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.differenceSection}>
        <div className="container">
          <div className={styles.differenceHeader}>
            <span className="eyebrow">Diferenciais</span>
            <h2>O espaço une atmosfera, operação e flexibilidade para eventos que pedem mais.</h2>
          </div>

          <div className={styles.differenceGrid}>
            {differenceCards.map((item) => (
              <article key={item.title} className={`${styles.differenceCard} surfaceCard`}>
                <div className={styles.differenceIcon}>{resolveContentIcon(item.icon)}</div>
                <p className={styles.differenceEyebrow}>{item.eyebrow}</p>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.gallerySection}>
        <div className="container">
          <div className={styles.galleryHeader}>
            <div>
              <span className="eyebrow">{galleryContent.heroLabel}</span>
              <h2>{galleryContent.heroTitle}</h2>
            </div>
            <Link href="/galeria" className="btn-outline">
              Explorar galeria
            </Link>
          </div>

          <div className={styles.galleryRail}>
            {galleryPreview.map((item) => (
              <div key={`${item.id}-${item.originalName}`} className={styles.galleryCard}>
                {item.filename ? (
                  item.mimeType.startsWith('image/') ? (
                    <div
                      className={styles.galleryCardImage}
                      style={{ backgroundImage: `url(${getMediaUrl(item)})` }}
                    />
                  ) : (
                    <div className={styles.galleryCardFallback}>
                      <VisualPlaceholder
                        compact
                        label="Vídeo"
                        title={item.caption || item.originalName}
                        description={getCategoryLabel(item.category, galleryContent.categories)}
                      />
                    </div>
                  )
                ) : (
                  <div className={styles.galleryCardFallback}>
                    <VisualPlaceholder
                      compact
                      label={getCategoryLabel(item.category, galleryContent.categories)}
                      title={item.caption || item.originalName}
                    />
                  </div>
                )}
                <div className={styles.galleryCardBody}>
                  <strong>{item.caption || item.originalName}</strong>
                  <span>{getCategoryLabel(item.category, galleryContent.categories)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
