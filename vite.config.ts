
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
<<<<<<< HEAD
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY)
  },
  server: {
    historyApiFallback: true,
=======
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY),
  },
  build: {
    outDir: 'dist',
    sourcemap: false
>>>>>>> 0b6886b30f42ba84b6a79e344ab28656f0d46a20
  }
});
