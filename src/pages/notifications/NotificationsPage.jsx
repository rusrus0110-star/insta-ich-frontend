import { useEffect, useState } from "react";

import {
  get_notifications,
  mark_all_notifications_as_read,
} from "../../api/notifications_api.js";

import Avatar from "../../components/common/Avatar.jsx";
import ErrorMessage from "../../components/common/ErrorMessage.jsx";

function NotificationsPage() {
  const [notifications, set_notifications] = useState([]);
  const [error, set_error] = useState("");
  const [is_loading, set_is_loading] = useState(true);

  useEffect(() => {
    let is_mounted = true;

    const load_initial_notifications = async () => {
      try {
        const data = await get_notifications();

        if (is_mounted) {
          set_notifications(data.notifications || []);
          set_error("");
        }
      } catch (err) {
        if (is_mounted) {
          set_error(
            err.response?.data?.message || "Could not load notifications",
          );
        }
      } finally {
        if (is_mounted) {
          set_is_loading(false);
        }
      }
    };

    load_initial_notifications();

    return () => {
      is_mounted = false;
    };
  }, []);

  const reload_notifications = async () => {
    try {
      set_error("");
      set_is_loading(true);

      const data = await get_notifications();

      set_notifications(data.notifications || []);
    } catch (err) {
      set_error(err.response?.data?.message || "Could not load notifications");
    } finally {
      set_is_loading(false);
    }
  };

  const handle_mark_all = async () => {
    try {
      await mark_all_notifications_as_read();
      await reload_notifications();
    } catch (err) {
      set_error(
        err.response?.data?.message || "Could not update notifications",
      );
    }
  };

  const get_notification_text = (notification) => {
    const username = notification.sender?.username || "Someone";

    if (notification.type === "follow") {
      return `${username} started following you.`;
    }

    if (notification.type === "like") {
      return `${username} liked your post.`;
    }

    if (notification.type === "comment") {
      return `${username} commented on your post.`;
    }

    return `${username} sent you a notification.`;
  };

  return (
    <section className="main-page main-panel-page">
      <div className="side-panel">
        <div className="panel-header">
          <h1>Notifications</h1>

          <button type="button" onClick={handle_mark_all}>
            Read all
          </button>
        </div>

        <ErrorMessage message={error} />

        <div className="panel-list">
          {is_loading && <p className="panel-muted">Loading...</p>}

          {!is_loading && notifications.length === 0 && (
            <p className="panel-muted">No notifications yet</p>
          )}

          {notifications.map((notification) => (
            <div
              className={
                notification.is_read
                  ? "notification-item"
                  : "notification-item notification-item-unread"
              }
              key={notification.id || notification._id}
            >
              <Avatar
                src={notification.sender?.avatar}
                username={notification.sender?.username}
                size={42}
              />

              <div>
                <p>{get_notification_text(notification)}</p>
                <span>
                  {new Date(notification.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="main-overlay-preview" />
    </section>
  );
}

export default NotificationsPage;
