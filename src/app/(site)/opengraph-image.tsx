import { ImageResponse } from 'next/og';

export const alt = 'Ostato';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// სოციალური ქსელების გაზიარების სურათი (ბმულის ბარათი). ქართული შრიფტი next/og-ის ჩაშენებულ შრიფტში არ არის
// (საჭიროებდა ფაილის ჩამოტვირთვას), ამიტომ სურათზე მხოლოდ ლათინური ბრენდია — ქართული ტექსტი ბარათის სათაურ/აღწერაშია (metadata).
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #2563EB 0%, #1E3A8A 100%)',
          color: 'white',
        }}
      >
        <div
          style={{
            width: 132,
            height: 132,
            borderRadius: 34,
            background: 'rgba(255,255,255,0.16)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg width="76" height="76" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
          </svg>
        </div>
        <div style={{ marginTop: 40, fontSize: 132, fontWeight: 800, letterSpacing: -3 }}>Ostato</div>
        <div style={{ marginTop: 8, fontSize: 40, opacity: 0.85 }}>ostato.app</div>
      </div>
    ),
    size,
  );
}
