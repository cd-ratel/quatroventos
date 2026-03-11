'use client';

import Link from 'next/link';
import { useScrollAnimation } from '@/hooks/useAnimations';
import styles from './page.module.css';

const spaces = [
  {
    tag: 'Salão Principal',
    name: 'Salão Grand Ventus',
    desc: 'Nosso espaço principal, ideal para casamentos, formaturas e grandes celebrações. Com pé-direito duplo, iluminação cênica e capacidade para até 300 convidados, o Grand Ventus oferece a grandiosidade que seu evento merece.',
    icon: '✨',
    capacity: '300',
    area: '450m²',
  },
  {
    tag: 'Espaço Íntimo',
    name: 'Sala Brisa',
    desc: 'Perfeito para reuniões corporativas, workshops e eventos mais íntimos. Com equipamentos audiovisuais de última geração, layout flexível e ambiente climatizado, a Sala Brisa combina funcionalidade com elegância.',
    icon: '🌿',
    capacity: '80',
    area: '120m²',
  },
  {
    tag: 'Espaço Kids',
    name: 'Jardim dos Sonhos',
    desc: 'Um universo mágico para festas infantis! Com área interna e externa, brinquedoteca, espaço para recreação monitorada e decoração temática personalizável. Segurança e diversão em um só lugar.',
    icon: '🎪',
    capacity: '150',
    area: '280m²',
  },
];

const amenities = [
  { icon: '🅿️', name: 'Estacionamento' },
  { icon: '❄️', name: 'Ar-condicionado' },
  { icon: '🎵', name: 'Som Profissional' },
  { icon: '💡', name: 'Iluminação Cênica' },
  { icon: '🍽️', name: 'Cozinha Industrial' },
  { icon: '♿', name: 'Acessibilidade' },
  { icon: '📶', name: 'Wi-Fi Premium' },
  { icon: '🔒', name: 'Segurança' },
];

export default function EspacosPage() {
  const heroAnim = useScrollAnimation(0.1);
  const amenitiesAnim = useScrollAnimation();

  return (
    <>
      {/* Page Hero */}
      <section className={styles.pageHero}>
        <div className={styles.pageHeroDots} />
        <div
          className="container"
          ref={heroAnim.ref}
        >
          <span className="section-label">Nossos Espaços</span>
          <h1 className="section-title">Ambientes Pensados Para Cada Momento</h1>
          <hr className="divider" />
          <p className="section-subtitle">
            Três espaços únicos, cada um projetado para um tipo de celebração,
            todos com a mesma excelência e atenção aos detalhes.
          </p>
        </div>
      </section>

      {/* Spaces */}
      <section className="section">
        <div className="container">
          <div className={styles.spacesGrid}>
            {spaces.map((space, i) => {
              return (
                <SpaceRow key={space.name} space={space} index={i} />
              );
            })}
          </div>
        </div>
      </section>

      {/* Amenities */}
      <section className={styles.amenities}>
        <div className="container">
          <div
            ref={amenitiesAnim.ref}
            className={`section-header animate-on-scroll ${amenitiesAnim.isVisible ? 'visible' : ''}`}
          >
            <span className="section-label">Infraestrutura</span>
            <h2 className="section-title">Tudo Que Você Precisa</h2>
            <hr className="divider" />
          </div>
          <div className={`${styles.amenitiesGrid} stagger ${amenitiesAnim.isVisible ? 'visible' : ''}`}>
            {amenities.map((a) => (
              <div key={a.name} className={styles.amenityCard}>
                <span className={styles.amenityIcon}>{a.icon}</span>
                <span className={styles.amenityName}>{a.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section" style={{ textAlign: 'center' }}>
        <div className="container">
          <h2 className="section-title">Ficou Interessado?</h2>
          <p className="section-subtitle" style={{ marginBottom: 'var(--space-2xl)' }}>
            Agende uma visita e conheça nossos espaços pessoalmente.
          </p>
          <Link href="/agendar" className="btn btn-primary btn-lg">
            Agendar Visita Gratuita
          </Link>
        </div>
      </section>
    </>
  );
}

function SpaceRow({ space, index }: { space: typeof spaces[number]; index: number }) {
  const anim = useScrollAnimation();

  return (
    <div
      ref={anim.ref}
      className={`${styles.spaceRow} animate-on-scroll ${anim.isVisible ? 'visible' : ''}`}
    >
      <div className={styles.spaceImageWrapper}>
        <div className={styles.spaceImagePlaceholder}>{space.icon}</div>
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
            <span className={styles.spaceDetailLabel}>Área Total</span>
          </div>
        </div>
      </div>
    </div>
  );
}
