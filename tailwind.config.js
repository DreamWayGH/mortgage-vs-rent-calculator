/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  // 與 MUI 並用：關掉 Tailwind 的 preflight 以免覆蓋 MUI 樣式
  corePlugins: { preflight: false },
  theme: {
    extend: {},
  },
  plugins: [],
}

