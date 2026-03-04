export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#1E40AF', light: '#3B82F6', dark: '#1e3a8a' },
        risk: {
          low: '#10B981',
          moderate: '#F59E0B',
          high: '#EF4444',
          critical: '#FF1744',
        },
        card: '#0a1628',
        card2: '#0f1f3d',
        dark: '#050d1a',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'spin-slow': 'spin-slow 4s linear infinite',
        'pulse-ring': 'pulse-ring 2s infinite',
        'shimmer': 'shimmer 2s infinite',
      },
      backgroundImage: {
        'grid-pattern': `linear-gradient(rgba(30, 64, 175, 0.05) 1px, transparent 1px),
          linear-gradient(90deg, rgba(30, 64, 175, 0.05) 1px, transparent 1px)`,
      },
    },
  },
  plugins: [],
}
