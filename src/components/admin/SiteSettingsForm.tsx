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

export default function SiteSettingsForm() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/settings')
      .then((response) => response.json())
      .then((data) => setSettings(normalizeSiteSettings(data)))
      .catch(() => setError('Nao foi possivel carregar as configuracoes.'));
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
            ...(sectionRecord[arrayKey][index] as Record<
              string,
              unknown
            >),
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
        throw new Error(data.error || 'Erro ao salvar as configuracoes.');
      }

      setSettings(normalizeSiteSettings(data));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : 'Erro ao salvar as configuracoes.'
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
    <>
      <h1 className={styles.title}>Configuracoes</h1>
      <p className={styles.subtitle}>Edite o conteudo completo do site publico.</p>
      {error ? <p className={styles.errorMessage}>{error}</p> : null}

      <form onSubmit={handleSubmit}>
        <GeneralHomeSection settings={settings} helpers={helpers} />
        <SpacesGallerySection settings={settings} helpers={helpers} />
        <BookingContactFooterSection settings={settings} helpers={helpers} />

        <div className={styles.formActions}>
          <button type="submit" className="btn btn-primary btn-lg" disabled={saving}>
            {saving ? (
              <span className="spinner" />
            ) : saved ? (
              'Configuracoes salvas'
            ) : (
              'Salvar configuracoes'
            )}
          </button>
        </div>
      </form>
    </>
  );
}
