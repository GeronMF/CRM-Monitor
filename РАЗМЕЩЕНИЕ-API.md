# Размещение API на сервере

## Шаг 1: Скопируйте PHP файл на сервер

```bash
# Через SSH
scp -P 32762 api/parse-crm-data.php aiecom_uploadspace@decloud2376.zahid.host:~/www/api/
```

Или через файловый менеджер:
- Скопируйте файл `api/parse-crm-data.php` в `~/www/api/` на сервере

## Шаг 2: Создайте директорию api (если нет)

```bash
ssh -p 32762 aiecom_uploadspace@decloud2376.zahid.host
mkdir -p ~/www/api
```

## Шаг 3: Установите права

```bash
chmod 644 ~/www/api/parse-crm-data.php
```

## Шаг 4: Проверьте, что PHP работает

```bash
# Проверьте версию PHP
php -v

# Должна быть версия 7.4 или выше
```

## Шаг 5: Проверьте доступность

Откройте в браузере:
```
https://ai.ecom-upload.space/api/parse-crm-data.php?session=ecommerce
```

Должен вернуться JSON с данными.

## Шаг 6: Обновите приложение

После размещения API файла, соберите и задеплойте проект:

```bash
npm run build
# Файлы из dist/ уже на сервере через GitHub Actions
```

## Проверка логов

Логи PHP будут в:
```bash
# На сервере
tail -f ~/logs/php-error.log
# Или
tail -f /var/log/php-fpm/error.log
```

Или проверьте логи через панель хостинга.

## Преимущества локального API

✅ Полный контроль над логированием
✅ Нет зависимости от Supabase
✅ Быстрее (нет внешних запросов)
✅ Легче отлаживать
✅ Логи доступны на сервере
