# PublicVoice Frontend

React + TypeScript frontend for the PublicVoice civic engagement platform.

## 🚀 Features

- Modern React 19 with TypeScript
- Responsive design with Tailwind CSS
- Multi-language support (English & Kinyarwanda)
- React Router for navigation
- Rwanda-focused civic engagement for citizens and local authorities
- **Report a problem**: Name, phone, location, category, and problem description (no login required)
- **Dashboard**: For administrators only—Login/Register is used by admins to access the dashboard of all reported problems. Citizens do not need an account to submit reports.

## 🔐 Authentication & access

- **Citizens**: Can report problems without creating an account or logging in. The report form collects name, phone number, location, category, and problem description.
- **Administrators**: Use **Login** (or **Register** for new admins) to access the dashboard where all reported problems are listed and managed. Only admin accounts can see the dashboard.

## 📋 Prerequisites

- Node.js 18 or higher
- pnpm (recommended) or npm

## 🛠️ Installation

### 1. Install pnpm (if not installed)

```bash
npm install -g pnpm
```

Or use npm if you prefer.

### 2. Navigate to Frontend directory

```bash
cd Public_Voice/Frontend
```

### 3. Install dependencies

```bash
pnpm install
```

Or with npm:
```bash
npm install
```

## 🏃 Running the Application

### Development mode

```bash
pnpm dev
```

Or with npm:
```bash
npm run dev
```

The application will be available at:
- **Local**: http://localhost:5173
- **Network**: Check terminal for network URL

### Build for production

```bash
pnpm build
```

Or with npm:
```bash
npm run build
```

The built files will be in the `dist/` directory.

### Preview production build

```bash
pnpm preview
```

Or with npm:
```bash
npm run preview
```

## 📁 Project Structure

```
Frontend/
├── public/              # Static assets
│   ├── home.jpg        # Images
│   └── vite.svg
├── src/
│   ├── Components/    # React components
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   ├── Pages/          # Page components
│   │   ├── Home.tsx
│   │   ├── About.tsx
│   │   ├── Services.tsx
│   │   ├── Contact.tsx
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   └── Report.tsx
│   ├── Routes/          # Routing configuration
│   │   └── approute.tsx
│   ├── contexts/        # React contexts
│   │   └── LanguageContext.tsx
│   ├── i18n/            # Internationalization
│   │   └── content.ts
│   ├── assets/          # Assets
│   ├── App.tsx          # Main app component
│   ├── main.tsx         # Entry point
│   └── index.css        # Global styles
├── index.html           # HTML template
├── package.json         # Dependencies
├── tsconfig.json        # TypeScript config
├── vite.config.ts      # Vite configuration
└── README.md           # This file
```

## 🎨 Tech Stack

- **React 19**: UI library
- **TypeScript**: Type safety
- **Vite**: Build tool and dev server
- **Tailwind CSS 4**: Utility-first CSS framework
- **React Router DOM**: Client-side routing
- **Lucide React**: Icon library

## 🌐 Internationalization (i18n)

The application supports multiple languages:
- English (default)
- Kinyarwanda

Language switching is available in the navbar. Translations are managed in `src/i18n/content.ts`.

### Adding a new language

1. Add the language type to `src/i18n/content.ts`
2. Add translations for all keys
3. Update the language switcher in `Navbar.tsx`

## 🎨 Color Scheme

The application uses a government-style blue color palette:
- **Primary Blue**: `#0066CC`
- **Darker Blue**: `#0052A3`
- **Accent Blue**: `#003D7A`
- **Text Dark**: `#1E293B`
- **Text Gray**: `#64748B`
- **Background**: White

## 📱 Responsive Design

The application is fully responsive:
- Mobile: Optimized for small screens
- Tablet: Adaptive layouts
- Desktop: Full-width with `w-11/12` container

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the Frontend directory for API configuration:

```env
VITE_API_URL=http://localhost:8000
VITE_APP_NAME=PublicVoice
```

Access in code:
```typescript
const apiUrl = import.meta.env.VITE_API_URL;
```

### Vite Configuration

Configuration is in `vite.config.ts`. The project uses:
- React plugin
- Tailwind CSS Vite plugin
- TypeScript support

## 📦 Available Scripts

- `pnpm dev`: Start development server
- `pnpm build`: Build for production
- `pnpm preview`: Preview production build
- `pnpm lint`: Run ESLint

## 🧪 Linting

```bash
pnpm lint
```

Or with npm:
```bash
npm run lint
```

## 🐛 Troubleshooting

### Port Already in Use

Change the port in `vite.config.ts` or use:
```bash
pnpm dev -- --port 3000
```

### Module Not Found

Clear cache and reinstall:
```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Build Errors

- Check TypeScript errors: `pnpm build`
- Verify all imports are correct
- Ensure all dependencies are installed

## 🔗 API Integration

Update the API base URL in your components:

```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
```

## 📝 Code Style

- Use TypeScript for type safety
- Follow React best practices
- Use functional components with hooks
- Keep components small and focused
- Use Tailwind CSS for styling

## 🚀 Deployment

### Build for production

```bash
pnpm build
```

### Deploy to Netlify/Vercel

1. Connect your repository
2. Set build command: `pnpm build`
3. Set publish directory: `dist`
4. Add environment variables if needed

### Deploy to static hosting

1. Run `pnpm build`
2. Upload `dist/` folder contents to your hosting service

## 📚 Documentation

- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [React Router Documentation](https://reactrouter.com/)

## 📝 License

This project is part of the PublicVoice capstone project.

## 👥 Contributors

PublicVoice Development Team
