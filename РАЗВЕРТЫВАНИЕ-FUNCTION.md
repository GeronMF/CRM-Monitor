# Развертывание обновленной Supabase функции

## Проблема
Функция `parse-crm-data` не обновлена на сервере Supabase, поэтому данные не меняются при выборе сессии.

## Решение

### Вариант 1: Через Supabase CLI (рекомендуется)

```bash
# Установите Supabase CLI (если еще не установлен)
npm install -g supabase

# Войдите в Supabase
supabase login

# Свяжите проект (если еще не связан)
supabase link --project-ref awangomqhrqmljoetgta

# Разверните функцию
supabase functions deploy parse-crm-data
```

### Вариант 2: Через веб-интерфейс Supabase

1. Откройте: https://supabase.com/dashboard/project/awangomqhrqmljoetgta
2. Перейдите в **Edge Functions**
3. Найдите функцию `parse-crm-data`
4. Нажмите **Edit**
5. Скопируйте содержимое файла `supabase/functions/parse-crm-data/index.ts`
6. Вставьте в редактор
7. Нажмите **Deploy**

### Вариант 3: Через GitHub Actions (автоматически)

Если настроен автоматический деплой функций, просто запушьте изменения:

```bash
git add supabase/functions/parse-crm-data/index.ts
git commit -m "Update parse-crm-data function with session support"
git push
```

## Проверка

После развертывания:
1. Откройте приложение: https://ai.ecom-upload.space/crm-monitor
2. Выберите другую сессию (ДИАР или Розпакуй)
3. Данные должны обновиться

## Логи

Проверьте логи функции в Supabase Dashboard → Edge Functions → parse-crm-data → Logs
Там должны быть сообщения:
- `Session: diar` или `Session: rozpakuj`
- `Role ID: 9`
- `Source Filter: [...]`
- И т.д.
