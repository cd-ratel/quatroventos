'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import styles from './admin.module.css';

const navItems = [
  { href: '/admin', icon: '📊', label: 'Dashboard' },
  { href: '/admin/agendamentos', icon: '📅', label: 'Agendamentos' },
  { href: '/admin/midia', icon: '🖼️', label: 'Mídia' },
  { href: '/admin/configuracoes', icon: '⚙️', label: 'Configurações' },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <div className={styles.adminLayout}>
      <button
        className={styles.sidebarToggle}
        onClick={() => setSidebarOpen(!sidebarOpen)}
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

          <div style={{ flex: 1 }} />

          <Link
            href="/"
            className={styles.sidebarLink}
            target="_blank"
          >
            <span className={styles.sidebarIcon}>🌐</span>
            Ver Site
          </Link>
        </nav>

        <div className={styles.sidebarFooter}>
          <button
            className={styles.logoutBtn}
            onClick={() => signOut({ callbackUrl: '/admin/login' })}
          >
            <span>🚪</span>
            Sair
          </button>
        </div>
      </aside>

      <div className={styles.mainContent}>
        {children}
      </div>
    </div>
  );
}
