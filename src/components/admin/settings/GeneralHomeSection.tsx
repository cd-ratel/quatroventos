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
        <h2 className={styles.sectionTitle}>Informações gerais</h2>
        <div className={styles.fieldGrid}>
          {[
            ['venueTitle', 'Nome do espaço'],
            ['venueSubtitle', 'Subtítulo institucional'],
            ['phone', 'Telefone'],
            ['email', 'E-mail principal'],
            ['address', 'Endereço'],
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
          <label className="form-label">Descrição institucional</label>
          <textarea
            className="form-textarea"
            rows={4}
            value={settings.aboutText}
            onChange={(event) => helpers.updateField('aboutText', event.target.value)}
          />
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Horário de atendimento</h2>
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
            ['heroLabel', 'Eyebrow do hero'],
            ['heroTitle', 'Título principal'],
            ['heroTitleAccent', 'Destaque do título'],
            ['primaryCtaLabel', 'CTA principal'],
            ['secondaryCtaLabel', 'CTA secundário'],
            ['eventsSectionLabel', 'Label da seção de eventos'],
            ['eventsSectionTitle', 'Título da seção de eventos'],
            ['aboutSectionLabel', 'Label da seção institucional'],
            ['aboutSectionTitle', 'Título da seção institucional'],
            ['aboutCtaLabel', 'Botão da seção institucional'],
            ['ctaLabel', 'Label do CTA final'],
            ['ctaTitle', 'Título do CTA final'],
            ['ctaPrimaryLabel', 'Botão principal do CTA final'],
            ['ctaSecondaryLabel', 'Botão secundário do CTA final'],
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
          ['heroSubtitle', 'Texto de apoio do hero'],
          ['eventsSectionSubtitle', 'Descrição da seção de eventos'],
          ['ctaSubtitle', 'Descrição do CTA final'],
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
            { key: 'icon', label: 'Ícone' },
            { key: 'title', label: 'Título' },
            { key: 'desc', label: 'Descrição', type: 'textarea', rows: 3 },
          ]}
          addLabel="Adicionar evento"
          createEmpty={() => ({ icon: '', title: '', desc: '' })}
          onChange={(index, key, value) =>
            helpers.updateArrayItem('homeContent', 'events', index, key, value)
          }
          onAdd={(item) => helpers.addArrayItem('homeContent', 'events', item)}
          onRemove={(index) => helpers.removeArrayItem('homeContent', 'events', index)}
        />

        <TextListEditor
          title="Parágrafo institucional"
          items={settings.homeContent.aboutParagraphs}
          addLabel="Adicionar parágrafo"
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
