/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: { 100: '#C8E6C9', 400: '#4CAF50', 500: '#2E7D32', 600: '#1B5E20' },
        c1: '#2563EB',
        c2: '#16A34A',
        c3: '#F59E0B',
        c4: '#DC2626',
        neutral: { 100: '#F3F4F6', 200: '#E5E7EB', 400: '#9CA3AF', 700: '#374151', 900: '#111827' },
        risk: { low: '#16A34A', medium: '#F59E0B', high: '#EA580C', critical: '#DC2626' },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '16px',
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.08)',
      },
    },
  },
  plugins: [],
};
