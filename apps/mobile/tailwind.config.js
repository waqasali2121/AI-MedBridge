/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: '#001428',
        'primary-container': '#0F2942',
        secondary: '#006A61',
        'secondary-container': '#86F2E4',
        surface: '#F8F9FF',
        'surface-container': '#E5EEFF',
        'surface-container-low': '#EFF4FF',
        'surface-container-lowest': '#FFFFFF',
        'surface-container-high': '#DCE9FF',
        'on-surface': '#0B1C30',
        'on-surface-variant': '#43474D',
        'on-primary': '#FFFFFF',
        'on-secondary': '#FFFFFF',
        error: '#BA1A1A',
        'error-container': '#FFDAD6',
        outline: '#74777E',
        'outline-variant': '#C3C6CE',
        teal: '#0D9488',
        'teal-light': '#14B8A6',
      },
      fontFamily: {
        heading: ['PlusJakartaSans-Bold'],
        'heading-semibold': ['PlusJakartaSans-SemiBold'],
        body: ['Inter-Regular'],
        'body-medium': ['Inter-Medium'],
        'body-semibold': ['Inter-SemiBold'],
      },
    },
  },
  plugins: [],
};
