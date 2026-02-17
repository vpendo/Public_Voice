import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navbar } from '../Components/Navbar';
import { Footer } from '../Components/Footer';
import { ProtectedRoute } from '../Components/ProtectedRoute';
import { RedirectAdminToAdmin } from '../Components/RedirectAdminToAdmin';
import { content } from '../i18n/content';
import type { Language } from '../i18n/content';
import { LanguageProvider } from '../contexts/LanguageContext';
import { AuthProvider } from '../contexts/AuthContext';
import Home from '../Pages/Home';
import About from '../Pages/About';
import Contact from '../Pages/Contact';
import Services from '../Pages/Services';
import Login from '../Pages/Login';
import Register from '../Pages/Register';
import ResetPassword from '../Pages/ResetPassword';
import Report from '../Pages/Report';
import { UserDashboardLayout } from '../Pages/Dashboard/user/UserDashboardLayout';
import { UserDashboard } from '../Pages/Dashboard/user/UserDashboard';
import { SubmitIssue } from '../Pages/Dashboard/user/SubmitIssue';
import { MyIssues } from '../Pages/Dashboard/user/MyIssues';
import { IssueDetail } from '../Pages/Dashboard/user/IssueDetail';
import { Profile } from '../Pages/Dashboard/user/Profile';
import { AdminDashboardLayout } from '../Pages/Dashboard/admin/AdminDashboardLayout';
import { AdminDashboard } from '../Pages/Dashboard/admin/AdminDashboard';
import { AllIssues } from '../Pages/Dashboard/admin/AllIssues';
import { RespondList } from '../Pages/Dashboard/admin/RespondList';
import { Respond } from '../Pages/Dashboard/admin/Respond';
import { Users } from '../Pages/Dashboard/admin/Users';

function DashboardRedirect() {
  const { isAdmin, isLoadingUser } = useAuth();
  if (isLoadingUser) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><p className="text-slate-500">Loading...</p></div>;
  return <Navigate to={isAdmin ? '/admin/dashboard' : '/user/dashboard'} replace />;
}

function AppLayout({ children, lang, setLang }: { children: React.ReactNode; lang: Language; setLang: (lang: Language) => void }) {
  const location = useLocation();
  const path = location.pathname;
  const hideNavFooter =
    path === '/login' ||
    path === '/register' ||
    path === '/reset-password' ||
    path.startsWith('/user/') ||
    path.startsWith('/admin/');

  if (hideNavFooter) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
      <Navbar currentLang={lang} onLangChange={setLang} />
      <main className="flex-grow">
        {children}
      </main>
      <Footer currentLang={lang} />
    </div>
  );
}

export function AppRoute() {
  const [lang, setLang] = useState<Language>('English');
  const t = content[lang];

  if (!t || !t.nav) {
    return <div className="p-10 text-center">Loading PublicVoice...</div>;
  }

  return (
    <Router>
      <LanguageProvider lang={lang} setLang={setLang}>
        <AuthProvider>
          <AppLayout lang={lang} setLang={setLang}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/services" element={<Services />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route
                path="/report"
                element={
                  <ProtectedRoute>
                    <Report />
                  </ProtectedRoute>
                }
              />
              <Route path="/dashboard" element={<DashboardRedirect />} />
              {/* User dashboard – admins are redirected to /admin/dashboard */}
              <Route
                path="/user"
                element={
                  <ProtectedRoute>
                    <RedirectAdminToAdmin>
                      <UserDashboardLayout />
                    </RedirectAdminToAdmin>
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="/user/dashboard" replace />} />
                <Route path="dashboard" element={<UserDashboard />} />
                <Route path="submit" element={<SubmitIssue />} />
                <Route path="issues" element={<MyIssues />} />
                <Route path="issues/:id" element={<IssueDetail />} />
                <Route path="profile" element={<Profile />} />
              </Route>
              {/* Admin dashboard */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requireAdmin>
                    <AdminDashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="issues" element={<AllIssues />} />
                <Route path="respond" element={<RespondList />} />
                <Route path="respond/:id" element={<Respond />} />
                <Route path="users" element={<Users />} />
              </Route>
            </Routes>
          </AppLayout>
        </AuthProvider>
      </LanguageProvider>
    </Router>
  );
}
