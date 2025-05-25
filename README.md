#Vercel
https://vercel.com/jldelacruzs-projects/task-management
#server
cd server
node server.js

# Task-Management
CRUD Task using React + Vite and Material UI

#app
Node.js
https://nodejs.org
node -v

##Vite + React
npm create vite@latest task-manager -- --template React
npm install
npm run dev

-----------------------------------------------------------------------------------
npm install react react-dom
Installs React and React DOM to build and render your app in the browser.

npm install @mui/material @emotion/react @emotion/styled @mui/icons-material
Adds Material UI components, styling tools (Emotion), and icons for a nice, ready-made design system.

npm install axios
Installs Axios to easily make HTTP requests to your backend APIs.

npm install react-router-dom
Adds routing so your app can have multiple pages with URL navigation.

npm install @mui/material @emotion/react @emotion/styled
(Already included in #2) — Material UI and Emotion for styling your components.

-----------------------------------------------------------------------------------



##server

-----------------------------------------------------------------------------------
npm install express pg bcrypt jsonwebtoken cors dotenv multer

express – web framework
pg – PostgreSQL client
bcrypt – password hashing
jsonwebtoken – JWT issuance & verification
cors – enable cross-origin requests
dotenv – load environment variables
multer - middleware to handle file uploads (like images) in your Node.js backend easily.

-----------------------------------------------------------------------------------

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

