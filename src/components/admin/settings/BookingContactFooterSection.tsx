'use client';

import styles from '@/app/admin/configuracoes/config.module.css';
import type { SiteSettings } from '@/lib/site-settings';
import { ObjectListEditor, TextListEditor } from './Editors';
import type { SettingsFormHelpers } from './types';

export function BookingContactFooterSection({
  settings,
  helpers,
}: {
  settings: SiteSettings;
  helpers: SettingsFormHelpers;
}) {
  return (
    <>
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Página de agendamento</h2>
        <div className={styles.fieldGrid}>
          {[
            ['heroLabel', 'Hero label'],
            ['title', 'Título'],
            ['formTitle', 'Título do formulário'],
            ['formSubtitle', 'Subtítulo do formulário'],
            ['successTitle', 'Título de sucesso'],
            ['resetButtonLabel', 'Botão de reset'],
            ['submitButtonLabel', 'Botão de envio'],
          ].map(([key, label]) => (
            <div key={key} className="form-group">
              <label className="form-label">{label}</label>
              <input
                className="form-input"
                value={String(settings.bookingContent[key as keyof typeof settings.bookingContent] ?? '')}
                onChange={(event) =>
                  helpers.updateSectionField(
                    'bookingContent',
                    key as keyof typeof settings.bookingContent & string,
                    event.target.value as never
                  )
                }
              />
            </div>
          ))}
        </div>
        {[
          ['subtitle', 'Descrição principal'],
          ['successMessage', 'Mensagem de sucesso'],
          ['conflictMessage', 'Mensagem de conflito de horário'],
        ].map(([key, label]) => (
          <div key={key} className="form-group">
            <label className="form-label">{label}</label>
            <textarea
              className="form-textarea"
              rows={3}
              value={String(settings.bookingContent[key as keyof typeof settings.bookingContent] ?? '')}
              onChange={(event) =>
                helpers.updateSectionField(
                  'bookingContent',
                  key as keyof typeof settings.bookingContent & string,
                  event.target.value as never
                )
              }
            />
          </div>
        ))}

        <ObjectListEditor
          title="Card informativo"
          items={settings.bookingContent.infoCards}
          fields={[
            { key: 'icon', label: 'Ícone' },
            { key: 'title', label: 'Título' },
            { key: 'desc', label: 'Descrição', type: 'textarea', rows: 3 },
          ]}
          addLabel="Adicionar card"
          createEmpty={() => ({ icon: '', title: '', desc: '' })}
          onChange={(index, key, value) =>
            helpers.updateArrayItem('bookingContent', 'infoCards', index, key, value)
          }
          onAdd={(item) => helpers.addArrayItem('bookingContent', 'infoCards', item)}
          onRemove={(index) => helpers.removeArrayItem('bookingContent', 'infoCards', index)}
        />

        <ObjectListEditor
          title="Tipo de evento"
          items={settings.bookingContent.eventTypes}
          fields={[
            { key: 'value', label: 'Valor' },
            { key: 'label', label: 'Rótulo' },
          ]}
          addLabel="Adicionar tipo de evento"
          createEmpty={() => ({ value: '', label: '' })}
          onChange={(index, key, value) =>
            helpers.updateArrayItem('bookingContent', 'eventTypes', index, key, value)
          }
          onAdd={(item) => helpers.addArrayItem('bookingContent', 'eventTypes', item)}
          onRemove={(index) => helpers.removeArrayItem('bookingContent', 'eventTypes', index)}
        />

        <TextListEditor
          title="Horário disponível"
          items={settings.bookingContent.timeSlots}
          addLabel="Adicionar horário"
          onChange={(index, value) =>
            helpers.updateStringArrayItem('bookingContent', 'timeSlots', index, value)
          }
          onAdd={() => helpers.addStringArrayItem('bookingContent', 'timeSlots', '09:00')}
          onRemove={(index) => helpers.removeStringArrayItem('bookingContent', 'timeSlots', index)}
        />
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Página de contato</h2>
        <div className={styles.fieldGrid}>
          {[
            ['heroLabel', 'Hero label'],
            ['heroTitle', 'Hero título'],
            ['formTitle', 'Título do formulário'],
            ['formSuccessTitle', 'Título de sucesso'],
            ['formResetLabel', 'Botão de reset'],
            ['namePlaceholder', 'Placeholder nome'],
            ['emailPlaceholder', 'Placeholder email'],
            ['subjectPlaceholder', 'Placeholder assunto'],
            ['mapPlaceholderTitle', 'Título do placeholder do mapa'],
          ].map(([key, label]) => (
            <div key={key} className="form-group">
              <label className="form-label">{label}</label>
              <input
                className="form-input"
                value={String(settings.contactContent[key as keyof typeof settings.contactContent] ?? '')}
                onChange={(event) =>
                  helpers.updateSectionField(
                    'contactContent',
                    key as keyof typeof settings.contactContent & string,
                    event.target.value as never
                  )
                }
              />
            </div>
          ))}
        </div>
        {[
          ['heroSubtitle', 'Hero descrição'],
          ['formSuccessMessage', 'Mensagem de sucesso'],
          ['messagePlaceholder', 'Placeholder mensagem'],
          ['mapPlaceholderSubtitle', 'Descrição do placeholder do mapa'],
        ].map(([key, label]) => (
          <div key={key} className="form-group">
            <label className="form-label">{label}</label>
            <textarea
              className="form-textarea"
              rows={3}
              value={String(settings.contactContent[key as keyof typeof settings.contactContent] ?? '')}
              onChange={(event) =>
                helpers.updateSectionField(
                  'contactContent',
                  key as keyof typeof settings.contactContent & string,
                  event.target.value as never
                )
              }
            />
          </div>
        ))}

        <ObjectListEditor
          title="Card de contato"
          items={settings.contactContent.cards}
          fields={[
            { key: 'icon', label: 'Ícone' },
            { key: 'title', label: 'Título' },
            { key: 'buttonLabel', label: 'Texto do botão' },
            { key: 'buttonUrl', label: 'URL do botão' },
          ]}
          addLabel="Adicionar card"
          createEmpty={() => ({
            icon: '',
            title: '',
            lines: [''],
            buttonLabel: '',
            buttonUrl: '',
          })}
          onChange={(index, key, value) =>
            helpers.updateArrayItem('contactContent', 'cards', index, key, value)
          }
          onAdd={(item) => helpers.addArrayItem('contactContent', 'cards', item)}
          onRemove={(index) => helpers.removeArrayItem('contactContent', 'cards', index)}
          renderExtra={(item, index) => (
            <TextListEditor
              title="Linha do card"
              items={item.lines}
              addLabel="Adicionar linha"
              onChange={(lineIndex, value) => helpers.updateCardLine(index, lineIndex, value)}
              onAdd={() => helpers.addCardLine(index)}
              onRemove={(lineIndex) => helpers.removeCardLine(index, lineIndex)}
            />
          )}
        />
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Footer e navegação</h2>
        <div className={styles.fieldGrid}>
          {[
            ['navigationTitle', 'Título da navegação'],
            ['navigationCtaLabel', 'CTA da navegação'],
            ['eventsTitle', 'Título da coluna de eventos'],
            ['contactTitle', 'Título da coluna de contato'],
            ['creditsText', 'Texto de créditos'],
          ].map(([key, label]) => (
            <div key={key} className="form-group">
              <label className="form-label">{label}</label>
              <input
                className="form-input"
                value={String(settings.footerContent[key as keyof typeof settings.footerContent] ?? '')}
                onChange={(event) =>
                  helpers.updateSectionField(
                    'footerContent',
                    key as keyof typeof settings.footerContent & string,
                    event.target.value as never
                  )
                }
              />
            </div>
          ))}
        </div>
        <div className="form-group">
          <label className="form-label">Descrição do footer</label>
          <textarea
            className="form-textarea"
            rows={3}
            value={settings.footerContent.description}
            onChange={(event) =>
              helpers.updateSectionField('footerContent', 'description', event.target.value)
            }
          />
        </div>

        <ObjectListEditor
          title="Link de navegação"
          items={settings.footerContent.navigationLinks}
          fields={[
            { key: 'label', label: 'Rótulo' },
            { key: 'href', label: 'URL' },
          ]}
          addLabel="Adicionar link"
          createEmpty={() => ({ label: '', href: '' })}
          onChange={(index, key, value) =>
            helpers.updateArrayItem('footerContent', 'navigationLinks', index, key, value)
          }
          onAdd={(item) => helpers.addArrayItem('footerContent', 'navigationLinks', item)}
          onRemove={(index) => helpers.removeArrayItem('footerContent', 'navigationLinks', index)}
        />

        <ObjectListEditor
          title="Link de evento"
          items={settings.footerContent.eventLinks}
          fields={[
            { key: 'label', label: 'Rótulo' },
            { key: 'href', label: 'URL' },
          ]}
          addLabel="Adicionar link de evento"
          createEmpty={() => ({ label: '', href: '' })}
          onChange={(index, key, value) =>
            helpers.updateArrayItem('footerContent', 'eventLinks', index, key, value)
          }
          onAdd={(item) => helpers.addArrayItem('footerContent', 'eventLinks', item)}
          onRemove={(index) => helpers.removeArrayItem('footerContent', 'eventLinks', index)}
        />

        <ObjectListEditor
          title="Rede social"
          items={settings.footerContent.socialLinks}
          fields={[
            { key: 'label', label: 'Sigla' },
            { key: 'href', label: 'URL' },
            { key: 'ariaLabel', label: 'Descrição acessível' },
          ]}
          addLabel="Adicionar rede social"
          createEmpty={() => ({ label: '', href: '', ariaLabel: '' })}
          onChange={(index, key, value) =>
            helpers.updateArrayItem('footerContent', 'socialLinks', index, key, value)
          }
          onAdd={(item) => helpers.addArrayItem('footerContent', 'socialLinks', item)}
          onRemove={(index) => helpers.removeArrayItem('footerContent', 'socialLinks', index)}
        />
      </div>
    </>
  );
}
