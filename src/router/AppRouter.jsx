import { Navigate, Route, Routes } from "react-router-dom";

import ProtectedRoute from "../components/layout/ProtectedRoute.jsx";
import AppLayout from "../components/layout/AppLayout.jsx";

import LoginPage from "../pages/auth/LoginPage.jsx";
import RegisterPage from "../pages/auth/RegisterPage.jsx";
import ResetPasswordPage from "../pages/auth/ResetPasswordPage.jsx";
import FeedPage from "../pages/feed/FeedPage.jsx";
import NotFoundPage from "../pages/error/NotFoundPage.jsx";

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/feed" replace />} />

      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      <Route
        path="/feed"
        element={
          <ProtectedRoute>
            <AppLayout>
              <FeedPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default AppRouter;
