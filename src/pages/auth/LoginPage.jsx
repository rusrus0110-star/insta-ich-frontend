import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";

import ichgra_logo from "../../assets/ichgra_logo.png";

import ErrorMessage from "../../components/common/ErrorMessage.jsx";
import AuthLayout from "../../components/layout/AuthLayout.jsx";
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
    <AuthLayout>
      <div className="auth-card auth-card-login">
        <img src={ichgra_logo} alt="ICHgram" className="auth-logo-image" />

        <form className="auth-form" onSubmit={handle_submit}>
          <input
            name="email"
            type="email"
            placeholder="Username, or email"
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

          <button type="submit" disabled={is_submitting}>
            {is_submitting ? "Logging in..." : "Log in"}
          </button>

          <div className="auth-divider">
            <span />
            <p>OR</p>
            <span />
          </div>

          <ErrorMessage message={error} />

          <Link className="auth-link" to="/reset-password">
            Forgot password?
          </Link>
        </form>
      </div>

      <div className="auth-switch-card">
        <span>Don&apos;t have an account?</span>
        <Link to="/register">Sign up</Link>
      </div>
    </AuthLayout>
  );
}

export default LoginPage;
