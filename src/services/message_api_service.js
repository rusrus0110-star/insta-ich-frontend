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

export async function search_users(query) {
  const normalizedQuery = String(query || "").trim();

  if (normalizedQuery.length < 2) {
    return [];
  }

  const data = await request(
    `/api/users/search?query=${encodeURIComponent(normalizedQuery)}`,
  );

  if (Array.isArray(data)) {
    return data;
  }

  return data.users || data.data || data.results || [];
}

export async function get_conversations() {
  const data = await request("/api/conversations");

  if (Array.isArray(data)) {
    return data;
  }

  return data.conversations || data.data || [];
}

export async function create_conversation(participant_id) {
  const data = await request("/api/conversations", {
    method: "POST",
    body: JSON.stringify({
      participant_id,
    }),
  });

  return data.conversation || data.data;
}

export async function get_conversation_messages(conversation_id) {
  const data = await request(`/api/conversations/${conversation_id}/messages`);

  if (Array.isArray(data)) {
    return data;
  }

  return data.messages || data.data || [];
}
