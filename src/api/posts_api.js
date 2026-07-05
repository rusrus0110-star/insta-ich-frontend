import axios_client from "./axios_client.js";

export const get_posts = async (params = {}) => {
  const response = await axios_client.get("/posts", { params });
  return response.data;
};

export const toggle_post_like = async (post_id) => {
  const response = await axios_client.post(`/posts/${post_id}/like`);
  return response.data;
};
