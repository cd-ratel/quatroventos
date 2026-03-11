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

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ totalAppointments: 0, pendingAppointments: 0, confirmedAppointments: 0, totalMedia: 0 });
  const [recent, setRecent] = useState<RecentAppointment[]>([]);

  useEffect(() => {
    Promise.all([
      fetch('/api/appointments?limit=5').then((r) => r.json()),
      fetch('/api/media').then((r) => r.json()),
    ]).then(([apptData, mediaData]) => {
      const appts = apptData.appointments || [];
      setStats({
        totalAppointments: apptData.total || 0,
        pendingAppointments: appts.filter((a: RecentAppointment) => a.status === 'pending').length,
        confirmedAppointments: appts.filter((a: RecentAppointment) => a.status === 'confirmed').length,
        totalMedia: mediaData.length || 0,
      });
      setRecent(appts.slice(0, 5));
    }).catch(() => {});
  }, []);

  const eventLabels: Record<string, string> = {
    wedding: 'Casamento',
    children: 'Festa Infantil',
    corporate: 'Corporativo',
    debutante: 'Debutante',
    party: 'Confraternização',
    other: 'Outro',
  };

  return (
    <>
      {/* Stats Grid */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <span className={styles.statIcon}>📅</span>
          <div>
            <div className={styles.statValue}>{stats.totalAppointments}</div>
            <div className={styles.statLabel}>Total Agendamentos</div>
          </div>
        </div>
        <div className={`${styles.statCard} ${styles.statWarning}`}>
          <span className={styles.statIcon}>⏳</span>
          <div>
            <div className={styles.statValue}>{stats.pendingAppointments}</div>
            <div className={styles.statLabel}>Pendentes</div>
          </div>
        </div>
        <div className={`${styles.statCard} ${styles.statSuccess}`}>
          <span className={styles.statIcon}>✅</span>
          <div>
            <div className={styles.statValue}>{stats.confirmedAppointments}</div>
            <div className={styles.statLabel}>Confirmados</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statIcon}>🖼️</span>
          <div>
            <div className={styles.statValue}>{stats.totalMedia}</div>
            <div className={styles.statLabel}>Mídias</div>
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className={styles.dashboardGrid}>
        {/* Recent Appointments */}
        <div className={styles.recentSection}>
          <div className={styles.recentHeader}>
            <h2 className={styles.recentTitle}>Agendamentos Recentes</h2>
            <Link href="/admin/agendamentos" className={styles.viewAll}>
              Ver todos →
            </Link>
          </div>

          {recent.length > 0 ? (
            <div className={styles.table}>
              <div className={styles.tableHead}>
                <span>Nome</span>
                <span>Evento</span>
                <span>Data</span>
                <span>Horário</span>
                <span>Status</span>
              </div>
              {recent.map((appt) => (
                <div key={appt.id} className={styles.tableRow}>
                  <span className={styles.tableName}>{appt.name}</span>
                  <span>{eventLabels[appt.eventType] || appt.eventType}</span>
                  <span>{new Date(appt.date).toLocaleDateString('pt-BR')}</span>
                  <span>{appt.timeSlot}</span>
                  <span>
                    <span className={`badge badge-${appt.status}`}>
                      {appt.status === 'pending' ? 'Pendente' :
                       appt.status === 'confirmed' ? 'Confirmado' : 'Cancelado'}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <span>📭</span>
              <p>Nenhum agendamento ainda</p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className={styles.quickActions}>
          <h2 className={styles.recentTitle}>Ações Rápidas</h2>
          <div className={styles.actionsGrid}>
            <Link href="/admin/agendamentos" className={styles.actionCard}>
              <span>📅</span>
              <span>Gerenciar Agendamentos</span>
            </Link>
            <Link href="/admin/midia" className={styles.actionCard}>
              <span>📸</span>
              <span>Upload de Mídia</span>
            </Link>
            <Link href="/admin/configuracoes" className={styles.actionCard}>
              <span>⚙️</span>
              <span>Configurações</span>
            </Link>
            <a
              href={process.env.NEXT_PUBLIC_APP_URL || 'https://quatroventos.redecm.com.br'}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.actionCard}
            >
              <span>🌐</span>
              <span>Ver Site Público</span>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
