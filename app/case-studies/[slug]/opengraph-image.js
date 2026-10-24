import { ImageResponse } from 'next/og';
import { getCaseStudy } from '@/lib/api';
import { OG_COLORS as C, OG_SIZE, markDataUri, ogFonts } from '@/lib/og';
import { SITE_NAME } from '@/lib/site';

export const runtime = 'nodejs';
export const revalidate = 3600;
export const size = OG_SIZE;
export const contentType = 'image/png';
export const alt = 'Case study summary card';

export default async function Image({ params }) {
  const { slug } = await params;
  const [cs, fonts] = await Promise.all([getCaseStudy(slug), ogFonts()]);
  const g = cs?.atAGlance ?? {};
  const years = g.foundedYear && g.shutDownYear ? `${g.foundedYear}–${g.shutDownYear}` : g.foundedYear ? `Founded ${g.foundedYear}` : null;
  const meta = [years, g.lifespanYears != null ? `${g.lifespanYears} ${g.lifespanYears === 1 ? 'year' : 'years'}` : null, g.sector].filter(Boolean);
  const name = cs?.name ?? SITE_NAME;
  const nameSize = name.length > 26 ? 80 : name.length > 14 ? 96 : 124;

  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: C.paper, padding: '64px 72px', fontFamily: 'Bricolage' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={markDataUri} width={44} height={44} alt="" />
          <span style={{ fontSize: 30, fontWeight: 800, color: C.ink, letterSpacing: '-0.02em' }}>{SITE_NAME}</span>
          <span style={{ marginLeft: 'auto', fontFamily: 'JetBrains Mono', fontSize: 20, letterSpacing: '0.12em', color: C.muted }}>CASE STUDY</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', marginTop: 'auto' }}>
          <div style={{ fontSize: nameSize, fontWeight: 800, color: C.ink, lineHeight: 0.95, letterSpacing: '-0.04em' }}>{name}</div>
          {cs?.tagline && (
            <div style={{ marginTop: 22, fontSize: 38, fontWeight: 200, color: C.ink, lineHeight: 1.15, maxWidth: 1000 }}>
              {cs.tagline.length > 110 ? `${cs.tagline.slice(0, 107)}…` : cs.tagline}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginTop: 44, fontFamily: 'JetBrains Mono', fontSize: 24, letterSpacing: '0.1em' }}>
          {g.outcome && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 12, background: C.accent, color: C.paper, padding: '10px 20px', borderRadius: 999 }}>
              {g.outcome.toUpperCase()}
            </span>
          )}
          {meta.length > 0 && <span style={{ color: C.muted }}>{meta.join(' · ').toUpperCase()}</span>}
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts },
  );
}
