import { useState } from "react";
import { Link } from "react-router-dom";

import { forgot_password, reset_password } from "../../api/auth_api.js";
import ErrorMessage from "../../components/common/ErrorMessage.jsx";

function ResetPasswordPage() {
  const [email, set_email] = useState("");
  const [reset_token, set_reset_token] = useState("");
  const [new_password, set_new_password] = useState("");
  const [generated_token, set_generated_token] = useState("");
  const [success_message, set_success_message] = useState("");
  const [error, set_error] = useState("");
  const [is_submitting, set_is_submitting] = useState(false);

  const handle_forgot_password = async (event) => {
    event.preventDefault();

    set_error("");
    set_success_message("");
    set_generated_token("");
    set_is_submitting(true);

    try {
      const data = await forgot_password({ email });

      set_success_message(data.message);

      if (data.reset_token) {
        set_generated_token(data.reset_token);
        set_reset_token(data.reset_token);
      }
    } catch (err) {
      set_error(
        err.response?.data?.message || "Could not generate reset token",
      );
    } finally {
      set_is_submitting(false);
    }
  };

  const handle_reset_password = async (event) => {
    event.preventDefault();

    set_error("");
    set_success_message("");
    set_is_submitting(true);

    try {
      await reset_password({
        reset_token,
        new_password,
      });

      set_success_message(
        "Password was changed successfully. You can now log in.",
      );
      set_reset_token("");
      set_new_password("");
    } catch (err) {
      set_error(err.response?.data?.message || "Could not reset password");
    } finally {
      set_is_submitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card auth-card-wide">
        <h1 className="auth-logo">ICHgram</h1>
        <p className="auth-subtitle">Reset password</p>

        <form className="auth-form" onSubmit={handle_forgot_password}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(event) => set_email(event.target.value)}
          />

          <button type="submit" disabled={is_submitting}>
            {is_submitting ? "Generating..." : "Generate reset token"}
          </button>
        </form>

        {generated_token && (
          <div className="reset-token-box">
            <strong>Demo reset token:</strong>
            <p>{generated_token}</p>
          </div>
        )}

        <form
          className="auth-form auth-form-spaced"
          onSubmit={handle_reset_password}
        >
          <input
            type="text"
            placeholder="Reset token"
            value={reset_token}
            onChange={(event) => set_reset_token(event.target.value)}
          />

          <input
            type="password"
            placeholder="New password"
            value={new_password}
            onChange={(event) => set_new_password(event.target.value)}
          />

          <ErrorMessage message={error} />

          {success_message && (
            <div className="success-message">{success_message}</div>
          )}

          <button type="submit" disabled={is_submitting}>
            {is_submitting ? "Saving..." : "Set new password"}
          </button>
        </form>

        <Link className="auth-link" to="/login">
          Back to login
        </Link>
      </div>
    </div>
  );
}

export default ResetPasswordPage;
