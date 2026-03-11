'use client';

import Link from 'next/link';
import { useSiteSettings } from '@/components/SiteSettingsProvider';
import styles from './Footer.module.css';

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

export default function Footer() {
  const year = new Date().getFullYear();
  const settings = useSiteSettings();
  const { lead, accent } = splitVenueTitle(settings.venueTitle);

  return (
    <footer className={styles.footer}>
      <div className={styles.footerGrid}>
        <div className={styles.footerBrand}>
          <div className={styles.footerLogo}>
            {lead}
            {accent ? (
              <>
                {' '}
                <span className={styles.footerLogoAccent}>{accent}</span>
              </>
            ) : null}
          </div>
          <p className={styles.footerDesc}>{settings.footerContent.description}</p>
          <div className={styles.footerSocial}>
            {settings.footerContent.socialLinks.map((link) => (
              <a
                key={`${link.href}-${link.label}`}
                href={link.href}
                className={styles.socialLink}
                aria-label={link.ariaLabel}
                target="_blank"
                rel="noopener noreferrer"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <div className={styles.footerColumn}>
          <h4>{settings.footerContent.navigationTitle}</h4>
          <ul className={styles.footerLinks}>
            {settings.footerContent.navigationLinks.map((link) => (
              <li key={`${link.href}-${link.label}-footer-nav`}>
                <Link href={link.href} className={styles.footerLink}>
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/agendar" className={styles.footerLink}>
                {settings.footerContent.navigationCtaLabel}
              </Link>
            </li>
          </ul>
        </div>

        <div className={styles.footerColumn}>
          <h4>{settings.footerContent.eventsTitle}</h4>
          <ul className={styles.footerLinks}>
            {settings.footerContent.eventLinks.map((link) => (
              <li key={`${link.href}-${link.label}-footer-event`}>
                <Link href={link.href} className={styles.footerLink}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.footerColumn}>
          <h4>{settings.footerContent.contactTitle}</h4>
          <div className={styles.contactItem}>
            <span className={styles.contactIcon}>[</span>
            <span>{settings.address}</span>
          </div>
          <div className={styles.contactItem}>
            <span className={styles.contactIcon}>T</span>
            <span>{settings.phone}</span>
          </div>
          <div className={styles.contactItem}>
            <span className={styles.contactIcon}>@</span>
            <span>{settings.email}</span>
          </div>
        </div>
      </div>

      <div className={styles.footerBottom}>
        <p className={styles.copyright}>
          Copyright {year} {settings.venueTitle}. Todos os direitos reservados.
        </p>
        <p className={styles.footerCredits}>{settings.footerContent.creditsText}</p>
      </div>
    </footer>
  );
}
