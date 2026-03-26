import { build } from 'vite';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { copyFileSync, mkdirSync, unlinkSync } from 'fs';

const mainPath = 'src/main.tsx';
const mainMegaPath = 'src/main-mega.tsx';
const mainBackup = 'src/main.tsx.backup';

copyFileSync(mainPath, mainBackup);
copyFileSync(mainMegaPath, mainPath);

try {
  await build(defineConfig({
    plugins: [react()],
    base: '/crm-monitor/mega/',
    build: {
      outDir: 'dist-mega',
      rollupOptions: { input: { main: 'index.html' } },
    },
  }));
  mkdirSync('dist-mega/api', { recursive: true });
  copyFileSync('api/parse-crm-data-mega.php', 'dist-mega/api/parse-crm-data.php');
  console.log('Mega build complete!');
} finally {
  copyFileSync(mainBackup, mainPath);
  unlinkSync(mainBackup);
}
