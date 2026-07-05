import axios_client from "./axios_client.js";

export const get_notifications = async (params = {}) => {
  const response = await axios_client.get("/notifications", { params });
  return response.data;
};

export const mark_notification_as_read = async (notification_id) => {
  const response = await axios_client.patch(
    `/notifications/${notification_id}/read`,
  );
  return response.data;
};

export const mark_all_notifications_as_read = async () => {
  const response = await axios_client.patch("/notifications/read-all");
  return response.data;
};
