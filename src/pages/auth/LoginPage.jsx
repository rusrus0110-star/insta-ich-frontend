import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";

import ErrorMessage from "../../components/common/ErrorMessage.jsx";
import useAuth from "../../hooks/useAuth.js";

function LoginPage() {
  const { login, is_authenticated } = useAuth();
  const navigate = useNavigate();

  const [form_data, set_form_data] = useState({
    email: "",
    password: "",
  });

  const [error, set_error] = useState("");
  const [is_submitting, set_is_submitting] = useState(false);

  if (is_authenticated) {
    return <Navigate to="/feed" replace />;
  }

  const handle_change = (event) => {
    const { name, value } = event.target;

    set_form_data((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handle_submit = async (event) => {
    event.preventDefault();

    set_error("");
    set_is_submitting(true);

    try {
      await login(form_data);
      navigate("/feed");
    } catch (err) {
      set_error(err.response?.data?.message || "Login failed");
    } finally {
      set_is_submitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-logo">ICHgram</h1>
        <p className="auth-subtitle">Sign in to continue</p>

        <form className="auth-form" onSubmit={handle_submit}>
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form_data.email}
            onChange={handle_change}
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form_data.password}
            onChange={handle_change}
          />

          <ErrorMessage message={error} />

          <button type="submit" disabled={is_submitting}>
            {is_submitting ? "Signing in..." : "Log in"}
          </button>
        </form>

        <Link className="auth-link" to="/reset-password">
          Forgot password?
        </Link>
      </div>

      <div className="auth-switch-card">
        <span>Don&apos;t have an account?</span>
        <Link to="/register">Sign up</Link>
      </div>
    </div>
  );
}

export default LoginPage;
