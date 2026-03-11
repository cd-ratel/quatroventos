const DEFAULT_PUBLIC_URL = 'https://quatroventos.redecm.com.br';
const DEFAULT_ADMIN_URL = 'https://adminquatroventos.redecm.com.br';
const INTERNAL_HOSTS = new Set(['127.0.0.1', 'localhost']);

export const PUBLIC_URL = process.env.APP_URL || DEFAULT_PUBLIC_URL;
export const ADMIN_URL = process.env.ADMIN_URL || DEFAULT_ADMIN_URL;
export const PUBLIC_HOST = new URL(PUBLIC_URL).host;
export const ADMIN_HOST = new URL(ADMIN_URL).host;

type HeaderBag = {
  get(name: string): string | null;
};

export function normalizeHost(value?: string | null) {
  return value?.split(',')[0]?.trim().split(':')[0]?.toLowerCase() || '';
}

export function getRequestHost(headers: HeaderBag) {
  return normalizeHost(
    headers.get('x-forwarded-host') ||
      headers.get('host') ||
      headers.get('x-original-host')
  );
}

export function isPublicHost(host: string) {
  return host === PUBLIC_HOST;
}

export function isAdminHost(host: string) {
  return host === ADMIN_HOST;
}

export function isKnownHost(host: string) {
  return isPublicHost(host) || isAdminHost(host);
}

export function isInternalHost(host: string) {
  return INTERNAL_HOSTS.has(host);
}

export function isAllowedHost(host: string) {
  return isKnownHost(host) || isInternalHost(host);
}

export function getAllowedOriginForHost(host: string) {
  if (isPublicHost(host)) {
    return PUBLIC_URL;
  }

  if (isAdminHost(host)) {
    return ADMIN_URL;
  }

  return null;
}
