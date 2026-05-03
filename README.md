# Trackix

<p align="center">
  <strong>AI-powered expense and budget tracking with premium UX</strong>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#screenshots">Screenshots</a>
</p>

---

Trackix is a full-stack finance tracking application designed for users who want more than a spreadsheet. Built with Next.js and Express, it features real-time data visualizations, AI-driven insights, budget management, savings goals, and a polished dark-mode-ready interface with smooth animations.

## ✨ Features

### Dashboard & Analytics
- **Signal-rich overview** — Balance, income, expenses, and savings rate at a glance
- **Interactive charts** — Pie charts for category breakdown, line charts for trends
- **90-day spending heatmap** — Visualize spending patterns over time
- **Future projections** — AI-powered savings forecasts

### Financial Management
- **Transaction tracking** — Manual and categorized entries
- **Budget management** — Monthly envelopes with live utilization tracking
- **Savings goals** — Track targets with progress bars and AI-assisted pacing
- **Multi-currency support** — USD, EUR, RWF with mock FX rates

### AI Features
- **Weekly insights** — Automated financial health reports
- **Spending analysis** — AI-generated warnings and recommendations
- **Goal planning** — Smart monthly savings suggestions

### Security & Admin
- **JWT authentication** — Access + refresh token rotation
- **Role-based access** — Separate user and admin dashboards
- **Admin panel** — User lifecycle management (suspend, delete)
- **Activity logs** — Track admin actions

### UX/UI
- **Premium design** — Glass-morphism cards, layered animated backgrounds
- **Dark mode ready** — Full theming support
- **Smooth animations** — Framer Motion page transitions and micro-interactions
- **Loading states** — Visual feedback on all async actions

## 🛠 Tech Stack

### Backend
| Technology | Purpose |
|------------|---------|
| **Node.js** | Runtime |
| **Express** | API framework |
| **MongoDB + Mongoose** | Database & ODM |
| **JWT** | Authentication |
| **bcryptjs** | Password hashing |
| **cors + cookie-parser** | Security & sessions |

### Frontend
| Technology | Purpose |
|------------|---------|
| **Next.js 14** | React framework (App Router) |
| **TypeScript** | Type safety |
| **Tailwind CSS** | Styling |
| **Framer Motion** | Animations |
| **Recharts** | Data visualization |
| **Lucide React** | Icons |
| **Axios** | API client |
| **date-fns** | Date formatting |

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/trackix.git
cd trackix
```

2. **Setup Backend**
```bash
cd backend
cp .env.example .env
# Edit .env with your MongoDB URI and admin credentials
npm install
npm run dev
```

The API will start on `http://localhost:5000`

3. **Setup Frontend**
```bash
cd frontend
cp .env.local.example .env.local
# Set NEXT_PUBLIC_API_URL=http://localhost:5000/api
npm install
npm run dev
```

The app will run on `http://localhost:3000`

### Environment Variables

#### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/trackix
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
ADMIN_EMAIL=admin@trackix.com
ADMIN_PASSWORD=your-admin-password
```

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## 📸 Screenshots

| Dashboard | Transactions | Budgets |
|-----------|--------------|---------|
| ![Dashboard](/screenshots/dashboard.png) | ![Transactions](/screenshots/transactions.png) | ![Budgets](/screenshots/budgets.png) |

| Goals | AI Insights | Settings |
|-------|-------------|----------|
| ![Goals](/screenshots/goals.png) | ![AI](/screenshots/ai.png) | ![Settings](/screenshots/settings.png) |

## 🏗 Architecture

```
trackix/
├── backend/              # Express API
│   ├── config/          # Database config
│   ├── controllers/     # Route handlers
│   ├── middleware/      # Auth, validation
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API endpoints
│   ├── services/        # Business logic
│   └── utils/           # Helpers
│
├── frontend/            # Next.js App
│   ├── app/            # App Router pages
│   │   ├── (user)/     # User dashboard routes
│   │   ├── admin/      # Admin panel
│   │   └── login/      # Auth pages
│   ├── components/     # UI components
│   │   ├── ui/         # Button, Card, etc.
│   │   ├── layout/     # Navigation
│   │   └── visual/     # SceneBackground
│   ├── features/       # Auth provider, theme
│   ├── lib/            # API client, utilities
│   └── types/          # TypeScript definitions
```

## 🔌 API Overview

### Authentication
- `POST /api/auth/register` — Create account
- `POST /api/auth/login` — Authenticate
- `POST /api/auth/refresh` — Refresh token
- `POST /api/auth/logout` — Sign out

### Transactions
- `GET /api/transactions` — List all
- `POST /api/transactions` — Create
- `PATCH /api/transactions/:id` — Update
- `DELETE /api/transactions/:id` — Delete

### Dashboard
- `GET /api/dashboard/summary` — Financial summary
- `GET /api/dashboard/category-breakdown` — Pie chart data
- `GET /api/dashboard/monthly-trend` — Line chart data
- `GET /api/dashboard/heatmap` — Spending heatmap
- `GET /api/dashboard/projection` — Future projections

### Budgets & Goals
- `GET /api/budgets/usage` — Budget utilization
- `POST /api/budgets` — Create budget
- `GET /api/goals` — List goals
- `POST /api/goals` — Create goal
- `GET /api/goals/:id/savings-plan` — AI plan

### Admin
- `GET /api/admin/users` — List users
- `POST /api/admin/users/:id/suspend` — Suspend user
- `DELETE /api/admin/users/:id` — Delete user
- `GET /api/admin/logs` — Activity logs

## 🚢 Deployment

### Backend (Vercel/Railway/Render)
1. Set environment variables
2. Ensure MongoDB is accessible
3. Deploy with `npm start`

### Frontend (Vercel)
```bash
cd frontend
vercel --prod
```

Set `NEXT_PUBLIC_API_URL` to your deployed backend URL.

## 📝 Roadmap

- [ ] Real bank integrations (where APIs available)
- [ ] Export to PDF/Excel
- [ ] Recurring transactions
- [ ] Push notifications
- [ ] Mobile app (React Native)
- [ ] Multi-language support

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 🙏 Acknowledgments

- Design inspired by modern fintech applications
- Built as a portfolio project showcasing full-stack capabilities

---

<p align="center">
  Built with ❤️ by <a href="https://github.com/yourusername">Your Name</a>
</p>
