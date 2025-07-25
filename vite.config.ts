import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
    server: {
        port: 3000, // Cambia el puerto si el 5173 está ocupado
    },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
