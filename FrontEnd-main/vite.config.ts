import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    cors: true,
    hmr: {
      overlay: false
    },
    proxy: {
      '/api/analisis': {
        target: 'http://localhost',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api\/analisis/, '/api/analisis')
      },
      '/api/concesionarios': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api\/concesionarios/, '/api/concesionarios')
      },
      '/api/v1': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api\/v1/, '/api/v1')
      },
      '/api/clientes': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api\/clientes/, '/api/clientes')
      },
      '/api/catalog': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api\/catalog/, '/api/catalog')
      },
      '/api/originacion': {
        target: 'http://localhost:81',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api\/originacion/, '/api/originacion')
      }
    }
  },
  preview: {
    host: '0.0.0.0',
    port: 4173,
    allowedHosts: ['ec2-18-116-67-249.us-east-2.compute.amazonaws.com'],
  }
})

