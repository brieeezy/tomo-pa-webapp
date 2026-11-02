
import axios from "axios";
import { getApiCredentials } from "./auth";

const api = axios.create({
  baseURL: import.meta.env.VITE_TOMO_API_ORIGIN + "/notifications",
});

api.interceptors.request.use((config) => {
  config.auth = getApiCredentials() || undefined;
  return config;
});

// Get all notifications
export async function getNotifications() {
  const response = await api.get("");
  return response.data;
}

// Get unread notification count
export async function getUnreadCount() {
  const response = await api.get("/unread-count");
  return response.data.count;
}

// Mark a notification as read
export async function markNotificationAsRead(id) {
  await api.put(`/${id}/read`);
}

// Mark all notifications as read
export async function markAllNotificationsAsRead() {
  await api.put("/read-all");
}

export async function deleteNotificationRequest(id) {
    await api.delete(`/${id}`);
}
