# Создание SSH ключа для GitHub Actions
# Запуск: .\create-ssh-key.ps1

$sshDir = "$env:USERPROFILE\.ssh"
$privateKeyPath = "$sshDir\id_rsa"
$publicKeyPath = "$sshDir\id_rsa.pub"

# Создаем директорию .ssh если её нет
if (-not (Test-Path $sshDir)) {
    New-Item -ItemType Directory -Path $sshDir -Force | Out-Null
}

Write-Host "Создание SSH ключа..." -ForegroundColor Green

# Используем OpenSSL если доступен, иначе используем альтернативный метод
try {
    # Попробуем найти openssl
    $openssl = Get-Command openssl -ErrorAction Stop
    
    # Генерируем приватный ключ
    & openssl genrsa -out $privateKeyPath 4096 2>$null
    
    # Генерируем публичный ключ
    & openssl rsa -in $privateKeyPath -pubout -out $publicKeyPath 2>$null
    
    Write-Host "✓ SSH ключ создан успешно!" -ForegroundColor Green
} catch {
    Write-Host "OpenSSL не найден. Используйте один из вариантов:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "ВАРИАНТ 1: Установите Git for Windows (включает ssh-keygen)" -ForegroundColor Cyan
    Write-Host "  Скачайте: https://git-scm.com/download/win" -ForegroundColor Gray
    Write-Host ""
    Write-Host "ВАРИАНТ 2: Используйте онлайн генератор" -ForegroundColor Cyan
    Write-Host "  https://www.sshkeygen.com/" -ForegroundColor Gray
    Write-Host "  Сохраните приватный ключ в: $privateKeyPath" -ForegroundColor Gray
    Write-Host "  Сохраните публичный ключ в: $publicKeyPath" -ForegroundColor Gray
    Write-Host ""
    Write-Host "ВАРИАНТ 3: Создайте ключ на сервере" -ForegroundColor Cyan
    Write-Host "  ssh -p 32762 aiecom_uploadspace@decloud2376.zahid.host" -ForegroundColor Gray
    Write-Host "  ssh-keygen -t rsa -b 4096 -C 'github-actions'" -ForegroundColor Gray
    Write-Host "  cat ~/.ssh/id_rsa" -ForegroundColor Gray
    Write-Host "  (скопируйте содержимое и сохраните локально)" -ForegroundColor Gray
    exit 1
}

Write-Host ""
Write-Host "Приватный ключ: $privateKeyPath" -ForegroundColor Cyan
Write-Host "Публичный ключ: $publicKeyPath" -ForegroundColor Cyan
Write-Host ""
Write-Host "Следующий шаг:" -ForegroundColor Yellow
Write-Host "1. Скопируйте содержимое ПРИВАТНОГО ключа для GitHub секрета SSH_PRIVATE_KEY" -ForegroundColor White
Write-Host "2. Добавьте публичный ключ на сервер:" -ForegroundColor White
Write-Host "   type $publicKeyPath | ssh -p 32762 aiecom_uploadspace@decloud2376.zahid.host `"mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys`"" -ForegroundColor Gray
