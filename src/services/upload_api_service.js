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

export async function upload_image(file, folder = "ichgram/avatars") {
  const token = get_auth_token();

  const formData = new FormData();
  formData.append("image", file);
  formData.append("folder", folder);

  const response = await fetch(`${API_URL}/api/upload/image`, {
    method: "POST",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || data.error || "Image upload failed");
  }

  return {
    image_url: data.image_url,
    public_id: data.public_id,
  };
}
