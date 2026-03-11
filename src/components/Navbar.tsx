'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSiteSettings } from '@/components/SiteSettingsProvider';
import styles from './Navbar.module.css';

function splitVenueTitle(value: string) {
  const parts = value.trim().split(/\s+/);

  if (parts.length <= 1) {
    return { lead: value, accent: '' };
  }

  return {
    lead: parts.slice(0, -1).join(' '),
    accent: parts.at(-1) || '',
  };
}

function normalizePhone(phone: string) {
  return phone.replace(/\D/g, '');
}

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const settings = useSiteSettings();
  const { lead, accent } = splitVenueTitle(settings.venueTitle);
  const navLinks = settings.footerContent.navigationLinks;
  const isHome = pathname === '/';
  const phoneHref = useMemo(
    () => `tel:${normalizePhone(settings.phone)}`,
    [settings.phone]
  );
  const whatsappHref = useMemo(() => {
    const base = normalizePhone(settings.whatsapp || settings.phone);
    return `https://wa.me/${base}`;
  }, [settings.phone, settings.whatsapp]);
  const isTransparent = isHome && !scrolled && !mobileOpen;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  return (
    <>
      <div className={`${styles.topBar} ${isTransparent ? styles.topBarTransparent : ''}`}>
        <div className={styles.topInner}>
          <div className={styles.topMeta}>
            <span>{settings.address}</span>
            <a href={phoneHref}>{settings.phone}</a>
          </div>
          <div className={styles.topActions}>
            {settings.footerContent.socialLinks.map((link) => (
              <a
                key={`${link.href}-${link.label}`}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.ariaLabel}
                className={styles.topSocial}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      <header
        className={`${styles.header} ${isTransparent ? styles.headerTransparent : styles.headerSolid}`}
      >
        <div className={styles.headerInner}>
          <Link href="/" className={styles.brand} aria-label={settings.venueTitle}>
            <span className={styles.brandMark}>QV</span>
            <span className={styles.brandText}>
              {lead}
              {accent ? (
                <>
                  {' '}
                  <span className={styles.brandAccent}>{accent}</span>
                </>
              ) : null}
            </span>
          </Link>

          <nav className={styles.desktopNav} aria-label="Navegação principal">
            {navLinks.map((link) => (
              <Link
                key={`${link.href}-${link.label}`}
                href={link.href}
                className={`${styles.navLink} ${pathname === link.href ? styles.navLinkActive : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className={styles.desktopActions}>
            <a href={whatsappHref} className={styles.whatsLink} target="_blank" rel="noopener noreferrer">
              WhatsApp
            </a>
            <Link href="/agendar" className={styles.headerCta}>
              {settings.footerContent.navigationCtaLabel}
            </Link>
          </div>

          <button
            type="button"
            className={`${styles.mobileToggle} ${mobileOpen ? styles.mobileToggleOpen : ''}`}
            onClick={() => setMobileOpen((current) => !current)}
            aria-label={mobileOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={mobileOpen}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      <div
        className={`${styles.mobileOverlay} ${mobileOpen ? styles.mobileOverlayOpen : ''}`}
        onClick={() => setMobileOpen(false)}
      />

      <aside className={`${styles.mobilePanel} ${mobileOpen ? styles.mobilePanelOpen : ''}`}>
        <div className={styles.mobilePanelHeader}>
          <span className={styles.mobilePanelTitle}>Quatro Ventos</span>
          <button
            type="button"
            className={styles.mobileClose}
            onClick={() => setMobileOpen(false)}
            aria-label="Fechar menu"
          >
            ×
          </button>
        </div>

        <div className={styles.mobilePanelMeta}>
          <span>{settings.address}</span>
          <a href={phoneHref}>{settings.phone}</a>
        </div>

        <nav className={styles.mobileNav} aria-label="Navegação mobile">
          {navLinks.map((link) => (
            <Link
              key={`${link.href}-${link.label}-mobile`}
              href={link.href}
              className={`${styles.mobileNavLink} ${pathname === link.href ? styles.mobileNavLinkActive : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className={styles.mobileFooter}>
          <Link href="/agendar" className={styles.mobilePrimary}>
            {settings.footerContent.navigationCtaLabel}
          </Link>
          <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className={styles.mobileSecondary}>
            Falar no WhatsApp
          </a>
        </div>
      </aside>
    </>
  );
}
