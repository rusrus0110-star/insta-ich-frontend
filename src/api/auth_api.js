import axios_client from "./axios_client.js";

export const register_user = async (payload) => {
  const response = await axios_client.post("/auth/register", payload);
  return response.data;
};

export const login_user = async (payload) => {
  const response = await axios_client.post("/auth/login", payload);
  return response.data;
};

export const get_current_user = async () => {
  const response = await axios_client.get("/auth/me");
  return response.data;
};

export const forgot_password = async (payload) => {
  const response = await axios_client.post("/auth/forgot-password", payload);
  return response.data;
};

export const reset_password = async (payload) => {
  const response = await axios_client.post("/auth/reset-password", payload);
  return response.data;
};
