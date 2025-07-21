/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./templates/**/*.html",
    "./**/*.py",
    "./static/scripts/**/*.js"
  ],
  theme: {
    extend: {},
  },
  plugins: [
    function ({ addBase }) {
      addBase({
        'body': {
          '@apply p-2 bg-gray-900 text-gray-100': {},
        },
        'h2': {
          '@apply text-3xl font-bold text-center text-cyan-400 m-3': {},
        },
        'h4': {
          '@apply text-2xl font-bold text-center text-cyan-400 m-2': {},
        },
        'a': {
          '@apply text-cyan-500 hover:text-cyan-400 underline transition-colors duration-200': {},
          'cursor': 'pointer',
        },
        'fieldset': {
          '@apply border border-gray-700 bg-gray-800 rounded-md p-2 mb-3': {},
        },
        'legend': {
          '@apply text-lg font-semibold bg-gray-800 text-cyan-500 rounded-md px-2': {},
        },
        'button[type="button"], button[type="submit"]': {
          '@apply py-1 px-2 rounded shadow-md my-1': {},
          '@apply bg-cyan-700 hover:bg-cyan-600 active:bg-cyan-800': {},
          '@apply focus:outline-none focus:ring-2 focus:ring-cyan-400': {},
          '@apply focus:ring-offset-2 focus:ring-offset-gray-900': {},
          '@apply transition-colors duration-200': {},
        },
        'input, select, textarea': {
          '@apply w-full bg-gray-600 text-white placeholder-gray-400': {},
          '@apply rounded-md px-2 py-1': {},
          '@apply focus:outline-none focus:ring-2 focus:ring-cyan-400': {},
          '@apply focus:ring-offset-2 focus:ring-offset-gray-900': {},
          '@apply transition duration-200': {},
        },
        'input[type="color"]': {
          '@apply w-[5em] h-[2rem] mt-2 mb-1 mx-2': {},
        },
        'textarea': {
          '@apply resize-none min-h-[2rem]': {},
        },
        '.spoiler': {
          '@apply bg-gray-700 text-gray-300': {},
        },
        '.grid-content-2': {
          '@apply grid gap-2 text-right items-baseline grid-cols-[auto_1fr]': {},
        },
        '.grid-content-4': {
          '@apply grid gap-2 text-right items-baseline grid-cols-[auto_1fr_auto_1fr]': {},
        },
        '.grid-content-4-reverse': {
          '@apply grid gap-2 text-right items-baseline grid-cols-[1fr_auto_1fr_auto]': {},
        },
        '.grid-content-6': {
          '@apply grid gap-2 text-right items-baseline grid-cols-[auto_1fr_auto_1fr_auto_1fr]': {},
        },
        '.grid-content-textarea': {
          '@apply grid gap-2 text-left items-baseline grid-cols-[1fr_1fr]': {},
        },
        '.cell': {
          '@apply flex flex-col': {},
        },
        '.colors': {
          '@apply flex content-center items-center': {},
        },
        '.colors > *:nth-child(even)': {
          '@apply mr-2': {},
        },
        '.colors > *:last-child': {
          '@apply mr-0': {},
        }
      })
    }
  ],
}
