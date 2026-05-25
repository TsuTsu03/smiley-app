/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Dental psychology: trust (blue-teal), cleanliness (white), calm (soft mint), health (warm teal)
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
        mint: {
          50:  '#f2fbf9',
          100: '#d3f4ee',
          200: '#a7e9dd',
          300: '#6dd6c5',
          400: '#3cbcac',
          500: '#23a091',
          600: '#1a8276',
          700: '#186860',
          800: '#185350',
          900: '#184643',
        },
        navy: {
          50:  '#f0f4ff',
          100: '#dde6ff',
          200: '#c2d0ff',
          300: '#9cb0ff',
          400: '#7488fc',
          500: '#5464f8',
          600: '#3d44ed',
          700: '#3235d2',
          800: '#2b2daa',
          900: '#1e2060',
          950: '#0f1035',
        },
        cream: '#fdfcf8',
        'warm-white': '#f8f9fa',
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
        'soft': '0 2px 20px rgba(14, 148, 136, 0.08)',
        'card': '0 4px 32px rgba(14, 148, 136, 0.10)',
        'hover': '0 8px 40px rgba(14, 148, 136, 0.18)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease forwards',
        'slide-up': 'slideUp 0.4s ease forwards',
        'slide-in': 'slideIn 0.3s ease forwards',
      },
      keyframes: {
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: 'translateY(16px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        slideIn: { from: { opacity: 0, transform: 'translateX(-16px)' }, to: { opacity: 1, transform: 'translateX(0)' } },
      },
    },
  },
  plugins: [],
}
