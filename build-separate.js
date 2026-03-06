import { build } from 'vite';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { copyFileSync, mkdirSync, cpSync } from 'fs';
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
    
    console.log('DIAR build complete!');
  } finally {
    // Восстанавливаем оригинальный main.tsx
    copyFileSync(mainBackup, mainPath);
    // Удаляем backup
    require('fs').unlinkSync(mainBackup);
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
    
    console.log('Rozpakuj build complete!');
  } finally {
    // Восстанавливаем оригинальный main.tsx
    copyFileSync(mainBackup, mainPath);
    // Удаляем backup
    require('fs').unlinkSync(mainBackup);
  }
}

// Запускаем все сборки
async function buildAll() {
  await buildMain();
  await buildDiar();
  await buildRozpakuj();
  console.log('All builds complete!');
}

buildAll().catch(console.error);
