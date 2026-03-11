'use client';

import { useEffect, useState } from 'react';
import styles from './agendamentos.module.css';

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
  children: 'Festa Infantil',
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

      const res = await fetch(`/api/appointments?${params}`);
      const data = await res.json();
      setAppointments(data.appointments || []);
      setTotal(data.total || 0);
    } catch {
      // silent
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
      // silent
    }
  };

  const deleteAppointment = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este agendamento?')) return;
    try {
      await fetch(`/api/appointments?id=${id}`, { method: 'DELETE' });
      fetchAppointments();
    } catch {
      // silent
    }
  };

  return (
    <>
      <h1 className={styles.title}>Agendamentos</h1>
      <p className={styles.subtitle}>
        {total} agendamento{total !== 1 ? 's' : ''} no total
      </p>

      {/* Filters */}
      <div className={styles.filters}>
        {['', 'pending', 'confirmed', 'cancelled'].map((f) => (
          <button
            key={f}
            className={`${styles.filterBtn} ${filter === f ? styles.active : ''}`}
            onClick={() => setFilter(f)}
          >
            {f === '' ? 'Todos' : statusLabels[f]}
          </button>
        ))}
      </div>

      {/* Table */}
      {loading ? (
        <div className={styles.loading}>
          <span className="spinner" />
        </div>
      ) : appointments.length > 0 ? (
        <div className={styles.tableWrapper}>
          <div className={styles.tableHead}>
            <span>Nome</span>
            <span>Evento</span>
            <span>Data</span>
            <span>Horário</span>
            <span>Contato</span>
            <span>Status</span>
            <span>Ações</span>
          </div>
          {appointments.map((appt) => (
            <div key={appt.id} className={styles.tableRow}>
              <div>
                <div className={styles.cellName}>{appt.name}</div>
                {appt.guests && (
                  <div className={styles.cellSub}>{appt.guests} convidados</div>
                )}
              </div>
              <span>{eventLabels[appt.eventType] || appt.eventType}</span>
              <span>{new Date(appt.date).toLocaleDateString('pt-BR')}</span>
              <span>{appt.timeSlot}</span>
              <div>
                <div className={styles.cellSub}>{appt.email}</div>
                <div className={styles.cellSub}>{appt.phone}</div>
              </div>
              <span>
                <span className={`badge badge-${appt.status}`}>
                  {statusLabels[appt.status]}
                </span>
              </span>
              <div className={styles.actions}>
                {appt.status === 'pending' && (
                  <button
                    className={styles.actionConfirm}
                    onClick={() => updateStatus(appt.id, 'confirmed')}
                    title="Confirmar"
                  >
                    ✅
                  </button>
                )}
                {appt.status !== 'cancelled' && (
                  <button
                    className={styles.actionCancel}
                    onClick={() => updateStatus(appt.id, 'cancelled')}
                    title="Cancelar"
                  >
                    ❌
                  </button>
                )}
                <button
                  className={styles.actionDelete}
                  onClick={() => deleteAppointment(appt.id)}
                  title="Excluir"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <span>📭</span>
          <p>Nenhum agendamento {filter ? 'com este status' : 'encontrado'}</p>
        </div>
      )}
    </>
  );
}
