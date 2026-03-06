# PowerShell скрипт для развертывания CRM Monitor
# Запуск: .\deploy.ps1

Write-Host "=== Развертывание CRM Monitor ===" -ForegroundColor Green

# Проверка наличия dist
if (-not (Test-Path "dist")) {
    Write-Host "Папка dist не найдена. Запустите 'npm run build' сначала." -ForegroundColor Yellow
    exit 1
}

Write-Host "✓ Папка dist найдена" -ForegroundColor Green

# Параметры подключения
$SSH_HOST = "decloud2376.zahid.host"
$SSH_PORT = "32762"
$SSH_USER = "aiecom_uploadspace"
$SSH_BASE_PATH = "/home/aiecom_uploadspace"

# Определение веб-директории
Write-Host "Поиск веб-директории..." -ForegroundColor Cyan

$webDirs = @("public_html", "www", "html", "domains/ai.ecom-upload.space/public_html")
$webDir = ""

foreach ($dir in $webDirs) {
    $fullPath = "$SSH_BASE_PATH/$dir"
    Write-Host "Проверка: $fullPath" -ForegroundColor Gray
    
    # Попробуем проверить через SSH команду
    $testCmd = "ssh -p $SSH_PORT ${SSH_USER}@${SSH_HOST} `"[ -d $fullPath ]`""
    $result = Invoke-Expression $testCmd 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        $webDir = $fullPath
        Write-Host "✓ Найдена веб-директория: $webDir" -ForegroundColor Green
        break
    }
}

if ([string]::IsNullOrEmpty($webDir)) {
    Write-Host "Веб-директория не найдена автоматически." -ForegroundColor Yellow
    Write-Host "Проверьте доступные директории:" -ForegroundColor Yellow
    ssh -p $SSH_PORT ${SSH_USER}@${SSH_HOST} "ls -la $SSH_BASE_PATH"
    $webDir = Read-Host "Введите путь к веб-директории (относительно $SSH_BASE_PATH)"
    $webDir = "$SSH_BASE_PATH/$webDir"
}

# Создание директории crm-monitor
Write-Host "Создание директории crm-monitor..." -ForegroundColor Cyan
ssh -p $SSH_PORT ${SSH_USER}@${SSH_HOST} "mkdir -p $webDir/crm-monitor"

# Копирование файлов
Write-Host "Копирование файлов..." -ForegroundColor Cyan
$targetPath = "${SSH_USER}@${SSH_HOST}:$webDir/crm-monitor/"

# Используем scp для копирования
Get-ChildItem -Path "dist" -Recurse | ForEach-Object {
    $relativePath = $_.FullName.Substring((Resolve-Path "dist").Path.Length + 1)
    $targetFile = "$targetPath$relativePath"
    
    if ($_.PSIsContainer) {
        ssh -p $SSH_PORT ${SSH_USER}@${SSH_HOST} "mkdir -p `"$webDir/crm-monitor/$relativePath`""
    } else {
        scp -P $SSH_PORT $_.FullName $targetFile
    }
}

Write-Host "✓ Файлы скопированы" -ForegroundColor Green

# Установка прав
Write-Host "Установка прав доступа..." -ForegroundColor Cyan
ssh -p $SSH_PORT ${SSH_USER}@${SSH_HOST} "chmod -R 755 $webDir/crm-monitor"

Write-Host "✓ Права установлены" -ForegroundColor Green

Write-Host ""
Write-Host "=== Развертывание завершено ===" -ForegroundColor Green
Write-Host "Файлы размещены в: $webDir/crm-monitor" -ForegroundColor Cyan
Write-Host ""
Write-Host "Следующий шаг: настройте Nginx" -ForegroundColor Yellow
Write-Host "Используйте файл: nginx-location-block.conf" -ForegroundColor Yellow
Write-Host "Путь для alias в конфиге: $webDir/crm-monitor" -ForegroundColor Yellow
