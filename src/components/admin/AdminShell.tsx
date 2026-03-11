'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import styles from '@/app/admin/admin.module.css';

const navItems = [
  { href: '/admin', icon: '📊', label: 'Dashboard' },
  { href: '/admin/agendamentos', icon: '📅', label: 'Agendamentos' },
  { href: '/admin/midia', icon: '🖼️', label: 'Midia' },
  { href: '/admin/configuracoes', icon: '⚙️', label: 'Configuracoes' },
];

export default function AdminShell({
  children,
  publicUrl,
}: {
  children: React.ReactNode;
  publicUrl: string;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    setCurrentDate(
      new Date().toLocaleDateString('pt-BR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    );
  }, []);

  const pageTitle = (() => {
    if (pathname === '/admin') return 'Dashboard';
    if (pathname === '/admin/agendamentos') return 'Agendamentos';
    if (pathname === '/admin/midia') return 'Galeria de Midia';
    if (pathname === '/admin/configuracoes') return 'Configuracoes';
    return 'Admin';
  })();

  const pageSubtitle = (() => {
    if (pathname === '/admin') return 'Visao geral do Quatro Ventos';
    if (pathname === '/admin/agendamentos') return 'Gerencie os agendamentos de visita';
    if (pathname === '/admin/midia') return 'Gerencie fotos e videos do espaco';
    if (pathname === '/admin/configuracoes') return 'Conteudo, contato e textos do site';
    return '';
  })();

  return (
    <div className={styles.adminLayout}>
      <button
        className={styles.sidebarToggle}
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Menu"
      >
        ☰
      </button>

      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.open : ''}`}>
        <div className={styles.sidebarHeader}>
          <div className={styles.sidebarLogo}>
            Quatro <span className={styles.sidebarLogoAccent}>Ventos</span>
            <span className={styles.sidebarBadge}>Admin</span>
          </div>
        </div>

        <nav className={styles.sidebarNav}>
          <span className={styles.sidebarSection}>Menu Principal</span>

          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.sidebarLink} ${
                pathname === item.href ? styles.active : ''
              }`}
              onClick={() => setSidebarOpen(false)}
            >
              <span className={styles.sidebarIcon}>{item.icon}</span>
              {item.label}
            </Link>
          ))}

          <span className={styles.sidebarSection}>Acesso Rapido</span>

          <a
            href={publicUrl}
            className={styles.sidebarLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className={styles.sidebarIcon}>🌐</span>
            Ver Site Publico
          </a>
        </nav>

        <div className={styles.sidebarFooter}>
          <button
            className={styles.logoutBtn}
            onClick={() => signOut({ callbackUrl: '/admin/login' })}
          >
            <span>🚪</span>
            Sair do Painel
          </button>
        </div>
      </aside>

      <div className={styles.mainContent}>
        <div className={styles.topHeader}>
          <div className={styles.topHeaderLeft}>
            <h1>{pageTitle}</h1>
            <p>{pageSubtitle}</p>
          </div>
          <div className={styles.topHeaderRight}>
            <span className={styles.headerDate}>{currentDate}</span>
            <div className={styles.avatarBadge}>QV</div>
          </div>
        </div>

        {children}
      </div>
    </div>
  );
}
