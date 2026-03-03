import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// Đổi 'my-react-app' thành tên GitHub repository của bạn
export default defineConfig({
  plugins: [react()],
  base: '/qldh/',
})
