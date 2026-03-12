# Public Voice — Frontend

React + TypeScript frontend for the **Public Voice** civic engagement platform. Citizens register and log in with email and password (plus email OTP), submit and track reports; administrators manage and respond to reports from a dedicated dashboard.

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Install & Run](#install--run)
- [Configuration](#configuration)
- [Scripts](#scripts)
- [How the App Works](#how-the-app-works)
- [Project Structure](#project-structure)
- [Deployment (Netlify)](#deployment-netlify)
- [Technology](#technology)

---

## Prerequisites

- **Node.js** 18+
- **pnpm** (recommended) or npm

---

## Install & Run

```bash
cd Public_Voice/Frontend
pnpm install
```

**Development:**

```bash
pnpm dev
```

The app runs at **http://localhost:5173**. Ensure the [Backend](../Backend/README.md) is running (e.g. http://localhost:8000) and that `VITE_API_URL` points to it if you use a custom URL.

**Production build:**

```bash
pnpm build
```

Output is in **`dist/`**. Serve this folder with any static host (e.g. Netlify, Vercel).

**Preview production build locally:**

```bash
pnpm preview
```

---

## Configuration

Create a **`.env`** file in the `Frontend` directory (optional for local dev if the backend is on the same host and port):

```env
VITE_API_URL=http://127.0.0.1:8000
```

- **Development:** If unset, the app typically uses a default base URL (e.g. same origin or a default backend URL defined in the API client).
- **Production:** Set `VITE_API_URL` to your deployed backend URL (e.g. `https://public-voice1.onrender.com`) so all API requests go to the correct server.

Variable names must start with `VITE_` to be exposed to the client in Vite.

---

## Scripts

| Command | Description |
|--------|-------------|
| `pnpm dev` | Start development server (Vite). |
| `pnpm build` | TypeScript check + production build. |
| `pnpm preview` | Serve the production build locally. |
| `pnpm lint` | Run ESLint. |
| `pnpm test` | Run Vitest (watch). |
| `pnpm test:run` | Run Vitest once. |

---

## How the App Works

### Public routes

- **Home** (`/`) — Landing page.
- **Login** (`/login`) — Email + password; then 6-digit OTP sent to email; then redirect to dashboard (user or admin).
- **Register** (`/register`) — Full name, email, password → redirect to verify-email.
- **Verify email** (`/verify-email`) — Enter 6-digit code after registration (or from link with state).
- **Reset password** (`/reset-password`) — Request OTP → enter email + code + new password.
- **About, Contact, Services** — Static/info pages.

### Citizen (user) flows

- After login, redirect to **User dashboard** (`/user/dashboard`).
- **Submit issue** (`/user/submit`) — Report form (description can be in English or Kinyarwanda).
- **My issues** (`/user/issues`) — List of the user’s reports and status.
- **Issue detail** — View one report and admin response.
- **Profile** — Update name and avatar.

### Admin flows

- After login as admin, redirect to **Admin dashboard** (`/admin/dashboard`).
- **All issues** — List and filter all reports.
- **Respond** — Open a report, add response, update status.
- **Users** — List registered users (if enabled).

### Auth and API

- **AuthContext** stores token and user; provides `login(email, password)`, `loginVerifyOtp(email, code)`, `register(fullName, email, password)`, and password reset helpers.
- **API client** (e.g. Axios) sends `Authorization: Bearer <token>` for protected routes and uses `VITE_API_URL` as base URL.

---

## Project Structure

```
Frontend/
├── public/                 # Static assets
├── src/
│   ├── api/
│   │   └── client.ts       # Axios instance, base URL
│   ├── Components/         # Reusable UI (Navbar, Footer, ProtectedRoute, etc.)
│   ├── contexts/
│   │   ├── AuthContext.tsx # Auth state, login, register, OTP, reset password
│   │   └── LanguageContext.tsx
│   ├── i18n/
│   │   └── content.ts      # Translations (e.g. English, Kinyarwanda)
│   ├── Pages/
│   │   ├── Login.tsx       # Email + password, then OTP step
│   │   ├── Register.tsx   # Name, email, password → verify-email
│   │   ├── VerifyEmail.tsx # Enter OTP after registration
│   │   ├── ResetPassword.tsx
│   │   ├── Home.tsx, About.tsx, Contact.tsx, Services.tsx
│   │   ├── Report.tsx      # Standalone report page (if used)
│   │   └── Dashboard/
│   │       ├── user/       # User dashboard, submit issue, my issues, profile
│   │       └── admin/     # Admin dashboard, all issues, respond, users
│   ├── Routes/
│   │   └── approute.tsx    # React Router setup, protected routes
│   ├── App.tsx
│   └── main.tsx
├── .env.example            # Optional; VITE_API_URL
├── package.json
├── vite.config.ts
└── tsconfig.json
```

---

## Deployment (Netlify)

1. Connect your GitHub repository to [Netlify](https://netlify.com).
2. Set **Base directory** to `Frontend`.
3. **Build command:** `pnpm install && pnpm build`
4. **Publish directory:** `Frontend/dist`
5. **Environment variable:** `VITE_API_URL` = your production backend URL (e.g. `https://public-voice1.onrender.com`).

After deployment, ensure the backend’s `CORS_ORIGINS` includes your Netlify URL (e.g. `https://publicvoice1.netlify.app`).

---

## Technology

| Category | Stack |
|----------|--------|
| **Framework** | React 19 |
| **Language** | TypeScript |
| **Build** | Vite (Rolldown) |
| **Styling** | Tailwind CSS 4 |
| **Routing** | React Router DOM |
| **HTTP** | Axios |
| **Icons** | Lucide React |

For full platform documentation and backend setup, see the [main README](../README.md) and [Backend README](../Backend/README.md).
