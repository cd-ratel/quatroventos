'use client';

import styles from '@/app/admin/configuracoes/config.module.css';
import type { SiteSettings } from '@/lib/site-settings';
import { ObjectListEditor } from './Editors';
import type { SettingsFormHelpers } from './types';

export function SpacesGallerySection({
  settings,
  helpers,
}: {
  settings: SiteSettings;
  helpers: SettingsFormHelpers;
}) {
  return (
    <>
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Página de espaços</h2>
        <div className={styles.fieldGrid}>
          {[
            ['heroLabel', 'Eyebrow do hero'],
            ['heroTitle', 'Título principal'],
            ['amenitiesSectionLabel', 'Label de amenidades'],
            ['amenitiesSectionTitle', 'Título de amenidades'],
            ['ctaTitle', 'Título do CTA'],
            ['ctaLabel', 'Botão do CTA'],
          ].map(([key, label]) => (
            <div key={key} className="form-group">
              <label className="form-label">{label}</label>
              <input
                className="form-input"
                value={String(settings.spacesContent[key as keyof typeof settings.spacesContent] ?? '')}
                onChange={(event) =>
                  helpers.updateSectionField(
                    'spacesContent',
                    key as keyof typeof settings.spacesContent & string,
                    event.target.value as never
                  )
                }
              />
            </div>
          ))}
        </div>

        {[
          ['heroSubtitle', 'Descrição do hero'],
          ['ctaSubtitle', 'Descrição do CTA'],
        ].map(([key, label]) => (
          <div key={key} className="form-group">
            <label className="form-label">{label}</label>
            <textarea
              className="form-textarea"
              rows={3}
              value={String(settings.spacesContent[key as keyof typeof settings.spacesContent] ?? '')}
              onChange={(event) =>
                helpers.updateSectionField(
                  'spacesContent',
                  key as keyof typeof settings.spacesContent & string,
                  event.target.value as never
                )
              }
            />
          </div>
        ))}

        <ObjectListEditor
          title="Espaço"
          items={settings.spacesContent.spaces}
          fields={[
            { key: 'tag', label: 'Tag' },
            { key: 'name', label: 'Nome' },
            { key: 'icon', label: 'Ícone' },
            { key: 'capacity', label: 'Capacidade' },
            { key: 'area', label: 'Área' },
            { key: 'desc', label: 'Descrição', type: 'textarea', rows: 4 },
          ]}
          addLabel="Adicionar espaço"
          createEmpty={() => ({
            tag: '',
            name: '',
            icon: '',
            capacity: '',
            area: '',
            desc: '',
          })}
          onChange={(index, key, value) =>
            helpers.updateArrayItem('spacesContent', 'spaces', index, key, value)
          }
          onAdd={(item) => helpers.addArrayItem('spacesContent', 'spaces', item)}
          onRemove={(index) => helpers.removeArrayItem('spacesContent', 'spaces', index)}
        />

        <ObjectListEditor
          title="Amenidade"
          items={settings.spacesContent.amenities}
          fields={[
            { key: 'icon', label: 'Ícone' },
            { key: 'name', label: 'Nome' },
          ]}
          addLabel="Adicionar amenidade"
          createEmpty={() => ({ icon: '', name: '' })}
          onChange={(index, key, value) =>
            helpers.updateArrayItem('spacesContent', 'amenities', index, key, value)
          }
          onAdd={(item) => helpers.addArrayItem('spacesContent', 'amenities', item)}
          onRemove={(index) => helpers.removeArrayItem('spacesContent', 'amenities', index)}
        />
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Galeria</h2>
        <div className={styles.fieldGrid}>
          {[
            ['heroLabel', 'Eyebrow do hero'],
            ['heroTitle', 'Título principal'],
            ['emptyMessage', 'Mensagem de vazio'],
          ].map(([key, label]) => (
            <div key={key} className="form-group">
              <label className="form-label">{label}</label>
              <input
                className="form-input"
                value={String(settings.galleryContent[key as keyof typeof settings.galleryContent] ?? '')}
                onChange={(event) =>
                  helpers.updateSectionField(
                    'galleryContent',
                    key as keyof typeof settings.galleryContent & string,
                    event.target.value as never
                  )
                }
              />
            </div>
          ))}
        </div>

        <div className="form-group">
          <label className="form-label">Descrição do hero</label>
          <textarea
            className="form-textarea"
            rows={3}
            value={settings.galleryContent.heroSubtitle}
            onChange={(event) =>
              helpers.updateSectionField('galleryContent', 'heroSubtitle', event.target.value)
            }
          />
        </div>

        <ObjectListEditor
          title="Categoria"
          items={settings.galleryContent.categories}
          fields={[
            { key: 'value', label: 'Valor interno' },
            { key: 'label', label: 'Rótulo' },
          ]}
          addLabel="Adicionar categoria"
          createEmpty={() => ({ value: '', label: '' })}
          onChange={(index, key, value) =>
            helpers.updateArrayItem('galleryContent', 'categories', index, key, value)
          }
          onAdd={(item) => helpers.addArrayItem('galleryContent', 'categories', item)}
          onRemove={(index) => helpers.removeArrayItem('galleryContent', 'categories', index)}
        />

        <ObjectListEditor
          title="Placeholder"
          items={settings.galleryContent.placeholderMedia}
          fields={[
            { key: 'id', label: 'ID' },
            { key: 'title', label: 'Título' },
            { key: 'category', label: 'Categoria' },
            { key: 'caption', label: 'Legenda' },
            { key: 'icon', label: 'Ícone' },
          ]}
          addLabel="Adicionar placeholder"
          createEmpty={() => ({
            id: '',
            title: '',
            category: '',
            caption: '',
            icon: '',
          })}
          onChange={(index, key, value) =>
            helpers.updateArrayItem('galleryContent', 'placeholderMedia', index, key, value)
          }
          onAdd={(item) => helpers.addArrayItem('galleryContent', 'placeholderMedia', item)}
          onRemove={(index) =>
            helpers.removeArrayItem('galleryContent', 'placeholderMedia', index)
          }
        />
      </div>
    </>
  );
}
