import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['react', 'react-dom', 'leaflet']
  },
  server: {
    host: '0.0.0.0', // Bind to all network interfaces
    port: 5173,      // Explicitly define the port
  },
});
