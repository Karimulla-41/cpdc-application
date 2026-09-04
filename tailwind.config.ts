import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Institutional Academic Palette
        navy: {
          DEFAULT: '#163A5F', // Academic Navy - Primary
          50: '#f2f6fa',
          100: '#e1ebd4',
          700: '#1c4977',
          800: '#163A5F',
          900: '#102a46',
          950: '#0b1c30',
        },
        teal: {
          DEFAULT: '#2F6F7E', // Teal Blue - Secondary
          50: '#f2f8f9',
          100: '#e1f0f3',
          600: '#2F6F7E',
          700: '#265965',
        },
        gold: {
          DEFAULT: '#D4A72C', // Academic Gold - Accent (Used sparingly)
          100: '#fbf4e2',
          400: '#e3b843',
          500: '#D4A72C',
          600: '#b88d1d',
        },
        warmbg: '#F7F8F5',   // Warm Off-White Primary Background
        charcoal: '#1F2933', // Primary Text
        stategray: '#667085',// Secondary Text
        softgray: '#D9DEE3', // Soft Borders
        forest: '#3F7D58',   // Success Green
        amberwarn: '#C58A1A',// Warning Amber
        brickred: '#B54747', // Error Red
        cpdc: {
          50: '#f2f6fa',
          100: '#e1ebd4',
          500: '#2F6F7E',
          700: '#1c4977',
          800: '#163A5F',
          900: '#102a46',
          950: '#0b1c30',
        }
      },
      fontFamily: {
        sans: ['var(--font-source-sans)', 'Source Sans 3', 'sans-serif'],
        serif: ['var(--font-merriweather)', 'Merriweather', 'serif'],
      },
      borderRadius: {
        'academic': '10px',
      }
    },
  },
  plugins: [],
};

export default config;
