import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";

import ErrorMessage from "../../components/common/ErrorMessage.jsx";
import useAuth from "../../hooks/useAuth.js";

function RegisterPage() {
  const { register, is_authenticated } = useAuth();
  const navigate = useNavigate();

  const [form_data, set_form_data] = useState({
    username: "",
    full_name: "",
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
      await register(form_data);
      navigate("/feed");
    } catch (err) {
      set_error(err.response?.data?.message || "Registration failed");
    } finally {
      set_is_submitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-logo">ICHgram</h1>
        <p className="auth-subtitle">Create your account</p>

        <form className="auth-form" onSubmit={handle_submit}>
          <input
            name="username"
            type="text"
            placeholder="Username"
            value={form_data.username}
            onChange={handle_change}
          />

          <input
            name="full_name"
            type="text"
            placeholder="Full name"
            value={form_data.full_name}
            onChange={handle_change}
          />

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
            {is_submitting ? "Creating account..." : "Sign up"}
          </button>
        </form>
      </div>

      <div className="auth-switch-card">
        <span>Have an account?</span>
        <Link to="/login">Log in</Link>
      </div>
    </div>
  );
}

export default RegisterPage;
