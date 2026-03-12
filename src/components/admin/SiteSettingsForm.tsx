'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import styles from '@/app/admin/configuracoes/config.module.css';
import { normalizeSiteSettings, type SiteSettings } from '@/lib/site-settings';
import { BookingContactFooterSection } from './settings/BookingContactFooterSection';
import { GeneralHomeSection } from './settings/GeneralHomeSection';
import { SpacesGallerySection } from './settings/SpacesGallerySection';
import type { SettingsFormHelpers } from './settings/types';

function cloneSettings(settings: SiteSettings) {
  return structuredClone(settings);
}

const tabs = [
  { id: 'general', label: 'Geral e Home' },
  { id: 'spaces', label: 'Espaços e Galeria' },
  { id: 'booking', label: 'Agendamento, Contato e Rodapé' },
] as const;

type TabId = (typeof tabs)[number]['id'];

export default function SiteSettingsForm() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>('general');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/settings')
      .then((response) => response.json())
      .then((data) => setSettings(normalizeSiteSettings(data)))
      .catch(() => setError('Não foi possível carregar as configurações.'));
  }, []);

  const updateSettings = (updater: (draft: SiteSettings) => void) => {
    setSettings((current) => {
      if (!current) {
        return current;
      }

      const next = cloneSettings(current);
      updater(next);
      return next;
    });
  };

  const helpers = useMemo<SettingsFormHelpers>(
    () => ({
      updateField: (key, value) => {
        updateSettings((draft) => {
          draft[key] = value;
        });
      },
      updateSectionField: (section, key, value) => {
        updateSettings((draft) => {
          (draft[section] as SiteSettings[typeof section])[key] = value;
        });
      },
      updateArrayItem: (section, arrayKey, index, key, value) => {
        updateSettings((draft) => {
          const sectionRecord = draft[section] as unknown as Record<string, unknown[]>;
          sectionRecord[arrayKey][index] = {
            ...(sectionRecord[arrayKey][index] as Record<string, unknown>),
            [key]: value,
          };
        });
      },
      addArrayItem: (section, arrayKey, value) => {
        updateSettings((draft) => {
          const sectionRecord = draft[section] as unknown as Record<string, unknown[]>;
          (sectionRecord[arrayKey] as unknown[]).push(value);
        });
      },
      removeArrayItem: (section, arrayKey, index) => {
        updateSettings((draft) => {
          const sectionRecord = draft[section] as unknown as Record<string, unknown[]>;
          (sectionRecord[arrayKey] as unknown[]).splice(index, 1);
        });
      },
      updateStringArrayItem: (section, arrayKey, index, value) => {
        updateSettings((draft) => {
          const sectionRecord = draft[section] as unknown as Record<string, string[]>;
          (sectionRecord[arrayKey] as string[])[index] = value;
        });
      },
      addStringArrayItem: (section, arrayKey, value = '') => {
        updateSettings((draft) => {
          const sectionRecord = draft[section] as unknown as Record<string, string[]>;
          (sectionRecord[arrayKey] as string[]).push(value);
        });
      },
      removeStringArrayItem: (section, arrayKey, index) => {
        updateSettings((draft) => {
          const sectionRecord = draft[section] as unknown as Record<string, string[]>;
          (sectionRecord[arrayKey] as string[]).splice(index, 1);
        });
      },
      updateCardLine: (index, lineIndex, value) => {
        updateSettings((draft) => {
          draft.contactContent.cards[index].lines[lineIndex] = value;
        });
      },
      addCardLine: (index) => {
        updateSettings((draft) => {
          draft.contactContent.cards[index].lines.push('');
        });
      },
      removeCardLine: (index, lineIndex) => {
        updateSettings((draft) => {
          draft.contactContent.cards[index].lines.splice(lineIndex, 1);
        });
      },
      toggleBusinessDay: (day, isOpen) => {
        updateSettings((draft) => {
          draft.businessHours[day] = isOpen
            ? draft.businessHours[day] || { open: '09:00', close: '18:00' }
            : null;
        });
      },
      updateBusinessHour: (day, key, value) => {
        updateSettings((draft) => {
          if (!draft.businessHours[day]) {
            draft.businessHours[day] = { open: '09:00', close: '18:00' };
          }
          draft.businessHours[day]![key] = value;
        });
      },
    }),
    []
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!settings) {
      return;
    }

    setSaving(true);
    setSaved(false);
    setError('');

    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao salvar as configurações.');
      }

      setSettings(normalizeSiteSettings(data));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : 'Erro ao salvar as configurações.'
      );
    } finally {
      setSaving(false);
    }
  };

  if (!settings) {
    return (
      <div className={styles.loading}>
        <span className="spinner" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={styles.page}>
      <header className={styles.pageHero}>
        <div>
          <span className={styles.pageKicker}>Conteúdo do site</span>
          <h2>Gerencie textos, contatos, navegação e blocos públicos.</h2>
          <p>
            Use as abas abaixo para editar a experiência do visitante sem mexer no código.
          </p>
        </div>

        <div className={styles.pageStatus}>
          {error ? <p className={styles.errorMessage}>{error}</p> : null}
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? (
              <span className="spinner" />
            ) : saved ? (
              'Alterações salvas'
            ) : (
              'Salvar alterações'
            )}
          </button>
        </div>
      </header>

      <div className={styles.tabBar}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`${styles.tabButton} ${activeTab === tab.id ? styles.tabButtonActive : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className={styles.tabPanel}>
        {activeTab === 'general' ? (
          <GeneralHomeSection settings={settings} helpers={helpers} />
        ) : null}

        {activeTab === 'spaces' ? (
          <SpacesGallerySection settings={settings} helpers={helpers} />
        ) : null}

        {activeTab === 'booking' ? (
          <BookingContactFooterSection settings={settings} helpers={helpers} />
        ) : null}
      </div>
    </form>
  );
}
