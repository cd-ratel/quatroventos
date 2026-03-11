'use client';

import { FormEvent, useMemo, useState } from 'react';
import { useSiteSettings } from '@/components/SiteSettingsProvider';
import { resolveContentIcon } from '@/lib/content-icons';
import styles from './page.module.css';

function normalizePhone(phone: string) {
  return phone.replace(/\D/g, '');
}

function formatBusinessHours(
  businessHours: Record<string, { open: string; close: string } | null>
) {
  const entries = [
    ['Seg. a Sex.', ['mon', 'tue', 'wed', 'thu', 'fri']],
    ['Sábado', ['sat']],
    ['Domingo', ['sun']],
  ] as const;

  return entries.map(([label, days]) => {
    const values = days
      .map((day) => businessHours[day])
      .filter((value): value is { open: string; close: string } => Boolean(value));

    if (values.length === 0) {
      return `${label}: Fechado`;
    }

    const first = values[0];
    const sameRange = values.every(
      (value) => value.open === first.open && value.close === first.close
    );

    if (!sameRange) {
      return `${label}: horários sob consulta`;
    }

    return `${label}: ${first.open} às ${first.close}`;
  });
}

export default function ContatoPage() {
  const settings = useSiteSettings();
  const { contactContent } = settings;
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const whatsappHref = useMemo(
    () => `https://wa.me/${normalizePhone(settings.whatsapp || settings.phone)}`,
    [settings.phone, settings.whatsapp]
  );
  const businessHours = useMemo(
    () => formatBusinessHours(settings.businessHours),
    [settings.businessHours]
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const body = Object.fromEntries(formData.entries());

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        setSent(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="pageHero">
        <div className="container">
          <span className="section-label">{contactContent.heroLabel}</span>
          <h1 className="section-title">{contactContent.heroTitle}</h1>
          <p className="section-subtitle">{contactContent.heroSubtitle}</p>
        </div>
      </section>

      <section className={styles.contactSection}>
        <div className={`container ${styles.contactGrid}`}>
          <div className={styles.contactInfo}>
            <div className={styles.infoCard}>
              <span className="eyebrow">Fale com o time</span>
              <h2>Escolha o melhor canal para o seu atendimento</h2>
              <p>
                Estamos prontos para apresentar o espaço, tirar dúvidas sobre
                formatos de evento e alinhar o melhor horário para uma visita.
              </p>
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="btn-primary">
                Conversar no WhatsApp
              </a>
            </div>

            <div className={styles.cardsGrid}>
              {contactContent.cards.map((card) => (
                <article key={`${card.title}-${card.icon}`} className={`${styles.contactCard} surfaceCard`}>
                  <span className={styles.cardIcon}>{resolveContentIcon(card.icon)}</span>
                  <h3>{card.title}</h3>
                  <div className={styles.cardLines}>
                    {card.lines.map((line) => (
                      <span key={`${card.title}-${line}`}>{line}</span>
                    ))}
                  </div>
                  {card.buttonLabel && card.buttonUrl ? (
                    <a
                      href={card.buttonUrl}
                      className={styles.cardLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {card.buttonLabel}
                    </a>
                  ) : null}
                </article>
              ))}
            </div>
          </div>

          <div className={`${styles.formPanel} surfaceCard`}>
            {sent ? (
              <div className={styles.successState}>
                <div className={styles.successIcon}>OK</div>
                <h2>{contactContent.formSuccessTitle}</h2>
                <p>{contactContent.formSuccessMessage}</p>
                <button type="button" className="btn-outline" onClick={() => setSent(false)}>
                  {contactContent.formResetLabel}
                </button>
              </div>
            ) : (
              <>
                <span className="eyebrow">Mensagem direta</span>
                <h2>{contactContent.formTitle}</h2>
                <form onSubmit={handleSubmit}>
                  <div className={styles.formRow}>
                    <div className="form-group">
                      <label className="form-label">Nome</label>
                      <input
                        type="text"
                        name="name"
                        className="form-input"
                        placeholder={contactContent.namePlaceholder}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">E-mail</label>
                      <input
                        type="email"
                        name="email"
                        className="form-input"
                        placeholder={contactContent.emailPlaceholder}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Assunto</label>
                    <input
                      type="text"
                      name="subject"
                      className="form-input"
                      placeholder={contactContent.subjectPlaceholder}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Mensagem</label>
                    <textarea
                      name="message"
                      className="form-textarea"
                      placeholder={contactContent.messagePlaceholder}
                      required
                    />
                  </div>

                  <button type="submit" className="btn-primary btn-lg" disabled={loading}>
                    {loading ? <span className="spinner" /> : 'Enviar mensagem'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </section>

      <section className={styles.supportSection}>
        <div className="container">
          <div className={styles.supportGrid}>
            <div className={`${styles.supportCard} surfaceCard`}>
              <span className="eyebrow">Horários</span>
              <h2>Atendimento e visitas</h2>
              <div className={styles.scheduleList}>
                {businessHours.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </div>
            </div>
            <div className={`${styles.mapCard} surfaceCard`}>
              <span className="eyebrow">Localização</span>
              <h2>{contactContent.mapPlaceholderTitle}</h2>
              <p>{settings.address}</p>
              <small>{contactContent.mapPlaceholderSubtitle}</small>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
