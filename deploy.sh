#!/bin/bash
# Скрипт развертывания CRM Monitor через SSH

echo "=== Развертывание CRM Monitor ==="

# Цвета для вывода
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Проверка наличия dist
if [ ! -d "dist" ]; then
    echo -e "${YELLOW}Папка dist не найдена. Запустите 'npm run build' сначала.${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Папка dist найдена${NC}"

# Параметры подключения
SSH_HOST="decloud2376.zahid.host"
SSH_PORT="32762"
SSH_USER="aiecom_uploadspace"
SSH_PATH="/home/aiecom_uploadspace"

# Определение веб-директории
echo "Поиск веб-директории..."
WEB_DIRS=("public_html" "www" "html" "domains/ai.ecom-upload.space/public_html")

WEB_DIR=""
for dir in "${WEB_DIRS[@]}"; do
    if ssh -p $SSH_PORT $SSH_USER@$SSH_HOST "[ -d $SSH_PATH/$dir ]"; then
        WEB_DIR="$SSH_PATH/$dir"
        echo -e "${GREEN}✓ Найдена веб-директория: $WEB_DIR${NC}"
        break
    fi
done

if [ -z "$WEB_DIR" ]; then
    echo -e "${YELLOW}Веб-директория не найдена автоматически.${NC}"
    echo "Проверьте доступные директории:"
    ssh -p $SSH_PORT $SSH_USER@$SSH_HOST "ls -la $SSH_PATH"
    read -p "Введите путь к веб-директории: " WEB_DIR
    WEB_DIR="$SSH_PATH/$WEB_DIR"
fi

# Создание директории crm-monitor
echo "Создание директории crm-monitor..."
ssh -p $SSH_PORT $SSH_USER@$SSH_HOST "mkdir -p $WEB_DIR/crm-monitor"

# Копирование файлов
echo "Копирование файлов..."
scp -P $SSH_PORT -r dist/* $SSH_USER@$SSH_HOST:$WEB_DIR/crm-monitor/

echo -e "${GREEN}✓ Файлы скопированы${NC}"

# Установка прав
echo "Установка прав доступа..."
ssh -p $SSH_PORT $SSH_USER@$SSH_HOST "chmod -R 755 $WEB_DIR/crm-monitor"

echo -e "${GREEN}✓ Права установлены${NC}"

echo ""
echo -e "${GREEN}=== Развертывание завершено ===${NC}"
echo "Файлы размещены в: $WEB_DIR/crm-monitor"
echo ""
echo "Следующий шаг: попросите администратора добавить конфигурацию Nginx"
echo "Используйте файл: nginx-location-block.conf"
echo "Путь для alias в конфиге: $WEB_DIR/crm-monitor"
