/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'light-background': '#fdf6e3',
        'light-surface': '#eee8d5',
        'light-border': '#d3cbb7',
        'light-text-primary': '#657b83',
        'light-text-secondary': '#839496',
        'light-primary': '#268bd2',
        'light-primary-hover': '1a6397',

        // Dark Theme Colors
        'dark-background': '#111827',
        'dark-surface': '#1f2937',
        'dark-border': '#374151',
        'dark-text-primary': '#ffffff',
        'dark-text-secondary': '#d1d5db',
        'dark-primary': '#6366f1',
        'dark-primary-hover': '#4f46e5',
      },
    },
  },
  plugins: [],
};
