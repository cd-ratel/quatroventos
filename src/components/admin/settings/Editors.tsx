'use client';

import type { ReactNode } from 'react';
import styles from '@/app/admin/configuracoes/config.module.css';
import type { SiteSettings } from '@/lib/site-settings';
import type { BusinessDay } from './types';

export type ObjectField<T> = {
  key: Extract<keyof T, string>;
  label: string;
  type?: 'text' | 'textarea' | 'number';
  placeholder?: string;
  rows?: number;
};

export const dayLabels: Record<BusinessDay, string> = {
  mon: 'Segunda',
  tue: 'Terça',
  wed: 'Quarta',
  thu: 'Quinta',
  fri: 'Sexta',
  sat: 'Sábado',
  sun: 'Domingo',
};

export function TextListEditor({
  title,
  items,
  addLabel,
  onChange,
  onAdd,
  onRemove,
}: {
  title: string;
  items: string[];
  addLabel: string;
  onChange: (index: number, value: string) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
}) {
  return (
    <div className={styles.itemList}>
      <h3 className={styles.subsectionTitle}>{title}</h3>
      {items.map((item, index) => (
        <div key={`${title}-${index}`} className={styles.itemCard}>
          <div className={styles.itemHeader}>
            <span className={styles.itemTitle}>
              {title} {index + 1}
            </span>
            <button
              type="button"
              className={styles.dangerButton}
              onClick={() => onRemove(index)}
            >
              Remover
            </button>
          </div>
          <textarea
            className="form-textarea"
            rows={3}
            value={item}
            onChange={(event) => onChange(index, event.target.value)}
          />
        </div>
      ))}
      <button type="button" className={styles.addButton} onClick={onAdd}>
        + {addLabel}
      </button>
    </div>
  );
}

export function ObjectListEditor<T extends Record<string, unknown>>({
  title,
  items,
  fields,
  addLabel,
  createEmpty,
  onChange,
  onAdd,
  onRemove,
  renderExtra,
}: {
  title: string;
  items: T[];
  fields: ObjectField<T>[];
  addLabel: string;
  createEmpty: () => T;
  onChange: <K extends Extract<keyof T, string>>(index: number, key: K, value: T[K]) => void;
  onAdd: (item: T) => void;
  onRemove: (index: number) => void;
  renderExtra?: (item: T, index: number) => ReactNode;
}) {
  return (
    <div className={styles.itemList}>
      <h3 className={styles.subsectionTitle}>{title}</h3>
      {items.map((item, index) => (
        <div key={`${title}-${index}`} className={styles.itemCard}>
          <div className={styles.itemHeader}>
            <span className={styles.itemTitle}>
              {title} {index + 1}
            </span>
            <button
              type="button"
              className={styles.dangerButton}
              onClick={() => onRemove(index)}
            >
              Remover
            </button>
          </div>
          <div className={styles.fieldGrid}>
            {fields.map((field) => {
              const inputValue = item[field.key];
              if (field.type === 'textarea') {
                return (
                  <div key={`${title}-${index}-${field.key}`} className="form-group">
                    <label className="form-label">{field.label}</label>
                    <textarea
                      className="form-textarea"
                      rows={field.rows || 3}
                      placeholder={field.placeholder}
                      value={String(inputValue ?? '')}
                      onChange={(event) =>
                        onChange(index, field.key, event.target.value as T[typeof field.key])
                      }
                    />
                  </div>
                );
              }

              return (
                <div key={`${title}-${index}-${field.key}`} className="form-group">
                  <label className="form-label">{field.label}</label>
                  <input
                    className="form-input"
                    type={field.type === 'number' ? 'number' : 'text'}
                    placeholder={field.placeholder}
                    value={String(inputValue ?? '')}
                    onChange={(event) =>
                      onChange(
                        index,
                        field.key,
                        (field.type === 'number'
                          ? Number(event.target.value || 0)
                          : event.target.value) as T[typeof field.key]
                      )
                    }
                  />
                </div>
              );
            })}
          </div>
          {renderExtra ? renderExtra(item, index) : null}
        </div>
      ))}
      <button type="button" className={styles.addButton} onClick={() => onAdd(createEmpty())}>
        + {addLabel}
      </button>
    </div>
  );
}

export function BusinessHoursEditor({
  businessHours,
  toggleBusinessDay,
  updateBusinessHour,
}: {
  businessHours: SiteSettings['businessHours'];
  toggleBusinessDay: (day: BusinessDay, isOpen: boolean) => void;
  updateBusinessHour: (day: BusinessDay, key: 'open' | 'close', value: string) => void;
}) {
  return (
    <div className={styles.dayHoursGrid}>
      {(Object.keys(businessHours) as BusinessDay[]).map((day) => {
        const value = businessHours[day];
        return (
          <div key={day} className={styles.dayCard}>
            <div className={styles.itemHeader}>
              <span className={styles.itemTitle}>{dayLabels[day]}</span>
              <label className={styles.dayToggle}>
                <input
                  type="checkbox"
                  checked={Boolean(value)}
                  onChange={(event) => toggleBusinessDay(day, event.target.checked)}
                />
                <span>{value ? 'Aberto' : 'Fechado'}</span>
              </label>
            </div>
            {value ? (
              <div className={styles.fieldGrid}>
                <div className="form-group">
                  <label className="form-label">Abre</label>
                  <input
                    type="time"
                    className="form-input"
                    value={value.open}
                    onChange={(event) =>
                      updateBusinessHour(day, 'open', event.target.value)
                    }
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Fecha</label>
                  <input
                    type="time"
                    className="form-input"
                    value={value.close}
                    onChange={(event) =>
                      updateBusinessHour(day, 'close', event.target.value)
                    }
                  />
                </div>
              </div>
            ) : (
              <p className={styles.helperText}>Sem atendimento neste dia.</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
