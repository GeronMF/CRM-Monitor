# 🚀 Развертывание CRM Monitor

## 📋 Быстрый старт

1. **Соберите проект:**
   ```bash
   npm install
   # Создайте .env с Supabase данными (из env.example.txt)
   npm run build
   ```

2. **Скопируйте на сервер:**
   - **Windows:** Запустите `copy-to-server.bat`
   - **Или вручную:** `scp -P 32762 -r dist/* aiecom_uploadspace@decloud2376.zahid.host:~/public_html/crm-monitor/`

3. **Настройте БД:**
   - Откройте phpMyAdmin: `https://ai.ecom-upload.space/phpmyadmin`
   - Выполните SQL из `setup-database.sql`

4. **Настройте Nginx:**
   - Добавьте конфигурацию из `nginx-location-block.conf`
   - Или попросите администратора

## 📁 Файлы для развертывания

| Файл | Описание |
|------|----------|
| `БЫСТРОЕ-РАЗВЕРТЫВАНИЕ.md` | Краткая инструкция |
| `РАЗВЕРТЫВАНИЕ-SSH.md` | Подробная инструкция через SSH |
| `РАЗВЕРТЫВАНИЕ-БЕЗ-SUDO.md` | Инструкция без sudo прав |
| `setup-database.sql` | SQL скрипт для создания таблиц |
| `nginx-location-block.conf` | Фрагмент конфигурации Nginx |
| `copy-to-server.bat` | Скрипт для Windows |
| `deploy.sh` | Скрипт для Linux/Mac |
| `deploy.ps1` | PowerShell скрипт |

## 🔑 Данные для подключения

**SSH:**
- Хост: `decloud2376.zahid.host`
- Порт: `32762`
- Пользователь: `aiecom_uploadspace`
- Путь: `/home/aiecom_uploadspace`

**База данных:**
- Хост: `localhost`
- БД: `aiecom_uploadspace`
- Пользователь: `aiecom_uploadspace`
- Пароль: `73762984-d17c-45cd-b77c-fad42de47b65`

## ✅ После развертывания

Проверьте: `https://ai.ecom-upload.space/crm-monitor`

## 🔄 Обновление

```bash
npm run build
scp -P 32762 -r dist/* aiecom_uploadspace@decloud2376.zahid.host:~/public_html/crm-monitor/
```

## 📞 Нужна помощь?

См. подробные инструкции:
- `БЫСТРОЕ-РАЗВЕРТЫВАНИЕ.md` - для быстрого старта
- `РАЗВЕРТЫВАНИЕ-SSH.md` - подробная инструкция
