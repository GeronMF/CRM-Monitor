# Развертывание CRM Monitor через SSH

## Данные для подключения

- **SSH хост:** decloud2376.zahid.host
- **SSH порт:** 32762
- **SSH пользователь:** aiecom_uploadspace
- **SSH путь:** /home/aiecom_uploadspace
- **БД хост:** localhost
- **БД имя:** aiecom_uploadspace
- **БД пользователь:** aiecom_uploadspace

## Шаг 1: Подготовка проекта локально

```bash
# Установите зависимости
npm install

# Создайте файл .env
cp env.example.txt .env

# Отредактируйте .env и укажите ваши Supabase данные
# VITE_SUPABASE_URL=https://ваш-проект.supabase.co
# VITE_SUPABASE_ANON_KEY=ваш-ключ

# Соберите проект
npm run build
```

## Шаг 2: Определение веб-директории

Подключитесь к серверу и найдите веб-директорию:

```bash
ssh -p 32762 aiecom_uploadspace@decloud2376.zahid.host
```

Проверьте доступные директории:

```bash
ls -la /home/aiecom_uploadspace
```

Обычно веб-директория находится в одном из этих мест:
- `~/public_html`
- `~/www`
- `~/html`
- `~/domains/ai.ecom-upload.space/public_html`

## Шаг 3: Размещение файлов

### Вариант А: Автоматический скрипт (Windows)

Если у вас установлен Git Bash или WSL:

```bash
# Сделайте скрипт исполняемым (в Git Bash)
chmod +x deploy.sh

# Запустите скрипт
./deploy.sh
```

### Вариант Б: Ручное копирование

```bash
# С вашего компьютера (Windows PowerShell или Git Bash)
scp -P 32762 -r dist/* aiecom_uploadspace@decloud2376.zahid.host:/home/aiecom_uploadspace/public_html/crm-monitor/

# Или если другая директория, например:
# scp -P 32762 -r dist/* aiecom_uploadspace@decloud2376.zahid.host:/home/aiecom_uploadspace/www/crm-monitor/
```

### Вариант В: Через SSH сессию

```bash
# Подключитесь к серверу
ssh -p 32762 aiecom_uploadspace@decloud2376.zahid.host

# Создайте директорию
mkdir -p ~/public_html/crm-monitor

# Выйдите из SSH (Ctrl+D)

# С вашего компьютера скопируйте файлы
scp -P 32762 -r dist/* aiecom_uploadspace@decloud2376.zahid.host:~/public_html/crm-monitor/

# Вернитесь на сервер и установите права
ssh -p 32762 aiecom_uploadspace@decloud2376.zahid.host
chmod -R 755 ~/public_html/crm-monitor
```

## Шаг 4: Настройка базы данных

### Через phpMyAdmin

1. Откройте `https://ai.ecom-upload.space/phpmyadmin`
2. Войдите с данными:
   - Пользователь: `aiecom_uploadspace`
   - Пароль: `73762984-d17c-45cd-b77c-fad42de47b65`
3. Выберите базу данных `aiecom_uploadspace`
4. Перейдите на вкладку "SQL"
5. Выполните SQL из файла `setup-database.sql`

### Через SSH (MySQL CLI)

```bash
# Подключитесь к серверу
ssh -p 32762 aiecom_uploadspace@decloud2376.zahid.host

# Подключитесь к MySQL
mysql -u aiecom_uploadspace -p aiecom_uploadspace
# Введите пароль: 73762984-d17c-45cd-b77c-fad42de47b65

# Выполните SQL команды из setup-database.sql
# Или импортируйте файл:
source /home/aiecom_uploadspace/setup-database.sql
```

**Примечание:** Если в MySQL нет поддержки UUID() (старые версии), используйте:

```sql
CREATE TABLE IF NOT EXISTS employees (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  name text NOT NULL,
  status text NOT NULL DEFAULT 'stop',
  created_at timestamp DEFAULT CURRENT_TIMESTAMP
);
```

## Шаг 5: Настройка Nginx

### Если у вас есть доступ к конфигурации Nginx

```bash
# Подключитесь к серверу
ssh -p 32762 aiecom_uploadspace@decloud2376.zahid.host

# Найдите конфигурацию домена
# Обычно в одном из этих мест:
# /etc/nginx/sites-available/ai.ecom-upload.space
# /etc/nginx/conf.d/ai.ecom-upload.space.conf
# /usr/local/nginx/conf/vhost/ai.ecom-upload.space.conf

# Отредактируйте конфигурацию (может потребоваться sudo)
sudo nano /etc/nginx/sites-available/ai.ecom-upload.space
```

Добавьте блок (замените путь на реальный):

```nginx
location /crm-monitor {
    alias /home/aiecom_uploadspace/public_html/crm-monitor;
    try_files $uri $uri/ /crm-monitor/index.html;
    
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    location ~* \.html$ {
        expires -1;
        add_header Cache-Control "no-store, no-cache, must-revalidate";
    }
}
```

Проверьте и перезагрузите:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

### Если нет доступа к Nginx

Отправьте администратору файл `nginx-location-block.conf` с указанием правильного пути:

```nginx
location /crm-monitor {
    alias /home/aiecom_uploadspace/public_html/crm-monitor;  # Укажите реальный путь
    try_files $uri $uri/ /crm-monitor/index.html;
    # ... остальная конфигурация
}
```

## Шаг 6: Проверка

1. Откройте в браузере: `https://ai.ecom-upload.space/crm-monitor`
2. Проверьте консоль браузера (F12) на ошибки
3. Убедитесь, что API запросы работают

## Обновление проекта

```bash
# Локально
npm run build

# Скопируйте новые файлы
scp -P 32762 -r dist/* aiecom_uploadspace@decloud2376.zahid.host:/home/aiecom_uploadspace/public_html/crm-monitor/

# Очистите кэш браузера (Ctrl+Shift+R)
```

## Быстрая команда для копирования (Windows PowerShell)

```powershell
# Определите путь к веб-директории (замените public_html на ваш путь)
$webPath = "/home/aiecom_uploadspace/public_html/crm-monitor"

# Скопируйте файлы
scp -P 32762 -r dist/* aiecom_uploadspace@decloud2376.zahid.host:$webPath
```

## Устранение проблем

### Проблема: Permission denied при копировании

**Решение:** Убедитесь, что директория существует и у вас есть права:

```bash
ssh -p 32762 aiecom_uploadspace@decloud2376.zahid.host
mkdir -p ~/public_html/crm-monitor
chmod 755 ~/public_html/crm-monitor
```

### Проблема: Файлы не отображаются

**Решение:** Проверьте права доступа:

```bash
ssh -p 32762 aiecom_uploadspace@decloud2376.zahid.host
chmod -R 755 ~/public_html/crm-monitor
ls -la ~/public_html/crm-monitor
```

### Проблема: 404 ошибка

**Решение:** 
1. Проверьте, что файлы скопированы
2. Убедитесь, что Nginx настроен правильно
3. Проверьте путь в конфигурации Nginx

## Структура на сервере

После развертывания структура должна быть такой:

```
/home/aiecom_uploadspace/
└── public_html/  (или www, или html)
    └── crm-monitor/
        ├── index.html
        ├── assets/
        │   ├── index-*.js
        │   ├── index-*.css
        │   └── ...
        ├── icon-192.png
        ├── icon-512.png
        ├── manifest.json
        └── sw.js
```
