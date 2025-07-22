# 🚚 Truck Management Backend API

A NestJS-based backend API for managing trucks, drivers, clients, trips, and financial reports in a logistics system.

---

## 📁 Modules

- **Auth** — JWT-based login
- **Users** — Role-based users (Admin, Staff, Viewer)
- **Clients** — CRUD, view client trip history
- **Drivers** — CRUD, assign drivers to trips
- **Trucks** — CRUD, track availability & usage
- **Trips** — Manage trips, associate trucks & drivers
- **Reports** — Driver-wise, Truck-wise, Client-wise reports with filters

---

## 🛠️ Tech Stack

- **Node.js** + **NestJS**
- **PostgreSQL** (via Docker)
- **TypeORM**
- **JWT Auth**
- **Docker**
- **Postman / Swagger**

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone git@github.com:your-username/truck-management-backend.git
cd truck-management-backend


⚙️ Environment Setup
2. Create .env File
Create a .env file at the project root using this template:

⚠️ DO NOT commit your real .env to GitHub.

.env.example

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_db_username
DB_PASSWORD=your_db_password
DB_DATABASE=your_db_name

# JWT Configuration
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=24h

# App Config
PORT=3000
NODE_ENV=development

# TypeORM
TYPEORM_LOGGING=false


🐳 Docker Setup
3. PostgreSQL via Docker (Option 1)
Use this if you're not using docker-compose.

docker run --name truck-db \
  -e POSTGRES_DB=your_db_name \
  -e POSTGRES_USER=your_db_username \
  -e POSTGRES_PASSWORD=your_db_password \
  -p 5432:5432 \
  -d postgres


Or Use docker-compose (Recommended)
Create a file named docker-compose.yml:

version: '3.8'

services:
  postgres:
    image: postgres
    container_name: truck-db
    restart: always
    environment:
      POSTGRES_USER: your_db_username
      POSTGRES_PASSWORD: your_db_password
      POSTGRES_DB: your_db_name
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
 # Enable better logging
    command: ["postgres", "-c", "log_statement=all", "-c", "log_destination=stderr"]

  # Optional: pgAdmin for web-based database management
  pgadmin:
    image: dpage/pgadmin4:7
    restart: always
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@example.com
      PGLADMIN_DEFAULT_PASSWORD: admin
    ports:
      - '5050:80'
    depends_on:
      - postgres

volumes:
  postgres_data:

  Run:

  docker-compose up -d

📦 Install Dependencies

  npm install

🏃 Run the App

  # Dev mode
  npm run start:dev
  API runs at: http://localhost:3000