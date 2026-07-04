import { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { LockKeyhole } from "lucide-react";

import { reset_password } from "../../api/auth_api.js";
import ErrorMessage from "../../components/common/ErrorMessage.jsx";
import AuthLayout from "../../components/layout/AuthLayout.jsx";

function SetNewPasswordPage() {
  const [search_params] = useSearchParams();
  const navigate = useNavigate();

  const reset_token = useMemo(() => {
    return search_params.get("token") || "";
  }, [search_params]);

  const [form_data, set_form_data] = useState({
    new_password: "",
    confirm_password: "",
  });

  const [success_message, set_success_message] = useState("");
  const [error, set_error] = useState("");
  const [is_submitting, set_is_submitting] = useState(false);

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
    set_success_message("");

    if (!reset_token) {
      set_error("Reset token is missing. Please use the link from your email.");
      return;
    }

    if (form_data.new_password.length < 6) {
      set_error("Password must be at least 6 characters");
      return;
    }

    if (form_data.new_password !== form_data.confirm_password) {
      set_error("Passwords do not match");
      return;
    }

    set_is_submitting(true);

    try {
      await reset_password({
        reset_token,
        new_password: form_data.new_password,
      });

      set_success_message(
        "Password changed successfully. Redirecting to login...",
      );

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (err) {
      set_error(err.response?.data?.message || "Could not change password");
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

        <h1 className="reset-title">Set new password</h1>

        <p className="reset-description">
          Enter a new password for your account.
        </p>

        <form className="auth-form reset-form" onSubmit={handle_submit}>
          <input
            name="new_password"
            type="password"
            placeholder="New password"
            value={form_data.new_password}
            onChange={handle_change}
          />

          <input
            name="confirm_password"
            type="password"
            placeholder="Confirm new password"
            value={form_data.confirm_password}
            onChange={handle_change}
          />

          <button type="submit" disabled={is_submitting}>
            {is_submitting ? "Saving..." : "Change password"}
          </button>

          <ErrorMessage message={error} />

          {success_message && (
            <div className="success-message reset-success">
              {success_message}
            </div>
          )}
        </form>
      </div>

      <Link className="reset-back-card" to="/login">
        Back to login
      </Link>
    </AuthLayout>
  );
}

export default SetNewPasswordPage;
