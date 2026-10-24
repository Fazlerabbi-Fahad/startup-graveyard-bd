import { ImageResponse } from 'next/og';
import { OG_COLORS as C, OG_SIZE, markDataUri, ogFonts } from '@/lib/og';
import { SITE_NAME, SITE_TAGLINE } from '@/lib/site';

export const runtime = 'nodejs';
export const size = OG_SIZE;
export const contentType = 'image/png';
export const alt = `${SITE_NAME}: ${SITE_TAGLINE}`;

export default async function Image() {
  const fonts = await ogFonts();
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: C.paper, padding: '72px', fontFamily: 'Bricolage' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={markDataUri} width={72} height={72} alt="" />
        <div style={{ marginTop: 'auto', fontFamily: 'JetBrains Mono', fontSize: 24, letterSpacing: '0.12em', color: C.muted }}>
          AN ARCHIVE OF FAILED BANGLADESHI STARTUPS
        </div>
        <div style={{ marginTop: 18, fontSize: 112, fontWeight: 800, color: C.ink, lineHeight: 0.95, letterSpacing: '-0.04em' }}>{SITE_NAME}</div>
        <div style={{ marginTop: 22, fontSize: 46, fontWeight: 200, color: C.ink, lineHeight: 1.1 }}>{SITE_TAGLINE}</div>
      </div>
    ),
    { ...OG_SIZE, fonts },
  );
}
