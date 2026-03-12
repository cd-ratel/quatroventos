'use client';

import { FormEvent, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './login.module.css';

function getSafeCallbackUrl(rawValue: string | null) {
  if (!rawValue) {
    return '/admin';
  }

  if (rawValue.startsWith('/admin')) {
    return rawValue;
  }

  if (typeof window !== 'undefined') {
    try {
      const url = new URL(rawValue, window.location.origin);
      if (url.origin === window.location.origin && url.pathname.startsWith('/admin')) {
        return `${url.pathname}${url.search}${url.hash}`;
      }
    } catch {
      return '/admin';
    }
  }

  return '/admin';
}

export default function AdminLoginPage() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(event.currentTarget);
    const callbackUrl = getSafeCallbackUrl(searchParams.get('callbackUrl'));

    const result = await signIn('credentials', {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      redirect: false,
      callbackUrl,
    });

    if (result?.error) {
      setError('E-mail ou senha inválidos.');
      setLoading(false);
      return;
    }

    router.push(result?.url || callbackUrl);
    router.refresh();
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginBackdrop} />

      <div className={styles.loginLayout}>
        <section className={styles.loginIntro}>
          <span className={styles.kicker}>Admin Quatro Ventos</span>
          <h1>Painel sóbrio para gerir visitas, mídia e conteúdo.</h1>
          <p>
            Entre com as credenciais do painel para acompanhar agendamentos,
            atualizar o material do salão e ajustar os textos do site público.
          </p>
        </section>

        <section className={styles.loginCard}>
          <div className={styles.loginHeader}>
            <div className={styles.loginLogo}>QV</div>
            <div>
              <h2>Entrar no painel</h2>
              <p>Use o e-mail administrativo cadastrado no ambiente.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">E-mail</label>
              <input
                type="email"
                name="email"
                className="form-input"
                placeholder="admin@quatroventos.com.br"
                required
                autoFocus
              />
            </div>

            <div className="form-group">
              <label className="form-label">Senha</label>
              <input
                type="password"
                name="password"
                className="form-input"
                placeholder="••••••••"
                required
              />
            </div>

            {error ? <p className={styles.loginError}>{error}</p> : null}

            <button
              type="submit"
              className="btn-primary btn-lg"
              style={{ width: '100%', marginTop: '0.25rem' }}
              disabled={loading}
            >
              {loading ? <span className="spinner" /> : 'Entrar'}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
