import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import {
  getAllowedOriginForHost,
  getRequestHost,
  isAdminHost,
  isAllowedHost,
  isPublicHost,
  normalizeHost,
} from '@/lib/site-host';

type TrustedMutationPolicy = 'admin' | 'public' | 'same-known-host';

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

function isTrustedHostForPolicy(host: string, policy: TrustedMutationPolicy) {
  if (policy === 'admin') {
    return isAdminHost(host);
  }

  if (policy === 'public') {
    return isPublicHost(host);
  }

  return isAllowedHost(host);
}

export function assertTrustedMutationRequest(
  request: NextRequest,
  policy: TrustedMutationPolicy
) {
  const requestHost = getRequestHost(request.headers);

  if (!requestHost || !isAllowedHost(requestHost)) {
    return jsonError('Host inválido.', 404);
  }

  if (!isTrustedHostForPolicy(requestHost, policy)) {
    return jsonError('Host inválido para esta operação.', 403);
  }

  const origin = request.headers.get('origin');
  if (!origin) {
    return jsonError('Origem da requisição ausente.', 403);
  }

  let originUrl: URL;
  try {
    originUrl = new URL(origin);
  } catch {
    return jsonError('Origem da requisição inválida.', 403);
  }

  const originHost = normalizeHost(originUrl.host);
  if (originHost !== requestHost) {
    return jsonError('Origem da requisição não autorizada.', 403);
  }

  if (!isTrustedHostForPolicy(originHost, policy)) {
    return jsonError('Origem da requisição não autorizada.', 403);
  }

  const expectedOrigin = getAllowedOriginForHost(requestHost);
  if (expectedOrigin && originUrl.origin !== expectedOrigin) {
    return jsonError('Origem da requisição não autorizada.', 403);
  }

  return null;
}
