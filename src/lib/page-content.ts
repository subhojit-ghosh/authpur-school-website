import "server-only";

import { cache } from "react";
import { getSetting } from "@/lib/settings";
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
} from "@/lib/page-content-types";

/** Server-side readers for the editable website wording. */

export const getIdentity = cache(() => getSetting<Identity>(CONTENT_KEYS.identity, defaultIdentity));
export const getHomeContent = cache(() => getSetting<HomeContent>(CONTENT_KEYS.home, defaultHome));
export const getLeadership = cache(() => getSetting<Leadership>(CONTENT_KEYS.leadership, defaultLeadership));
export const getPageBanners = cache(() => getSetting<PageBanners>(CONTENT_KEYS.pageBanners, defaultPageBanners));
export const getLabsContent = cache(() => getSetting<LabsContent>(CONTENT_KEYS.labs, defaultLabs));
