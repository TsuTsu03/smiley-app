/** @type {import('tailwindcss').Config} */
const token = (v) => `rgb(var(${v}) / <alpha-value>)`;

module.exports = {
  darkMode: ['selector', '[data-theme="dark"]'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // ── Semantic tokens (theme-aware via CSS variables) ──
        bg:            token('--bg'),
        surface:       token('--surface'),
        raised:        token('--raised'),
        fg:            token('--fg'),
        muted:         token('--muted'),
        subtle:        token('--subtle'),
        line:          token('--line'),
        'line-strong': token('--line-strong'),
        primary: {
          DEFAULT: token('--primary'),
          hover:   token('--primary-hover'),
          fg:      token('--primary-fg'),
        },
        accent: {
          DEFAULT: token('--accent'),
          fg:      token('--accent-fg'),
        },
        success: token('--success'),
        warning: token('--warning'),
        danger:  token('--danger'),
        ring:    token('--ring'),

        // Sky — clean, clinical, professional (primary brand ramp)
        // Teal — dental freshness (accent)
        // Amber — warnings/alerts only
        teal: {
          50:  '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
      },
      fontFamily: {
        sans: ['var(--font-body)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'soft':  'var(--shadow-soft)',
        'card':  'var(--shadow-card)',
        'hover': 'var(--shadow-hover)',
        'ring':  '0 0 0 3px rgb(var(--ring) / 0.30)',
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.23, 1, 0.32, 1)',
        'in-out-strong': 'cubic-bezier(0.77, 0, 0.175, 1)',
        'drawer': 'cubic-bezier(0.32, 0.72, 0, 1)',
      },
      animation: {
        'fade-in':  'fadeIn 0.4s cubic-bezier(0.23,1,0.32,1) forwards',
        'slide-up': 'slideUp 0.32s cubic-bezier(0.32,0.72,0,1) forwards',
        'slide-in': 'slideIn 0.3s cubic-bezier(0.23,1,0.32,1) forwards',
        'scale-in': 'scaleIn 0.2s cubic-bezier(0.23,1,0.32,1) forwards',
      },
      keyframes: {
        fadeIn:  { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: 'translateY(16px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        slideIn: { from: { opacity: 0, transform: 'translateX(-16px)' }, to: { opacity: 1, transform: 'translateX(0)' } },
        scaleIn: { from: { opacity: 0, transform: 'scale(0.95)' }, to: { opacity: 1, transform: 'scale(1)' } },
      },
    },
  },
  plugins: [],
}
