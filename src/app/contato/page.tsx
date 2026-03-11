'use client';

import { useState, FormEvent } from 'react';
import styles from './page.module.css';

export default function ContatoPage() {
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
      if (res.ok) setSent(true);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className={styles.contactHero}>
        <div className="container">
          <span className="section-label">Contato</span>
          <h1 className="section-title">Fale Conosco</h1>
          <hr className="divider" />
          <p className="section-subtitle">
            Estamos prontos para ajudá-lo a planejar o evento perfeito.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className={styles.contactGrid}>
            {/* Contact Info */}
            <div className={styles.contactInfo}>
              <div className={styles.contactCard}>
                <span className={styles.cardIcon}>📍</span>
                <h3 className={styles.cardTitle}>Endereço</h3>
                <p className={styles.cardText}>
                  Rua Exemplo, 123<br />
                  Centro - Cidade/UF<br />
                  CEP: 00000-000
                </p>
              </div>

              <div className={styles.contactCard}>
                <span className={styles.cardIcon}>📞</span>
                <h3 className={styles.cardTitle}>Telefone</h3>
                <p className={styles.cardText}>(00) 00000-0000</p>
                <a href="https://wa.me/5500000000000" className={styles.whatsappBtn} target="_blank" rel="noopener noreferrer">
                  💬 WhatsApp
                </a>
              </div>

              <div className={styles.contactCard}>
                <span className={styles.cardIcon}>✉️</span>
                <h3 className={styles.cardTitle}>Email</h3>
                <p className={styles.cardText}>contato@quatroventos.com.br</p>
              </div>

              <div className={styles.contactCard}>
                <span className={styles.cardIcon}>🕐</span>
                <h3 className={styles.cardTitle}>Horário de Atendimento</h3>
                <p className={styles.cardText}>
                  Seg à Sex: 09h às 18h<br />
                  Sábado: 09h às 14h<br />
                  Domingo: Fechado
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div className={styles.formWrapper}>
              {sent ? (
                <div className={styles.successState}>
                  <span className={styles.successIcon}>✅</span>
                  <h3>Mensagem Enviada!</h3>
                  <p>Retornaremos em breve.</p>
                  <button className="btn btn-outline" onClick={() => setSent(false)}>
                    Nova Mensagem
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <h2 className={styles.formTitle}>Envie uma Mensagem</h2>
                  <div className={styles.formRow}>
                    <div className="form-group">
                      <label className="form-label">Nome</label>
                      <input type="text" name="name" className="form-input" placeholder="Seu nome" required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email</label>
                      <input type="email" name="email" className="form-input" placeholder="seu@email.com" required />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Assunto</label>
                    <input type="text" name="subject" className="form-input" placeholder="Assunto da mensagem" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Mensagem</label>
                    <textarea name="message" className="form-textarea" placeholder="Escreva sua mensagem..." rows={6} required />
                  </div>
                  <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
                    {loading ? <span className="spinner" /> : 'Enviar Mensagem'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className={styles.mapSection}>
        <div className={styles.mapPlaceholder}>
          <span>🗺️</span>
          <p>Mapa será exibido aqui<br /><small>Configure o Google Maps embed nas configurações</small></p>
        </div>
      </section>
    </>
  );
}
