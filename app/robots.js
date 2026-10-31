import { absoluteUrl } from '@/lib/site';

// AI answer engines and search crawlers are allowed on purpose, so the archive can be cited in their answers.
// Blocking any of these removes the site from that product's answers.
const AI_CRAWLERS = ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-User', 'PerplexityBot', 'Perplexity-User', 'Google-Extended', 'Applebot-Extended'];

export default function robots() {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/api/'] },
      { userAgent: AI_CRAWLERS, allow: '/', disallow: ['/api/'] },
    ],
    sitemap: absoluteUrl('/sitemap.xml'),
  };
}
