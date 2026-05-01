import { landingTranslations } from './landing';
import { layoutTranslations } from './layout';
import { authTranslations } from './auth';
import { dashboardTranslations } from './dashboard';
import { guideTranslations } from './guide';

export const translations = {
  landing: landingTranslations,
  layout: layoutTranslations,
  auth: authTranslations,
  dashboard: dashboardTranslations,
  guide: guideTranslations,
};

export type TranslationType = typeof translations;
