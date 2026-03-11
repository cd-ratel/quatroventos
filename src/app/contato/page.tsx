'use client';

import { FormEvent, useState } from 'react';
import { useSiteSettings } from '@/components/SiteSettingsProvider';
import { resolveContentIcon } from '@/lib/content-icons';
import styles from './page.module.css';

export default function ContatoPage() {
  const { contactContent } = useSiteSettings();
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const body = Object.fromEntries(formData.entries());

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setSent(true);
      }
    } catch {
      // ignore fetch errors and keep the current form state
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className={styles.contactHero}>
        <div className="container">
          <span className="section-label">{contactContent.heroLabel}</span>
          <h1 className="section-title">{contactContent.heroTitle}</h1>
          <hr className="divider" />
          <p className="section-subtitle">{contactContent.heroSubtitle}</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className={styles.contactGrid}>
            <div className={styles.contactInfo}>
              {contactContent.cards.map((card) => (
                <div key={`${card.title}-${card.icon}`} className={styles.contactCard}>
                  <span className={styles.cardIcon}>{resolveContentIcon(card.icon)}</span>
                  <h3 className={styles.cardTitle}>{card.title}</h3>
                  <p className={styles.cardText}>
                    {card.lines.map((line) => (
                      <span key={`${card.title}-${line}`} style={{ display: 'block' }}>
                        {line}
                      </span>
                    ))}
                  </p>
                  {card.buttonLabel && card.buttonUrl ? (
                    <a
                      href={card.buttonUrl}
                      className={styles.whatsappBtn}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {card.buttonLabel}
                    </a>
                  ) : null}
                </div>
              ))}
            </div>

            <div className={styles.formWrapper}>
              {sent ? (
                <div className={styles.successState}>
                  <span className={styles.successIcon}>OK</span>
                  <h3>{contactContent.formSuccessTitle}</h3>
                  <p>{contactContent.formSuccessMessage}</p>
                  <button className="btn btn-outline" onClick={() => setSent(false)}>
                    {contactContent.formResetLabel}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <h2 className={styles.formTitle}>{contactContent.formTitle}</h2>
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
                      <label className="form-label">Email</label>
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
                      rows={6}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg"
                    style={{ width: '100%' }}
                    disabled={loading}
                  >
                    {loading ? <span className="spinner" /> : 'Enviar Mensagem'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className={styles.mapSection}>
        <div className={styles.mapPlaceholder}>
          <span>MAP</span>
          <p>
            {contactContent.mapPlaceholderTitle}
            <br />
            <small>{contactContent.mapPlaceholderSubtitle}</small>
          </p>
        </div>
      </section>
    </>
  );
}
