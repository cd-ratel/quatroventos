'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from '@/app/admin/dashboard.module.css';

interface Stats {
  totalAppointments: number;
  pendingAppointments: number;
  confirmedAppointments: number;
  totalMedia: number;
}

interface RecentAppointment {
  id: string;
  name: string;
  eventType: string;
  date: string;
  timeSlot: string;
  status: string;
}

const eventLabels: Record<string, string> = {
  wedding: 'Casamento',
  children: 'Festa infantil',
  corporate: 'Corporativo',
  debutante: 'Debutante',
  party: 'Confraternização',
  other: 'Outro',
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalAppointments: 0,
    pendingAppointments: 0,
    confirmedAppointments: 0,
    totalMedia: 0,
  });
  const [recent, setRecent] = useState<RecentAppointment[]>([]);

  useEffect(() => {
    Promise.all([
      fetch('/api/appointments?limit=5').then((response) => response.json()),
      fetch('/api/media').then((response) => response.json()),
    ])
      .then(([appointmentData, mediaData]) => {
        const appointments = appointmentData.appointments || [];
        setStats({
          totalAppointments: appointmentData.total || 0,
          pendingAppointments: appointments.filter(
            (appointment: RecentAppointment) => appointment.status === 'pending'
          ).length,
          confirmedAppointments: appointments.filter(
            (appointment: RecentAppointment) => appointment.status === 'confirmed'
          ).length,
          totalMedia: mediaData.length || 0,
        });
        setRecent(appointments.slice(0, 5));
      })
      .catch(() => {
        setStats({
          totalAppointments: 0,
          pendingAppointments: 0,
          confirmedAppointments: 0,
          totalMedia: 0,
        });
        setRecent([]);
      });
  }, []);

  return (
    <>
      <section className={styles.statsGrid}>
        <article className={styles.statCard}>
          <span className={styles.statIcon}>◷</span>
          <div>
            <small>Total</small>
            <strong>{stats.totalAppointments}</strong>
            <p>Agendamentos cadastrados</p>
          </div>
        </article>

        <article className={styles.statCard}>
          <span className={styles.statIcon}>⌛</span>
          <div>
            <small>Pendentes</small>
            <strong>{stats.pendingAppointments}</strong>
            <p>Solicitações aguardando retorno</p>
          </div>
        </article>

        <article className={styles.statCard}>
          <span className={styles.statIcon}>✓</span>
          <div>
            <small>Confirmados</small>
            <strong>{stats.confirmedAppointments}</strong>
            <p>Visitas alinhadas com clientes</p>
          </div>
        </article>

        <article className={styles.statCard}>
          <span className={styles.statIcon}>▣</span>
          <div>
            <small>Mídia</small>
            <strong>{stats.totalMedia}</strong>
            <p>Arquivos ativos na galeria</p>
          </div>
        </article>
      </section>

      <section className={styles.dashboardGrid}>
        <article className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <div>
              <h2>Agendamentos recentes</h2>
              <p>Últimas solicitações recebidas pelo site.</p>
            </div>
            <Link href="/admin/agendamentos" className={styles.inlineLink}>
              Ver todos
            </Link>
          </div>

          {recent.length > 0 ? (
            <div className={styles.list}>
              {recent.map((appointment) => (
                <div key={appointment.id} className={styles.listRow}>
                  <div className={styles.listMain}>
                    <strong>{appointment.name}</strong>
                    <span>{eventLabels[appointment.eventType] || appointment.eventType}</span>
                  </div>
                  <div className={styles.listMeta}>
                    <span>{new Date(appointment.date).toLocaleDateString('pt-BR')}</span>
                    <span>{appointment.timeSlot}</span>
                    <span className={`badge badge-${appointment.status}`}>
                      {appointment.status === 'pending'
                        ? 'Pendente'
                        : appointment.status === 'confirmed'
                          ? 'Confirmado'
                          : 'Cancelado'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <strong>Nenhum agendamento recente</strong>
              <p>As novas solicitações vão aparecer aqui automaticamente.</p>
            </div>
          )}
        </article>

        <article className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <div>
              <h2>Ações rápidas</h2>
              <p>Atalhos para as tarefas mais frequentes do painel.</p>
            </div>
          </div>

          <div className={styles.actionGrid}>
            <Link href="/admin/agendamentos" className={styles.actionCard}>
              <span>◷</span>
              <strong>Gerenciar visitas</strong>
              <p>Confirmar, cancelar e acompanhar solicitações.</p>
            </Link>

            <Link href="/admin/midia" className={styles.actionCard}>
              <span>▣</span>
              <strong>Atualizar galeria</strong>
              <p>Subir novas imagens e vídeos do espaço.</p>
            </Link>

            <Link href="/admin/configuracoes" className={styles.actionCard}>
              <span>⚙</span>
              <strong>Editar conteúdo</strong>
              <p>Alterar textos, links e blocos do site público.</p>
            </Link>

            <a
              href={process.env.NEXT_PUBLIC_APP_URL || 'https://quatroventos.redecm.com.br'}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.actionCard}
            >
              <span>↗</span>
              <strong>Ver site público</strong>
              <p>Conferir como a experiência está publicada.</p>
            </a>
          </div>
        </article>
      </section>
    </>
  );
}
