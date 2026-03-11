import type { SiteSettings } from '@/lib/site-settings';

const DEFAULT_ADDRESS = 'Rua Exemplo, 123 - Centro';
const DEFAULT_PHONE = '(00) 00000-0000';
const DEFAULT_WHATSAPP = '5500000000000';
const DEFAULT_EMAIL = 'contato@quatroventos.com.br';
const DEFAULT_INSTAGRAM = 'https://instagram.com/quatroventos';
const DEFAULT_FACEBOOK = 'https://facebook.com/quatroventos';

const categoryLabelMap: Record<string, string> = {
  all: 'Todos',
  venue: 'Espaço',
  wedding: 'Casamentos',
  children: 'Festas infantis',
  corporate: 'Corporativo',
  decoration: 'Decoração',
  gallery: 'Galeria geral',
};

export function normalizePhone(phone: string) {
  return phone.replace(/\D/g, '');
}

export function isPlaceholderPhone(phone: string) {
  const digits = normalizePhone(phone);
  const defaultDigits = normalizePhone(DEFAULT_PHONE);

  return !digits || /^0+$/.test(digits) || digits === defaultDigits || digits === DEFAULT_WHATSAPP;
}

export function isPlaceholderAddress(address: string) {
  return !address.trim() || address.trim() === DEFAULT_ADDRESS;
}

export function isPlaceholderEmail(email: string) {
  return !email.trim() || email.trim().toLowerCase() === DEFAULT_EMAIL;
}

export function isPlaceholderSocialLink(href: string) {
  const normalized = href.trim().toLowerCase();

  return (
    !normalized ||
    normalized === DEFAULT_INSTAGRAM ||
    normalized === DEFAULT_FACEBOOK
  );
}

export function createWhatsAppHref(phone: string, venueTitle: string) {
  if (isPlaceholderPhone(phone)) {
    return '/agendar';
  }

  const message = encodeURIComponent(
    `Olá! Gostaria de saber mais sobre o ${venueTitle}.`
  );

  return `https://wa.me/${normalizePhone(phone)}?text=${message}`;
}

export function createMapsHref(address: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

export function getCategoryLabel(
  category: string,
  categories: Array<{ value: string; label: string }> = []
) {
  const fromSettings = categories.find((item) => item.value === category)?.label;
  if (fromSettings) {
    return fromSettings;
  }

  const fromMap = categoryLabelMap[category];
  if (fromMap) {
    return fromMap;
  }

  return category
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function getVisibleSocialLinks(settings: SiteSettings) {
  return settings.footerContent.socialLinks.filter(
    (link) => !isPlaceholderSocialLink(link.href)
  );
}

export function getDisplayAddress(settings: SiteSettings) {
  return isPlaceholderAddress(settings.address)
    ? 'Visitas com atendimento personalizado'
    : settings.address;
}

export function getDisplayPhone(settings: SiteSettings) {
  if (!isPlaceholderPhone(settings.phone)) {
    return settings.phone;
  }

  if (!isPlaceholderPhone(settings.whatsapp)) {
    return settings.whatsapp;
  }

  return '';
}
