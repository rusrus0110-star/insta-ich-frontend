const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function get_auth_token() {
  const directToken = localStorage.getItem("token");

  if (directToken) {
    return directToken;
  }

  const authData = localStorage.getItem("auth");

  if (authData) {
    try {
      const parsedAuthData = JSON.parse(authData);

      return (
        parsedAuthData?.token ||
        parsedAuthData?.accessToken ||
        parsedAuthData?.access_token ||
        null
      );
    } catch {
      return null;
    }
  }

  const userData = localStorage.getItem("user");

  if (userData) {
    try {
      const parsedUserData = JSON.parse(userData);

      return (
        parsedUserData?.token ||
        parsedUserData?.accessToken ||
        parsedUserData?.access_token ||
        null
      );
    } catch {
      return null;
    }
  }

  return null;
}

async function request(path, options = {}) {
  const token = get_auth_token();

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || data.error || "Request failed");
  }

  return data;
}

export async function create_post(postData) {
  const data = await request("/api/posts", {
    method: "POST",
    body: JSON.stringify(postData),
  });

  return data.post || data.data;
}
