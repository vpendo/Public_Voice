# PublicVoice Frontend

React + TypeScript frontend for PublicVoice civic engagement platform.

---

## Install and Run

### Prerequisites

- Node.js 18+
- pnpm (or npm)

### Setup

```bash
cd Public_Voice/Frontend
pnpm install
```

### Configuration

**Optional:** Create `.env` file:

```env
VITE_API_URL=http://127.0.0.1:8000
```

### Run Development Server

```bash
pnpm dev
```

App runs at: **http://localhost:5173**

### Build for Production

```bash
pnpm build
```

Output: `dist/` folder

---

## Project Structure

```
Frontend/
├── src/
│   ├── Components/     # Reusable components
│   ├── Pages/          # Page components
│   ├── Routes/         # Routing configuration
│   ├── contexts/       # React contexts (Auth, Language)
│   ├── api/            # API client configuration
│   └── i18n/           # Language translations
├── public/             # Static assets
└── package.json
```

---

## Deployment (Netlify)

1. Connect GitHub repository to Netlify
2. Set base directory: `Frontend`
3. Build command: `pnpm install && pnpm build`
4. Publish directory: `Frontend/dist`
5. Set environment variable: `VITE_API_URL` (production backend URL)

---

## Technology

- React 19
- TypeScript
- Vite
- Tailwind CSS 4
- React Router DOM
- Axios
- Lucide React
