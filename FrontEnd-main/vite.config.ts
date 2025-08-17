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
        target: 'http://banquito-alb-1166574131.us-east-2.elb.amazonaws.com',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api\/analisis/, '/api/analisis')
      },
      '/api/vehiculos': {
        target: 'http://banquito-alb-1166574131.us-east-2.elb.amazonaws.com',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api\/vehiculos/, '/api/vehiculos')
      },
      // Comentado temporalmente para evitar conflictos
      // '/api/concesionarios': {
      //   target: 'http://banquito-alb-1166574131.us-east-2.elb.amazonaws.com',
      //   changeOrigin: true,
      //   secure: false,
      //   rewrite: (path) => path.replace(/^\/api\/concesionarios/, '/api/vehiculos')
      // },
      '/api/v1': {
        target: 'http://banquito-alb-1166574131.us-east-2.elb.amazonaws.com',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api\/v1/, '/api/vehiculos')
      },
      '/api/clientes': {
        target: 'http://localhost:83',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api\/clientes/, '/api/clientes')
      },
      '/api/catalog': {
        target: 'http://localhost:82',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api\/catalog/, '/api/catalogo')
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

