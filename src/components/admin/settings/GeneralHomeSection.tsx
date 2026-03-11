'use client';

import styles from '@/app/admin/configuracoes/config.module.css';
import type { SiteSettings } from '@/lib/site-settings';
import { BusinessHoursEditor, ObjectListEditor, TextListEditor } from './Editors';
import type { SettingsFormHelpers } from './types';

export function GeneralHomeSection({
  settings,
  helpers,
}: {
  settings: SiteSettings;
  helpers: SettingsFormHelpers;
}) {
  return (
    <>
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Informacoes gerais</h2>
        <div className={styles.fieldGrid}>
          {[
            ['venueTitle', 'Nome do espaco'],
            ['venueSubtitle', 'Subtitulo'],
            ['phone', 'Telefone'],
            ['email', 'Email principal'],
            ['address', 'Endereco'],
            ['whatsapp', 'WhatsApp'],
            ['instagram', 'Instagram'],
            ['facebook', 'Facebook'],
          ].map(([key, label]) => (
            <div key={key} className="form-group">
              <label className="form-label">{label}</label>
              <input
                className="form-input"
                type={key === 'email' ? 'email' : 'text'}
                value={String(settings[key as keyof SiteSettings] ?? '')}
                onChange={(event) =>
                  helpers.updateField(
                    key as keyof SiteSettings,
                    event.target.value as SiteSettings[keyof SiteSettings]
                  )
                }
              />
            </div>
          ))}
        </div>
        <div className="form-group">
          <label className="form-label">Descricao institucional</label>
          <textarea
            className="form-textarea"
            rows={4}
            value={settings.aboutText}
            onChange={(event) => helpers.updateField('aboutText', event.target.value)}
          />
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Horario de atendimento</h2>
        <BusinessHoursEditor
          businessHours={settings.businessHours}
          toggleBusinessDay={helpers.toggleBusinessDay}
          updateBusinessHour={helpers.updateBusinessHour}
        />
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Home</h2>
        <div className={styles.fieldGrid}>
          {[
            ['heroLabel', 'Hero label'],
            ['heroTitle', 'Hero titulo'],
            ['heroTitleAccent', 'Hero destaque'],
            ['primaryCtaLabel', 'CTA primario'],
            ['secondaryCtaLabel', 'CTA secundario'],
            ['eventsSectionLabel', 'Label da secao de eventos'],
            ['eventsSectionTitle', 'Titulo da secao de eventos'],
            ['aboutSectionLabel', 'Label da secao sobre'],
            ['aboutSectionTitle', 'Titulo da secao sobre'],
            ['aboutCtaLabel', 'Botao da secao sobre'],
            ['ctaLabel', 'Label do CTA final'],
            ['ctaTitle', 'Titulo do CTA final'],
            ['ctaPrimaryLabel', 'CTA final primario'],
            ['ctaSecondaryLabel', 'CTA final secundario'],
          ].map(([key, label]) => (
            <div key={key} className="form-group">
              <label className="form-label">{label}</label>
              <input
                className="form-input"
                value={String(settings.homeContent[key as keyof typeof settings.homeContent] ?? '')}
                onChange={(event) =>
                  helpers.updateSectionField(
                    'homeContent',
                    key as keyof typeof settings.homeContent & string,
                    event.target.value as never
                  )
                }
              />
            </div>
          ))}
        </div>

        {[
          ['heroSubtitle', 'Hero subtitulo'],
          ['eventsSectionSubtitle', 'Descricao da secao de eventos'],
          ['ctaSubtitle', 'Descricao do CTA final'],
        ].map(([key, label]) => (
          <div key={key} className="form-group">
            <label className="form-label">{label}</label>
            <textarea
              className="form-textarea"
              rows={3}
              value={String(settings.homeContent[key as keyof typeof settings.homeContent] ?? '')}
              onChange={(event) =>
                helpers.updateSectionField(
                  'homeContent',
                  key as keyof typeof settings.homeContent & string,
                  event.target.value as never
                )
              }
            />
          </div>
        ))}

        <ObjectListEditor
          title="Evento"
          items={settings.homeContent.events}
          fields={[
            { key: 'icon', label: 'Icone' },
            { key: 'title', label: 'Titulo' },
            { key: 'desc', label: 'Descricao', type: 'textarea', rows: 3 },
          ]}
          addLabel="Adicionar evento"
          createEmpty={() => ({ icon: '', title: '', desc: '' })}
          onChange={(index, key, value) =>
            helpers.updateArrayItem('homeContent', 'events', index, key, value)
          }
          onAdd={(item) => helpers.addArrayItem('homeContent', 'events', item)}
          onRemove={(index) => helpers.removeArrayItem('homeContent', 'events', index)}
        />

        <ObjectListEditor
          title="Estatistica"
          items={settings.homeContent.stats}
          fields={[
            { key: 'value', label: 'Valor', type: 'number' },
            { key: 'suffix', label: 'Sufixo' },
            { key: 'label', label: 'Legenda' },
          ]}
          addLabel="Adicionar estatistica"
          createEmpty={() => ({ value: 0, suffix: '', label: '' })}
          onChange={(index, key, value) =>
            helpers.updateArrayItem('homeContent', 'stats', index, key, value)
          }
          onAdd={(item) => helpers.addArrayItem('homeContent', 'stats', item)}
          onRemove={(index) => helpers.removeArrayItem('homeContent', 'stats', index)}
        />

        <TextListEditor
          title="Paragrafo da secao sobre"
          items={settings.homeContent.aboutParagraphs}
          addLabel="Adicionar paragrafo"
          onChange={(index, value) =>
            helpers.updateStringArrayItem('homeContent', 'aboutParagraphs', index, value)
          }
          onAdd={() => helpers.addStringArrayItem('homeContent', 'aboutParagraphs')}
          onRemove={(index) =>
            helpers.removeStringArrayItem('homeContent', 'aboutParagraphs', index)
          }
        />

        <TextListEditor
          title="Diferencial"
          items={settings.homeContent.features}
          addLabel="Adicionar diferencial"
          onChange={(index, value) =>
            helpers.updateStringArrayItem('homeContent', 'features', index, value)
          }
          onAdd={() => helpers.addStringArrayItem('homeContent', 'features')}
          onRemove={(index) => helpers.removeStringArrayItem('homeContent', 'features', index)}
        />
      </div>
    </>
  );
}
