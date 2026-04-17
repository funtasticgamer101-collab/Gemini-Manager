import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';
import dotenv from 'dotenv';
import fs from 'fs';

// Try to load token.env specifically if it exists using native Node.js tools
const envPath = path.resolve(process.cwd(), 'token.env');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
}

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  
  // Use either process.env (populated from token.env via dotenv) OR Vite's loadEnv
  const apiKey = process.env.GEMINI_API_KEY || env.GEMINI_API_KEY;

  return {
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(apiKey || ''),
    },
    resolve: {
      alias: {
        '@': path.resolve(process.cwd(), '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
