/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'gray-900': '#1a1a1a',
        'gray-800': '#2d2d2d',
        'blue-500': '#1e88e5',
        'blue-600': '#1565c0',
        'black': '#000000',
      },
      boxShadow: {
        neu: '10px 10px 20px #0a3d91, -10px -10px 20px #114db1',
      },
    },
  },
  plugins: [require("tailwind-scrollbar")],
};
