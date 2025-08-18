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
      '/api/concesionarios': {
        target: 'http://banquito-alb-1166574131.us-east-2.elb.amazonaws.com',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api\/concesionarios/, '/api/concesionarios')
      },
      '/api/v1': {
        target: 'http://banquito-alb-1166574131.us-east-2.elb.amazonaws.com',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api\/v1/, '/api/v1')
      },
      '/api/clientes': {
        target: 'http://banquito-alb-1166574131.us-east-2.elb.amazonaws.com',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api\/clientes/, '/api/clientes')
      },
      '/api/catalog': {
        target: 'http://banquito-alb-1166574131.us-east-2.elb.amazonaws.com',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api\/catalog/, '/api/catalog')
      },
      '/api/originacion': {
        target: 'http://banquito-alb-1166574131.us-east-2.elb.amazonaws.com',
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

