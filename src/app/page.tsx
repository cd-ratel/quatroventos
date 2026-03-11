'use client';

import Link from 'next/link';
import { useSiteSettings } from '@/components/SiteSettingsProvider';
import { resolveContentIcon } from '@/lib/content-icons';
import { useCountUp, useScrollAnimation } from '@/hooks/useAnimations';
import styles from './page.module.css';

function StatItem({
  end,
  label,
  suffix = '',
}: {
  end: number;
  label: string;
  suffix?: string;
}) {
  const { count, ref } = useCountUp(end, 2500);

  return (
    <div className={styles.statItem} ref={ref}>
      <div className={styles.statNumber}>
        {count}
        {suffix}
      </div>
      <div className={styles.statLabel}>{label}</div>
    </div>
  );
}

export default function HomePage() {
  const { homeContent } = useSiteSettings();
  const aboutAnim = useScrollAnimation();
  const taglineAnim = useScrollAnimation();
  const statsAnim = useScrollAnimation();
  const ctaAnim = useScrollAnimation();

  return (
    <>
      {/* ── HERO (full-screen banner like Maggiore) ── */}
      <section className={styles.hero}>
        <div className={styles.heroBg} />
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            {homeContent.heroTitle}
            <span className={styles.heroTitleAccent}>
              {homeContent.heroTitleAccent}
            </span>
          </h1>
        </div>
        <div className={styles.heroScroll}>
          <span className={styles.scrollLine} />
        </div>
      </section>

      {/* ── ABOUT (two-column: logo+text left, image right, like Maggiore) ── */}
      <section className={styles.aboutSection}>
        <div className="container">
          <div
            ref={aboutAnim.ref}
            className={`${styles.aboutRow} animate-on-scroll ${aboutAnim.isVisible ? 'visible' : ''}`}
          >
            <div className={styles.aboutLeft}>
              <div className={styles.aboutLogo}>QV</div>
              {homeContent.aboutParagraphs.map((paragraph, index) => (
                <p key={`${paragraph.slice(0, 20)}-${index}`} className={styles.aboutText}>
                  {paragraph}
                </p>
              ))}
              <Link href="/espacos" className={`btn btn-outline ${styles.aboutBtn}`}>
                {homeContent.aboutCtaLabel}
              </Link>
            </div>
            <div className={styles.aboutRight}>
              <div className={styles.aboutImagePlaceholder}>
                <span>🏛️</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TAGLINE (centered quote like Maggiore) ── */}
      <section className={styles.taglineSection}>
        <div className="container">
          <div
            ref={taglineAnim.ref}
            className={`${styles.taglineInner} animate-on-scroll ${taglineAnim.isVisible ? 'visible' : ''}`}
          >
            <h3 className={styles.taglineText}>
              {homeContent.heroSubtitle}
            </h3>
          </div>
        </div>
      </section>

      {/* ── EVENT SECTIONS (alternating image+text rows like Maggiore) ── */}
      {homeContent.events.map((event, index) => (
        <EventSection key={`${event.title}-${event.icon}`} event={event} index={index} />
      ))}

      {/* ── DIFFERENTIALS (3-column grid like Maggiore "Diferenciais") ── */}
      <section className={styles.differentials}>
        <div className="container">
          <h2 className={styles.differentialsTitle}>
            Diferenciais Quatro Ventos
          </h2>
          <div className={styles.differentialsGrid}>
            {homeContent.features.slice(0, 3).map((feature, index) => {
              const icons = ['🌿', '🏠', '🍽️'];
              const subtitles = [
                'Espaço acolhedor em meio à natureza, proporcionando um ambiente único para eventos.',
                'Múltiplos ambientes que podem ser utilizados juntos ou separadamente para cada tipo de evento.',
                'Gastronomia sofisticada com cardápios personalizados para atender cada ocasião.',
              ];
              return (
                <div key={feature} className={styles.differentialCard}>
                  <div className={styles.differentialImagePlaceholder}>
                    <span>{icons[index]}</span>
                  </div>
                  <h3 className={styles.differentialName}>{feature}</h3>
                  <p className={styles.differentialDesc}>{subtitles[index]}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section className={styles.stats}>
        <div className="container" ref={statsAnim.ref}>
          <div className={`${styles.statsGrid} ${statsAnim.isVisible ? 'visible' : ''}`}>
            {homeContent.stats.map((stat) => (
              <StatItem
                key={`${stat.label}-${stat.value}`}
                end={stat.value}
                suffix={stat.suffix}
                label={stat.label}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA (contact section like Maggiore footer CTA) ── */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaBg} />
        <div
          ref={ctaAnim.ref}
          className={`container ${styles.ctaInner} animate-on-scroll ${ctaAnim.isVisible ? 'visible' : ''}`}
        >
          <div className={styles.ctaLeft}>
            <h2 className={styles.ctaTitle}>{homeContent.ctaTitle}</h2>
            <p className={styles.ctaSubtitle}>{homeContent.ctaSubtitle}</p>
          </div>
          <div className={styles.ctaRight}>
            <Link href="/agendar" className="btn btn-primary btn-lg">
              {homeContent.ctaPrimaryLabel}
            </Link>
            <Link href="/contato" className="btn btn-white btn-lg">
              {homeContent.ctaSecondaryLabel}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

/* Alternating event row component (image left / right like Maggiore) */
function EventSection({
  event,
  index,
}: {
  event: { icon: string; title: string; desc: string };
  index: number;
}) {
  const anim = useScrollAnimation();
  const isEven = index % 2 === 0;

  return (
    <section
      ref={anim.ref}
      className={`${styles.eventSection} ${isEven ? '' : styles.eventSectionAlt} animate-on-scroll ${anim.isVisible ? 'visible' : ''}`}
    >
      <div className={`container ${styles.eventRow}`}>
        <div className={styles.eventImage}>
          <div className={styles.eventImagePlaceholder}>
            <span className={styles.eventPlaceholderIcon}>
              {resolveContentIcon(event.icon)}
            </span>
          </div>
        </div>
        <div className={styles.eventContent}>
          <h2 className={styles.eventTitle}>{event.title}</h2>
          <p className={styles.eventDesc}>{event.desc}</p>
          <Link href="/espacos" className="btn btn-outline">
            Saiba mais
          </Link>
        </div>
      </div>
    </section>
  );
}
