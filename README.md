# Collaborative Task Manager

Full-stack collaborative task management application with React frontend and Node.js backend.

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL database (Neon recommended)
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd Collaborative-Task-Manager
   ```

2. **Setup Backend**

   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env and add your DATABASE_URL
   npm run prisma:generate
   npm run prisma:push
   npm run dev
   ```

3. **Setup Frontend** (in new terminal)
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## 📁 Project Structure

```
Collaborative-Task-Manager/
├── backend/              # Node.js + Express + Prisma
│   ├── src/
│   │   ├── controllers/  # Business logic
│   │   ├── routes/       # API routes
│   │   ├── lib/          # Database (Prisma)
│   │   ├── config/       # Configuration
│   │   ├── middleware/   # Express middleware
│   │   ├── types/        # TypeScript types
│   │   ├── utils/        # Utilities
│   │   └── index.ts      # Server entry
│   ├── prisma/
│   │   └── schema.prisma
│   ├── .env
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/             # React + TypeScript + Vite
│   ├── src/
│   │   ├── components/
│   │   ├── assets/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── public/
│   ├── package.json
│   └── vite.config.ts
│
├── .gitignore
└── README.md
```

## 🛠️ Tech Stack

### Backend

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL (Neon)
- **ORM**: Prisma
- **Dev Tools**: tsx

### Frontend

- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: CSS

## 📜 Available Scripts

### Backend (in `/backend`)

```bash
npm run dev              # Start dev server with hot reload
npm run build           # Build for production
npm start               # Start production server
npm run prisma:generate # Generate Prisma Client
npm run prisma:push     # Push schema to database
npm run prisma:migrate  # Run migrations
npm run prisma:studio   # Open Prisma Studio
```

### Frontend (in `/frontend`)

```bash
npm run dev             # Start dev server
npm run build          # Build for production
npm run preview        # Preview production build
```

## 🗄️ Database Setup

### Using Neon PostgreSQL (Recommended)

1. Visit [neon.tech](https://neon.tech) and create account
2. Create new project
3. Copy connection string
4. Paste in `backend/.env`:
   ```env
   DATABASE_URL="postgresql://user:pass@ep-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require"
   ```

### Using Local PostgreSQL

```bash
createdb taskmanager
# Update backend/.env
DATABASE_URL="postgresql://localhost:5432/taskmanager"
```

## 🔧 Environment Variables

### Backend (`backend/.env`)

```env
DATABASE_URL="postgresql://..."
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

### Frontend

No environment variables required for basic setup.

## 📡 API Endpoints

### Backend API (http://localhost:3000)

- **GET** `/` - Hello World with database status
  ```json
  {
    "success": true,
    "message": "Hello World!",
    "database": "Connected"
  }
  ```

### Frontend (http://localhost:5173)

React application running on Vite dev server.

## 🚢 Deployment

### Backend

```bash
cd backend
npm run build
npm start
```

Set environment variables on hosting platform:

- `DATABASE_URL`
- `NODE_ENV=production`
- `PORT` (optional)

### Frontend

```bash
cd frontend
npm run build
# Deploy dist/ folder to hosting service
```

## 🔍 Troubleshooting

### Port already in use

```bash
# Windows (PowerShell)
$proc = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
if ($proc) { Stop-Process -Id $proc.OwningProcess -Force }

# Linux/Mac
lsof -ti:3000 | xargs kill
```

### Database connection failed

- Check `DATABASE_URL` in `backend/.env`
- Verify database is accessible
- Check firewall/network settings
- Ensure SSL mode is correct

### Prisma errors

```bash
cd backend
npm run prisma:generate
# Reset database (⚠️ destroys data)
npx prisma migrate reset
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit pull request

## 📄 License

ISC

## 🔗 Links

- [Express.js](https://expressjs.com/)
- [React](https://react.dev/)
- [Prisma](https://www.prisma.io/docs)
- [Vite](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Neon PostgreSQL](https://neon.tech)

---

**Need help?** Open an issue on GitHub.
