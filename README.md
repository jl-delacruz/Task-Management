# Task-Management
CRUD Task using React + Vite and Material UI

##server
npm install express pg bcrypt jsonwebtoken cors dotenv

express – web framework
pg – PostgreSQL client
bcrypt – password hashing
jsonwebtoken – JWT issuance & verification
cors – enable cross-origin requests
dotenv – load environment variables

##PostgreSQL
CREATE DATABASE myapp;
CREATE USER myuser WITH PASSWORD 'mypassword';
GRANT ALL PRIVILEGES ON DATABASE myapp TO myuser;

CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  parent_id INTEGER REFERENCES tasks(id) ON DELETE CASCADE, -- for subtasks
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  status TEXT DEFAULT 'Todo',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE subtasks (
  id SERIAL PRIMARY KEY,
  task_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'Todo',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
);

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


\c myapp
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO myuser;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO myuser;

