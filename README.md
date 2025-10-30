e# BookIt: Travel Experience Booking Platform

A fullstack web application for booking travel experiences with React + TypeScript frontend and Node.js + Express backend.

## Prerequisites

- **Node.js** (v18+) - [Download](https://nodejs.org/)
- **MongoDB** - Local or [MongoDB Atlas](https://www.mongodb.com/atlas)
- **Git** - [Download](https://git-scm.com/)

## Quick Start

### 1. Clone & Install
```bash
git clone <repository-url>
cd booklit

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Database Setup

**Local MongoDB:**
- Install and start MongoDB
- App connects to `mongodb://localhost:27017/bookit`

**MongoDB Atlas:**
- Create cluster and get connection string
- Create `backend/.env`:
```
MONGODB_URI=your_connection_string_here
```

### 3. Run Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Runs on: http://localhost:5000

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Runs on: http://localhost:5173

## Features

- Browse travel experiences
- View details and select time slots
- Booking with promo codes (SAVE10, FLAT100)
- Responsive design
- Real-time availability

## API Endpoints

- `GET /api/experiences` - List experiences
- `GET /api/experiences/:id` - Get experience details
- `POST /api/bookings` - Create booking
- `POST /api/promo/validate` - Validate promo codes

## Tech Stack

**Frontend:** React 19, TypeScript, Vite, TailwindCSS, React Router
**Backend:** Node.js, Express, MongoDB, Mongoose

## Project Structure

```
booklit/
├── backend/
│   ├── server.js
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── types/
│   └── package.json
└── README.md
```

## Troubleshooting

- **MongoDB Issues:** Ensure MongoDB is running or check Atlas connection
- **Port Conflicts:** Backend uses 5000, frontend uses 5173
- **CORS Issues:** Check browser console for errors

## Deployment

Update API URL in `frontend/src/services/api.ts` for production.

**Recommended Platforms:**
- Frontend: Vercel, Netlify
- Backend: Railway, Render
- Database: MongoDB Atlas