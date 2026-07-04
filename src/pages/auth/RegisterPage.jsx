import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";

import ichgra_logo from "../../assets/ichgra_logo.png";

import ErrorMessage from "../../components/common/ErrorMessage.jsx";
import AuthLayout from "../../components/layout/AuthLayout.jsx";
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
    <AuthLayout hide_visual>
      <div className="auth-card auth-card-register">
        <img
          src={ichgra_logo}
          alt="ICHgram"
          className="auth-logo-image auth-logo-register"
        />

        <p className="auth-register-subtitle">
          Sign up to see photos and videos from your friends.
        </p>

        <form className="auth-form" onSubmit={handle_submit}>
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form_data.email}
            onChange={handle_change}
          />

          <input
            name="full_name"
            type="text"
            placeholder="Full Name"
            value={form_data.full_name}
            onChange={handle_change}
          />

          <input
            name="username"
            type="text"
            placeholder="Username"
            value={form_data.username}
            onChange={handle_change}
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form_data.password}
            onChange={handle_change}
          />

          <p className="auth-legal-text">
            People who use our service may have uploaded your contact
            information to ICHgram.
            <a href="#" onClick={(event) => event.preventDefault()}>
              {" "}
              Learn More
            </a>
          </p>

          <p className="auth-legal-text">
            By signing up, you agree to our
            <a href="#" onClick={(event) => event.preventDefault()}>
              {" "}
              Terms
            </a>
            ,
            <a href="#" onClick={(event) => event.preventDefault()}>
              {" "}
              Privacy Policy
            </a>{" "}
            and
            <a href="#" onClick={(event) => event.preventDefault()}>
              {" "}
              Cookies Policy
            </a>
            .
          </p>

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
    </AuthLayout>
  );
}

export default RegisterPage;
