/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: {
          bg: '#F5F2FD',
          pure: '#FFFFFF',
          muted: '#F8F6FE',
          card: '#FFFFFF',
        },
        ink: {
          dark: '#121214',
          navy: '#0F172A',
          body: '#334155',
          muted: '#64748B',
          light: '#94A3B8',
        },
        aesthetic: {
          pink: '#FFA8D5',
          'pink-hover': '#FF94CC',
          'pink-soft': '#FDF2F8',
          lilac: '#E9D5FF',
          'lilac-soft': '#F5EEFD',
          lime: '#D4F851',
          'lime-hover': '#C5F82A',
          'lime-soft': '#F7FEE7',
          black: '#121214',
          emerald: '#10B981',
          'emerald-soft': '#ECFDF5',
          amber: '#F59E0B',
          'amber-soft': '#FFFBEB',
          indigo: '#6366F1',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        '2.5xl': '1.25rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        'aesthetic': '0 20px 40px -15px rgba(120, 80, 200, 0.08)',
        'aesthetic-hover': '0 25px 50px -12px rgba(120, 80, 200, 0.16)',
        'card-lift': '0 20px 50px -10px rgba(15, 23, 42, 0.1)',
        'lime-glow': '0 0 25px -5px rgba(212, 248, 81, 0.5)',
        'pink-glow': '0 0 25px -5px rgba(255, 168, 213, 0.5)',
      }
    },
  },
  plugins: [],
}
