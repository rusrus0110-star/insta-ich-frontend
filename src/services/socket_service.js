import { io } from "socket.io-client";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

let socket = null;

function get_auth_token() {
  const directToken = localStorage.getItem("token");

  if (directToken) {
    return directToken;
  }

  const authData = localStorage.getItem("auth");

  if (authData) {
    try {
      const parsedAuthData = JSON.parse(authData);
      return parsedAuthData?.token || parsedAuthData?.accessToken || null;
    } catch {
      return null;
    }
  }

  const userData = localStorage.getItem("user");

  if (userData) {
    try {
      const parsedUserData = JSON.parse(userData);
      return parsedUserData?.token || parsedUserData?.accessToken || null;
    } catch {
      return null;
    }
  }

  return null;
}

export function connect_socket() {
  const token = get_auth_token();

  if (!token) {
    console.warn("Socket connection skipped: auth token is missing");
    return null;
  }

  if (socket?.connected) {
    return socket;
  }

  socket = io(API_URL, {
    auth: {
      token,
    },
    transports: ["websocket"],
  });

  socket.on("connect", () => {
    console.log("Socket connected:", socket.id);
  });

  socket.on("socket_connected", (data) => {
    console.log("Socket authenticated:", data);
  });

  socket.on("connect_error", (error) => {
    console.error("Socket connection error:", error.message);
  });

  socket.on("disconnect", (reason) => {
    console.log("Socket disconnected:", reason);
  });

  return socket;
}

export function get_socket() {
  return socket;
}

export function disconnect_socket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
