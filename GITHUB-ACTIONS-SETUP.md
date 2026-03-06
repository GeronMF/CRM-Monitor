# Настройка GitHub Actions для автоматического деплоя

## Шаг 1: Добавьте секреты в GitHub

Перейдите в репозиторий: **Settings → Secrets and variables → Actions → New repository secret**

Добавьте следующие секреты:

### Обязательные секреты:

1. **SSH_HOST**
   - Значение: `decloud2376.zahid.host`

2. **SSH_PORT**
   - Значение: `32762`

3. **SSH_USER**
   - Значение: `aiecom_uploadspace`

4. **SSH_PRIVATE_KEY**
   - Значение: Ваш приватный SSH ключ
   - Как получить: Если у вас нет SSH ключа, создайте его:
     ```bash
     ssh-keygen -t rsa -b 4096 -C "github-actions"
     ```
   - Скопируйте содержимое `~/.ssh/id_rsa` (приватный ключ)
   - Добавьте публичный ключ на сервер:
     ```bash
     ssh-copy-id -p 32762 aiecom_uploadspace@decloud2376.zahid.host
     ```

5. **DEPLOY_PATH**
   - Значение: `/home/aiecom_uploadspace/www`

6. **VITE_SUPABASE_URL**
   - Значение: URL вашего Supabase проекта (например: `https://xxxxx.supabase.co`)

7. **VITE_SUPABASE_ANON_KEY**
   - Значение: Ваш публичный Supabase ключ

## Шаг 2: Проверьте workflow файл

Файл `.github/workflows/deploy.yml` уже создан и настроен.

## Шаг 3: Запушьте изменения

```bash
git add .
git commit -m "Add GitHub Actions deployment"
git push origin main
```

## Шаг 4: Проверьте деплой

1. Перейдите в репозиторий на GitHub
2. Откройте вкладку **Actions**
3. Вы увидите запущенный workflow
4. Дождитесь завершения

## Как это работает

- При каждом push в ветку `main` или `master` автоматически запускается деплой
- Проект собирается с вашими переменными окружения
- Файлы копируются на сервер через SSH
- Устанавливаются правильные права доступа

## Ручной запуск

Вы также можете запустить деплой вручную:
- Перейдите в **Actions** → выберите workflow → **Run workflow**

## Устранение проблем

### Ошибка: Permission denied (publickey)
- Убедитесь, что SSH_PRIVATE_KEY добавлен правильно
- Проверьте, что публичный ключ добавлен на сервер

### Ошибка: Host key verification failed
- Workflow автоматически добавляет хост в known_hosts
- Если проблема сохраняется, проверьте SSH_HOST и SSH_PORT

### Ошибка: No such file or directory
- Проверьте DEPLOY_PATH - должен быть `/home/aiecom_uploadspace/www`
