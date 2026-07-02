import { Navigate } from "react-router-dom";

import useAuth from "../../hooks/useAuth.js";
import Loader from "../common/Loader.jsx";

function ProtectedRoute({ children }) {
  const { is_authenticated, is_loading } = useAuth();

  if (is_loading) {
    return <Loader text="Loading application..." />;
  }

  if (!is_authenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
