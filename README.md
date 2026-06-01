# 📦 InvenTrack — Inventory Management System

A full-stack inventory management system built with FastAPI, React, and PostgreSQL. Supports product tracking, customer management, and order processing.

---

## 🚀 Live Demo

| Service | URL |
|---|---|
| Frontend | [https://inventory-system-seven-sepia.vercel.app](https://inventory-system-g541.vercel.app/) |
| Backend API | [https://inventory-backend-buhm.onrender.com](https://inventory-backend-buhm.onrender.com) |
| API Docs (Swagger) | [https://inventory-backend-buhm.onrender.com/docs](https://inventory-backend-buhm.onrender.com/docs) |

---

## 🐳 Docker Hub Images

| Image | Link |
|---|---|
| Backend | [ds90277/inventory-backend](https://hub.docker.com/r/ds90277/inventory-backend) |
| Frontend | [ds90277/inventory-frontend](https://hub.docker.com/r/ds90277/inventory-frontend) |

---

## 🗂️ Project Structure

```
inventory-system/
├── backend/
│   ├── app/
│   │   ├── main.py              ← FastAPI entry point
│   │   ├── core/database.py     ← PostgreSQL connection
│   │   ├── models/models.py     ← Database tables
│   │   ├── schemas/schemas.py   ← Data validation
│   │   └── routes/              ← API endpoints
│   │       ├── products.py
│   │       ├── customers.py
│   │       ├── orders.py
│   │       └── dashboard.py
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .dockerignore
├── frontend/
│   ├── src/
│   │   ├── App.js               ← Main app + routing
│   │   ├── App.css              ← All styles
│   │   ├── index.js
│   │   ├── pages/               ← Dashboard, Products, Customers, Orders
│   │   └── services/api.js      ← All API calls
│   ├── public/index.html
│   ├── package.json
│   ├── Dockerfile
│   ├── nginx.conf
│   └── .dockerignore
├── docker-compose.yml
├── .env
└── .gitignore
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Axios, React Router |
| Backend | FastAPI (Python) |
| Database | PostgreSQL |
| ORM | SQLAlchemy + Alembic |
| Containerization | Docker, Docker Compose |
| Backend Hosting | Render |
| Frontend Hosting | Vercel |
| Image Registry | Docker Hub |

---

## ⚙️ Features

- 📦 **Products** — Add, edit, delete products with stock tracking
- 👥 **Customers** — Manage customer records
- 📋 **Orders** — Create and manage orders linked to customers and products
- 📊 **Dashboard** — Overview of total products, customers, orders, and low stock alerts

---

## 🏃 Run Locally with Docker

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running

### Steps

1. Clone the repository:
```bash
git clone https://github.com/DeepakSharma90277/Inventory-System.git
cd Inventory-System
```

2. Create a `.env` file in the root folder:
```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=inventory_db
REACT_APP_API_URL=http://localhost:8000
```

3. Run with Docker Compose:
```bash
docker compose up --build
```

4. Access the app:

| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8000 |
| API Docs | http://localhost:8000/docs |

5. To stop:
```bash
docker compose down
```

---

## 🌐 Deployment

### Backend — Render
- Runtime: Python 3.11
- Build Command: `pip install -r requirements.txt`
- Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- Environment Variable: `DATABASE_URL` (PostgreSQL Internal URL from Render)

### Frontend — Vercel
- Framework: Create React App
- Root Directory: `frontend`
- Environment Variable: `REACT_APP_API_URL=https://inventory-backend-buhm.onrender.com`

### Docker Hub
```bash
# Pull images
docker pull ds90277/inventory-backend:latest
docker pull ds90277/inventory-frontend:latest
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/products` | Get all products |
| POST | `/products` | Create a product |
| PUT | `/products/{id}` | Update a product |
| DELETE | `/products/{id}` | Delete a product |
| GET | `/customers` | Get all customers |
| POST | `/customers` | Create a customer |
| DELETE | `/customers/{id}` | Delete a customer |
| GET | `/orders` | Get all orders |
| POST | `/orders` | Create an order |
| DELETE | `/orders/{id}` | Delete an order |
| GET | `/dashboard` | Get dashboard stats |

---

## ❓ Common Issues

**Port already in use**
```bash
docker compose down
docker compose up --build
```

**Backend can't connect to database**
- Make sure Docker Desktop is running
- Wait a few seconds for PostgreSQL to initialize

**Frontend shows blank page or CORS error**
- Check that `REACT_APP_API_URL` matches your backend URL
- Local: `http://localhost:8000`
- Production: your Render URL

---

## 👨‍💻 Author

**Deepak Sharma**
- GitHub: [@DeepakSharma90277](https://github.com/DeepakSharma90277)
- Docker Hub: [ds90277](https://hub.docker.com/u/ds90277)
