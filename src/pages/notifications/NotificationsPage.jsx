import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import FeedPage from "../feed/FeedPage.jsx";
import {
  get_notifications,
  mark_notification_as_read,
  mark_all_notifications_as_read,
} from "../../services/notification_api_service.js";

import "../../styles/notifications.css";

function format_notification_time(dateValue) {
  if (!dateValue) {
    return "now";
  }

  const date = new Date(dateValue);
  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);

  if (diffMinutes < 1) return "now";
  if (diffMinutes < 60) return `${diffMinutes} m`;
  if (diffHours < 24) return `${diffHours} h`;
  if (diffDays < 7) return `${diffDays} d`;

  return `${diffWeeks} w`;
}

function get_notification_text(type) {
  if (type === "like") {
    return "liked your photo.";
  }

  if (type === "comment") {
    return "commented on your photo.";
  }

  if (type === "follow") {
    return "started following you.";
  }

  return "interacted with you.";
}

function get_post_image(post) {
  if (!post) {
    return "";
  }

  return post.image_url || post.image || "";
}

function normalize_notification(notification) {
  const sender = notification.sender || {};
  const post = notification.post || null;

  return {
    id: notification.id || notification._id,
    type: notification.type,
    isRead: notification.is_read || notification.isRead || false,
    sender: {
      id: sender.id || sender._id,
      username: sender.username || "unknown",
      fullName: sender.full_name || sender.fullName || sender.username || "",
      avatar: sender.avatar || "",
    },
    post: post
      ? {
          id: post.id || post._id,
          image: get_post_image(post),
        }
      : null,
    createdAt: notification.created_at || notification.createdAt,
  };
}

function NotificationAvatar({ user }) {
  const username = user?.username || "user";
  const firstLetter = username.charAt(0).toUpperCase();

  return (
    <span className="notification-avatar">
      {user?.avatar ? (
        <img src={user.avatar} alt={`${username} avatar`} />
      ) : (
        <span>{firstLetter}</span>
      )}
    </span>
  );
}

function NotificationItem({ notification, onOpen }) {
  const navigate = useNavigate();

  async function handle_click() {
    await onOpen(notification);

    if (notification.type === "follow") {
      navigate(`/profile/${notification.sender.username}`);
      return;
    }

    if (notification.post?.id) {
      navigate(`/posts/${notification.post.id}`);
      return;
    }

    navigate(`/profile/${notification.sender.username}`);
  }

  return (
    <article
      className={
        notification.isRead
          ? "notification-row"
          : "notification-row notification-row-unread"
      }
    >
      <Link to={`/profile/${notification.sender.username}`}>
        <NotificationAvatar user={notification.sender} />
      </Link>

      <button
        type="button"
        className="notification-text-button"
        onClick={handle_click}
      >
        <span className="notification-username">
          {notification.sender.username}
        </span>{" "}
        {get_notification_text(notification.type)}{" "}
        <small>{format_notification_time(notification.createdAt)}</small>
      </button>

      {notification.post?.image ? (
        <button
          type="button"
          className="notification-thumbnail-button"
          onClick={handle_click}
          aria-label="Open related post"
        >
          <img
            src={notification.post.image}
            alt=""
            className="notification-thumbnail"
          />
        </button>
      ) : (
        <span className="notification-thumbnail-placeholder" />
      )}
    </article>
  );
}

function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [completedLoading, setCompletedLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isActive = true;

    async function load_notifications() {
      try {
        const notificationsData = await get_notifications();

        if (!isActive) {
          return;
        }

        const normalizedNotifications = notificationsData
          .map(normalize_notification)
          .filter((notification) => notification.id && notification.sender);

        setNotifications(normalizedNotifications);
        setErrorMessage("");
      } catch (error) {
        console.error("Failed to load notifications:", error.message);

        if (isActive) {
          setNotifications([]);
          setErrorMessage(error.message);
        }
      } finally {
        if (isActive) {
          setCompletedLoading(true);
        }
      }
    }

    load_notifications();

    return () => {
      isActive = false;
    };
  }, []);

  async function handle_open_notification(notification) {
    if (notification.isRead) {
      return;
    }

    try {
      await mark_notification_as_read(notification.id);

      setNotifications((currentNotifications) =>
        currentNotifications.map((currentNotification) =>
          currentNotification.id === notification.id
            ? {
                ...currentNotification,
                isRead: true,
              }
            : currentNotification,
        ),
      );
    } catch (error) {
      console.error("Failed to mark notification as read:", error.message);
    }
  }

  async function handle_mark_all_as_read() {
    try {
      await mark_all_notifications_as_read();

      setNotifications((currentNotifications) =>
        currentNotifications.map((notification) => ({
          ...notification,
          isRead: true,
        })),
      );
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error.message);
    }
  }

  return (
    <section className="notification-page">
      <div className="notification-feed-background">
        <FeedPage />
      </div>

      <div className="notification-layer">
        <aside className="notification-panel">
          <div className="notification-panel-header">
            <h1>Notifications</h1>

            {notifications.some((notification) => !notification.isRead) ? (
              <button type="button" onClick={handle_mark_all_as_read}>
                Mark all as read
              </button>
            ) : null}
          </div>

          <div className="notification-section">
            <h2>New</h2>

            {!completedLoading ? (
              <p className="notification-state-text">
                Loading notifications...
              </p>
            ) : null}

            {completedLoading && errorMessage ? (
              <p className="notification-state-text">{errorMessage}</p>
            ) : null}

            {completedLoading && !errorMessage && notifications.length === 0 ? (
              <p className="notification-state-text">No notifications yet.</p>
            ) : null}

            {notifications.length > 0 ? (
              <div className="notification-list">
                {notifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onOpen={handle_open_notification}
                  />
                ))}
              </div>
            ) : null}
          </div>
        </aside>

        <div className="notification-overlay" />
      </div>
    </section>
  );
}

export default NotificationsPage;
