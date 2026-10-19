# CycleSense AI — AI-Powered Women's Menstrual Health Platform 🌸

> **AI & ML Engineering Capstone Project**  
> An intelligent, dignified, and evidence-backed menstrual health companion designed for cycle tracking, nuanced symptom awareness, PCOS education, and bilingual AI guidance in English and Bengali (বাংলা).

---

## 🌟 Overview

**CycleSense AI** is a modern health-tech web application built to empower women and adolescent girls with actionable, respectful, and clinically responsible insights about their menstrual cycles. Rather than presenting black-box predictions or making unfounded diagnostic claims, CycleSense AI focuses on:

1. **Empirical Cycle Science:** Distinguishing historical, recorded menstrual data from mathematical estimations with explicit uncertainty ranges (e.g. `±2 to 3 days`).
2. **Comprehensive Symptom Logging:** Daily journal tracking pelvic pain on a validated 0–10 scale alongside bleeding intensity, mood fluctuations, fatigue, acne, sleep quality, bloating, and hair changes.
3. **PCOS & Hormonal Education:** Accessible, culturally sensitive educational hub providing clear explanations of Polycystic Ovary Syndrome (PCOS), endometriosis, thyroid health, and red-flag symptoms that warrant clinical consultation.
4. **Bilingual AI Health Assistant:** Dual-language conversational health assistant capable of answering questions in English and Bengali (বাংলা), complete with source citations, response copy, feedback ratings, and simulated typing states.
5. **Privacy-First Architecture:** Clear separation of sensitive user logs, zero invasive ad-trackers, local storage persistence, and one-click data purge or export.

---

## 🎨 Design System

Crafted to embody a calming, feminine, professional health-tech aesthetic:

| Token | Color Code | Purpose |
| :--- | :--- | :--- |
| **Primary** | `#D96C91` (Muted Rose) | Brand identity, primary CTAs, active menstrual days |
| **Secondary** | `#B8A7E8` (Soft Lavender) | Secondary highlights, estimated cycle ranges, badges |
| **Canvas** | `#FFF9F7` (Warm Off-White) | Soothing background reducing eye strain |
| **Surface** | `#FFFFFF` (Pure White) | Card panels, modals, dropdown surfaces |
| **Text** | `#302536` (Deep Plum) | High-contrast, legible headings and body copy |
| **Accent** | `#F8DCCF` (Soft Peach) | Warm accents, light bleeding flow badges, highlights |
| **Success** | `#5F8D76` (Muted Sage) | Verified badges, regular cycles, confirmations |
| **Warning** | `#D97706` (Warm Amber) | Irregular cycle alerts, caution notices |

- **Typography:** `Inter` for crisp English typography, paired with `Hind Siliguri` for natural, legible Bengali text rendering.
- **Icons:** Standardized `lucide-react` iconography.

---

## 🚀 Key Features & Pages

### 1. Public Landing Page (`#landing`)
- High-converting hero section with dual-language toggle (`EN` / `বাং`).
- Live interactive interactive preview switcher for Dashboard, Calendar, and Insights.
- Feature grid detailing cycle forecasts, symptom diaries, and PCOS guidance.
- "How It Works" 3-step walkthrough and dedicated privacy shield section.

### 2. Authentication Prototype (`#auth_signin`, `#auth_signup`)
- Tabbed interface supporting Sign In, Sign Up, Forgot Password, Reset Password, and Email Verification.
- Form validation (name length, valid email syntax, minimum 8-character password with match confirmation).
- Password visibility toggle (`Eye` / `EyeOff`).
- Explicit privacy consent checkbox for sensitive health data.
- Transparent demo disclaimer clarifying client-side prototype behavior.

### 3. Dashboard (`#dashboard`)
- Personalized greeting with cycle day counter based on latest period logs.
- Next period forecast card featuring uncertainty intervals (e.g., `±2.0 days`) and estimated cycle phases (Follicular, Ovulation, Luteal, Menstrual).
- Quick action pills: **Log Period**, **Log Symptoms**, **View Insights**, and **Ask AI**.
- Interactive monthly cycle history bar chart and 14-day symptom severity trend area chart.
- Curated educational reading cards and user-configurable health reminders.
- Robust empty states with direct call-to-actions when no logs exist.

### 4. Interactive Period Calendar (`#calendar`)
- Monthly calendar grid with functional forward/back navigation and year wraparound.
- "Today" quick-jump button to instantly re-center the view.
- Color-coded day markers distinguishing recorded period days (`rose-500`), estimated upcoming period dates (`lavender-400` dashed ring), and current date (`ring-plum`).
- Date selection sidebar providing detailed status for the active day with instant Add/Edit actions.
- **Recorded Cycles History Table:** Comprehensive data management table listing all logged cycles with dates, duration, flow intensity, notes, inline **Edit** (opens modal pre-filled), and **Delete** actions.
- **Period Logger Modal:** Reusable dialog supporting both Create and Edit modes, flow intensity buttons (`light`, `medium`, `heavy`), date range picker with validation, notes field, `Escape` key and backdrop dismiss, and inline cycle deletion.

### 5. Daily Symptom Tracker (`#symptoms`)
- Interactive date picker and quick-jump shortcuts (Today, Yesterday).
- Pelvic pain / cramps 0–10 numeric slider with dynamic color-coded severity labels (Mild, Moderate, Severe).
- Flow intensity selector (`None`, `Light`, `Medium`, `Heavy`).
- Mood badge selector (`Calm`, `Happy`, `Anxious`, `Sad`, `Irritable`, `Exhausted`) fully localized in English and Bengali.
- Multi-symptom toggle cards for Acne, Bloating, Fatigue, Headache, and Sleep Quality.
- Personal journal notes textarea.
- Persistent recent logs history table with inline Edit and Delete operations.

### 6. Cycle Insights & Trends (`#insights`)
- Statistical summary cards: Average Cycle Length, Cycle Variation (standard deviation), and Period Duration.
- Algorithmic Regularity status badge (`Regular`, `Mild Variation`, `Irregular`, `Insufficient Data`).
- **Notable Patterns section:** Automatic algorithmic observations (e.g. cramps frequency across past cycles, flow patterns).
- Visual charts: Historical cycle length trend line and period bleeding duration bar charts with clear **Demo Dataset** annotations.

### 7. PCOS & Women's Health Education (`#education`)
- Filterable knowledge base spanning 10 medical categories (PCOS, Irregular Periods, Painful Periods, Heavy Bleeding, PMS, Endometriosis, Thyroid Health, Anemia, Menstrual Hygiene, Medical Consultations).
- Search bar with live title and summary filtering.
- Article reading modal with structured sections: Overview, Symptoms, When to See a Doctor, and Verifiable Medical Sources (ACOG, WHO, NHS, Endocrine Society).
- Transparent reviewer credentials disclaimer.

### 8. AI Health Assistant (`#aiAssistant`)
- Conversational chat interface available as a full page and a global floating slide-over drawer (`ChatDrawer`).
- Pre-configured prompt chips for frequent questions.
- Dual-language medical NLP responses (English & Bengali) with source citations.
- Simulated real-time typing indicator (`isAssistantTyping`).
- Response actions: One-click clipboard copy (`Copied!`), helpfulness rating (`thumbs-up` / `thumbs-down`), and chat history clearing.

### 9. Health Reports (`#reports`)
- Consultation-ready summary document summarizing user cycle metrics, regularity, and recent pain trends.
- One-click native browser print / PDF export trigger.
- Data tables of recent cycle and symptom logs with clean empty state handling.

### 10. Profile, Privacy & Settings (`#profile`, `#settings`)
- User preferences: cycle length baseline, period duration defaults, and preferred language.
- Privacy Mode toggle that blurs sensitive cycle statistics on screen during public use.
- Data Management controls: **Reset to Demo Data** and **Erase All Health Data**.
- Client-side prototype notice detailing browser `localStorage` storage model.

---

## 🛠️ Tech Stack & Architecture

- **Frontend Core:** React 18 (TypeScript), Vite 6
- **Styling:** Tailwind CSS with custom health-tech color palette and typography tokens
- **Data Visualizations:** Recharts (ResponsiveContainer, BarChart, AreaChart, Tooltip)
- **Icons:** Lucide React
- **Date Utilities:** `date-fns` for leap year handling, cycle intervals, and ISO parsing
- **State Management:** React Context API (`AppContext`) with bidirectional `window.location.hash` routing and `localStorage` synchronization
- **Internationalization:** Built-in dictionary system (`src/data/translations.ts`) covering all navigation, dashboard, calendar, symptom, and assistant interactions in English (`en`) and Bengali (`bn`).

---

## 📁 Project Structure

```
c:\Users\User\Desktop\CycleSense AI\
├── index.html                      # HTML entry with Hind Siliguri & Inter fonts
├── package.json                    # Dependencies & build scripts
├── postcss.config.js               # PostCSS plugins
├── tailwind.config.js              # Custom color palette & typography tokens
├── tsconfig.json                   # TypeScript compiler options
├── vite.config.ts                  # Vite build bundler configuration
└── src/
    ├── main.tsx                    # React DOM entry point
    ├── App.tsx                     # Main application shell & view router
    ├── index.css                   # Global styles & Tailwind base
    ├── types/                      # TypeScript definitions (Cycle, Symptom, User, etc.)
    │   └── index.ts
    ├── context/                    # Central application state & localStorage sync
    │   └── AppContext.tsx
    ├── data/                       # Initial datasets & bilingual dictionaries
    │   ├── mockUserData.ts
    │   ├── mockChatResponses.ts
    │   ├── educationalArticles.ts
    │   └── translations.ts
    ├── utils/                      # Menstrual cycle algorithms & date helpers
    │   └── cycleCalculations.ts
    ├── components/
    │   ├── common/                 # Header, Sidebar, BottomNav, Button, Badge, Modal, Banner
    │   ├── cycle/                  # PeriodLoggerModal, CyclePhaseRing
    │   └── chat/                   # Floating ChatDrawer with simulated AI typing
    ├── pages/                      # 11 distinct application views
    │   ├── LandingPage.tsx
    │   ├── AuthPage.tsx
    │   ├── DashboardPage.tsx
    │   ├── PeriodCalendarPage.tsx
    │   ├── SymptomTrackerPage.tsx
    │   ├── CycleInsightsPage.tsx
    │   ├── PcosEducationPage.tsx
    │   ├── AiAssistantPage.tsx
    │   ├── HealthReportsPage.tsx
    │   ├── ProfilePrivacyPage.tsx
    │   └── SettingsPage.tsx
    └── services/
        └── api.ts                  # Typed client service layer connecting React to FastAPI
backend/
├── .env.example                    # Template environment variables
├── .env                            # Active runtime environment configuration
├── requirements.txt                # Python backend dependencies
├── alembic.ini                     # Alembic migration configuration
├── alembic/
│   ├── env.py                      # Migration environment with batch rendering support
│   └── versions/
│       └── 7fd5ad377799_initial_schema.py # Initial database migration
├── app/
│   ├── __init__.py
│   ├── main.py                     # FastAPI entrypoint, lifespan, CORS & exception handlers
│   ├── config.py                   # Environment settings & Pydantic BaseSettings
│   ├── database.py                 # SQLAlchemy engine, sessionmaker & Base
│   ├── dependencies.py             # JWT bearer authentication & user injection
│   ├── models/                     # SQLAlchemy ORM models (User, PeriodCycle, DailySymptom, Article)
│   ├── schemas/                    # Pydantic v2 validation models
│   ├── routers/                    # Modular API route controllers
│   │   ├── auth.py                 # /api/auth (register, login, me)
│   │   ├── users.py                # /api/users (profile, export, delete account)
│   │   ├── periods.py              # /api/cycles (CRUD, stats, prediction)
│   │   ├── symptoms.py             # /api/symptoms (daily log upsert, CRUD)
│   │   ├── articles.py             # /api/education/articles (search, category filter)
│   │   └── reports.py              # /api/reports/summary (consultation summary)
│   └── services/                   # Analytics, auth hashing, seed data
└── tests/                          # 21 automated pytest integration test cases
    ├── conftest.py                 # Isolated test database & JWT test fixtures
    ├── test_auth.py                # Registration, validation, bcrypt check, login
    ├── test_periods.py             # Cycle CRUD, date order validation, stats, predictions
    ├── test_symptoms.py            # Daily symptom CRUD, 0-10 validation, upsert
    ├── test_isolation.py           # IDOR & multi-tenant security verification
    ├── test_export_delete.py       # GDPR export & cascading account deletion
    └── test_education_and_reports.py # Article filtering, sources & consultation reports
```

---

## 🔌 API Endpoints Reference

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new user with bcrypt password hashing | No |
| `POST` | `/api/auth/login` | Authenticate with email/password; returns JWT | No |
| `GET` | `/api/auth/me` | Fetch currently authenticated user profile | Bearer JWT |
| `GET` | `/api/users/profile` | Get user settings and cycle baseline | Bearer JWT |
| `PUT` | `/api/users/profile` | Update preferences (cycle length, privacy mode) | Bearer JWT |
| `POST` | `/api/users/change-password` | Verify current password and set new password | Bearer JWT |
| `GET` | `/api/users/export` | Complete JSON export of all user data (GDPR) | Bearer JWT |
| `DELETE` | `/api/users/account` | Permanently erase user account and all health records | Bearer JWT |
| `GET` | `/api/cycles` | List logged period cycles (user-scoped) | Bearer JWT |
| `POST` | `/api/cycles` | Create period record with start/end date and flow | Bearer JWT |
| `PUT` | `/api/cycles/{id}` | Update period record (IDOR protected) | Bearer JWT |
| `DELETE` | `/api/cycles/{id}` | Delete period record (IDOR protected) | Bearer JWT |
| `GET` | `/api/cycles/stats` | Calculate cycle length average, variation & regularity | Bearer JWT |
| `GET` | `/api/cycles/prediction` | Calculate next period forecast with uncertainty interval | Bearer JWT |
| `GET` | `/api/symptoms` | List daily symptom logs (optional `?date=YYYY-MM-DD`) | Bearer JWT |
| `POST` | `/api/symptoms` | Log or upsert daily symptoms (0–10 pain scale) | Bearer JWT |
| `PUT` | `/api/symptoms/{id}` | Update symptom entry (IDOR protected) | Bearer JWT |
| `DELETE` | `/api/symptoms/{id}` | Delete symptom entry (IDOR protected) | Bearer JWT |
| `GET` | `/api/education/articles` | List evidence-backed articles (`?category=`, `?q=`) | No |
| `GET` | `/api/education/articles/{id}` | Fetch full article with verified medical source links | No |
| `GET` | `/api/reports/summary` | Aggregated consultation report for physician reviews | Bearer JWT |
| `GET` | `/docs` | Interactive Swagger UI API documentation | No |
| `GET` | `/health` | API operational and environment health check | No |

---

## 💻 Getting Started

### 1. Frontend Setup
```bash
# Navigate to project root
cd "c:\Users\User\Desktop\CycleSense AI"

# Install Node dependencies
npm install

# Start Vite development server
npm run dev
# Running at http://localhost:5173
```

### 2. Backend Setup
```bash
# Activate Python virtual environment
cd "c:\Users\User\Desktop\CycleSense AI\backend"
.\venv\Scripts\activate

# Install Python dependencies
pip install -r requirements.txt

# Run Alembic database migrations
alembic upgrade head

# Start FastAPI server
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
# Running at http://localhost:8000 (Swagger docs at http://localhost:8000/docs)
```

### 3. Run Automated Pytest Suite
```bash
cd "c:\Users\User\Desktop\CycleSense AI\backend"
.\venv\Scripts\pytest.exe -v
# Verified: 21 passed in 26.14s
```

---

## 🔒 Security & Medical Privacy Architecture

1. **Bcrypt Password Hashing:** Plaintext passwords are never stored. Passwords are salted and hashed using `passlib` with `bcrypt`.
2. **User-Scoped Isolation & IDOR Protection:** Every query for period cycles and daily symptoms explicitly filters by `user_id == current_user.id`. Direct object references for unauthorized records yield `404 Not Found`.
3. **Cascading Data Purge:** Invoking `DELETE /api/users/account` permanently deletes the user and automatically removes all associated period cycles and symptom entries. Zero orphaned health records remain.
4. **Environment Isolation:** Sensitive secrets (`SECRET_KEY`, `DATABASE_URL`) are isolated in `backend/.env` and excluded from source control.
5. **CORS Restrictions:** FastAPI `CORSMiddleware` restricts cross-origin resource requests to authorized frontend origins (`http://localhost:5173`, etc.).
6. **Clinical Disclaimers:** All responses, forecasts, and reports clearly communicate that cycle predictions are mathematical estimates (`±2 to 3 days`) and not clinical diagnoses.

---

## ⚙️ Manual Configuration Guide for Production / PostgreSQL

To transition from the default local SQLite development database to a production PostgreSQL database:
1. Install and start PostgreSQL.
2. Create a database: `CREATE DATABASE cyclesense_db;`
3. Edit `backend/.env`:
   ```ini
   DATABASE_URL=postgresql://<username>:<password>@localhost:5432/cyclesense_db
   SECRET_KEY=<generate_with_openssl_rand_hex_32>
   ENVIRONMENT=production
   DEBUG=False
   ```
4. Run Alembic migrations against PostgreSQL:
   ```bash
   alembic upgrade head
   ```

---

## 📄 License
This project is developed for educational and portfolio demonstration purposes as part of an **AI & ML Engineering Capstone**.
