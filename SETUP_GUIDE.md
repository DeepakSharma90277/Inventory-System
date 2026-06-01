# 📦 InvenTrack — Complete Setup & Deployment Guide
### For Windows Users (Beginner-Friendly)

---

## 🗂️ PROJECT STRUCTURE

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
├── docker-compose.yml           ← Runs all 3 services
├── .env                         ← Your environment variables
└── .gitignore
```

---

## STEP 1 — Install Docker Desktop

1. Go to https://www.docker.com/products/docker-desktop/
2. Download **Docker Desktop for Windows**
3. Run the installer (it may ask to restart your PC — that's normal)
4. After restart, open Docker Desktop and wait until it says **"Engine running"**

Verify in Command Prompt (cmd):
```
docker --version
docker compose version
```
Both should print version numbers. ✅

---

## STEP 2 — Run the Project with Docker

Open **Command Prompt** or **PowerShell** in the project folder:
```
cd path\to\inventory-system
```

Run everything with ONE command:
```
docker compose up --build
```

This will:
- Download PostgreSQL image
- Build your backend Python image
- Build your React frontend image
- Connect everything together

Wait until you see: `Application startup complete.`

### Access the app:
| Service     | URL                          |
|-------------|------------------------------|
| Frontend    | http://localhost:3000        |
| Backend API | http://localhost:8000        |
| API Docs    | http://localhost:8000/docs   |

To stop: Press `Ctrl+C`, then run `docker compose down`

---

## STEP 3 — Push Code to GitHub

1. Go to https://github.com and create a new repository called `inventory-system`
2. Copy the repository URL (e.g., `https://github.com/yourname/inventory-system.git`)

In your project folder:
```
git init
git add .
git commit -m "Initial commit - Inventory Management System"
git remote add origin https://github.com/yourname/inventory-system.git
git push -u origin main
```

---

## STEP 4 — Push Backend Image to Docker Hub

1. Sign up at https://hub.docker.com
2. Create a repository named `inventory-backend`

In your terminal:
```
docker login

docker build -t yourdockerhubusername/inventory-backend:latest ./backend

docker push yourdockerhubusername/inventory-backend:latest
```

Your Docker Hub image URL will be:
`https://hub.docker.com/r/yourdockerhubusername/inventory-backend`

---

## STEP 5 — Deploy Backend on Render (Free)

1. Go to https://render.com and sign up with GitHub
2. Click **New → Web Service**
3. Connect your GitHub repo
4. Configure:
   - **Name**: `inventory-backend`
   - **Root Directory**: `backend`
   - **Runtime**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

5. Add Environment Variables (click "Environment"):
   ```
   DATABASE_URL = postgresql://[Render will give you this from their DB service]
   ```

6. First create a **PostgreSQL database** on Render:
   - Click **New → PostgreSQL**
   - Name it `inventory-db`
   - After it's created, copy the **Internal Database URL**
   - Paste it as `DATABASE_URL` in your backend service

7. Click **Create Web Service**

Your backend URL will be: `https://inventory-backend-xxxx.onrender.com`

---

## STEP 6 — Deploy Frontend on Vercel (Free)

1. Go to https://vercel.com and sign up with GitHub
2. Click **New Project → Import** your GitHub repository
3. Configure:
   - **Framework**: Create React App
   - **Root Directory**: `frontend`
4. Add Environment Variable:
   ```
   REACT_APP_API_URL = https://inventory-backend-xxxx.onrender.com
   ```
   (Use the Render URL from Step 5)
5. Click **Deploy**

Your frontend URL will be: `https://inventory-system-xxxx.vercel.app`

---

## ✅ SUBMISSION CHECKLIST

- [ ] GitHub repository link
- [ ] Docker Hub image link: `https://hub.docker.com/r/yourusername/inventory-backend`
- [ ] Live frontend URL (Vercel): `https://your-app.vercel.app`
- [ ] Live backend API URL (Render): `https://your-api.onrender.com`
- [ ] Test that frontend can call backend on the deployed URLs

---

## 🔥 TEST YOUR API (Backend Docs)

Go to `http://localhost:8000/docs` — you'll see a Swagger UI where you can test every API endpoint directly in the browser!

---

## ❓ Common Problems & Fixes

**Docker says "port already in use"**
```
docker compose down
docker compose up --build
```

**Backend can't connect to database**
- Make sure Docker Desktop is running
- Wait a few seconds for PostgreSQL to start before backend starts
- The `depends_on: db: condition: service_healthy` in compose handles this automatically

**Frontend shows blank page or CORS error**
- Check that `REACT_APP_API_URL` in `.env` matches your backend URL
- For local: it should be `http://localhost:8000`
- For production: it should be your Render URL

**"npm not found" or "pip not found" errors inside Docker**
- These run INSIDE Docker — you don't need npm or pip installed on Windows
- Docker handles all of that!
