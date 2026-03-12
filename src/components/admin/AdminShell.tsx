'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import styles from '@/app/admin/admin.module.css';

const navItems = [
  {
    href: '/admin',
    icon: '◫',
    label: 'Dashboard',
    description: 'Resumo operacional do espaço',
  },
  {
    href: '/admin/agendamentos',
    icon: '◷',
    label: 'Agendamentos',
    description: 'Visitas, status e ocupação',
  },
  {
    href: '/admin/midia',
    icon: '▣',
    label: 'Mídia',
    description: 'Fotos e vídeos do salão',
  },
  {
    href: '/admin/configuracoes',
    icon: '⚙',
    label: 'Configurações',
    description: 'Textos e conteúdo do site',
  },
];

const pageMeta: Record<string, { title: string; subtitle: string }> = {
  '/admin': {
    title: 'Dashboard',
    subtitle: 'Visão geral do Quatro Ventos',
  },
  '/admin/agendamentos': {
    title: 'Agendamentos',
    subtitle: 'Gerencie visitas, status e confirmações',
  },
  '/admin/midia': {
    title: 'Mídia',
    subtitle: 'Organize fotos e vídeos publicados no site',
  },
  '/admin/configuracoes': {
    title: 'Configurações',
    subtitle: 'Edite os textos e blocos do site público',
  },
};

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

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  const currentPage = useMemo(
    () => pageMeta[pathname] || { title: 'Painel', subtitle: 'Administração do site' },
    [pathname]
  );

  return (
    <div className={styles.shell}>
      <button
        type="button"
        className={styles.mobileToggle}
        onClick={() => setSidebarOpen((current) => !current)}
        aria-label={sidebarOpen ? 'Fechar menu' : 'Abrir menu'}
        aria-expanded={sidebarOpen}
      >
        <span />
        <span />
        <span />
      </button>

      <div
        className={`${styles.overlay} ${sidebarOpen ? styles.overlayVisible : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.sidebarHeader}>
          <div className={styles.brandMark}>QV</div>
          <div className={styles.brandCopy}>
            <strong>Quatro Ventos</strong>
            <span>Painel administrativo</span>
          </div>
        </div>

        <div className={styles.sidebarSection}>
          <span className={styles.sidebarLabel}>Gestão principal</span>
          <nav className={styles.nav} aria-label="Menu administrativo">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
                >
                  <span className={styles.navIcon}>{item.icon}</span>
                  <span className={styles.navCopy}>
                    <strong>{item.label}</strong>
                    <small>{item.description}</small>
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className={styles.sidebarSection}>
          <span className={styles.sidebarLabel}>Atalhos</span>
          <a
            href={publicUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.secondaryLink}
          >
            <span className={styles.navIcon}>↗</span>
            <span className={styles.navCopy}>
              <strong>Ver site público</strong>
              <small>Abrir a experiência do visitante</small>
            </span>
          </a>
        </div>

        <div className={styles.sidebarFooter}>
          <button
            type="button"
            className={styles.logoutButton}
            onClick={() => signOut({ callbackUrl: '/admin/login' })}
          >
            <span>⇠</span>
            <span>Sair do painel</span>
          </button>
        </div>
      </aside>

      <main className={styles.main}>
        <header className={styles.topbar}>
          <div className={styles.pageIntro}>
            <span className={styles.pageKicker}>Admin Quatro Ventos</span>
            <h1>{currentPage.title}</h1>
            <p>{currentPage.subtitle}</p>
          </div>

          <div className={styles.topbarMeta}>
            <div className={styles.dateCard}>
              <span>Hoje</span>
              <strong>{currentDate}</strong>
            </div>
            <div className={styles.avatar}>QV</div>
          </div>
        </header>

        <div className={styles.content}>{children}</div>
      </main>
    </div>
  );
}
