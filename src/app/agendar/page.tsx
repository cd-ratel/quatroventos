'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useSiteSettings } from '@/components/SiteSettingsProvider';
import { resolveContentIcon } from '@/lib/content-icons';
import styles from './page.module.css';

function getTomorrowDate() {
  const tomorrow = new Date();
  tomorrow.setHours(12, 0, 0, 0);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const year = tomorrow.getFullYear();
  const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
  const day = String(tomorrow.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export default function AgendarPage() {
  const { bookingContent } = useSiteSettings();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [unavailableSlots, setUnavailableSlots] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formKey, setFormKey] = useState(0);
  const minDate = useMemo(() => getTomorrowDate(), []);

  useEffect(() => {
    if (!selectedDate) {
      setUnavailableSlots([]);
      return;
    }

    let cancelled = false;

    fetch(`/api/appointments/availability?date=${selectedDate}`)
      .then((response) => response.json())
      .then((data) => {
        if (!cancelled) {
          setUnavailableSlots(Array.isArray(data.unavailableSlots) ? data.unavailableSlots : []);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setUnavailableSlots([]);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [selectedDate]);

  const validate = (form: FormData): boolean => {
    const nextErrors: Record<string, string> = {};

    if (!form.get('name')) nextErrors.name = 'Nome é obrigatório.';
    if (!form.get('email')) nextErrors.email = 'E-mail é obrigatório.';
    if (!form.get('phone')) nextErrors.phone = 'Telefone é obrigatório.';
    if (!form.get('date')) nextErrors.date = 'Selecione uma data';
    if (!form.get('timeSlot')) nextErrors.timeSlot = 'Selecione um horário';
    if (!form.get('eventType')) nextErrors.eventType = 'Selecione o tipo do evento';

    const requestedSlot = String(form.get('timeSlot') || '');
    if (requestedSlot && unavailableSlots.includes(requestedSlot)) {
      nextErrors.timeSlot = bookingContent.conflictMessage;
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const resetForm = () => {
    setSubmitted(false);
    setLoading(false);
    setSelectedDate('');
    setSelectedTimeSlot('');
    setUnavailableSlots([]);
    setErrors({});
    setFormKey((current) => current + 1);
  };

  const refreshAvailability = async (date: string) => {
    if (!date) {
      return;
    }

    const availability = await fetch(
      `/api/appointments/availability?date=${date}`
    ).then((response) => response.json());

    setUnavailableSlots(
      Array.isArray(availability.unavailableSlots) ? availability.unavailableSlots : []
    );
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    if (!validate(formData)) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const body = Object.fromEntries(formData.entries());
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setSubmitted(true);
        await refreshAvailability(selectedDate);
        return;
      }

      const data = await res.json();
      if (res.status === 409) {
        setErrors({ form: bookingContent.conflictMessage });
        await refreshAvailability(selectedDate);
      } else {
        setErrors({ form: data.error || 'Erro ao enviar. Tente novamente.' });
      }
    } catch {
      setErrors({ form: 'Erro de conexão. Tente novamente.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.bookingPage}>
      <div className="container">
        <div className={styles.bookingGrid}>
          <div className={styles.bookingInfo}>
            <span className="section-label">{bookingContent.heroLabel}</span>
            <h1 className={styles.bookingTitle}>{bookingContent.title}</h1>
            <p className={styles.bookingSubtitle}>{bookingContent.subtitle}</p>

            <div className={styles.infoCards}>
              {bookingContent.infoCards.map((card) => (
                <div key={`${card.title}-${card.icon}`} className={styles.infoCard}>
                  <span className={styles.infoCardIcon}>
                    {resolveContentIcon(card.icon)}
                  </span>
                  <div>
                    <div className={styles.infoCardTitle}>{card.title}</div>
                    <div className={styles.infoCardDesc}>{card.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.formCard}>
            {submitted ? (
              <div className={styles.successState}>
                <span className={styles.successIcon}>OK</span>
                <h3 className={styles.successTitle}>{bookingContent.successTitle}</h3>
                <p className={styles.successMsg}>{bookingContent.successMessage}</p>
                <button className="btn btn-outline" onClick={resetForm}>
                  {bookingContent.resetButtonLabel}
                </button>
              </div>
            ) : (
              <>
                <h2 className={styles.formTitle}>{bookingContent.formTitle}</h2>
                <p className={styles.formSubtitle}>{bookingContent.formSubtitle}</p>

                <form key={formKey} onSubmit={handleSubmit}>
                  <div className={styles.formRow}>
                    <div className="form-group">
                      <label className="form-label">Nome completo</label>
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
                      <label className="form-label">Tipo do evento</label>
                      <select name="eventType" className="form-select">
                        <option value="">Selecione...</option>
                        {bookingContent.eventTypes.map((eventType) => (
                          <option key={eventType.value} value={eventType.value}>
                            {eventType.label}
                          </option>
                        ))}
                      </select>
                      {errors.eventType && (
                        <p className={styles.fieldError}>{errors.eventType}</p>
                      )}
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className="form-group">
                      <label className="form-label">Data da visita</label>
                      <input
                        type="date"
                        name="date"
                        className="form-input"
                        min={minDate}
                        onChange={(event) => {
                          setSelectedDate(event.target.value);
                          setSelectedTimeSlot('');
                          setErrors((current) => {
                            const nextErrors = { ...current };
                            delete nextErrors.form;
                            delete nextErrors.timeSlot;
                            return nextErrors;
                          });
                        }}
                      />
                      {errors.date && <p className={styles.fieldError}>{errors.date}</p>}
                    </div>
                    <div className="form-group">
                      <label className="form-label">Horário</label>
                      <select
                        name="timeSlot"
                        className="form-select"
                        disabled={!selectedDate}
                        value={selectedTimeSlot}
                        onChange={(event) => setSelectedTimeSlot(event.target.value)}
                      >
                        <option value="">
                          {selectedDate ? 'Selecione...' : 'Escolha a data primeiro'}
                        </option>
                        {bookingContent.timeSlots.map((timeSlot) => {
                          const isUnavailable = unavailableSlots.includes(timeSlot);
                          return (
                            <option key={timeSlot} value={timeSlot} disabled={isUnavailable}>
                              {isUnavailable ? `${timeSlot} - indisponível` : timeSlot}
                            </option>
                          );
                        })}
                      </select>
                      {errors.timeSlot && (
                        <p className={styles.fieldError}>{errors.timeSlot}</p>
                      )}
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Número de convidados (estimado)</label>
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
                      placeholder="Conte mais sobre o evento..."
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
                    {loading ? <span className="spinner" /> : bookingContent.submitButtonLabel}
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
