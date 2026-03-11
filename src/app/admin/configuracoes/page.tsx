'use client';

import { useEffect, useState, FormEvent } from 'react';
import styles from './config.module.css';

interface SettingsData {
  venueTitle: string;
  venueSubtitle: string;
  phone: string;
  email: string;
  address: string;
  whatsapp: string;
  instagram: string;
  facebook: string;
  aboutText: string;
  businessHours: string;
}

export default function ConfiguracoesPage() {
  const [settings, setSettings] = useState<SettingsData | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((data) => setSettings({
        ...data,
        businessHours: typeof data.businessHours === 'string'
          ? data.businessHours
          : JSON.stringify(data.businessHours, null, 2),
      }))
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    setSaved(false);

    try {
      let parsedHours = settings.businessHours;
      try { parsedHours = JSON.parse(settings.businessHours); } catch {}

      await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...settings, businessHours: parsedHours }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      // silent
    } finally {
      setSaving(false);
    }
  };

  const update = (key: keyof SettingsData, value: string) => {
    setSettings((s) => s ? { ...s, [key]: value } : null);
  };

  if (!settings) return <div className={styles.loading}><span className="spinner" /></div>;

  return (
    <>
      <h1 className={styles.title}>Configurações</h1>
      <p className={styles.subtitle}>Gerencie as informações do site</p>

      <form onSubmit={handleSubmit}>
        {/* General */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Informações Gerais</h2>
          <div className={styles.formRow}>
            <div className="form-group">
              <label className="form-label">Nome do Espaço</label>
              <input className="form-input" value={settings.venueTitle} onChange={(e) => update('venueTitle', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Subtítulo</label>
              <input className="form-input" value={settings.venueSubtitle} onChange={(e) => update('venueSubtitle', e.target.value)} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Sobre (texto para o site)</label>
            <textarea className="form-textarea" rows={4} value={settings.aboutText} onChange={(e) => update('aboutText', e.target.value)} />
          </div>
        </div>

        {/* Contact */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Contato</h2>
          <div className={styles.formRow}>
            <div className="form-group">
              <label className="form-label">Telefone</label>
              <input className="form-input" value={settings.phone} onChange={(e) => update('phone', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-input" type="email" value={settings.email} onChange={(e) => update('email', e.target.value)} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Endereço</label>
            <input className="form-input" value={settings.address} onChange={(e) => update('address', e.target.value)} />
          </div>
        </div>

        {/* Social */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Redes Sociais</h2>
          <div className={styles.formRow3}>
            <div className="form-group">
              <label className="form-label">WhatsApp (com código do país)</label>
              <input className="form-input" value={settings.whatsapp} onChange={(e) => update('whatsapp', e.target.value)} placeholder="5511999999999" />
            </div>
            <div className="form-group">
              <label className="form-label">Instagram (URL)</label>
              <input className="form-input" value={settings.instagram} onChange={(e) => update('instagram', e.target.value)} placeholder="https://instagram.com/..." />
            </div>
            <div className="form-group">
              <label className="form-label">Facebook (URL)</label>
              <input className="form-input" value={settings.facebook} onChange={(e) => update('facebook', e.target.value)} placeholder="https://facebook.com/..." />
            </div>
          </div>
        </div>

        {/* Business Hours */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Horário de Funcionamento</h2>
          <div className="form-group">
            <label className="form-label">JSON de Horários</label>
            <textarea className="form-textarea" rows={8} value={settings.businessHours} onChange={(e) => update('businessHours', e.target.value)} style={{ fontFamily: 'monospace', fontSize: '0.85rem' }} />
          </div>
        </div>

        <div className={styles.formActions}>
          <button type="submit" className="btn btn-primary btn-lg" disabled={saving}>
            {saving ? <span className="spinner" /> : saved ? '✅ Salvo!' : 'Salvar Configurações'}
          </button>
        </div>
      </form>
    </>
  );
}
