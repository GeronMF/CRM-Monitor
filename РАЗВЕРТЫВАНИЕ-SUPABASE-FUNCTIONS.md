# Развертывание Edge Functions в Supabase

Инструкция по развертыванию трех отдельных Edge Functions для E-commerce, ДИАР и Трансляции.

## Вариант 1: Через Supabase Dashboard (рекомендуется)

### Шаг 1: Откройте Supabase Dashboard

1. Перейдите на: https://supabase.com/dashboard/project/awangomqhrqmljoetgta
2. Войдите в свой аккаунт

### Шаг 2: Развертывание функции для E-commerce

1. В левом меню выберите **Edge Functions**
2. Нажмите **Create a new function**
3. Введите имя функции: `parse-crm-data-ecommerce`
4. Нажмите **Create function**
5. Откройте файл `supabase/functions/parse-crm-data-ecommerce/index.ts` в вашем редакторе
6. Скопируйте **ВЕСЬ** код из файла
7. Вставьте код в редактор Supabase Dashboard
8. Нажмите **Deploy**

### Шаг 3: Развертывание функции для ДИАР

1. Нажмите **Create a new function**
2. Введите имя функции: `parse-crm-data-diar`
3. Нажмите **Create function**
4. Откройте файл `supabase/functions/parse-crm-data-diar/index.ts` в вашем редакторе
5. Скопируйте **ВЕСЬ** код из файла
6. Вставьте код в редактор Supabase Dashboard
7. Нажмите **Deploy**

### Шаг 4: Развертывание функции для Трансляции

1. Нажмите **Create a new function**
2. Введите имя функции: `parse-crm-data-rozpakuj`
3. Нажмите **Create function**
4. Откройте файл `supabase/functions/parse-crm-data-rozpakuj/index.ts` в вашем редакторе
5. Скопируйте **ВЕСЬ** код из файла
6. Вставьте код в редактор Supabase Dashboard
7. Нажмите **Deploy**

### Шаг 5: Проверка развертывания

После развертывания всех трех функций, проверьте их URL:

- E-commerce: `https://awangomqhrqmljoetgta.supabase.co/functions/v1/parse-crm-data-ecommerce`
- ДИАР: `https://awangomqhrqmljoetgta.supabase.co/functions/v1/parse-crm-data-diar`
- Трансляция: `https://awangomqhrqmljoetgta.supabase.co/functions/v1/parse-crm-data-rozpakuj`

## Вариант 2: Через Supabase CLI

### Шаг 1: Установка Supabase CLI

```bash
npm install -g supabase
```

### Шаг 2: Вход в Supabase

```bash
supabase login
```

Следуйте инструкциям для входа через браузер.

### Шаг 3: Подключение к проекту

```bash
supabase link --project-ref awangomqhrqmljoetgta
```

### Шаг 4: Развертывание функций

```bash
# Развертывание E-commerce
supabase functions deploy parse-crm-data-ecommerce

# Развертывание ДИАР
supabase functions deploy parse-crm-data-diar

# Развертывание Трансляции
supabase functions deploy parse-crm-data-rozpakuj
```

## Проверка работы функций

### Тестирование через браузер

Откройте в браузере (добавьте `?debug=true` для отладки):

- E-commerce: https://awangomqhrqmljoetgta.supabase.co/functions/v1/parse-crm-data-ecommerce?debug=true
- ДИАР: https://awangomqhrqmljoetgta.supabase.co/functions/v1/parse-crm-data-diar?debug=true
- Трансляция: https://awangomqhrqmljoetgta.supabase.co/functions/v1/parse-crm-data-rozpakuj?debug=true

### Проверка логов

1. В Supabase Dashboard перейдите в **Edge Functions**
2. Выберите нужную функцию
3. Откройте вкладку **Logs**
4. Проверьте логи на наличие ошибок

## Важно!

1. **Убедитесь, что в `.env` файле есть `VITE_SUPABASE_ANON_KEY`** - он нужен для авторизации запросов к функциям
2. После развертывания функций, пересоберите фронтенд: `npm run build`
3. Задеплойте обновленный фронтенд на сервер

## Обновление функций

Если нужно обновить функцию:

1. Внесите изменения в файл `supabase/functions/parse-crm-data-*/index.ts`
2. Скопируйте обновленный код
3. В Supabase Dashboard откройте нужную функцию
4. Вставьте обновленный код
5. Нажмите **Deploy**

Или через CLI:

```bash
supabase functions deploy parse-crm-data-ecommerce
```

## Устранение проблем

### Функция возвращает ошибку 401

- Проверьте, что в запросе отправляется заголовок `Authorization: Bearer <VITE_SUPABASE_ANON_KEY>`
- Убедитесь, что `VITE_SUPABASE_ANON_KEY` указан в `.env` файле

### Функция возвращает ошибку 500

- Проверьте логи функции в Supabase Dashboard
- Убедитесь, что логин и пароль в конфигурации функции правильные
- Проверьте, что URL CRM доступен

### Данные не меняются

- Убедитесь, что развернуты все три функции
- Проверьте, что фронтенд использует правильные URL функций
- Очистите кэш браузера
