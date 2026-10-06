import "server-only";

import { cache } from "react";
import { getSetting, getSettingOrNull } from "@/lib/settings";
import {
  CONTENT_KEYS,
  defaultHome,
  defaultIdentity,
  defaultLabs,
  defaultLeadership,
  defaultPageBanners,
  type HomeContent,
  type Identity,
  type LabsContent,
  type Leadership,
  type PageBanners,
  defaultNavigation,
  leadersFromLegacy,
  type Leaders,
  type Navigation,
} from "@/lib/page-content-types";

/** Server-side readers for the editable website wording. */

export const getIdentity = cache(() => getSetting<Identity>(CONTENT_KEYS.identity, defaultIdentity));
export const getHomeContent = cache(() => getSetting<HomeContent>(CONTENT_KEYS.home, defaultHome));
export const getLeadership = cache(() => getSetting<Leadership>(CONTENT_KEYS.leadership, defaultLeadership));

/**
 * The people shown on the leadership pages.
 *
 * Before this list existed the site held exactly a chairman and a principal
 * under another key. That row is still there and is read once, to carry its
 * wording across, until the school saves the list for the first time.
 */
export const getLeaders = cache(async (): Promise<Leaders> => {
  const saved = await getSettingOrNull<Leaders>(CONTENT_KEYS.leaders);
  if (saved?.people?.length) return saved;
  const legacy = await getSettingOrNull<Leadership>(CONTENT_KEYS.leadership);
  return leadersFromLegacy(legacy ?? undefined);
});
export const getPageBanners = cache(() => getSetting<PageBanners>(CONTENT_KEYS.pageBanners, defaultPageBanners));
export const getNavigation = cache(() => getSetting<Navigation>(CONTENT_KEYS.navigation, defaultNavigation));
export const getLabsContent = cache(() => getSetting<LabsContent>(CONTENT_KEYS.labs, defaultLabs));
