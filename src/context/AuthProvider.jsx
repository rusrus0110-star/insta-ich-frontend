import { useEffect, useMemo, useState } from "react";

import {
  get_current_user,
  login_user,
  register_user,
} from "../api/auth_api.js";

import AuthContext from "./auth_context.js";

const get_initial_loading_state = () => {
  return Boolean(localStorage.getItem("token"));
};

function AuthProvider({ children }) {
  const [user, set_user] = useState(null);
  const [is_loading, set_is_loading] = useState(get_initial_loading_state);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      return;
    }

    let is_mounted = true;

    const load_current_user = async () => {
      try {
        const data = await get_current_user();

        if (is_mounted) {
          set_user(data.user);
        }
      } catch {
        localStorage.removeItem("token");

        if (is_mounted) {
          set_user(null);
        }
      } finally {
        if (is_mounted) {
          set_is_loading(false);
        }
      }
    };

    load_current_user();

    return () => {
      is_mounted = false;
    };
  }, []);

  const login = async (payload) => {
    const data = await login_user(payload);

    localStorage.setItem("token", data.token);
    set_user(data.user);
    set_is_loading(false);

    return data;
  };

  const register = async (payload) => {
    const data = await register_user(payload);

    localStorage.setItem("token", data.token);
    set_user(data.user);
    set_is_loading(false);

    return data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    set_user(null);
    set_is_loading(false);
  };

  const value = useMemo(
    () => ({
      user,
      is_authenticated: Boolean(user),
      is_loading,
      login,
      register,
      logout,
    }),
    [user, is_loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
