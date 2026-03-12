import 'server-only';

import { unstable_noStore as noStore } from 'next/cache';
import { prisma } from '@/lib/prisma';
import {
  createDefaultSiteSettings,
  normalizeSiteSettings,
  type SiteSettings,
} from '@/lib/site-settings';

export async function getServerSiteSettings(): Promise<SiteSettings> {
  noStore();

  try {
    const existingSettings = await prisma.settings.findUnique({
      where: { id: 'main' },
    });

    if (existingSettings) {
      return normalizeSiteSettings(existingSettings as unknown as Record<string, unknown>);
    }

    const defaults = createDefaultSiteSettings();

    try {
      await prisma.settings.create({
        data: {
          id: 'main',
          ...defaults,
        },
      });
    } catch {
      const concurrentSettings = await prisma.settings.findUnique({
        where: { id: 'main' },
      });

      if (concurrentSettings) {
        return normalizeSiteSettings(concurrentSettings as unknown as Record<string, unknown>);
      }
    }

    return defaults;
  } catch (error) {
    console.error(
      'Server site settings fallback:',
      error instanceof Error ? error.message : 'unknown'
    );
    return createDefaultSiteSettings();
  }
}
