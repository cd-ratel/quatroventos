'use client';

import Link from 'next/link';
import { useSiteSettings } from '@/components/SiteSettingsProvider';
import { useCountUp, useScrollAnimation } from '@/hooks/useAnimations';
import styles from './page.module.css';

function HeroParticles() {
  const particles = Array.from({ length: 30 }, (_, index) => ({
    id: index,
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 8}s`,
    duration: `${6 + Math.random() * 6}s`,
    size: `${2 + Math.random() * 3}px`,
  }));

  return (
    <div className={styles.heroParticles}>
      {particles.map((particle) => (
        <span
          key={particle.id}
          className={styles.particle}
          style={{
            left: particle.left,
            animationDelay: particle.delay,
            animationDuration: particle.duration,
            width: particle.size,
            height: particle.size,
          }}
        />
      ))}
    </div>
  );
}

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
  const eventsAnim = useScrollAnimation();
  const statsAnim = useScrollAnimation();
  const aboutAnim = useScrollAnimation();
  const ctaAnim = useScrollAnimation();

  return (
    <>
      <section className={styles.hero}>
        <div className={styles.heroBg} />
        <HeroParticles />
        <div className={styles.heroContent}>
          <p className={styles.heroLabel}>{homeContent.heroLabel}</p>
          <h1 className={styles.heroTitle}>
            {homeContent.heroTitle}
            <span className={styles.heroTitleAccent}>
              {homeContent.heroTitleAccent}
            </span>
          </h1>
          <p className={styles.heroSubtitle}>{homeContent.heroSubtitle}</p>
          <div className={styles.heroCta}>
            <Link href="/agendar" className="btn btn-primary btn-lg">
              {homeContent.primaryCtaLabel}
            </Link>
            <Link href="/espacos" className="btn btn-outline btn-lg">
              {homeContent.secondaryCtaLabel}
            </Link>
          </div>
        </div>

        <div className={styles.heroScroll}>
          <span>Explore</span>
          <span className={styles.scrollLine} />
        </div>
      </section>

      <section className={styles.events}>
        <div className={styles.eventsBg} />
        <div className="container">
          <div
            ref={eventsAnim.ref}
            className={`section-header animate-on-scroll ${eventsAnim.isVisible ? 'visible' : ''}`}
          >
            <span className="section-label">{homeContent.eventsSectionLabel}</span>
            <h2 className="section-title">{homeContent.eventsSectionTitle}</h2>
            <hr className="divider" />
            <p className="section-subtitle">{homeContent.eventsSectionSubtitle}</p>
          </div>

          <div
            className={`${styles.eventsGrid} stagger ${eventsAnim.isVisible ? 'visible' : ''}`}
          >
            {homeContent.events.map((event) => (
              <div key={`${event.title}-${event.icon}`} className={styles.eventCard}>
                <span className={styles.eventIcon}>{event.icon}</span>
                <h3 className={styles.eventTitle}>{event.title}</h3>
                <p className={styles.eventDesc}>{event.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

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

      <section className={styles.about}>
        <div className="container">
          <div
            ref={aboutAnim.ref}
            className={`${styles.aboutGrid} animate-on-scroll ${aboutAnim.isVisible ? 'visible' : ''}`}
          >
            <div className={styles.aboutImageWrapper}>
              <div
                className={styles.aboutImage}
                style={{
                  background:
                    'linear-gradient(135deg, var(--color-navy-medium), var(--color-navy-light))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '4rem',
                }}
              >
                QV
              </div>
              <div className={styles.aboutDecorative} />
            </div>

            <div className={styles.aboutContent}>
              <span className="section-label">{homeContent.aboutSectionLabel}</span>
              <h2 className="section-title">{homeContent.aboutSectionTitle}</h2>

              {homeContent.aboutParagraphs.map((paragraph, index) => (
                <p key={`${paragraph.slice(0, 20)}-${index}`} className={styles.aboutText}>
                  {paragraph}
                </p>
              ))}

              <div className={styles.aboutFeatures}>
                {homeContent.features.map((feature) => (
                  <div key={feature} className={styles.featureItem}>
                    <span className={styles.featureCheck}>+</span>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <Link
                href="/espacos"
                className="btn btn-outline"
                style={{ alignSelf: 'flex-start' }}
              >
                {homeContent.aboutCtaLabel}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.cta}>
        <div className={styles.ctaBg} />
        <div
          ref={ctaAnim.ref}
          className={`${styles.ctaContent} animate-on-scroll ${ctaAnim.isVisible ? 'visible' : ''}`}
        >
          <span className="section-label">{homeContent.ctaLabel}</span>
          <h2 className={styles.ctaTitle}>{homeContent.ctaTitle}</h2>
          <p className={styles.ctaSubtitle}>{homeContent.ctaSubtitle}</p>
          <div className={styles.ctaButtons}>
            <Link href="/agendar" className="btn btn-primary btn-lg">
              {homeContent.ctaPrimaryLabel}
            </Link>
            <Link href="/contato" className="btn btn-glass btn-lg">
              {homeContent.ctaSecondaryLabel}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
