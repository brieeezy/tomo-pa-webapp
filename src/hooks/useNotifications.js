
import { useCallback, useEffect, useState } from "react";
import {
  getNotifications,
  getUnreadCount,
  markNotificationAsRead as markNotificationAsReadRequest,
  markAllNotificationsAsRead as markAllNotificationsAsReadRequest,
  deleteNotificationRequest as deleteNotificationRequest,
} from "../services/notificationApi";

export function useNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const reload = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [notificationData, count] = await Promise.all([
        getNotifications(),
        getUnreadCount(),
      ]);

      setNotifications(notificationData);
      setUnreadCount(count);
    } catch {
      setError("Could not load notifications from the Tomo service.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const markAsRead = async (id) => {
    setError("");

    try {
      await markNotificationAsReadRequest(id);

      setNotifications((current) =>
        current.map((notification) =>
          String(notification.id) === String(id)
            ? { ...notification, read: true }
            : notification,
        ),
      );

      setUnreadCount((current) => Math.max(0, current - 1));
    } catch (requestError) {
      setError("Could not mark notification as read.");
      throw requestError;
    }
  };

  const markAllAsRead = async () => {
    setError("");

    try {
      await markAllNotificationsAsReadRequest();

      setNotifications((current) =>
        current.map((notification) => ({
          ...notification,
          read: true,
        })),
      );

      setUnreadCount(0);
    } catch (requestError) {
      setError("Could not mark all notifications as read.");
      throw requestError;
    }
  };

  const unreadNotifications = notifications.filter(
    (notification) => !notification.read,
  );

  const deleteNotification = async (id) => {
    setError("");

    try {
      await deleteNotificationRequest(id);

      setNotifications((current) =>
        current.filter((notification) => String(notification.id) !== String(id))
      );

      setUnreadCount((current) => Math.max(0, current - 1));
    } catch (requestError) {
      setError("Could not delete notification.");
      throw requestError;
    }
  };

  return {
    notifications,
    unreadNotifications,
    unreadCount,
    loading,
    error,
    reload,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  };
}
