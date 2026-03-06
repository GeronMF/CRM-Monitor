-- Скрипт настройки базы данных для CRM Monitor
-- Выполнить в phpMyAdmin или через MySQL CLI

-- Создание базы данных (если еще не создана)
-- CREATE DATABASE IF NOT EXISTS aiecom_uploadspace CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Использование базы данных
USE aiecom_uploadspace;

-- Создание таблиц
-- Для MySQL используем CHAR(36) для UUID
CREATE TABLE IF NOT EXISTS employees (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  name TEXT NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'stop',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS orders (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  employee_id CHAR(36),
  amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS calls (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  employee_id CHAR(36),
  call_type VARCHAR(50) NOT NULL,
  duration INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Вставка тестовых данных (опционально)
INSERT INTO employees (name, status) VALUES
  ('Алексей', 'working'),
  ('Мария', 'working'),
  ('Иван', 'pause'),
  ('Елена', 'stop')
ON DUPLICATE KEY UPDATE name=name;

-- Примечание: UUID() в MySQL 8.0+, для более старых версий используйте:
-- id CHAR(36) PRIMARY KEY DEFAULT (UUID())
