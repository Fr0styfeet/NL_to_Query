export const SAMPLE_SCHEMAS = [
  {
    id: "ecommerce",
    name: "E-Commerce",
    icon: "🛒",
    description: "Users, orders, products & inventory",
    color: "#f59e0b",
    content: `-- E-Commerce Platform Schema
CREATE TABLE users (
  id          INT PRIMARY KEY,
  name        VARCHAR(100),
  email       VARCHAR(255) UNIQUE,
  created_at  TIMESTAMP DEFAULT NOW()
);

CREATE TABLE products (
  id          INT PRIMARY KEY,
  name        VARCHAR(200),
  price       DECIMAL(10,2),
  stock       INT,
  category    VARCHAR(100)
);

CREATE TABLE orders (
  id          INT PRIMARY KEY,
  user_id     INT REFERENCES users(id),
  total       DECIMAL(10,2),
  status      VARCHAR(50),
  placed_at   TIMESTAMP
);

CREATE TABLE order_items (
  id          INT PRIMARY KEY,
  order_id    INT REFERENCES orders(id),
  product_id  INT REFERENCES products(id),
  quantity    INT,
  unit_price  DECIMAL(10,2)
);`,
  },
  {
    id: "saas",
    name: "SaaS Analytics",
    icon: "📊",
    description: "Subscriptions, usage logs & billing",
    color: "#ffffff",
    content: `-- SaaS Analytics Platform Schema
CREATE TABLE companies (
  id           INT PRIMARY KEY,
  name         VARCHAR(200),
  plan         VARCHAR(50),
  created_at   DATE
);

CREATE TABLE subscriptions (
  id           INT PRIMARY KEY,
  company_id   INT REFERENCES companies(id),
  plan_name    VARCHAR(100),
  monthly_price DECIMAL(10,2),
  started_at   DATE,
  ends_at      DATE
);

CREATE TABLE usage_logs (
  log_id       INT PRIMARY KEY,
  company_id   INT REFERENCES companies(id),
  feature      VARCHAR(100),
  data_gb      DECIMAL(8,3),
  log_date     DATE
);

CREATE TABLE invoices (
  id           INT PRIMARY KEY,
  company_id   INT REFERENCES companies(id),
  amount       DECIMAL(10,2),
  paid         BOOLEAN,
  due_date     DATE
);`,
  },
  {
    id: "social",
    name: "Social Network",
    icon: "💬",
    description: "Users, posts, follows & reactions",
    color: "#8b5cf6",
    content: `-- Social Network Schema
CREATE TABLE users (
  id           INT PRIMARY KEY,
  username     VARCHAR(50) UNIQUE,
  display_name VARCHAR(100),
  bio          TEXT,
  joined_at    TIMESTAMP
);

CREATE TABLE posts (
  id           INT PRIMARY KEY,
  author_id    INT REFERENCES users(id),
  content      TEXT,
  media_url    VARCHAR(500),
  created_at   TIMESTAMP
);

CREATE TABLE follows (
  follower_id  INT REFERENCES users(id),
  following_id INT REFERENCES users(id),
  since        TIMESTAMP,
  PRIMARY KEY(follower_id, following_id)
);

CREATE TABLE reactions (
  id           INT PRIMARY KEY,
  post_id      INT REFERENCES posts(id),
  user_id      INT REFERENCES users(id),
  type         VARCHAR(20)
);`,
  },
  {
    id: "hr",
    name: "HR System",
    icon: "👥",
    description: "Employees, departments & payroll",
    color: "#10b981",
    content: `-- HR Management System
CREATE TABLE departments (
  id           INT PRIMARY KEY,
  name         VARCHAR(100),
  budget       DECIMAL(15,2),
  manager_id   INT
);

CREATE TABLE employees (
  id           INT PRIMARY KEY,
  first_name   VARCHAR(50),
  last_name    VARCHAR(50),
  email        VARCHAR(255),
  dept_id      INT REFERENCES departments(id),
  hire_date    DATE,
  salary       DECIMAL(12,2)
);

CREATE TABLE leaves (
  id           INT PRIMARY KEY,
  employee_id  INT REFERENCES employees(id),
  type         VARCHAR(50),
  start_date   DATE,
  end_date     DATE,
  approved     BOOLEAN
);

CREATE TABLE payroll (
  id           INT PRIMARY KEY,
  employee_id  INT REFERENCES employees(id),
  pay_period   DATE,
  gross        DECIMAL(12,2),
  deductions   DECIMAL(12,2),
  net          DECIMAL(12,2)
);`,
  },
];

export const QUERY_LANGUAGES = [
  { id: "postgresql", label: "PostgreSQL", icon: "🐘", category: "SQL" },
  { id: "mysql", label: "MySQL", icon: "🐬", category: "SQL" },
  { id: "sqlite", label: "SQLite", icon: "📦", category: "SQL" },
  { id: "mssql", label: "MS SQL Server", icon: "🪟", category: "SQL" },
  { id: "oracle", label: "Oracle SQL", icon: "🔴", category: "SQL" },
  { id: "mongodb", label: "MongoDB", icon: "🍃", category: "NoSQL" },
  { id: "redis", label: "Redis", icon: "⚡", category: "NoSQL" },
  { id: "cassandra", label: "Cassandra CQL", icon: "👁", category: "NoSQL" },
];
