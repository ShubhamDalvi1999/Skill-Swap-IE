/** @type {import('tailwindcss').Config} */

function addVariablesForColors({ addBase, theme }) {
  const allColors = flattenColorPalette(theme("colors"));
  const newVars = Object.fromEntries(Object.entries(allColors).map(([k, v]) => [`--${k}`, v]));

  addBase({ ":root": newVars });
}

const flattenColorPalette = (colors) => {
  const flatColors = {};
  
  Object.entries(colors).forEach(([key, value]) => {
    if (typeof value === 'object') {
      Object.entries(value).forEach(([subKey, subValue]) => {
        flatColors[`${key}-${subKey}`] = subValue;
      });
    } else {
      flatColors[key] = value;
    }
  });
  
  return flatColors;
};

module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Main brand colors
        primary: {
          50: '#FFF9DB',
          100: '#FFF3B0',
          200: '#FFEC85',
          300: '#FFE45A',
          400: '#FFDD30',
          500: '#FFD700', // Original primary color
          600: '#E6C200',
          700: '#BFA000',
          800: '#997F00',
          900: '#735E00',
          950: '#4D3F00',
        },
        // UI background colors
        secondary: {
          50: '#EAEAEC',
          100: '#D5D6D9',
          200: '#ABACB3',
          300: '#81838D',
          400: '#575966',
          500: '#2D2F40',
          600: '#1E2028', // Original secondary color
          700: '#191B22',
          800: '#14151B',
          900: '#0F1014',
          950: '#0A0B0F', // Original background color
        },
        // Accent colors
        accent: {
          50: '#E3FFED',
          100: '#C7FFDB',
          200: '#8AFFB7',
          300: '#4DFF93',
          400: '#10FF6F',
          500: '#00FF5A',
          600: '#00E651',
          700: '#00BF44',
          800: '#009937',
          900: '#00732A',
        },
        // Success, error, warning colors
        success: {
          500: '#10B981',
          600: '#059669',
        },
        error: {
          500: '#EF4444',
          600: '#DC2626',
        },
        warning: {
          500: '#F59E0B',
          600: '#D97706',
        },
        info: {
          500: '#3B82F6',
          600: '#2563EB',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
        heading: ['var(--font-poppins)', 'Poppins', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'JetBrains Mono', 'monospace'],
        vt323: ['var(--font-vt323)', 'VT323', 'monospace'],
        roboto: ['var(--font-roboto)', 'Roboto', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        '2xs': '0.625rem', // 10px
        xs: '0.75rem',     // 12px
        sm: '0.875rem',    // 14px
        base: '1rem',      // 16px
        lg: '1.125rem',    // 18px
        xl: '1.25rem',     // 20px
        '2xl': '1.5rem',   // 24px
        '3xl': '1.875rem', // 30px
        '4xl': '2.25rem',  // 36px
        '5xl': '3rem',     // 48px
        '6xl': '3.75rem',  // 60px
        '7xl': '4.5rem',   // 72px
      },
      spacing: {
        '4.5': '1.125rem', // 18px
        '13': '3.25rem',   // 52px
        '15': '3.75rem',   // 60px
        '128': '32rem',    // 512px
        '144': '36rem',    // 576px
      },
      borderRadius: {
        '4xl': '2rem',     // 32px
        '5xl': '2.5rem',   // 40px
      },
      boxShadow: {
        'soft': '0 2px 15px 0 rgba(0, 0, 0, 0.05)',
        'card': '0 4px 20px 0 rgba(0, 0, 0, 0.08)',
        'dropdown': '0 10px 25px 0 rgba(0, 0, 0, 0.1)',
        'glow': '0 0 15px 0 rgba(255, 215, 0, 0.3)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-in-out',
        'slide-down': 'slideDown 0.5s ease-in-out',
        'slide-in-right': 'slideInRight 0.5s ease-in-out',
        'bounce-subtle': 'bounceSubtle 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('tailwindcss-animate'),
    addVariablesForColors,
  ],
} 