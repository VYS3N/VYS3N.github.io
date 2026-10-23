import { site } from './data';

export const giscusConfig = site.giscus;
export const commentsReady = Boolean(
  giscusConfig.enabled &&
  /^[a-z\d](?:[a-z\d-]{0,37}[a-z\d])?\/[a-z\d_.-]+$/i.test(giscusConfig.repo) &&
  /^[A-Za-z0-9_=-]{4,}$/.test(giscusConfig.repoId) &&
  giscusConfig.category.trim() &&
  /^[A-Za-z0-9_=-]{4,}$/.test(giscusConfig.categoryId)
);
