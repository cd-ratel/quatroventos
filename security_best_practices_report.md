# Relatório de Segurança - Quatro Ventos

Data: 2026-03-12

## Escopo

- Revisão de autenticação, headers, host validation e rotas do App Router
- Revisão de endpoints públicos e administrativos
- Revisão do fluxo de upload de mídia
- Revisão do seed/bootstrap e do deploy versionado
- Revisão das configurações Nginx versionadas

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
