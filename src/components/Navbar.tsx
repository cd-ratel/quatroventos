'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSiteSettings } from '@/components/SiteSettingsProvider';
import {
  createWhatsAppHref,
  getDisplayAddress,
  getDisplayPhone,
  getVisibleSocialLinks,
  isPlaceholderPhone,
  normalizePhone,
} from '@/lib/public-site';
import styles from './Navbar.module.css';

type HeaderMode = 'overlay' | 'blend' | 'solid';

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

export default function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const [headerMode, setHeaderMode] = useState<HeaderMode>(isHome ? 'overlay' : 'solid');
  const [compactHeader, setCompactHeader] = useState(!isHome);
  const [mobileOpen, setMobileOpen] = useState(false);
  const settings = useSiteSettings();
  const { lead, accent } = splitVenueTitle(settings.venueTitle);
  const navLinks = settings.footerContent.navigationLinks;
  const socialLinks = useMemo(() => getVisibleSocialLinks(settings), [settings]);
  const addressLabel = useMemo(() => getDisplayAddress(settings), [settings]);
  const phoneLabel = useMemo(() => getDisplayPhone(settings), [settings]);
  const hasPhone = useMemo(() => !isPlaceholderPhone(phoneLabel), [phoneLabel]);
  const phoneHref = useMemo(() => `tel:${normalizePhone(phoneLabel)}`, [phoneLabel]);
  const whatsappHref = useMemo(
    () => createWhatsAppHref(settings.whatsapp || settings.phone, settings.venueTitle),
    [settings.phone, settings.venueTitle, settings.whatsapp]
  );
  const hasExternalWhatsApp = whatsappHref.startsWith('http');
  const showUtilityBar = !mobileOpen && (!compactHeader || headerMode === 'overlay');

  useEffect(() => {
    const syncHeaderMode = () => {
      const scrollY = window.scrollY;

      if (!isHome) {
        setHeaderMode('solid');
        setCompactHeader(scrollY > 24);
        return;
      }

      const hero = document.querySelector('[data-home-hero]') as HTMLElement | null;

      if (!hero) {
        if (scrollY < 56) {
          setHeaderMode('overlay');
        } else if (scrollY < 220) {
          setHeaderMode('blend');
        } else {
          setHeaderMode('solid');
        }

        setCompactHeader(scrollY > 84);
        return;
      }

      const heroBottom = hero.getBoundingClientRect().bottom;
      const overlayThreshold = window.innerHeight * 0.62;
      const solidThreshold = window.innerHeight * 0.18;

      if (heroBottom > overlayThreshold && scrollY < 120) {
        setHeaderMode('overlay');
      } else if (heroBottom > solidThreshold) {
        setHeaderMode('blend');
      } else {
        setHeaderMode('solid');
      }

      setCompactHeader(scrollY > 88 || heroBottom <= overlayThreshold);
    };

    syncHeaderMode();
    window.addEventListener('scroll', syncHeaderMode, { passive: true });
    window.addEventListener('resize', syncHeaderMode);

    return () => {
      window.removeEventListener('scroll', syncHeaderMode);
      window.removeEventListener('resize', syncHeaderMode);
    };
  }, [isHome]);

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
      <div
        className={`${styles.utilityBar} ${headerMode === 'overlay' ? styles.utilityBarTransparent : ''} ${!showUtilityBar ? styles.utilityBarHidden : ''}`}
      >
        <div className={styles.utilityInner}>
          <div className={styles.utilityMeta}>
            <span>{addressLabel}</span>
            {hasPhone ? <a href={phoneHref}>{phoneLabel}</a> : null}
          </div>

          <div className={styles.utilityActions}>
            <span className={styles.utilityNote}>Atendimento para visitas e eventos</span>
            <div className={styles.utilitySocials}>
              {socialLinks.map((link) => (
                <a
                  key={`${link.href}-${link.label}`}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.ariaLabel}
                  className={styles.utilitySocial}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <header
        className={`${styles.header} ${headerMode === 'overlay' ? styles.headerOverlay : ''} ${headerMode === 'blend' ? styles.headerBlend : ''} ${headerMode === 'solid' ? styles.headerSolid : ''} ${compactHeader ? styles.headerCompact : ''}`}
      >
        <div className={styles.headerInner}>
          <Link href="/" className={styles.brand} aria-label={settings.venueTitle}>
            <span className={styles.brandMark}>QV</span>
            <span className={styles.brandText}>
              <strong>{lead}</strong>
              {accent ? <em>{accent}</em> : null}
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
            {hasExternalWhatsApp ? (
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.secondaryAction}
              >
                WhatsApp
              </a>
            ) : (
              <Link href={whatsappHref} className={styles.secondaryAction}>
                Atendimento
              </Link>
            )}

            <Link href="/agendar" className={styles.primaryAction}>
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
          <div className={styles.mobileBrand}>
            <span className={styles.mobileBrandMark}>QV</span>
            <div>
              <strong>{settings.venueTitle}</strong>
              <span>{settings.venueSubtitle}</span>
            </div>
          </div>

          <button
            type="button"
            className={styles.mobileClose}
            onClick={() => setMobileOpen(false)}
            aria-label="Fechar menu"
          >
            ×
          </button>
        </div>

        <div className={styles.mobileMeta}>
          <span>{addressLabel}</span>
          {hasPhone ? <a href={phoneHref}>{phoneLabel}</a> : null}
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

          {hasExternalWhatsApp ? (
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.mobileSecondary}
            >
              Falar no WhatsApp
            </a>
          ) : (
            <Link href={whatsappHref} className={styles.mobileSecondary}>
              Solicitar atendimento
            </Link>
          )}
        </div>
      </aside>
    </>
  );
}
