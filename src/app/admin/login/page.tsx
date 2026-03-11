'use client';

import { useState, FormEvent } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import styles from './login.module.css';

export default function AdminLoginPage() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);

    const result = await signIn('credentials', {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      redirect: false,
    });

    if (result?.error) {
      setError('Email ou senha inválidos');
      setLoading(false);
    } else {
      router.push('/admin');
    }
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
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <p className={styles.loginError}>{error}</p>
          )}

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
