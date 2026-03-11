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
}: {
  children: ReactNode;
}) {
  const [settings, setSettings] = useState<SiteSettings>(() =>
    createDefaultSiteSettings()
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
        if (!cancelled) {
          setSettings(createDefaultSiteSettings());
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <SiteSettingsContext.Provider value={settings}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  return useContext(SiteSettingsContext);
}
