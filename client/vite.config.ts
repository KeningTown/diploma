import { defineConfig, UserConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import basicSsl from '@vitejs/plugin-basic-ssl'
import checker from 'vite-plugin-checker'
import path from 'path'

const USE_SSL = false

const plugins: UserConfig['plugins'] = [react(), checker({ typescript: true })]

if (USE_SSL) {
  plugins.push(basicSsl())
}

export default defineConfig({
  plugins,
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3000/',
        changeOrigin: true,
        secure: false
      },
      '/files': {
        target: 'http://127.0.0.1:3000/',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
