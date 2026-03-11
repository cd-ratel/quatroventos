import type { SiteSettings } from '@/lib/site-settings';

export type BusinessDay = keyof SiteSettings['businessHours'];

export type SettingsFormHelpers = {
  updateField: <K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) => void;
  updateSectionField: <
    S extends keyof SiteSettings,
    K extends keyof SiteSettings[S] & string
  >(
    section: S,
    key: K,
    value: SiteSettings[S][K]
  ) => void;
  updateArrayItem: (
    section: keyof SiteSettings,
    arrayKey: string,
    index: number,
    key: string,
    value: unknown
  ) => void;
  addArrayItem: (section: keyof SiteSettings, arrayKey: string, value: unknown) => void;
  removeArrayItem: (section: keyof SiteSettings, arrayKey: string, index: number) => void;
  updateStringArrayItem: (
    section: keyof SiteSettings,
    arrayKey: string,
    index: number,
    value: string
  ) => void;
  addStringArrayItem: (
    section: keyof SiteSettings,
    arrayKey: string,
    value?: string
  ) => void;
  removeStringArrayItem: (
    section: keyof SiteSettings,
    arrayKey: string,
    index: number
  ) => void;
  updateCardLine: (index: number, lineIndex: number, value: string) => void;
  addCardLine: (index: number) => void;
  removeCardLine: (index: number, lineIndex: number) => void;
  toggleBusinessDay: (day: BusinessDay, isOpen: boolean) => void;
  updateBusinessHour: (day: BusinessDay, key: 'open' | 'close', value: string) => void;
};
