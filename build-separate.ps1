# Скрипт для сборки отдельных версий

Write-Host "Building main (E-commerce)..." -ForegroundColor Green
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "Main build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "Building DIAR..." -ForegroundColor Green
# Временно заменяем main.tsx
Copy-Item "src\main.tsx" "src\main.tsx.backup"
Copy-Item "src\main-diar.tsx" "src\main.tsx"

# Создаем временный vite.config для DIAR
$viteConfigDiar = @"
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/crm-monitor/diar/',
  build: {
    outDir: 'dist-diar',
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
});
"@
$viteConfigDiar | Out-File -FilePath "vite.config.diar.ts" -Encoding UTF8

# Временно заменяем vite.config.ts
Copy-Item "vite.config.ts" "vite.config.ts.backup"
Copy-Item "vite.config.diar.ts" "vite.config.ts"

try {
    npm run build
    if ($LASTEXITCODE -ne 0) {
        Write-Host "DIAR build failed!" -ForegroundColor Red
        exit 1
    }
    
    # Копируем API файл
    New-Item -ItemType Directory -Force -Path "dist-diar\api" | Out-Null
    Copy-Item "api\parse-crm-data-diar.php" "dist-diar\api\parse-crm-data.php"
    
    Write-Host "DIAR build complete!" -ForegroundColor Green
} finally {
    # Восстанавливаем оригинальные файлы
    Copy-Item "src\main.tsx.backup" "src\main.tsx"
    Copy-Item "vite.config.ts.backup" "vite.config.ts"
    Remove-Item "src\main.tsx.backup"
    Remove-Item "vite.config.ts.backup"
    Remove-Item "vite.config.diar.ts"
}

Write-Host "Building Rozpakuj..." -ForegroundColor Green
# Временно заменяем main.tsx
Copy-Item "src\main.tsx" "src\main.tsx.backup"
Copy-Item "src\main-rozpakuj.tsx" "src\main.tsx"

# Создаем временный vite.config для Rozpakuj
$viteConfigRozpakuj = @"
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/crm-monitor/rozpakuy/',
  build: {
    outDir: 'dist-rozpakuj',
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
});
"@
$viteConfigRozpakuj | Out-File -FilePath "vite.config.rozpakuj.ts" -Encoding UTF8

# Временно заменяем vite.config.ts
Copy-Item "vite.config.ts" "vite.config.ts.backup"
Copy-Item "vite.config.rozpakuj.ts" "vite.config.ts"

try {
    npm run build
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Rozpakuj build failed!" -ForegroundColor Red
        exit 1
    }
    
    # Копируем API файл
    New-Item -ItemType Directory -Force -Path "dist-rozpakuj\api" | Out-Null
    Copy-Item "api\parse-crm-data-rozpakuj.php" "dist-rozpakuj\api\parse-crm-data.php"
    
    Write-Host "Rozpakuj build complete!" -ForegroundColor Green
} finally {
    # Восстанавливаем оригинальные файлы
    Copy-Item "src\main.tsx.backup" "src\main.tsx"
    Copy-Item "vite.config.ts.backup" "vite.config.ts"
    Remove-Item "src\main.tsx.backup"
    Remove-Item "vite.config.ts.backup"
    Remove-Item "vite.config.rozpakuj.ts"
}

Write-Host "All builds complete!" -ForegroundColor Green
