'use client';

import { useEffect, useState } from 'react';
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

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const settings = useSiteSettings();
  const { lead, accent } = splitVenueTitle(settings.venueTitle);
  const links = settings.footerContent.navigationLinks;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
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
      <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
        <div className={styles.navInner}>
          <Link href="/" className={styles.logo}>
            <span className={styles.logoIcon}>QV</span>
            <span className={styles.logoText}>
              {lead}
              {accent ? (
                <>
                  {' '}
                  <span className={styles.logoAccent}>{accent}</span>
                </>
              ) : null}
            </span>
          </Link>

          <ul className={styles.desktopLinks}>
            {links.map((link) => (
              <li key={`${link.href}-${link.label}`}>
                <Link
                  href={link.href}
                  className={`${styles.navLink} ${pathname === link.href ? styles.active : ''}`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/agendar" className={styles.navCta}>
                {settings.footerContent.navigationCtaLabel}
              </Link>
            </li>
          </ul>

          <button
            className={`${styles.hamburger} ${mobileOpen ? styles.open : ''}`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            <span className={styles.hamburgerLine} />
            <span className={styles.hamburgerLine} />
            <span className={styles.hamburgerLine} />
          </button>
        </div>
      </nav>

      <div className={`${styles.mobileMenu} ${mobileOpen ? styles.open : ''}`}>
        {links.map((link) => (
          <Link
            key={`${link.href}-${link.label}-mobile`}
            href={link.href}
            className={styles.mobileLink}
            onClick={() => setMobileOpen(false)}
          >
            {link.label}
          </Link>
        ))}
        <Link
          href="/agendar"
          className="btn btn-primary btn-lg"
          onClick={() => setMobileOpen(false)}
        >
          {settings.footerContent.navigationCtaLabel}
        </Link>
      </div>
    </>
  );
}
