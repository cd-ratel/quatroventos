'use client';

import { useState, FormEvent } from 'react';
import styles from './page.module.css';

const eventTypes = [
  { value: 'wedding', label: 'Casamento' },
  { value: 'children', label: 'Festa Infantil' },
  { value: 'corporate', label: 'Reunião / Corporativo' },
  { value: 'debutante', label: 'Debutante' },
  { value: 'party', label: 'Confraternização' },
  { value: 'other', label: 'Outro' },
];

const timeSlots = [
  '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00',
];

export default function AgendarPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (form: FormData): boolean => {
    const errs: Record<string, string> = {};
    if (!form.get('name')) errs.name = 'Nome é obrigatório';
    if (!form.get('email')) errs.email = 'Email é obrigatório';
    if (!form.get('phone')) errs.phone = 'Telefone é obrigatório';
    if (!form.get('date')) errs.date = 'Selecione uma data';
    if (!form.get('timeSlot')) errs.timeSlot = 'Selecione um horário';
    if (!form.get('eventType')) errs.eventType = 'Selecione o tipo do evento';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    if (!validate(formData)) return;

    setLoading(true);
    try {
      const body = Object.fromEntries(formData.entries());
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        const data = await res.json();
        setErrors({ form: data.error || 'Erro ao enviar. Tente novamente.' });
      }
    } catch {
      setErrors({ form: 'Erro de conexão. Tente novamente.' });
    } finally {
      setLoading(false);
    }
  };

  // Get minimum date (tomorrow)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <div className={styles.bookingPage}>
      <div className="container">
        <div className={styles.bookingGrid}>
          {/* Left — Info */}
          <div className={styles.bookingInfo}>
            <span className="section-label">Agendamento</span>
            <h1 className={styles.bookingTitle}>Agende Sua Visita</h1>
            <p className={styles.bookingSubtitle}>
              Conheça nosso espaço pessoalmente! Agende uma visita gratuita em horário
              comercial e descubra o cenário perfeito para o seu evento.
            </p>

            <div className={styles.infoCards}>
              <div className={styles.infoCard}>
                <span className={styles.infoCardIcon}>🕐</span>
                <div>
                  <div className={styles.infoCardTitle}>Horário Comercial</div>
                  <div className={styles.infoCardDesc}>
                    Seg à Sex: 09h às 18h | Sáb: 09h às 14h
                  </div>
                </div>
              </div>
              <div className={styles.infoCard}>
                <span className={styles.infoCardIcon}>⏱️</span>
                <div>
                  <div className={styles.infoCardTitle}>Duração da Visita</div>
                  <div className={styles.infoCardDesc}>
                    Aproximadamente 30 a 45 minutos
                  </div>
                </div>
              </div>
              <div className={styles.infoCard}>
                <span className={styles.infoCardIcon}>✨</span>
                <div>
                  <div className={styles.infoCardTitle}>Visita Personalizada</div>
                  <div className={styles.infoCardDesc}>
                    Tour completo por todos os espaços com atendimento exclusivo
                  </div>
                </div>
              </div>
              <div className={styles.infoCard}>
                <span className={styles.infoCardIcon}>💰</span>
                <div>
                  <div className={styles.infoCardTitle}>Sem Compromisso</div>
                  <div className={styles.infoCardDesc}>
                    Visita gratuita e sem obrigação de contratação
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right — Form */}
          <div className={styles.formCard}>
            {submitted ? (
              <div className={styles.successState}>
                <span className={styles.successIcon}>🎉</span>
                <h3 className={styles.successTitle}>Agendamento Confirmado!</h3>
                <p className={styles.successMsg}>
                  Recebemos seu agendamento com sucesso. Entraremos em contato
                  em breve para confirmar os detalhes da sua visita.
                </p>
                <button
                  className="btn btn-outline"
                  onClick={() => setSubmitted(false)}
                >
                  Novo Agendamento
                </button>
              </div>
            ) : (
              <>
                <h2 className={styles.formTitle}>Preencha os Dados</h2>
                <p className={styles.formSubtitle}>
                  Todos os campos são obrigatórios
                </p>

                <form onSubmit={handleSubmit}>
                  <div className={styles.formRow}>
                    <div className="form-group">
                      <label className="form-label">Nome Completo</label>
                      <input
                        type="text"
                        name="name"
                        className="form-input"
                        placeholder="Seu nome"
                      />
                      {errors.name && <p className={styles.fieldError}>{errors.name}</p>}
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        name="email"
                        className="form-input"
                        placeholder="seu@email.com"
                      />
                      {errors.email && <p className={styles.fieldError}>{errors.email}</p>}
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className="form-group">
                      <label className="form-label">Telefone / WhatsApp</label>
                      <input
                        type="tel"
                        name="phone"
                        className="form-input"
                        placeholder="(00) 00000-0000"
                      />
                      {errors.phone && <p className={styles.fieldError}>{errors.phone}</p>}
                    </div>
                    <div className="form-group">
                      <label className="form-label">Tipo do Evento</label>
                      <select name="eventType" className="form-select">
                        <option value="">Selecione...</option>
                        {eventTypes.map((t) => (
                          <option key={t.value} value={t.value}>{t.label}</option>
                        ))}
                      </select>
                      {errors.eventType && <p className={styles.fieldError}>{errors.eventType}</p>}
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className="form-group">
                      <label className="form-label">Data da Visita</label>
                      <input
                        type="date"
                        name="date"
                        className="form-input"
                        min={minDate}
                      />
                      {errors.date && <p className={styles.fieldError}>{errors.date}</p>}
                    </div>
                    <div className="form-group">
                      <label className="form-label">Horário</label>
                      <select name="timeSlot" className="form-select">
                        <option value="">Selecione...</option>
                        {timeSlots.map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                      {errors.timeSlot && <p className={styles.fieldError}>{errors.timeSlot}</p>}
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Número de Convidados (estimado)</label>
                    <input
                      type="number"
                      name="guests"
                      className="form-input"
                      placeholder="Ex: 150"
                      min="1"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Mensagem (opcional)</label>
                    <textarea
                      name="message"
                      className="form-textarea"
                      placeholder="Conte-nos mais sobre o evento que você planeja..."
                      rows={4}
                    />
                  </div>

                  {errors.form && (
                    <p className={styles.fieldError} style={{ marginBottom: 'var(--space-md)' }}>
                      {errors.form}
                    </p>
                  )}

                  <button
                    type="submit"
                    className={`btn btn-primary btn-lg ${styles.submitBtn}`}
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="spinner" />
                    ) : (
                      'Confirmar Agendamento'
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
