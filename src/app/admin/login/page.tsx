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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const callbackUrl = getSafeCallbackUrl(searchParams.get('callbackUrl'));

    const result = await signIn('credentials', {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      redirect: false,
      callbackUrl,
    });

    if (result?.error) {
      setError('Email ou senha invalidos');
      setLoading(false);
      return;
    }

    router.push(result?.url || callbackUrl);
    router.refresh();
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginBg} />
      <div className={styles.loginCard}>
        <div className={styles.loginHeader}>
          <div className={styles.loginLogo}>QV</div>
          <h1 className={styles.loginTitle}>Quatro Ventos</h1>
          <p className={styles.loginSubtitle}>Painel Administrativo</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
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
              placeholder="********"
              required
            />
          </div>

          {error && <p className={styles.loginError}>{error}</p>}

          <button
            type="submit"
            className="btn btn-primary btn-lg"
            style={{ width: '100%', marginTop: 'var(--space-md)' }}
            disabled={loading}
          >
            {loading ? <span className="spinner" /> : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}
