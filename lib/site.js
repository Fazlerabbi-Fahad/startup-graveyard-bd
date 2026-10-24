// Working name. Change it here; everything (metadata, OG images, JSON-LD, footer) reads from this file.
export const SITE_NAME = 'Startup Graveyard';
export const SITE_TAGLINE = 'Learn from the Bangladeshi startups that didn’t make it.';
export const SITE_DESCRIPTION =
  'An archive of failed Bangladeshi startups, each written as a business case study: what they built, what went wrong, and what founders can learn.';

// Optional: an address for startup suggestions. Leave empty to point people to the correction forms instead.
export const CONTACT_EMAIL = '';

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/+$/, '');

export const absoluteUrl = (path = '/') => `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
