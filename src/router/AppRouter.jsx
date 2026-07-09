import { Navigate, Route, Routes } from "react-router-dom";

import ProtectedRoute from "../components/layout/ProtectedRoute.jsx";
import AppLayout from "../components/layout/AppLayout.jsx";

import LoginPage from "../pages/auth/LoginPage.jsx";
import RegisterPage from "../pages/auth/RegisterPage.jsx";
import ResetPasswordPage from "../pages/auth/ResetPasswordPage.jsx";
import SetNewPasswordPage from "../pages/auth/SetNewPasswordPage.jsx";

import FeedPage from "../pages/feed/FeedPage.jsx";
import ExplorePage from "../pages/explore/ExplorePage.jsx";
import SearchPage from "../pages/search/SearchPage.jsx";
import NotificationsPage from "../pages/notifications/NotificationsPage.jsx";

import NotFoundPage from "../pages/error/NotFoundPage.jsx";
import ProfilePage from "../pages/profile/ProfilePage.jsx";
import PostPage from "../pages/post/PostPage.jsx";
import EditProfilePage from "../pages/profile/EditProfilePage.jsx";
import CreatePostPage from "../pages/create_post/CreatePostPage.jsx";
import MessagesPage from "../pages/messages/MessagesPage.jsx";

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/feed" replace />} />

      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/set-new-password" element={<SetNewPasswordPage />} />
      <Route
        path="/profile/:username"
        element={
          <ProtectedRoute>
            <AppLayout>
              <ProfilePage />
            </AppLayout>
          </ProtectedRoute>
        }
      />

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

      <Route
        path="/explore"
        element={
          <ProtectedRoute>
            <AppLayout>
              <ExplorePage />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/search"
        element={
          <ProtectedRoute>
            <AppLayout>
              <SearchPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile/edit"
        element={
          <ProtectedRoute>
            <AppLayout>
              <EditProfilePage />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <AppLayout>
              <NotificationsPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/posts/:postId"
        element={
          <ProtectedRoute>
            <AppLayout>
              <PostPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/create-post"
        element={
          <ProtectedRoute>
            <AppLayout>
              <CreatePostPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/messages"
        element={
          <ProtectedRoute>
            <AppLayout>
              <MessagesPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/messages/:username"
        element={
          <ProtectedRoute>
            <AppLayout>
              <MessagesPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="*"
        element={
          <ProtectedRoute>
            <AppLayout>
              <NotFoundPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default AppRouter;
