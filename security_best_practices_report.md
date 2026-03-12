# Relatório de Segurança - Quatro Ventos

Data: 2026-03-12

## Escopo

- Revisão de autenticação, headers, host validation e rotas do App Router
- Revisão de endpoints públicos e administrativos
- Revisão do fluxo de upload de mídia
- Revisão do seed/bootstrap e do deploy versionado
- Revisão das configurações Nginx versionadas
- Validação ofensiva prática com enumeração de superfície, upload malicioso, testes de auth bypass e revisão de cookies/sessão

## Achados corrigidos

1. **Host header spoofing mitigado**
   - O app agora rejeita requisições com `Host`, `X-Forwarded-Host` e `X-Original-Host` divergentes.
   - O proxy versionado foi ajustado para sobrescrever explicitamente `X-Forwarded-Host` e `X-Original-Host`.

2. **Brute force no login administrativo reduzido**
   - A rota `api/auth` passou a aceitar apenas host admin/interno.
   - Tentativas de login por credenciais agora sofrem rate limit.

3. **Abuso de endpoints públicos reduzido**
   - `POST /api/contact`, `POST /api/appointments` e `GET /api/appointments/availability` agora têm rate limiting.
   - Rotas de mutação exigem origem confiável antes de processar o payload.

4. **Payloads excessivos e parâmetros inseguros bloqueados**
   - Leitura de JSON com limite explícito de tamanho.
   - Query params do admin de agendamentos agora retornam `400` quando inválidos, em vez de falhar internamente.

5. **Upload de mídia endurecido**
   - Rate limit administrativo para upload e exclusão.
   - Limite de quantidade de arquivos por requisição.
   - Escrita de arquivos com `flag: 'wx'` para evitar overwrite acidental.
   - Allowlist de categorias, legenda limitada e validação de assinatura/MIME já mantidas.

6. **Seed e deploy protegidos contra segredo fraco/placeholder**
   - O seed não aceita mais `ADMIN_PASSWORD` ausente, placeholder ou fraco.
   - O deploy falha cedo quando encontra segredos não preenchidos, `NEXTAUTH_URL` divergente do admin ou senha administrativa fraca.

7. **Headers de segurança reforçados**
   - CSP ampliada com `default-src`, `form-action`, `object-src 'none'`, `media-src`, `font-src` e `worker-src`.
   - Inclusão de `Cross-Origin-Opener-Policy`, `Cross-Origin-Resource-Policy`, `Origin-Agent-Cluster` e `X-DNS-Prefetch-Control`.

8. **Autenticação mais robusta**
   - Normalização de email no login e comparação case-insensitive.
   - Rejeição de credenciais com tamanhos fora do razoável.

9. **App não fica mais exposto diretamente na internet**
   - O serviço `app` agora publica `127.0.0.1:3100:3000` em vez de `0.0.0.0:3100:3000`.
   - Isso mantém o acesso somente pelo proxy local da VPS e remove uma superfície desnecessária na internet.

## Validações ofensivas executadas

- `GET https://adminquatroventos.redecm.com.br/api/auth/csrf`
  - cookies `__Host-authjs.csrf-token` e `__Secure-authjs.callback-url` vieram com `HttpOnly`, `Secure` e `SameSite=Lax`.
- Login real via `POST /api/auth/callback/credentials`
  - cookie `__Secure-authjs.session-token` emitido com `HttpOnly`, `Secure` e `SameSite=Lax`.
- Tentativa de open redirect com `callbackUrl=https://evil.example/steal`
  - neutralizada com redirecionamento seguro para o host canônico.
- Tentativa de bypass do host público com `X-Forwarded-Host: adminquatroventos.redecm.com.br`
  - continuou retornando `404`.
- Tentativa de CSRF em `POST /api/contact` com `Origin` externa
  - bloqueada com `403`.
- Upload malicioso de `evil.svg`
  - bloqueado com `400` e erro `Formato de arquivo não permitido.`
- Upload malicioso de `fake.png` com conteúdo HTML
  - bloqueado com `400` e erro `Formato de arquivo não permitido.`
- Teste direto no app por `http://147.93.179.11:3100`
  - antes do fechamento da porta, o app rejeitava hosts inválidos e spoofing com `404`;
  - após esta rodada, a publicação fica restrita a `127.0.0.1` para eliminar a exposição externa da porta.

## Verificações executadas

- `npx tsc --noEmit`
- `npm run build`
- `npm audit --omit=dev`
- `bash -n scripts/deploy.sh`

Resultado:

- Typecheck: aprovado
- Build de produção: aprovado
- Dependências de produção com vulnerabilidades conhecidas: `0`
- Sintaxe do script de deploy: aprovada

## Riscos residuais

1. **Rate limit em memória**
   - O limitador atual é intencionalmente simples e funciona bem para a stack atual com um único container de app.
   - Se a aplicação passar a escalar horizontalmente, o ideal é migrar para Redis ou camada equivalente.

2. **Proxy compartilhado da VPS**
   - Os arquivos Nginx do repositório foram endurecidos, mas a proteção efetiva depende de aplicar a configuração no host da VPS.
   - Como o proxy é compartilhado com outros projetos, qualquer endurecimento adicional no default server deve ser feito com cuidado.

3. **Segredos operacionais**
   - A segurança final continua dependente de `NEXTAUTH_SECRET`, `ADMIN_PASSWORD`, `POSTGRES_PASSWORD` e SMTP fortes no `.env` da produção.
