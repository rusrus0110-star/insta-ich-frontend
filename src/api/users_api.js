import axios_client from "./axios_client.js";

export const search_users = async (query) => {
  const response = await axios_client.get("/users/search", {
    params: { query },
  });

  return response.data;
};
