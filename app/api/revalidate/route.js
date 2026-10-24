import { timingSafeEqual } from 'node:crypto';
import { revalidatePath, revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';
import { TAG_ALL } from '@/lib/api';

export const dynamic = 'force-dynamic';

function secretMatches(given) {
  const expected = process.env.REVALIDATE_SECRET;
  if (!expected || typeof given !== 'string') return false;
  const a = Buffer.from(given);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

/**
 * On-demand ISR, called by bdgy-api after publish / unpublish / edit / delete.
 * Body: { secret, slug }. Refreshes the home page, the archive, the case study page and the sitemap.
 */
export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 });
  }

  if (!secretMatches(body?.secret)) {
    return NextResponse.json({ ok: false, error: 'Invalid secret' }, { status: 401 });
  }

  const slug = typeof body.slug === 'string' && /^[a-z0-9-]{1,100}$/.test(body.slug) ? body.slug : null;

  // Data cache: every API fetch is tagged with TAG_ALL, so stats, lists, prev/next and the sitemap refresh too.
  revalidateTag(TAG_ALL);
  revalidatePath('/');
  revalidatePath('/case-studies');
  if (slug) revalidatePath(`/case-studies/${slug}`);
  revalidatePath('/sitemap.xml');

  return NextResponse.json({ ok: true, revalidated: ['/', '/case-studies', slug && `/case-studies/${slug}`].filter(Boolean), now: Date.now() });
}

export function GET() {
  return NextResponse.json({ ok: false, error: 'Use POST' }, { status: 405 });
}
