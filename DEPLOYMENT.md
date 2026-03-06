# Инструкция по развертыванию CRM Monitor

## Требования

- Сервер с Nginx
- Node.js 18+ и npm
- PHP 8.1+ (для phpMyAdmin, если используется)
- MySQL/MariaDB (для Supabase или прямой работы с БД)
- Доступ к Supabase проекту

## Шаг 1: Подготовка проекта

### 1.1 Клонирование/копирование проекта

```bash
# На сервере создайте директорию для проекта
sudo mkdir -p /var/www/ai.ecom-upload.space/crm-monitor
sudo chown -R $USER:$USER /var/www/ai.ecom-upload.space/crm-monitor

# Скопируйте файлы проекта в эту директорию
```

### 1.2 Установка зависимостей

```bash
cd /var/www/ai.ecom-upload.space/crm-monitor
npm install
```

### 1.3 Настройка переменных окружения

```bash
# Создайте файл .env на основе .env.example
cp .env.example .env

# Отредактируйте .env и укажите ваши Supabase данные
nano .env
```

Заполните:
- `VITE_SUPABASE_URL` - URL вашего Supabase проекта
- `VITE_SUPABASE_ANON_KEY` - публичный ключ Supabase

## Шаг 2: Настройка базы данных

### 2.1 Создание базы данных через phpMyAdmin

1. Откройте phpMyAdmin: `https://ai.ecom-upload.space/phpmyadmin`
2. Создайте новую базу данных (если используете локальную БД вместо Supabase)
3. Импортируйте миграцию из файла:
   ```
   supabase/migrations/20251209185430_create_crm_tables.sql
   ```

### 2.2 Настройка Supabase (рекомендуется)

Если используете Supabase:

1. Войдите в ваш проект Supabase
2. Перейдите в SQL Editor
3. Выполните миграцию из файла `supabase/migrations/20251209185430_create_crm_tables.sql`
4. Убедитесь, что Edge Function `parse-crm-data` развернута:
   ```bash
   # Установите Supabase CLI
   npm install -g supabase
   
   # Войдите в Supabase
   supabase login
   
   # Свяжите проект
   supabase link --project-ref your-project-ref
   
   # Разверните функцию
   supabase functions deploy parse-crm-data
   ```

## Шаг 3: Сборка проекта

```bash
cd /var/www/ai.ecom-upload.space/crm-monitor
npm run build
```

После сборки файлы будут в директории `dist/`.

## Шаг 4: Настройка Nginx

### 4.1 Копирование конфигурации

```bash
# Скопируйте конфигурацию nginx.conf в sites-available
sudo cp nginx.conf /etc/nginx/sites-available/ai.ecom-upload.space

# Или отредактируйте существующий конфиг
sudo nano /etc/nginx/sites-available/ai.ecom-upload.space
```

### 4.2 Добавление в конфигурацию

Если у вас уже есть конфигурация для `ai.ecom-upload.space`, добавьте в блок `server`:

```nginx
# CRM Monitor в поддиректории /crm-monitor
location /crm-monitor {
    alias /var/www/ai.ecom-upload.space/crm-monitor/dist;
    try_files $uri $uri/ /crm-monitor/index.html;
    
    # Кэширование статических файлов
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }
    
    # Отключить кэширование для HTML
    location ~* \.html$ {
        expires -1;
        add_header Cache-Control "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0";
    }
}
```

### 4.3 Активация конфигурации

```bash
# Создайте симлинк (если еще не создан)
sudo ln -s /etc/nginx/sites-available/ai.ecom-upload.space /etc/nginx/sites-enabled/

# Проверьте конфигурацию
sudo nginx -t

# Перезагрузите Nginx
sudo systemctl reload nginx
```

## Шаг 5: Копирование собранных файлов

```bash
# Скопируйте содержимое dist в целевую директорию
sudo cp -r dist/* /var/www/ai.ecom-upload.space/crm-monitor/

# Или создайте симлинк
sudo ln -s /var/www/ai.ecom-upload.space/crm-monitor/dist /var/www/ai.ecom-upload.space/crm-monitor

# Установите правильные права
sudo chown -R www-data:www-data /var/www/ai.ecom-upload.space/crm-monitor
sudo chmod -R 755 /var/www/ai.ecom-upload.space/crm-monitor
```

## Шаг 6: Проверка

1. Откройте в браузере: `https://ai.ecom-upload.space/crm-monitor`
2. Проверьте, что приложение загружается
3. Проверьте консоль браузера (F12) на наличие ошибок
4. Убедитесь, что API запросы к Supabase работают

## Обновление проекта

При обновлении проекта:

```bash
cd /var/www/ai.ecom-upload.space/crm-monitor
git pull  # если используете git
npm install  # если обновились зависимости
npm run build
sudo cp -r dist/* /var/www/ai.ecom-upload.space/crm-monitor/
sudo systemctl reload nginx
```

## Устранение проблем

### Проблема: 404 ошибка при переходе по прямым ссылкам

**Решение**: Убедитесь, что в Nginx конфигурации есть `try_files $uri $uri/ /crm-monitor/index.html;`

### Проблема: Статические файлы не загружаются

**Решение**: Проверьте пути в `dist/index.html` - они должны начинаться с `/crm-monitor/`

### Проблема: API запросы не работают

**Решение**: 
1. Проверьте переменные окружения в `.env`
2. Убедитесь, что Supabase функция развернута
3. Проверьте CORS настройки в Supabase

### Проблема: Service Worker не работает

**Решение**: Убедитесь, что `sw.js` доступен по пути `/crm-monitor/sw.js`

## Структура директорий на сервере

```
/var/www/ai.ecom-upload.space/
├── index.html              # Основной проект
├── assets/                 # Ресурсы основного проекта
└── crm-monitor/            # CRM Monitor
    ├── index.html
    ├── assets/
    ├── icon-192.png
    ├── icon-512.png
    ├── manifest.json
    └── sw.js
```

## Дополнительные настройки

### Настройка SSL (Let's Encrypt)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d ai.ecom-upload.space
```

### Автоматическое обновление через cron

Создайте скрипт для автоматического обновления:

```bash
#!/bin/bash
cd /var/www/ai.ecom-upload.space/crm-monitor
git pull
npm install
npm run build
sudo cp -r dist/* /var/www/ai.ecom-upload.space/crm-monitor/
sudo systemctl reload nginx
```

Добавьте в crontab для ежедневного обновления в 3:00:

```bash
0 3 * * * /path/to/update-script.sh
```
