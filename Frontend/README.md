# PublicVoice Frontend

## Description

React + TypeScript frontend for **PublicVoice**, a civic engagement platform for Rwanda. Citizens report community issues, view and track their reports, and switch language (English / Kinyarwanda). Admins manage and respond to reports. Built with React 19, Vite, Tailwind CSS, and React Router.

**Tools:** React 19, TypeScript, Vite, Tailwind CSS 4, React Router DOM, Axios, Lucide React.

---

## GitHub Repository

- **Repo:** [Add your GitHub repo link here]
- Example: `https://github.com/your-username/Public_Voice`

---

## How to Set Up the Environment and the Project

### Prerequisites

- Node.js 18+
- pnpm or npm

### Setup

```bash
cd Public_Voice/Frontend
pnpm install
```

Or use `npm install`.

### Environment (optional)

Create `.env` in the Frontend folder:

```env
VITE_API_URL=http://127.0.0.1:8000
```

If not set, the app uses `http://127.0.0.1:8000`. Ensure the backend is running.

### Run

```bash
pnpm dev
```

- **App:** http://localhost:5173

### Build (production)

```bash
pnpm build
```

Output: `dist/`

---

## Designs

- **Figma mockups / wireframes:** [Add link or path to your Figma file or docs/wireframes]
- **Screenshots of app interfaces:** [Add path e.g. docs/screenshots or embed images]

Key screens: Home, Login, Register, Report, User Dashboard (overview, Submit Issue, My Issues, Issue detail, Profile), Admin Dashboard (stats, All Issues, Respond, Users), language switcher (EN/RW).

---

## Deployment Plan (Netlify)

1. Connect the GitHub repo to **Netlify**.
2. **Build command:** `pnpm build` or `npm run build`.
3. **Publish directory:** `dist`.
4. **Base directory:** `Frontend` (if repo root is above Frontend).
5. **Environment variables:** Set `VITE_API_URL` to your production API URL (e.g. your Render backend URL).
6. **Redirects:** SPA routing is in `netlify.toml` (all routes to index.html).

After deployment, set the backend CORS_ORIGINS to your Netlify URL.
