@echo off
REM Быстрое копирование файлов на сервер
REM Использование: copy-to-server.bat

echo === Копирование CRM Monitor на сервер ===
echo.

REM Проверка наличия dist
if not exist "dist" (
    echo ОШИБКА: Папка dist не найдена!
    echo Запустите сначала: npm run build
    pause
    exit /b 1
)

echo Найденные файлы в dist:
dir /b dist
echo.

REM Параметры подключения
set SSH_HOST=decloud2376.zahid.host
set SSH_PORT=32762
set SSH_USER=aiecom_uploadspace
set WEB_PATH=/home/aiecom_uploadspace/public_html/crm-monitor

echo Копирование файлов...
echo Хост: %SSH_HOST%
echo Порт: %SSH_PORT%
echo Пользователь: %SSH_USER%
echo Путь: %WEB_PATH%
echo.

REM Создание директории на сервере
echo Создание директории на сервере...
ssh -p %SSH_PORT% %SSH_USER%@%SSH_HOST% "mkdir -p %WEB_PATH%"

REM Копирование файлов
echo Копирование файлов...
scp -P %SSH_PORT% -r dist\* %SSH_USER%@%SSH_HOST%:%WEB_PATH%/

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo Копирование завершено успешно!
    echo ========================================
    echo.
    echo Файлы размещены в: %WEB_PATH%
    echo.
    echo Следующий шаг: настройте Nginx
    echo Используйте файл: nginx-location-block.conf
) else (
    echo.
    echo ========================================
    echo ОШИБКА при копировании!
    echo ========================================
    echo.
    echo Возможные причины:
    echo 1. Неправильный путь к веб-директории
    echo 2. Нет прав доступа
    echo 3. SSH ключ не настроен
    echo.
    echo Проверьте доступные директории:
    echo ssh -p %SSH_PORT% %SSH_USER%@%SSH_HOST% "ls -la /home/aiecom_uploadspace"
)

echo.
pause
