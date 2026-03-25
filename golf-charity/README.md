# Golf Charity Subscription Platform 🏌️

This is a complete, production-ready Full Stack Web Application that handles user subscriptions, golf Stableford score tracking, monthly lottery draws, charity support, and winner verifications.

## 📂 Project Structure

```
/golf-charity
├── /backend                 # Node.js + Express Backend
│   ├── /controllers         # Core business logic
│   ├── /middleware          # JWT auth middleware
│   ├── /routes              # API routing logic
│   ├── .env                 # Backend environment variables
│   ├── server.js            # Main express server
│   ├── supabase.js          # Supabase Postgres Client DB connection
│   └── package.json         # Backend dependencies
│
├── /frontend                # React (Vite) + Tailwind CSS Frontend
│   ├── /src
│   │   ├── /components      # Reusable UI (Navbar, etc)
│   │   ├── /contexts        # Globally accessible states (AuthContext)
│   │   ├── /pages           # App views (Home, Dashboards, Charities, etc.)
│   │   ├── /services        # Axios HTTP client
│   │   ├── App.jsx          # React Router
│   │   └── index.css        # Tailwind Base
│   ├── tailwind.config.js   # Tailwind configurations
│   └── package.json         # Frontend dependencies
│
└── /database
    └── schema.sql           # Complete Supabase PostgreSQL Schema
```

## ⚙️ Environment Variables Setup

### Backend (`/backend/.env`)
```env
PORT=5000
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
JWT_SECRET=your_super_secret_jwt_key
```

### Frontend (`/frontend/.env`)
```env
VITE_API_URL=https://your-backend-render-url.onrender.com/api
```

## 🚀 Deployment Guide

### 1. Database Deployment (Supabase)
1. Go to [Supabase](https://supabase.com/) and create a new project.
2. Navigate to **SQL Editor** in the left sidebar.
3. Copy the contents of `/database/schema.sql` and click **RUN**. This sets up all tables and relationships.
4. Go to **Project Settings > API** to find your `Project URL` and `service_role secret`. Put these in your backend `.env`.

### 2. Backend Deployment (Render)
1. Push your `/backend` directory to a GitHub repository.
2. Go to [Render](https://render.com/) and create a new **Web Service**.
3. Connect your GitHub repository.
4. Set the **Root Directory** to `backend`.
5. Set the **Build Command** to `npm install`.
6. Set the **Start Command** to `node server.js`.
7. Add the **Environment Variables** (PORT, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, JWT_SECRET).
8. Click **Deploy**. Once successfully deployed, copy the API URL for the frontend.

### 3. Frontend Deployment (Vercel)
1. Push your `/frontend` directory to a GitHub repository.
2. Go to [Vercel](https://vercel.com/) and create a new **Project**.
3. Connect your GitHub repository and import the frontend project.
4. The framework preset should automatically detect `Vite`.
5. Add the **Environment Variables**:
   - `VITE_API_URL`: The URL you got from Render appending `/api` (e.g. `https://my-backend.onrender.com/api`).
6. Click **Deploy**. Your frontend is now live.

## 🔑 Sample Test Credentials

To test the role-based system:

**Admin User**
- **Email:** `admin@golfcharity.com`
- **Password:** `admin123`
*(Note: To make an account an admin, you can register it normally on the frontend, then manually go to Supabase Table Editor -> Users, and change the `role` field from `user` to `admin`.)*

**Regular User**
- **Email:** `player@example.com`
- **Password:** `player123`

## 🛠️ Tech Stack Employed
- **Frontend Framework**: React using Vite
- **Styling**: Tailwind CSS
- **Network**: Axios
- **Icons**: Lucide React
- **Backend**: Node.js, Express.js
- **Authentication**: JWT & bcrypt
- **Database**: PostgreSQL (provided by Supabase)
