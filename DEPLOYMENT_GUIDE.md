# CycleSense AI — Vercel Deployment Guide 🚀

This guide provides step-by-step instructions for deploying **CycleSense AI** to [Vercel](https://vercel.com) directly from your GitHub repository:
`https://github.com/nazrana-nahreen/CycleSense-AI.git`

---

## 📁 Deployment Files Created in the Repository

| File | Purpose |
| :--- | :--- |
| **[`vercel.json`](file:///c:/Users/User/Desktop/CycleSense%20AI/vercel.json)** | Configures Single Page Application (SPA) routing, so refreshing any page or direct URL rewrite back to `/index.html`, plus CDN caching headers for assets and images. |
| **[`.vercelignore`](file:///c:/Users/User/Desktop/CycleSense%20AI/.vercelignore)** | Tells Vercel to ignore backend files, virtual environments, database files, and caches to keep build times ultra-fast. |
| **[`vite.config.ts`](file:///c:/Users/User/Desktop/CycleSense%20AI/vite.config.ts)** | Optimized with smart vendor code splitting (`vendor-charts`, `vendor-icons`), reducing bundle size and speeding up load times on mobile. |
| **[`.env.example`](file:///c:/Users/User/Desktop/CycleSense%20AI/.env.example)** | Documents the optional `VITE_API_BASE_URL` environment variable. |

---

## ⚡ Method 1: Deploy via Vercel Dashboard (Recommended — 2 Minutes)

### Step 1: Sign Up or Log In to Vercel
1. Go to [https://vercel.com](https://vercel.com).
2. Click **Log In** or **Sign Up** and choose **Continue with GitHub**.

---

### Step 2: Import Your GitHub Repository
1. On your Vercel Dashboard, click the **"Add New..."** button and select **Project**.
2. Under "Import Git Repository", find **`nazrana-nahreen/CycleSense-AI`**.
   *(If you don't see it, click "Adjust GitHub App Permissions" and grant access to the repository).*
3. Click **Import**.

---

### Step 3: Configure Project Settings
Vercel automatically detects the Vite configuration:

- **Project Name:** `cyclesense-ai` (or your preferred name)
- **Framework Preset:** `Vite` (detected automatically)
- **Root Directory:** `./` (default)
- **Build Command:** `npm run build` (detected automatically)
- **Output Directory:** `dist` (detected automatically)
- **Install Command:** `npm install` (detected automatically)

---

### Step 4 (Optional): Environment Variables
- If using **Standalone / Demo / Portfolio Mode** (recommended):
  Leave Environment Variables empty! The app uses local storage and instant client-side prediction calculations so everything (calendar, symptoms tracker, mental health journal, box breathing, and reports) runs 100% interactively without requiring any server.
- If connecting to a live FastAPI backend:
  Add an environment variable:
  - **Key:** `VITE_API_BASE_URL`
  - **Value:** `https://your-backend-api.onrender.com` (your deployed backend URL)

---

### Step 5: Click Deploy
1. Click the blue **Deploy** button.
2. Vercel will install dependencies, compile the TypeScript code with Vite, and deploy it to their worldwide edge network.
3. In under 1 minute, you will see confetti and receive your live URL:
   `https://cyclesense-ai.vercel.app` (or similar).

---

## 💻 Method 2: Deploy via Vercel CLI (From Terminal)

If you prefer deploying directly from your computer's terminal:

1. Open PowerShell or Command Prompt in your project directory:
   ```bash
   cd "c:\Users\User\Desktop\CycleSense AI"
   ```

2. Run Vercel CLI:
   ```bash
   npx vercel
   ```

3. Follow the interactive prompts:
   - *Set up and deploy?* **`y`**
   - *Which scope?* (Select your Vercel username/team)
   - *Link to existing project?* **`n`**
   - *What's your project's name?* **`cyclesense-ai`**
   - *In which directory is your code located?* **`./`**
   - *Want to modify these settings?* **`n`**

4. To deploy directly to production:
   ```bash
   npx vercel --prod
   ```

---

## 🔄 Automatic Continuous Deployment (CI/CD)

Whenever you push new changes to GitHub (`git push origin main`), Vercel will **automatically trigger a new build** and deploy the update in seconds.

---

## 🛠️ Deploying the FastAPI Backend (Optional)

If you wish to deploy the Python FastAPI backend (`backend/`) with persistent SQLite or PostgreSQL:
1. Go to [Render.com](https://render.com) or [Railway.app](https://railway.app).
2. Connect your `CycleSense-AI` repository.
3. Set **Root Directory** to `backend`.
4. Set **Build Command** to `pip install -r requirements.txt`.
5. Set **Start Command** to `uvicorn app.main:app --host 0.0.0.0 --port 10000`.
6. Once deployed, copy your Render URL (e.g. `https://cyclesense-backend.onrender.com`) and paste it as `VITE_API_BASE_URL` in your Vercel Project Settings > Environment Variables!
