import { ImageResponse } from 'next/og';
import { SITE_NAME, SITE_TAGLINE } from '@/lib/seo';

// Social share / link-preview image (og:image + twitter:image), auto-detected
// by Next at /opengraph-image. Generated at build time — no static asset needed.
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = `${SITE_NAME} — ${SITE_TAGLINE}`;

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: '80px',
          background: 'linear-gradient(135deg, #0284C7 0%, #14B8A6 100%)',
          color: 'white',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            fontSize: 64,
            fontWeight: 800,
            letterSpacing: '-0.03em',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 88,
              height: 88,
              borderRadius: 24,
              background: 'rgba(255,255,255,0.2)',
              fontSize: 56,
              fontWeight: 800,
            }}
          >
            S
          </div>
          {SITE_NAME}
        </div>
        <div style={{ marginTop: 28, fontSize: 52, fontWeight: 700, lineHeight: 1.1, maxWidth: 900 }}>
          {SITE_TAGLINE}
        </div>
        <div style={{ marginTop: 24, fontSize: 30, opacity: 0.92, maxWidth: 940 }}>
          Online booking, patient records, billing, and an AI assistant — for dental clinics.
        </div>
      </div>
    ),
    { ...size }
  );
}
