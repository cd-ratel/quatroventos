'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import {
  createDefaultSiteSettings,
  normalizeSiteSettings,
  type SiteSettings,
} from '@/lib/site-settings';

const SiteSettingsContext = createContext<SiteSettings>(createDefaultSiteSettings());

export function SiteSettingsProvider({
  children,
  initialSettings,
}: {
  children: ReactNode;
  initialSettings?: SiteSettings;
}) {
  const [settings, setSettings] = useState<SiteSettings>(() =>
    initialSettings ?? createDefaultSiteSettings()
  );

  useEffect(() => {
    let cancelled = false;

    fetch('/api/settings')
      .then((response) => response.json())
      .then((data) => {
        if (!cancelled) {
          setSettings(normalizeSiteSettings(data));
        }
      })
      .catch(() => {
        if (!cancelled && !initialSettings) {
          setSettings(createDefaultSiteSettings());
        }
      });

    return () => {
      cancelled = true;
    };
  }, [initialSettings]);

  return (
    <SiteSettingsContext.Provider value={settings}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  return useContext(SiteSettingsContext);
}
