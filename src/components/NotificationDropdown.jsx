import { useState } from "react";
import { Popover } from "@mantine/core";
import {
  IconBell,
  IconCheck,
  IconBriefcase,
  IconClock,
  IconTrash,
} from "@tabler/icons-react";

function formatNotificationDate(date) {
  const notificationDate = new Date(date);

  return notificationDate.toLocaleString("en-PH", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function NotificationDropdown({
  notifications = [],
  onMarkAsRead,
  onMarkAllAsRead,
  onOpenJobs,
  onDelete,
}) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const unreadCount = notifications.filter(
    (notification) => !notification.readAt,
  ).length;

  const handleNotificationClick = async (notification) => {
    try {
      if (!notification.readAt) {
        await onMarkAsRead?.(notification.id);
      }

      onOpenJobs?.(notification.relatedJobIds || []);
      setNotificationsOpen(false);
    } catch (error) {
      console.error("Failed to open notification:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await onMarkAllAsRead?.();
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  };

  const handleDeleteNotification = async (event, id) => {
    event.stopPropagation();

    try {
      // Delete without waiting for the response to avoid UI lag
      onDelete?.(id);
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };

  return (
    <Popover
      opened={notificationsOpen}
      onChange={setNotificationsOpen}
      position="bottom-end"
      shadow="md"
      width={350}
      withinPortal
    >
      <Popover.Target>
        <button
          onClick={() => setNotificationsOpen((open) => !open)}
          className="relative rounded-xl bg-white p-2.5 text-slate-500 shadow-sm"
          aria-label={`Notifications, ${unreadCount} unread`}
          aria-expanded={notificationsOpen}
        >
          <IconBell size={18} />

          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-brand px-1 text-[10px] font-bold text-white">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </button>
      </Popover.Target>

      <Popover.Dropdown className="max-h-96 overflow-y-auto">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="font-bold text-ink">Notifications</p>
            <span className="text-xs text-slate-400">{unreadCount} unread</span>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="flex items-center gap-1 text-xs font-semibold text-brand hover:underline"
            >
              <IconCheck size={14} />
              Mark all as read
            </button>
          )}
        </div>

        {notifications.length > 0 ? (
          <div className="space-y-1">
            {notifications.map((notification) => {
              const isUnread = !notification.readAt;

              return (
                <div
                  key={notification.id}
                  className={`flex items-center gap-2 rounded-xl p-2 transition hover:bg-[#fff8f0] ${
                    isUnread ? "bg-[#fff8f0]" : "bg-white"
                  }`}
                >
                  <button
                    onClick={() => handleNotificationClick(notification)}
                    className="flex min-w-0 flex-1 gap-3 p-1 text-left"
                  >
                    <div className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#fff1e3] text-brand">
                      <IconBriefcase size={17} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`text-sm ${
                            isUnread
                              ? "font-bold text-ink"
                              : "font-medium text-slate-500"
                          }`}
                        >
                          {notification.title}
                        </span>

                        {isUnread ? (
                          <span className="shrink-0 rounded-full bg-brand/10 px-2 py-0.5 text-[10px] font-semibold text-brand">
                            New
                          </span>
                        ) : (
                          <span className="flex shrink-0 items-center gap-1 text-[10px] font-medium text-slate-400">
                            <IconCheck size={12} />
                            Read
                          </span>
                        )}
                      </div>

                      <p className="mt-1 text-xs leading-relaxed text-slate-500">
                        {notification.message}
                      </p>

                      <div className="mt-2 flex items-center gap-1 text-[10px] text-slate-400">
                        <IconClock size={12} />
                        {formatNotificationDate(notification.createdAt)}
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={(event) =>
                      handleDeleteNotification(event, notification.id)
                    }
                    className="shrink-0 rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                    aria-label="Delete notification"
                    title="Delete notification"
                  >
                    <IconTrash size={16} />
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="py-6 text-center text-sm text-slate-500">
            You’re all caught up.
          </p>
        )}
      </Popover.Dropdown>
    </Popover>
  );
}
