'use client';

import Link from 'next/link';
import { useScrollAnimation, useCountUp } from '@/hooks/useAnimations';
import styles from './page.module.css';

const events = [
  {
    icon: '💒',
    title: 'Casamentos',
    desc: 'Celebre o dia mais especial da sua vida em um cenário encantador, com toda a elegância e sofisticação que esse momento merece.',
  },
  {
    icon: '🎈',
    title: 'Festas Infantis',
    desc: 'Um espaço mágico e seguro para criar memórias inesquecíveis. Diversão garantida para os pequenos e conforto para os adultos.',
  },
  {
    icon: '🏢',
    title: 'Reuniões & Eventos',
    desc: 'Ambiente profissional e versátil para reuniões corporativas, workshops, confraternizações e eventos empresariais.',
  },
];

const features = [
  'Estacionamento amplo',
  'Equipe dedicada',
  'Cozinha industrial',
  'Ar-condicionado',
  'Som profissional',
  'Acessibilidade',
  'Área externa',
  'Segurança 24h',
];

// Floating particles for the hero (gold dots)
function HeroParticles() {
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 8}s`,
    duration: `${6 + Math.random() * 6}s`,
    size: `${2 + Math.random() * 3}px`,
  }));

  return (
    <div className={styles.heroParticles}>
      {particles.map((p) => (
        <span
          key={p.id}
          className={styles.particle}
          style={{
            left: p.left,
            animationDelay: p.delay,
            animationDuration: p.duration,
            width: p.size,
            height: p.size,
          }}
        />
      ))}
    </div>
  );
}

function StatItem({ end, label, suffix = '' }: { end: number; label: string; suffix?: string }) {
  const { count, ref } = useCountUp(end, 2500);
  return (
    <div className={styles.statItem} ref={ref}>
      <div className={styles.statNumber}>
        {count}{suffix}
      </div>
      <div className={styles.statLabel}>{label}</div>
    </div>
  );
}

export default function HomePage() {
  const eventsAnim = useScrollAnimation();
  const statsAnim = useScrollAnimation();
  const aboutAnim = useScrollAnimation();
  const ctaAnim = useScrollAnimation();

  return (
    <>
      {/* ── Hero Section ── */}
      <section className={styles.hero}>
        <div className={styles.heroBg} />
        <HeroParticles />
        <div className={styles.heroContent}>
          <p className={styles.heroLabel}>Espaço para Eventos</p>
          <h1 className={styles.heroTitle}>
            Transformamos Sonhos em
            <span className={styles.heroTitleAccent}>Celebrações Inesquecíveis</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Um espaço sofisticado e versátil, projetado para tornar cada evento
            único e cada momento, eterno.
          </p>
          <div className={styles.heroCta}>
            <Link href="/agendar" className="btn btn-primary btn-lg">
              Agendar Visita
            </Link>
            <Link href="/espacos" className="btn btn-outline btn-lg">
              Conheça os Espaços
            </Link>
          </div>
        </div>

        <div className={styles.heroScroll}>
          <span>Explore</span>
          <span className={styles.scrollLine} />
        </div>
      </section>

      {/* ── Events Section ── */}
      <section className={styles.events}>
        <div className={styles.eventsBg} />
        <div className="container">
          <div
            ref={eventsAnim.ref}
            className={`section-header animate-on-scroll ${eventsAnim.isVisible ? 'visible' : ''}`}
          >
            <span className="section-label">Nossos Eventos</span>
            <h2 className="section-title">Cada Celebração é Única</h2>
            <hr className="divider" />
            <p className="section-subtitle">
              Do íntimo ao grandioso, nosso espaço se adapta para realizar o evento dos seus sonhos
            </p>
          </div>

          <div
            className={`${styles.eventsGrid} stagger ${eventsAnim.isVisible ? 'visible' : ''}`}
          >
            {events.map((event) => (
              <div key={event.title} className={styles.eventCard}>
                <span className={styles.eventIcon}>{event.icon}</span>
                <h3 className={styles.eventTitle}>{event.title}</h3>
                <p className={styles.eventDesc}>{event.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats Section ── */}
      <section className={styles.stats}>
        <div
          className="container"
          ref={statsAnim.ref}
        >
          <div className={`${styles.statsGrid} ${statsAnim.isVisible ? 'visible' : ''}`}>
            <StatItem end={500} suffix="+" label="Eventos Realizados" />
            <StatItem end={98} suffix="%" label="Clientes Satisfeitos" />
            <StatItem end={15} label="Anos de Experiência" />
            <StatItem end={3} label="Espaços Exclusivos" />
          </div>
        </div>
      </section>

      {/* ── About Section ── */}
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
                  background: 'linear-gradient(135deg, var(--color-navy-medium), var(--color-navy-light))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '4rem',
                }}
              >
                🏛️
              </div>
              <div className={styles.aboutDecorative} />
            </div>

            <div className={styles.aboutContent}>
              <span className="section-label">Sobre Nós</span>
              <h2 className="section-title">Um Espaço Pensado em Cada Detalhe</h2>
              <p className={styles.aboutText}>
                O Quatro Ventos nasceu da paixão por criar momentos especiais.
                Com ambientes cuidadosamente projetados e uma equipe dedicada,
                oferecemos a estrutura ideal para que cada evento seja único e inesquecível.
              </p>
              <p className={styles.aboutText}>
                Nossa missão é proporcionar experiências memoráveis, com conforto,
                elegância e todo o suporte necessário para que você aproveite cada instante.
              </p>

              <div className={styles.aboutFeatures}>
                {features.map((f) => (
                  <div key={f} className={styles.featureItem}>
                    <span className={styles.featureCheck}>✦</span>
                    <span>{f}</span>
                  </div>
                ))}
              </div>

              <Link href="/espacos" className="btn btn-outline" style={{ alignSelf: 'flex-start' }}>
                Explorar Espaços
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className={styles.cta}>
        <div className={styles.ctaBg} />
        <div
          ref={ctaAnim.ref}
          className={`${styles.ctaContent} animate-on-scroll ${ctaAnim.isVisible ? 'visible' : ''}`}
        >
          <span className="section-label">Comece Agora</span>
          <h2 className={styles.ctaTitle}>
            Pronto para Conhecer Nosso Espaço?
          </h2>
          <p className={styles.ctaSubtitle}>
            Agende uma visita sem compromisso e descubra como podemos tornar o seu evento inesquecível.
          </p>
          <div className={styles.ctaButtons}>
            <Link href="/agendar" className="btn btn-primary btn-lg">
              Agendar Visita Gratuita
            </Link>
            <Link href="/contato" className="btn btn-glass btn-lg">
              Fale Conosco
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
