/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        rose: {
          50: '#FDF2F4',
          100: '#FCE7EB',
          200: '#F8D0DC',
          300: '#F2A9C1',
          400: '#EA81A5',
          500: '#D96C91', // Primary brand color
          600: '#C24B73',
          700: '#A4355B',
          800: '#872E4D',
          900: '#712A43',
        },
        lavender: {
          50: '#F6F4FD',
          100: '#ECE8FA',
          200: '#DDD5F6',
          300: '#C8BBF0',
          400: '#B8A7E8', // Secondary brand color
          500: '#9E88DE',
          600: '#866CD1',
          700: '#7054BD',
          800: '#5C44A0',
          900: '#4D3A82',
        },
        plum: {
          50: '#F7F6F8',
          100: '#EFECEF',
          200: '#D9D3DA',
          300: '#BAAFBD',
          400: '#948398',
          500: '#736177',
          600: '#5C4C60',
          700: '#4B3D4F',
          800: '#3D3041',
          900: '#302536', // Primary text
          950: '#1F1723',
        },
        peach: {
          50: '#FEF8F5',
          100: '#FDF1EB',
          200: '#F8DCCF', // Accent color
          300: '#F3C4B0',
          400: '#ECA48A',
          500: '#E28263',
          600: '#CB6644',
          700: '#AB4F33',
        },
        sage: {
          50: '#F4F7F5',
          100: '#EAF2EC',
          200: '#D3E3D7',
          300: '#B2CEBA',
          400: '#87B093',
          500: '#5B8266', // Success color
          600: '#466850',
          700: '#385340',
        },
        amber: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706', // Warning color
          700: '#B45309',
        },
        canvas: '#FFF9F7', // Warm off-white background
        surface: '#FFFFFF',
      },
      fontFamily: {
        sans: ['Inter', 'Hind Siliguri', 'system-ui', '-apple-system', 'sans-serif'],
        bengali: ['Hind Siliguri', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(48, 37, 54, 0.06), 0 2px 6px -1px rgba(48, 37, 54, 0.04)',
        'soft-lg': '0 12px 32px -4px rgba(48, 37, 54, 0.08), 0 4px 12px -2px rgba(48, 37, 54, 0.04)',
        'inner-soft': 'inset 0 2px 4px 0 rgba(48, 37, 54, 0.04)',
      },
      borderRadius: {
        '3xl': '1.5rem',
        '4xl': '2rem',
      }
    },
  },
  plugins: [],
}
