import { useState } from "react";
import { Link } from "react-router-dom";
import { LockKeyhole } from "lucide-react";

import { forgot_password } from "../../api/auth_api.js";
import ErrorMessage from "../../components/common/ErrorMessage.jsx";
import AuthLayout from "../../components/layout/AuthLayout.jsx";

function ResetPasswordPage() {
  const [email, set_email] = useState("");
  const [success_message, set_success_message] = useState("");
  const [error, set_error] = useState("");
  const [is_submitting, set_is_submitting] = useState(false);

  const handle_submit = async (event) => {
    event.preventDefault();

    set_error("");
    set_success_message("");
    set_is_submitting(true);

    try {
      const data = await forgot_password({ email });

      set_success_message(
        data.message ||
          "If this account exists, reset instructions have been generated.",
      );
    } catch (err) {
      set_error(err.response?.data?.message || "Could not reset password");
    } finally {
      set_is_submitting(false);
    }
  };

  return (
    <AuthLayout hide_visual>
      <div className="auth-card auth-card-reset">
        <div className="reset-icon">
          <LockKeyhole size={38} strokeWidth={1.7} />
        </div>

        <h1 className="reset-title">Trouble logging in?</h1>

        <p className="reset-description">
          Enter your email, phone, or username and we&apos;ll send you a link to
          get back into your account.
        </p>

        <form className="auth-form reset-form" onSubmit={handle_submit}>
          <input
            type="text"
            placeholder="Email or username"
            value={email}
            onChange={(event) => set_email(event.target.value)}
          />

          <button type="submit" disabled={is_submitting}>
            {is_submitting ? "Sending..." : "Reset your password"}
          </button>

          <ErrorMessage message={error} />

          {success_message && (
            <div className="success-message reset-success">
              {success_message}
            </div>
          )}
        </form>

        <div className="auth-divider reset-divider">
          <span />
          <p>OR</p>
          <span />
        </div>

        <Link className="reset-create-link" to="/register">
          Create new account
        </Link>
      </div>

      <Link className="reset-back-card" to="/login">
        Back to login
      </Link>
    </AuthLayout>
  );
}

export default ResetPasswordPage;
