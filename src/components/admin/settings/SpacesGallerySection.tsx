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
        <h2 className={styles.sectionTitle}>Pagina de espacos</h2>
        <div className={styles.fieldGrid}>
          {[
            ['heroLabel', 'Hero label'],
            ['heroTitle', 'Hero titulo'],
            ['amenitiesSectionLabel', 'Label de amenidades'],
            ['amenitiesSectionTitle', 'Titulo de amenidades'],
            ['ctaTitle', 'Titulo do CTA'],
            ['ctaLabel', 'Botao do CTA'],
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
          ['heroSubtitle', 'Hero descricao'],
          ['ctaSubtitle', 'Descricao do CTA'],
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
          title="Espaco"
          items={settings.spacesContent.spaces}
          fields={[
            { key: 'tag', label: 'Tag' },
            { key: 'name', label: 'Nome' },
            { key: 'icon', label: 'Icone' },
            { key: 'capacity', label: 'Capacidade' },
            { key: 'area', label: 'Area' },
            { key: 'desc', label: 'Descricao', type: 'textarea', rows: 4 },
          ]}
          addLabel="Adicionar espaco"
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
            { key: 'icon', label: 'Icone' },
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
            ['heroLabel', 'Hero label'],
            ['heroTitle', 'Hero titulo'],
            ['emptyMessage', 'Mensagem vazia'],
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
          <label className="form-label">Hero descricao</label>
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
            { key: 'value', label: 'Valor' },
            { key: 'label', label: 'Rotulo' },
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
            { key: 'title', label: 'Titulo' },
            { key: 'category', label: 'Categoria' },
            { key: 'caption', label: 'Legenda' },
            { key: 'icon', label: 'Icone' },
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
