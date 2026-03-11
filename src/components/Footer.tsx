'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { useSiteSettings } from '@/components/SiteSettingsProvider';
import { resolveContentIcon } from '@/lib/content-icons';
import {
  createWhatsAppHref,
  getVisibleSocialLinks,
  isPlaceholderAddress,
  isPlaceholderEmail,
  isPlaceholderPhone,
} from '@/lib/public-site';
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
  const settings = useSiteSettings();
  const { lead, accent } = splitVenueTitle(settings.venueTitle);
  const year = new Date().getFullYear();
  const socialLinks = useMemo(() => getVisibleSocialLinks(settings), [settings]);
  const whatsappHref = useMemo(
    () => createWhatsAppHref(settings.whatsapp || settings.phone, settings.venueTitle),
    [settings.phone, settings.venueTitle, settings.whatsapp]
  );
  const hasExternalWhatsApp = whatsappHref.startsWith('http');
  const hasAddress = !isPlaceholderAddress(settings.address);
  const hasPhone = !isPlaceholderPhone(settings.phone);
  const hasEmail = !isPlaceholderEmail(settings.email);

  return (
    <footer className={styles.footer}>
      <section className={styles.ctaBand}>
        <div className={styles.ctaInner}>
          <div>
            <p className={styles.ctaEyebrow}>{settings.homeContent.ctaLabel}</p>
            <h2 className={styles.ctaTitle}>{settings.homeContent.ctaTitle}</h2>
            <p className={styles.ctaText}>{settings.homeContent.ctaSubtitle}</p>
          </div>
          <div className={styles.ctaActions}>
            <Link href="/agendar" className={styles.primaryButton}>
              {settings.homeContent.ctaPrimaryLabel}
            </Link>
            {hasExternalWhatsApp ? (
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className={styles.secondaryButton}>
                Falar no WhatsApp
              </a>
            ) : (
              <Link href={whatsappHref} className={styles.secondaryButton}>
                Solicitar atendimento
              </Link>
            )}
          </div>
        </div>
      </section>

      <div className={styles.mainFooter}>
        <div className={styles.brandColumn}>
          <div className={styles.brandLogo}>
            <span className={styles.brandMark}>QV</span>
            <div>
              <div className={styles.brandName}>
                {lead}
                {accent ? (
                  <>
                    {' '}
                    <span>{accent}</span>
                  </>
                ) : null}
              </div>
              <p className={styles.brandSubtitle}>{settings.venueSubtitle}</p>
            </div>
          </div>
          <p className={styles.brandDescription}>{settings.footerContent.description}</p>
          <div className={styles.contactStack}>
            {hasAddress ? (
              <div className={styles.contactItem}>
                <span>{resolveContentIcon('END')}</span>
                <span>{settings.address}</span>
              </div>
            ) : null}
            {hasPhone ? (
              <div className={styles.contactItem}>
                <span>{resolveContentIcon('TEL')}</span>
                <span>{settings.phone}</span>
              </div>
            ) : null}
            {hasEmail ? (
              <div className={styles.contactItem}>
                <span>{resolveContentIcon('MAIL')}</span>
                <span>{settings.email}</span>
              </div>
            ) : null}
          </div>
          {!hasAddress || !hasPhone ? (
            <p className={styles.supportNote}>
              Detalhes completos de localização e atendimento são compartilhados no primeiro contato.
            </p>
          ) : null}
        </div>

        <div className={styles.footerColumn}>
          <h4>{settings.footerContent.navigationTitle}</h4>
          <div className={styles.footerLinks}>
            {settings.footerContent.navigationLinks.map((link) => (
              <Link key={`${link.href}-${link.label}-footer-nav`} href={link.href}>
                {link.label}
              </Link>
            ))}
            <Link href="/agendar">{settings.footerContent.navigationCtaLabel}</Link>
          </div>
        </div>

        <div className={styles.footerColumn}>
          <h4>{settings.footerContent.eventsTitle}</h4>
          <div className={styles.footerLinks}>
            {settings.footerContent.eventLinks.map((link) => (
              <Link key={`${link.href}-${link.label}-footer-event`} href={link.href}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className={styles.footerColumn}>
          <h4>{settings.footerContent.contactTitle}</h4>
          <div className={styles.scheduleCard}>
            <strong>Atendimento consultivo</strong>
            <p>
              {!hasExternalWhatsApp
                ? 'Organizamos visitas e retornos pelo formulário do site e pelo agendamento online.'
                : 'Respondemos visitas, dúvidas e orçamento com prioridade pelo WhatsApp.'}
            </p>
            {hasExternalWhatsApp ? (
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className={styles.scheduleButton}>
                Abrir conversa
              </a>
            ) : (
              <Link href={whatsappHref} className={styles.scheduleButton}>
                Agendar visita
              </Link>
            )}
          </div>
          {socialLinks.length > 0 ? (
            <div className={styles.socialRow}>
              {socialLinks.map((link) => (
                <a
                  key={`${link.href}-${link.label}-footer-social`}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.ariaLabel}
                  className={styles.socialLink}
                >
                  {link.label}
                </a>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      <div className={styles.bottomBar}>
        <p>© {year} {settings.venueTitle}. Todos os direitos reservados.</p>
        <p>{settings.footerContent.creditsText}</p>
      </div>
    </footer>
  );
}
