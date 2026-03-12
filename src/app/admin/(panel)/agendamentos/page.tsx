'use client';

import { useEffect, useState } from 'react';
import styles from '@/app/admin/agendamentos/agendamentos.module.css';

interface Appointment {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  timeSlot: string;
  eventType: string;
  guests: number | null;
  message: string | null;
  status: string;
  createdAt: string;
}

const eventLabels: Record<string, string> = {
  wedding: 'Casamento',
  children: 'Festa infantil',
  corporate: 'Corporativo',
  debutante: 'Debutante',
  party: 'Confraternização',
  other: 'Outro',
};

const statusLabels: Record<string, string> = {
  pending: 'Pendente',
  confirmed: 'Confirmado',
  cancelled: 'Cancelado',
};

export default function AgendamentosPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [total, setTotal] = useState(0);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter) params.set('status', filter);
      params.set('limit', '50');

      const response = await fetch(`/api/appointments?${params}`);
      const data = await response.json();
      setAppointments(data.appointments || []);
      setTotal(data.total || 0);
    } catch {
      setAppointments([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [filter]);

  const updateStatus = async (id: string, status: string) => {
    try {
      await fetch('/api/appointments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      fetchAppointments();
    } catch {
      // ignore
    }
  };

  const deleteAppointment = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este agendamento?')) {
      return;
    }

    try {
      await fetch(`/api/appointments?id=${id}`, { method: 'DELETE' });
      fetchAppointments();
    } catch {
      // ignore
    }
  };

  return (
    <section className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h2>Agendamentos</h2>
          <p>{total} registro{total !== 1 ? 's' : ''} no total</p>
        </div>

        <div className={styles.filters}>
          {['', 'pending', 'confirmed', 'cancelled'].map((value) => (
            <button
              key={value}
              type="button"
              className={`${styles.filterButton} ${filter === value ? styles.filterButtonActive : ''}`}
              onClick={() => setFilter(value)}
            >
              {value === '' ? 'Todos' : statusLabels[value]}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className={styles.loading}>
          <span className="spinner" />
        </div>
      ) : appointments.length > 0 ? (
        <div className={styles.cardList}>
          {appointments.map((appointment) => (
            <article key={appointment.id} className={styles.appointmentCard}>
              <div className={styles.cardMain}>
                <div className={styles.cardIdentity}>
                  <strong>{appointment.name}</strong>
                  <span>{eventLabels[appointment.eventType] || appointment.eventType}</span>
                </div>

                <div className={styles.cardMeta}>
                  <span>{new Date(appointment.date).toLocaleDateString('pt-BR')}</span>
                  <span>{appointment.timeSlot}</span>
                  {appointment.guests ? <span>{appointment.guests} convidados</span> : null}
                </div>
              </div>

              <div className={styles.cardDetails}>
                <div>
                  <small>Contato</small>
                  <p>{appointment.email}</p>
                  <p>{appointment.phone}</p>
                </div>

                <div>
                  <small>Status</small>
                  <span className={`badge badge-${appointment.status}`}>
                    {statusLabels[appointment.status]}
                  </span>
                </div>

                <div className={styles.cardActions}>
                  {appointment.status === 'pending' ? (
                    <button
                      type="button"
                      className={styles.primaryAction}
                      onClick={() => updateStatus(appointment.id, 'confirmed')}
                    >
                      Confirmar
                    </button>
                  ) : null}

                  {appointment.status !== 'cancelled' ? (
                    <button
                      type="button"
                      className={styles.secondaryAction}
                      onClick={() => updateStatus(appointment.id, 'cancelled')}
                    >
                      Cancelar
                    </button>
                  ) : null}

                  <button
                    type="button"
                    className={styles.dangerAction}
                    onClick={() => deleteAppointment(appointment.id)}
                  >
                    Excluir
                  </button>
                </div>
              </div>

              {appointment.message ? (
                <div className={styles.messageBox}>
                  <small>Mensagem do cliente</small>
                  <p>{appointment.message}</p>
                </div>
              ) : null}
            </article>
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <strong>Nenhum agendamento encontrado</strong>
          <p>
            {filter
              ? 'Tente outro filtro para ver mais solicitações.'
              : 'As novas visitas solicitadas no site aparecerão aqui.'}
          </p>
        </div>
      )}
    </section>
  );
}
