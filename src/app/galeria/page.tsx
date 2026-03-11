'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './page.module.css';

interface MediaItem {
  id: string;
  filename: string;
  originalName: string;
  category: string;
  caption: string | null;
  mimeType: string;
}

const categories = [
  { value: 'all', label: 'Todos' },
  { value: 'venue', label: 'Espaço' },
  { value: 'wedding', label: 'Casamentos' },
  { value: 'children', label: 'Festas Infantis' },
  { value: 'corporate', label: 'Corporativo' },
  { value: 'decoration', label: 'Decoração' },
];

const placeholderMedia: MediaItem[] = [
  { id: '1', filename: '', originalName: 'Salão Principal', category: 'venue', caption: 'Salão Grand Ventus', mimeType: 'image/jpeg' },
  { id: '2', filename: '', originalName: 'Decoração Casamento', category: 'wedding', caption: 'Mesa dos Noivos', mimeType: 'image/jpeg' },
  { id: '3', filename: '', originalName: 'Jardim Externo', category: 'venue', caption: 'Área Externa', mimeType: 'image/jpeg' },
  { id: '4', filename: '', originalName: 'Festa Infantil', category: 'children', caption: 'Espaço Kids', mimeType: 'image/jpeg' },
  { id: '5', filename: '', originalName: 'Buffet', category: 'venue', caption: 'Área do Buffet', mimeType: 'image/jpeg' },
  { id: '6', filename: '', originalName: 'Cerimônia', category: 'wedding', caption: 'Altar ao Ar Livre', mimeType: 'image/jpeg' },
  { id: '7', filename: '', originalName: 'Reunião', category: 'corporate', caption: 'Sala de Reuniões', mimeType: 'image/jpeg' },
  { id: '8', filename: '', originalName: 'Decoração', category: 'decoration', caption: 'Arranjo Floral', mimeType: 'image/jpeg' },
  { id: '9', filename: '', originalName: 'Pista de Dança', category: 'venue', caption: 'Pista de Dança', mimeType: 'image/jpeg' },
];

const placeholderIcons = ['🏛️', '💐', '🌳', '🎈', '🍽️', '💒', '🏢', '🌸', '💃'];

export default function GaleriaPage() {
  const [filter, setFilter] = useState('all');
  const [media, setMedia] = useState<MediaItem[]>(placeholderMedia);
  const [lightbox, setLightbox] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/media')
      .then((res) => res.json())
      .then((data) => {
        if (data.length > 0) setMedia(data);
      })
      .catch(() => { /* keep placeholders */ });
  }, []);

  const filtered = filter === 'all' ? media : media.filter((m) => m.category === filter);

  return (
    <>
      {/* Hero */}
      <section className={styles.pageHero || ''} style={{
        paddingTop: 'calc(var(--nav-height) + var(--space-4xl))',
        paddingBottom: 'var(--space-4xl)',
        textAlign: 'center',
        background: 'linear-gradient(180deg, var(--color-midnight), var(--color-navy))',
      }}>
        <div className="container">
          <span className="section-label">Galeria</span>
          <h1 className="section-title">Momentos que Encantam</h1>
          <hr className="divider" />
          <p className="section-subtitle">
            Confira registros dos nossos espaços e eventos que marcam vidas.
          </p>
        </div>
      </section>

      {/* Gallery */}
      <section className="section">
        <div className="container">
          {/* Filters */}
          <div className={styles.filters}>
            {categories.map((cat) => (
              <button
                key={cat.value}
                className={`${styles.filterBtn} ${filter === cat.value ? styles.active : ''}`}
                onClick={() => setFilter(cat.value)}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Grid */}
          {filtered.length > 0 ? (
            <div className={styles.galleryGrid}>
              {filtered.map((item, i) => (
                <div
                  key={item.id}
                  className={styles.galleryItem}
                  onClick={() => setLightbox(item.id)}
                >
                  {item.filename ? (
                    <Image
                      src={`/uploads/${item.filename}`}
                      alt={item.caption || item.originalName}
                      fill
                      style={{ objectFit: 'cover' }}
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  ) : (
                    <div className={styles.galleryPlaceholder}>
                      {placeholderIcons[i] || '📸'}
                    </div>
                  )}
                  <div className={styles.galleryOverlay}>
                    <span className={styles.galleryCaption}>
                      {item.caption || item.originalName}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <span className={styles.emptyIcon}>📷</span>
              <p>Nenhuma imagem encontrada nesta categoria.</p>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div className={styles.lightbox} onClick={() => setLightbox(null)}>
          <button className={styles.lightboxClose} onClick={() => setLightbox(null)}>✕</button>
          {(() => {
            const item = media.find((m) => m.id === lightbox);
            if (!item) return null;
            if (item.filename) {
              return (
                <Image
                  src={`/uploads/${item.filename}`}
                  alt={item.caption || ''}
                  width={1200}
                  height={800}
                  className={styles.lightboxImage}
                  style={{ objectFit: 'contain' }}
                />
              );
            }
            const idx = media.findIndex((m) => m.id === lightbox);
            return (
              <div style={{
                fontSize: '8rem',
                background: 'linear-gradient(135deg, var(--color-navy-medium), var(--color-navy-light))',
                padding: '4rem 6rem',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid var(--glass-border)',
              }}>
                {placeholderIcons[idx] || '📸'}
              </div>
            );
          })()}
        </div>
      )}
    </>
  );
}
