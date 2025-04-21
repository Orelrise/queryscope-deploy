/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#8C52FF',
        secondary: '#5CE1E6',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            // Add any base prose customizations here if needed later
          },
        },
        lg: {
          css: {
            h2: {
              fontSize: theme('fontSize.3xl'),
              fontWeight: theme('fontWeight.bold'),
              marginTop: theme('spacing.10'), 
              marginBottom: theme('spacing.4'),
            },
            h3: {
              fontSize: theme('fontSize.2xl'),
              fontWeight: theme('fontWeight.semibold'),
              marginTop: theme('spacing.8'), 
              marginBottom: theme('spacing.3'),
            },
            h4: {
              fontSize: theme('fontSize.xl'),
              fontWeight: theme('fontWeight.semibold'),
              marginTop: theme('spacing.6'), 
              marginBottom: theme('spacing.2'),
            },
            // Adjust link colors within prose if needed (can remove if satisfied with current)
            // a: {
            //   color: theme('colors.purple.600'),
            //   '&:hover': {
            //     color: theme('colors.purple.800'),
            //   },
            // },
          },
        },
        // Add customizations for dark mode prose if needed
        // invert: {
        //   css: {
        //     h2: { ... },
        //     h3: { ... },
        //     h4: { ... },
        //   }
        // }
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
} 