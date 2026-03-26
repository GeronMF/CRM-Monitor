import { build } from 'vite';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { copyFileSync, mkdirSync, cpSync, unlinkSync } from 'fs';
import { join } from 'path';

// Основная сборка (E-commerce)
async function buildMain() {
  console.log('Building main (E-commerce)...');
  await build(defineConfig({
    plugins: [react()],
    base: '/crm-monitor/',
    build: {
      outDir: 'dist',
      rollupOptions: {
        input: {
          main: 'index.html',
        },
      },
    },
  }));
  mkdirSync('dist/api', { recursive: true });
  copyFileSync('api/parse-crm-data-ecommerce.php', 'dist/api/parse-crm-data.php');
  copyFileSync('api/process-time-cache.php', 'dist/api/process-time-cache.php');
  console.log('Main build complete!');
}

// Сборка для ДИАР
async function buildDiar() {
  console.log('Building DIAR...');
  
  // Временно заменяем main.tsx
  const mainPath = 'src/main.tsx';
  const mainDiarPath = 'src/main-diar.tsx';
  const mainBackup = 'src/main.tsx.backup';
  
  copyFileSync(mainPath, mainBackup);
  copyFileSync(mainDiarPath, mainPath);
  
  try {
    await build(defineConfig({
      plugins: [react()],
      base: '/crm-monitor/diar/',
      build: {
        outDir: 'dist-diar',
        rollupOptions: {
          input: {
            main: 'index.html',
          },
        },
      },
    }));
    
    // Копируем API файл
    mkdirSync('dist-diar/api', { recursive: true });
    copyFileSync('api/parse-crm-data-diar.php', 'dist-diar/api/parse-crm-data.php');
    copyFileSync('api/process-time-cache.php', 'dist-diar/api/process-time-cache.php');
    
    console.log('DIAR build complete!');
  } finally {
    // Восстанавливаем оригинальный main.tsx
    copyFileSync(mainBackup, mainPath);
    // Удаляем backup
    unlinkSync(mainBackup);
  }
}

// Сборка для Трансляции
async function buildRozpakuj() {
  console.log('Building Rozpakuj...');
  
  // Временно заменяем main.tsx
  const mainPath = 'src/main.tsx';
  const mainRozpakujPath = 'src/main-rozpakuj.tsx';
  const mainBackup = 'src/main.tsx.backup';
  
  copyFileSync(mainPath, mainBackup);
  copyFileSync(mainRozpakujPath, mainPath);
  
  try {
    await build(defineConfig({
      plugins: [react()],
      base: '/crm-monitor/rozpakuy/',
      build: {
        outDir: 'dist-rozpakuj',
        rollupOptions: {
          input: {
            main: 'index.html',
          },
        },
      },
    }));
    
    // Копируем API файл
    mkdirSync('dist-rozpakuj/api', { recursive: true });
    copyFileSync('api/parse-crm-data-rozpakuj.php', 'dist-rozpakuj/api/parse-crm-data.php');
    copyFileSync('api/process-time-cache.php', 'dist-rozpakuj/api/process-time-cache.php');
    
    console.log('Rozpakuj build complete!');
  } finally {
    // Восстанавливаем оригинальный main.tsx
    copyFileSync(mainBackup, mainPath);
    // Удаляем backup
    unlinkSync(mainBackup);
  }
}

// Сборка для МегаРозпакуй
async function buildMega() {
  console.log('Building Mega...');

  const mainPath       = 'src/main.tsx';
  const mainMegaPath   = 'src/main-mega.tsx';
  const mainBackup     = 'src/main.tsx.backup';

  copyFileSync(mainPath, mainBackup);
  copyFileSync(mainMegaPath, mainPath);

  try {
    await build(defineConfig({
      plugins: [react()],
      base: '/crm-monitor/mega/',
      build: {
        outDir: 'dist-mega',
        rollupOptions: {
          input: {
            main: 'index.html',
          },
        },
      },
    }));

    mkdirSync('dist-mega/api', { recursive: true });
    copyFileSync('api/parse-crm-data-mega.php', 'dist-mega/api/parse-crm-data.php');

    console.log('Mega build complete!');
  } finally {
    copyFileSync(mainBackup, mainPath);
    unlinkSync(mainBackup);
  }
}

// Запускаем все сборки
async function buildAll() {
  await buildMain();
  await buildDiar();
  await buildRozpakuj();
  await buildMega();
  console.log('All builds complete!');
}

buildAll().catch(console.error);
