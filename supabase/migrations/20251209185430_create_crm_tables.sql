/*
  # Create CRM Database Tables

  1. New Tables
    - `employees`
      - `id` (uuid, primary key)
      - `name` (text)
      - `status` (text) - working, pause, stop
      - `created_at` (timestamp)
    
    - `orders`
      - `id` (uuid, primary key)
      - `employee_id` (uuid, foreign key)
      - `amount` (numeric)
      - `created_at` (timestamp)
    
    - `calls`
      - `id` (uuid, primary key)
      - `employee_id` (uuid, foreign key)
      - `call_type` (text) - all, profile, missed, non_target, missed_non_target
      - `duration` (integer)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access (for demo purposes)
*/

CREATE TABLE IF NOT EXISTS employees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  status text NOT NULL DEFAULT 'stop',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid REFERENCES employees(id) ON DELETE CASCADE,
  amount numeric NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS calls (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid REFERENCES employees(id) ON DELETE CASCADE,
  call_type text NOT NULL,
  duration integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE calls ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to employees"
  ON employees FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access to orders"
  ON orders FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access to calls"
  ON calls FOR SELECT
  USING (true);

-- Insert test employees
INSERT INTO employees (name, status) VALUES
  ('Алексей', 'working'),
  ('Мария', 'working'),
  ('Иван', 'pause'),
  ('Елена', 'stop');

-- Insert test orders
INSERT INTO orders (employee_id, amount) 
SELECT id, 5000 + (random() * 10000)::numeric(10,2)
FROM employees
WHERE status = 'working'
LIMIT 6;

-- Insert test calls
INSERT INTO calls (employee_id, call_type, duration)
SELECT 
  e.id,
  (ARRAY['all', 'profile', 'missed', 'non_target', 'missed_non_target'])[floor(random() * 5 + 1)],
  (random() * 600)::integer
FROM employees e, generate_series(1, 20);
